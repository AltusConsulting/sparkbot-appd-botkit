module.exports = function(controller) {

    controller.hears(['^show ev'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            var appID = 19573;

            controller.config.appdAPI.events.get(appID, function(error, response, body) {
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
                        convo.say("## Open events for application {}:<br/><br/>\n".format(appID));
                        list.forEach(function(event){
                            convo.say(event);
                        })
                    }
                } 
            });

            convo.activate();
        });
    });

};