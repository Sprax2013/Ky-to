const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const loc = index.getLocalization(); // Hiermit kann auf die Lokalisation zugegriffen werden
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'Token',
    aliases: ['Editor', 'Webinterface'],

    category: index.CommandCategory.MISC
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    msg.reply('this command will dm you a link containing the token. It would be valid for 90 minutes. Old Tokens will be replaced automatically');
}