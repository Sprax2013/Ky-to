const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const loc = index.getLocalization();
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'template', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
    aliases: ['t'], // Alternative Bezeichnungen des Befehls (Kann auch als Fallback dienen)
    usage: 'template <Arg1|Arg1-Alternativ> <Arg2>', // TODO: Wie markieren wir Argumente hier?
    description: 'Command Description', // TODO
    category: 0 // TODO
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    msg.channel.send(loc.getStringForGuild('cmd:debug', msg).format(bot.user.id, cmd, args));
}