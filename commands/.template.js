const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'template', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
    aliases: ['t1'] // Alternative Bezeichnungen des Befehls (Kann auch als Fallback dienen)
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    msg.channel.sendMessage(`#onCommand(bot[.user.id] = ${bot.user.id}, msg, cmd = ${cmd}, args = ${args})`);
}