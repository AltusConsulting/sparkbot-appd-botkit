module.exports = function(controller) {

    controller.hears(['^show app'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

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
                        convo.say("### Currently monitored applications:<br/>\n" + appList);
                    }
                }
            });

            convo.activate();
        });
    });

    controller.hears(['^show metric'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function showAppMetrics(app) {
                var metrics = [
                    'Overall Application Performance|Average Response Time (ms)',
                    'Overall Application Performance|Average End to End Latency (ms)',
                    'Overall Application Performance|Errors per Minute',
                    'Overall Application Performance|Infrastructure Errors per Minute',
                    'Overall Application Performance|Number of Slow Calls',
                    'Overall Application Performance|Number of Very Slow Calls'
                ];
                convo.say("Following are the metrics for application **{}** for the last **60 minutes**:<br/>\n".format(app.name));  
                    metrics.forEach(function(metric){
                        controller.config.appdAPI.metrics.get(app.id, metric, 60, function(error, response, body) {
                            if (body) {
                                let res = JSON.parse(body);
                                if (res[0].metricValues.length == 0) {
                                    console.log("No metric values")
                                    var metricValues = {"value": "N/A", "standardDeviation": "N/A"}
                                } else {
                                    var metricValues = res[0].metricValues[0];
                                }
                                convo.say("* {}}: <br/>\n     * Value: {}<br/>\n    * Std Dev: {}"
                                .format(metric, metricValues.value, metricValues.standardDeviation));
                            }
                        });
                    })
            }

            controller.config.appdAPI.applications.getall(function(error, response, body) {
                var patterns = [];
                var appList = "";
                if (body) {
                    let apps = JSON.parse(body);
                    apps.forEach(function(app) {
                        patterns.push({
                            pattern: app.name,
                            callback: function(response, convo) {
                                showAppMetrics(app);
                                convo.next();
                            }
                        });
                        appList += "\n* " + app.name;
                    });

                    patterns.push({
                        default: true,
                        callback: function(response, convo) {
                            convo.say("Sorry, I did not understand.");
                            convo.repeat();
                            convo.next();
                        }
                    });

                    if (appList == "") {
                        convo.say("There are no monitored applications in your account.");
                    } else {
                        convo.ask("What application do you want me to show metrics for?<br/>" + appList, patterns);
                    }
                }
            });

            convo.activate();   
        });
    });


};