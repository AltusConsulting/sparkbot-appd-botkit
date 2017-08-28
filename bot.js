// Copyright (c) 2017 Altus Consulting
// Licensed under the MIT License 

// Portions of this code are licensed and copyright as follows:
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 


// Load env variables 
var env = require('node-env-file');
env(__dirname + '/.env');

var AppD = require('./lib/appd.js');

// Storage
if (process.env.REDIS_URL) {
    var redisConfig = { "methods": ['subscriptions'], "url": process.env.REDIS_URL };
    var storage = require('botkit-storage-redis')(redisConfig);
    console.log("Using Redis storage at " + process.env.REDIS_URL);
} else {
    var jfsStorage = require('./lib/storage.js');
    var storage = jfsStorage({ path: './jfs' });
    console.log("Using JFS storage at ./jfs");
}

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
    storage: storage
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

var appdController = AppD.notifications({
    account: process.env.APPD_ACCOUNT,
    storage: controller.storage
});

// Start Bot API
controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("Cisco Spark: Webhooks set up!");
    });

    appdController.createNotificationEndpoint(webserver, bot, function() {
        console.log("AppDynamics: Notification endpoints set up!");
    });

    // installing Healthcheck
    webserver.get('/ping', function(req, res) {
        res.json(bot.commons);
    });

    console.log("Cisco Spark: healthcheck available at: " + bot.commons.healthcheck);
});

// Load skills
var normalizedPath = require("path").join(__dirname, "lib/skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    try {
        require("./lib/skills/" + file)(controller);
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