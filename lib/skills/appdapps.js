module.exports = function(controller) {

    controller.hears(['^show app'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            var appID = 19573;

            controller.config.appdAPI.applications.getall(function(error, response, body) {
                if (body) {
                    var appList = "";
                    var msg = "* **Name:** {}<br/>\n"
                    let apps = JSON.parse(body);
                    apps.forEach(function(app) {
                        appList += "* **{}:** {}<br/>\n".format(app.name, app.description);
                    });
                    if (appList == "") {
                        convo.say("There are no monitored applications.");
                    } else {
                        convo.say("## Currently monitored applications:<br/>\n" + appList);
                    }
                }
            });

            convo.activate();
        });
    });

    controller.hears(['^show metric'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            var appID = 19573;

            var metrics = [
                'Overall Application Performance|Average Response Time (ms)',
                'Overall Application Performance|Average End to End Latency (ms)',
                'Overall Application Performance|Errors per Minute',
                'Overall Application Performance|Infrastructure Errors per Minute',
                'Overall Application Performance|Number of Slow Calls',
                'Overall Application Performance|Number of Very Slow Calls'
            ];

            metrics.forEach(function(metric){
                controller.config.appdAPI.metrics.get(appID, metric, 60, function(error, response, body) {
                    if (body) {
                        let res = JSON.parse(body);
                        convo.say("* {}}: <br/>\n     * Value: {}<br/>\n    * Std Dev: {}"
                        .format(metric, res[0].metricValues[0].value, res[0].metricValues[0].standardDeviation));
                    }
                });
            })

            convo.activate();   
        });
    });


};