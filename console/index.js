'use strict';

const smoochBot = require('smooch-bot');
const MemoryStore = smoochBot.MemoryStore;
const MemoryLock = smoochBot.MemoryLock;
const Bot = smoochBot.Bot;
const Script = smoochBot.Script;
const StateMachine = smoochBot.StateMachine;

class ConsoleBot extends Bot {
    constructor(options) {
        super(options);
    }

    say(text) {
        return new Promise((resolve) => {
            console.log(text);
            resolve();
        });
    }
}

const script = new Script({
start: {
    receive: (bot) => {
        return bot.say('Hi! I\'m MatthiasBot!')
            .then(() => 'about');
    }
},
about: {
    prompt: (bot) => bot.say('I\'m the interactive resume of Matthias Kronfeld Jordan.\nYou can find his website here: http://iammatthias.com'),
    receive: (bot) => {
        return bot.say('Let\'s get started.')
            .then(() => 'askName');
    }
},
askName: {
    prompt: (bot) => bot.say('What\'s your name?'),
    receive: (bot, message) => {
        const name = message.text;
        return bot.setProp('name', name)
            .then(() => bot.say(`Thanks! I'll call you ${name}.`))
            .then(() => 'helpers');
    }
},

helpers: {
    receive: (bot, message) => {
        const name = message.text;
        return bot.setProp('name', name)
            .then(() => bot.say(`How can I help you today, ${name}`))
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

const userId = 'testUserId';
const store = new MemoryStore();
const lock = new MemoryLock();
const bot = new ConsoleBot({
    store,
    lock,
    userId
});

const stateMachine = new StateMachine({
    script,
    bot,
    userId
});

process.stdin.on('data', function(data) {
    stateMachine.receiveMessage({
        text: data.toString().trim()
    })
        .catch((err) => {
            console.error(err);
            console.error(err.stack);
        });
});
