//
// Command: help
//
module.exports = function(controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function(bot, message) {
        var text = "My skills are:";
        text += "\n- " + bot.enrichCommand(message, "subscribe") + ": Subscribe to a notification";
        text += "\n- " + bot.enrichCommand(message, "unsubscribe") + ": Unsubscribe from a notification";
        text += "\n- " + bot.enrichCommand(message, "show subscriptions") + ": Show current subscriptions";
        text += "\n- " + bot.enrichCommand(message, "show applications") + ": Show monitored applications";
        text += "\n- " + bot.enrichCommand(message, "show events") + ": Show recent events for a monitored application";
        text += "\n- " + bot.enrichCommand(message, "show metrics") + ": Show recent metrics for a monitored application";

        text += "\n\nI also understand:";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the message about my skills";
        bot.reply(message, text);
    });
}