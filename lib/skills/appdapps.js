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

    controller.hears('show metrics for (.*)', 'direct_message,direct_mention', function(bot, message) {

        var appName = message.match[1];

        bot.createConversation(message, function(err, convo) {

            function showAppMetrics(app) {
                var metrics = [
                    'Average Response Time (ms)',
                    'Average End to End Latency (ms)',
                    'Errors per Minute',
                    'Infrastructure Errors per Minute',
                    'Number of Slow Calls',
                    'Number of Very Slow Calls'
                ];
                convo.say("Following are the **Overall Application Performance** metrics for application **{}** for the last **60 minutes**:<br/><br/>\n *Results: Value | Standard Deviation* <br/>\n".format(app.name))
                    metrics.forEach(function(metric){
                        controller.config.appdAPI.metrics.get(app.id, 'Overall Application Performance|' + metric, 60, function(error, response, body) {
                            if (body) {
                                let res = JSON.parse(body);
                                if (res[0].metricValues.length == 0) {
                                    var metricValues = {"value": "N/A", "standardDeviation": "N/A"}
                                } else {
                                    var metricValues = res[0].metricValues[0];
                                }
                                convo.say("* {}:  {} | {}"
                                .format(metric, metricValues.value, metricValues.standardDeviation));
                            }
                        });
                    })
            }

            controller.config.appdAPI.applications.getall(function(error, response, body) {
                var patterns = [];
                var appList = "";
                var selectedApp = null;

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
                        if (app.name == appName) {
                            selectedApp = app;
                        }
                    });

                    patterns.push({
                        default: true,
                        callback: function(response, convo) {
                            convo.say("Sorry, I did not understand.");
                            convo.repeat();
                            convo.next();
                        }
                    });

                    if (selectedApp){
                        showAppMetrics(selectedApp);
                    } else {
                        if (appList == "") {
                            convo.say("There are no monitored applications in your account.");
                        } else {
                            convo.ask("There's no application called **{}**. Following are the available applications. Which one do you want me to show metrics for?<br/>{}".format(appName, appList), patterns);
                        }
                    }
                }
            });

            convo.activate();   
        });
    });


};