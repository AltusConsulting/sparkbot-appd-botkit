// Copyright (c) 2017 Altus Consulting
// Licensed under the MIT License 

// Portions of this code are licensed and copyright as follows:
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 


// Load env variables 
var env = require('node-env-file');
env(__dirname + '/.env');
var appd = require('./appd.js');


//
// BotKit initialization
//

var Botkit = require('botkit');

if (!process.env.SPARK_TOKEN) {
    console.log("Could not start as bots require a Cisco Spark API access token.");
    console.log("Please add env variable SPARK_TOKEN on the command line or to the .env file");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line or to the .env file");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

var env = process.env.NODE_ENV || "development";

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: process.env.SPARK_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks of incoming payloads originate from Cisco Spark
    webhook_name: process.env.WEBHOOK_NAME || ('built with BotKit (' + env + ')'),
    json_file_store: './jfs'
});

var bot = controller.spawn({});

// Load BotCommons properties
bot.commons = {};
bot.commons["healthcheck"] = process.env.PUBLIC_URL + "/ping";
bot.commons["up-since"] = new Date(Date.now()).toGMTString();
bot.commons["version"] = "v" + require("./package.json").version;
bot.commons["owner"] = process.env.owner;
bot.commons["support"] = process.env.support;
bot.commons["platform"] = process.env.platform;
bot.commons["nickname"] = process.env.BOT_NICKNAME || "unknown";
bot.commons["code"] = process.env.code;

// Function to emulate Python's .format syntax. In the future will
// be moved to a separate file
String.prototype.format = function() {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function() {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// Start Bot API
controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("Cisco Spark: Webhooks set up!");
    });

    appd().createNotificationEndpoint(webserver, bot, function() {
        console.log("AppDynamics: Notification endpoints set up!");
    });

    // installing Healthcheck
    webserver.get('/ping', function(req, res) {
        res.json(bot.commons);
    });

    // Endpoint for AppD's notifications
    // webserver.post('/appd', function(req, res) {
    //     res.sendStatus(200);
    //     //controller.handleWebhookPayload(req, res, bot);
    //     console.log("Received notification from AppD!");
    //     console.log(req.body[0].app);
    //     //Temporary hard-coded personId of rcampos@altus.cr for testing purposes
    //     var personId = "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9lMmRiYzJlNC01NDgyLTQ5N2YtYTFjNS02NzM3NjYzNWNiNzg";
    //     //Temporary hard-coded AppDynamics demo account 
    //     var account = "asteroids2017070703100120"
    //     var app_url_tpl = "https://{}.saas.appdynamics.com/controller/?accountName={}#/location=APP_DASHBOARD&application={}"
    //     var msg = "* A [{}]({}) has occurred in application [{}]({}) ({}).<br/>Time of event: *{}*.<br/>Affected Tier: **{}**.<br/>Affected Node: **{}**."

    //     bot.startPrivateConversationWithPersonId(personId, function(err, convo) {
    //         convo.say("### AppDynamics Notification");
    //         for (var i = 0; i < req.body.length; i++) {
    //             app_url = app_url_tpl.format(account, account, req.body[i].appid)
    //             convo.say(msg.format(req.body[i].name,
    //                 req.body[i].deeplink,
    //                 req.body[i].app,
    //                 app_url,
    //                 req.body[i].appid,
    //                 req.body[i].time,
    //                 req.body[i].tier,
    //                 req.body[i].node));
    //         };
    //     });
    // });

    console.log("Cisco Spark: healthcheck available at: " + bot.commons.healthcheck);
});

// Load skills
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    try {
        require("./skills/" + file)(controller);
        console.log("Cisco Spark: loaded skill: " + file);
    } catch (err) {
        if (err.code == "MODULE_NOT_FOUND") {
            if (file != "utils") {
                console.log("Cisco Spark: could not load skill: " + file);
            }
        }
    }
});

// Utility to add mentions if Bot is in a 'Group' space
bot.enrichCommand = function(message, command) {
    var botName = process.env.BOT_NICKNAME || "BotName";
    if ("group" == message.roomType) {
        return "`@" + botName + " " + command + "`";
    }
    if (message.original_message) {
        if ("group" == message.original_message.roomType) {
            return "`@" + botName + " " + command + "`";
        }
    }


    return "`" + command + "`";
}