module.exports = function(controller) {

    controller.hears(['^show ev'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function showAppEvents(app) {
                controller.config.appdAPI.events.get(app.id, function(error, response, body) {
                    if (body) {
                        var list = [];
                        var msg = "### [Event {}]({})\n * **Summary:** {}<br/>\n * **Severity:** {}<br/>\n * **Type:** {}<br/>\n * **Time:** {}<br/>\n * **Affected entities:** {}<br/><hr/>\n"
                        let events = JSON.parse(body);
                        events.forEach(function(event) {
                            if (!event.markedAsResolved){
                                var date = new Date(event.eventTime);
                                var entityList = "\n";
                                event.affectedEntities.forEach(function(entity){
                                    entityList += "    1. Type: {}<br/>Name: {}\n".format(entity.entityType, entity.name)
                                });
                                list.push (msg.format(event.id,
                                    event.deepLinkUrl,
                                    event.summary,
                                    event.severity,
                                    event.type,
                                    date.toString(),
                                    entityList + "\n")
                                )
                            }
                        });
                        if (list.length == 0) {
                            convo.say("There are no open events.");
                        } else {
                            convo.say("Following are the events for application **{}** for the last **week**:<br/>\n".format(app.name)); 
                            list.forEach(function(event){
                                convo.say(event);
                            })
                        }
                    } 
                });
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
                                showAppEvents(app);
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
                        convo.ask("What application do you want me to show events for?<br/>" + appList, patterns);
                    }
                }
            });

            

            convo.activate();
        });
    });

};