function AppD(configuration) {

    var controller = {
        config: configuration
    };

    controller.createNotificationEndpoint = function(webserver, bot, cb) {
        webserver.post('/appd', function(req, res) {

            res.sendStatus(200);
            controller.handleNotificationPayload(req, res, bot);

        });
        if (cb) cb();
    };

    controller.handleNotificationPayload = function(req, res, bot) {

        console.log("Received notification from AppD!");
        console.log(req.body[0].app);
        //Temporary hard-coded personId of rcampos@altus.cr for testing purposes
        var personId = "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9lMmRiYzJlNC01NDgyLTQ5N2YtYTFjNS02NzM3NjYzNWNiNzg";
        var app_url_tpl = "https://{}.saas.appdynamics.com/controller/?accountName={}#/location=APP_DASHBOARD&application={}"
        var msg = "* A [{}]({}) has occurred in application [{}]({}) ({}).<br/>Time of event: *{}*.<br/>Affected Tier: **{}**.<br/>Affected Node: **{}**."

        //Send a DM to the people who subscribed to the notification
        bot.startPrivateConversationWithPersonId(personId, function(err, convo) {
            convo.say("### AppDynamics Notification");
            for (var i = 0; i < req.body.length; i++) {
                app_url = app_url_tpl.format(controller.config.account,
                    controller.config.account,
                    req.body[i].appid);
                convo.say(msg.format(req.body[i].name,
                    req.body[i].deeplink,
                    req.body[i].app,
                    app_url,
                    req.body[i].appid,
                    req.body[i].time,
                    req.body[i].tier,
                    req.body[i].node));
            };
        });

    };

    return controller;
}

module.exports = AppD;