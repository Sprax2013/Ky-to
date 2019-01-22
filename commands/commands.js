const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'commands'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    msg.channel.sendMessage('hey');
}