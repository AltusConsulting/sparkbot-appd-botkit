module.exports = function(controller) {

    controller.hears(['^sub'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function subscribeToNotification(type, user) {
                controller.storage.subscriptions.get(type, function(err, subscription_data) {
                    var users = [];
                    if (subscription_data) {
                        users = subscription_data.users;
                        if (!users.includes(user)) {
                            users.push(user);
                            convo.say("You're now subscribed to '{}' notifications.".format(type));
                        } else {
                            convo.say("You're already subscribed to '{}' notifications.".format(type));
                        }
                    } else {
                        users.push(user)
                        convo.say("You're now subscribed to '{}' notifications.".format(type));
                    }
                    controller.storage.subscriptions.save({ id: type, users: users }, function(err) {});
                });
            }

            convo.ask("What type of notifications do you want to subscribe to? (INFO/WARN/ERROR)", [{
                pattern: "INFO|info|Info",
                callback: function(response, convo) {
                    subscribeToNotification('info', message.user);
                    convo.next();
                },
            }, {
                pattern: "WARN|warn|Warn",
                callback: function(response, convo) {
                    subscribeToNotification('warn', message.user);
                    convo.next();
                },
            }, {
                pattern: "ERROR|error|Error",
                callback: function(response, convo) {
                    subscribeToNotification('error', message.user);
                    convo.next();
                },
            }, {
                default: true,
                callback: function(response, convo) {
                    convo.say("Sorry, I did not understand.");
                    convo.repeat();
                    convo.next();
                }
            }]);

            convo.activate();
        });
    });

    controller.hears(['^unsub'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function unsubscribeFromNotification(type, user) {
                controller.storage.subscriptions.get(type, function(err, subscription_data) {
                    if (subscription_data) {
                        users = subscription_data.users;
                        if (users.includes(user)) {
                            users.splice(users.indexOf(user), 1);
                            convo.say("You're now unsubscribed from '{}' notifications.".format(type));
                        } else {
                            convo.say("You're not currently subscribed to '{}' notifications.".format(type));
                        }
                    } else {
                        convo.say("You're not currently subscribed to '{}' notifications.".format(type));
                    }
                    controller.storage.subscriptions.save({ id: type, users: users }, function(err) {});
                });
            }
            convo.ask("What type of notifications do you want to unsubscribe from? (INFO/WARN/ERROR)", [{
                pattern: "INFO|info|Info",
                callback: function(response, convo) {
                    unsubscribeFromNotification('info', message.user);
                    convo.next();
                },
            }, {
                pattern: "WARN|warn|Warn",
                callback: function(response, convo) {
                    unsubscribeFromNotification('warn', message.user);
                    convo.next();
                },
            }, {
                pattern: "ERROR|error|Error",
                callback: function(response, convo) {
                    unsubscribeFromNotification('error', message.user);
                    convo.next();
                },
            }, {
                default: true,
                callback: function(response, convo) {
                    convo.say("Sorry, I did not understand.");
                    convo.repeat();
                    convo.next();
                }
            }]);

            convo.activate();
        });
    });

    controller.hears(['^show sub'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            controller.storage.subscriptions.all(function(err, subscription_data) {
                if (subscription_data) {
                    var list = "";
                    subscription_data.forEach(function(sub) {
                        console.log(typeof(sub.users[0]));
                        sub.users.forEach(function(user) {
                            if (message.user == user) {
                                list += "`{}`<br/>".format(sub.id);
                            }
                        });
                    });
                    if (list == "") {
                        convo.say("You don't have any active subscriptions.");
                    } else {
                        convo.say("You're currently subscribed to the following notifications:<br/>" + list);
                    }
                }
            });

            convo.activate();
        });
    });


};