const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const loc = index.getLocalization(); // Hiermit kann auf die Lokalisation zugegriffen werden
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'Template', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
    aliases: ['t'], // Alternative Bezeichnungen des Befehls (Kann auch als Fallback dienen)

    category: index.CommandCategory.MISC // (Optional, Standard: 'MISC') Die Kategorie wird beim Auflisten von Befehlen genutzt
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    msg.channel.send(loc.getStringForGuild(this, '{%cmd}:msg', msg).format(bot.user.id, cmd, args));
}