const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const dc = require('discord.js'); // Praktisch für RichEmbed etc.
const fs = require('fs');

module.exports.cmd = {
    name: 'commands', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {

    if (args.length === 0) {
        msg.reply("You need to give an arg!")
    } else {
        msg.reply(args)
    }
}