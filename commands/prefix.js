const index = require('../index');
const dc = require('discord.js');

module.exports.cmd = {
    name: 'prefix'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
        if (!args[0] || args[0].equalsIgnoreCase('help')) {
            msg.channel.send(`Usage: \`${index.getGuildPrefix(msg)}${cmd} <New command-prefix to use>\``);
        } else {
            if (args[0].length === 1) {
                if (index.getGuildPrefix(msg) === args[0]) {
                    msg.channel.send(`Prefix is already set to ${index.getGuildPrefix(msg)}`);
                } else {
                    index.setGuildPrefix(msg, args[0]);

                    msg.channel.send(new dc.RichEmbed()
                        .setColor('0xE7193F')
                        .setTitle('Settings changed successfully!')
                        .setDescription(`Prefix has been set to **${index.getGuildPrefix(msg)}**`)
                        .setFooter(`On behalf of ${msg.author.tag}`));
                }
            } else {
                msg.channel.send('The prefix may only contain one symbol.');
            }
        }
    } else {
        msg.author.send('You can\'t change the prefix');
    }
}