'use strict';

const Script = require('smooch-bot').Script;

const _ = require('lodash');
const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
     receive: (bot) => {
         return bot.say('Welcome to Matthias Jordan\'s personal bot / resume assistant! Just say HELLO to get started.')
             .then(() => 'speak');
     }
 },

 speak: {
     receive: (bot, message) => {

         let upperText = message.text.trim().toUpperCase();

         function updateSilent() {
             switch (upperText) {
                 case "CONNECT ME":
                     return bot.setProp("silent", true);
                 case "DISCONNECT":
                     return bot.setProp("silent", false);
                 default:
                     return Promise.resolve();
             }
         }

         function getSilent() {
             return bot.getProp("silent");
         }

         function processMessage(isSilent) {
             if (isSilent) {
                 return Promise.resolve("speak");
             }

             if (!_.has(scriptRules, upperText)) {
                 return bot.say(`I didn't understand that. Here are a few useful commands: HELLO, BIO, SKILLS, EXPERIENCE, EDUCATION, HELP\nTo learn more about this bot, say ABOUT`).then(() => 'speak');
             }

             var response = scriptRules[upperText];
             var lines = response.split('\n');

             var p = Promise.resolve();
             _.each(lines, function(line) {
                 line = line.trim();
                 p = p.then(function() {
                     console.log(line);
                     return bot.say(line);
                 });
             })

             return p.then(() => 'speak');
         }

         return updateSilent()
             .then(getSilent)
             .then(processMessage);
     }
 }
});
