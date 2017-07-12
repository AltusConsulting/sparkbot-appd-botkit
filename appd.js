function AppD() {

    var controller = {};

    controller.createNotificationEndpoint = function(webserver, bot, cb) {
        webserver.post('/appd', function(req, res) {
            res.sendStatus(200);
            //controller.handleWebhookPayload(req, res, bot);
            console.log("Received notification from AppD!");
            console.log(req.body[0].app);
            //Temporary hard-coded personId of rcampos@altus.cr for testing purposes
            var personId = "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9lMmRiYzJlNC01NDgyLTQ5N2YtYTFjNS02NzM3NjYzNWNiNzg";
            //Temporary hard-coded AppDynamics demo account 
            var account = "asteroids2017070703100120"
            var app_url_tpl = "https://{}.saas.appdynamics.com/controller/?accountName={}#/location=APP_DASHBOARD&application={}"
            var msg = "* A [{}]({}) has occurred in application [{}]({}) ({}).<br/>Time of event: *{}*.<br/>Affected Tier: **{}**.<br/>Affected Node: **{}**."

            bot.startPrivateConversationWithPersonId(personId, function(err, convo) {
                convo.say("### AppDynamics Notification");
                for (var i = 0; i < req.body.length; i++) {
                    app_url = app_url_tpl.format(account, account, req.body[i].appid)
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
        });
        if (cb) cb();
    };

    return controller;
}

module.exports = AppD;