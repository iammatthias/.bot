'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Hi! I\'m MatthiasBot!')
                .then(() => 'about');
        }
    },
    about: {
        prompt: (bot) => {
            return bot.say('I\'m the interactive resume of Matthias Kronfeld Jordan.\n\nYou can find his website here: http://iammatthias.com')
                .then(() => 'askName');
        }
    },
    about: {
        prompt: (bot) => bot.say('I\'m the interactive resume of Matthias Kronfeld Jordan.'),
        receive: (bot, message) => {
            return bot.say(`You can find his website here: http://iammatthias.com`))
                .then(() => 'finish');
        }
    },
    askName: {
        prompt: (bot) => bot.say('What\'s your name?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say(`Great! I'll call you ${name}
Is that OK? %[Yes](postback:yes) %[No](postback:no)`))
                .then(() => 'finish');
        }
    },

    finish: {
        receive: (bot, message) => {
            return bot.getProp('name')
                .then((name) => bot.say(`Sorry ${name}, my creator didn't ` +
                        'teach me how to do anything else!'))
                .then(() => 'finish');
        }
    }
});
