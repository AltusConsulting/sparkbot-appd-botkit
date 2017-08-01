function Notifications(configuration) {
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

    controller.sendNotificationToSubscribers = function(subscribers, event, bot) {

        var app_url_tpl = "https://{}.saas.appdynamics.com/controller/?accountName={}#/location=APP_DASHBOARD&application={}"
        var msg = "* **[{}]** A [{}]({}) has occurred in application [{}]({}) ({}).<br/>Time of event: *{}*.<br/>Affected Tier: **{}**.<br/>Affected Node: **{}**."

        console.log("Sending message to subscribers: " + subscribers);
        subscribers.forEach(function(subscriber) {
            bot.startPrivateConversation({ user: subscriber }, function(err, convo) {
                app_url = app_url_tpl.format(controller.config.account,
                    controller.config.account,
                    event.appid);
                convo.say(msg.format(event.severity,
                    event.name,
                    event.deeplink,
                    event.app,
                    app_url,
                    event.appid,
                    event.time,
                    event.tier,
                    event.node));
            });
        });

    };

    controller.handleNotificationPayload = function(req, res, bot) {

        controller.config.storage.subscriptions.all(function(err, subscription_data) {
            var subscribers = {};
            subscription_data.forEach(function(item) {
                subscribers[item.id] = item.users
            });

            req.body.forEach(function(event) {
                var severity = event.severity.toLowerCase();
                if (subscribers[severity]) {
                    controller.sendNotificationToSubscribers(subscribers[severity], event, bot);
                }
            });
        });
    }

    return controller;
}

module.exports = Notifications;