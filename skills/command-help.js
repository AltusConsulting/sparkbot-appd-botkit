//
// Command: help
//
module.exports = function(controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function(bot, message) {
        var text = "My skills are:";
        text += "\n- " + bot.enrichCommand(message, "skill1") + ": Skill 1";
        text += "\n- " + bot.enrichCommand(message, "skill2") + ": Skill 2";
        text += "\n- " + bot.enrichCommand(message, "skill3") + ": Skill 3";
        text += "\n\nI also understand:";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the message about my skills";
        bot.reply(message, text);
    });
}