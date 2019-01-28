const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'prefix'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    const index = require('../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
    
    if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
        if (!args[0] || args[0].toLowerCase() === 'help') {
            msg.channel.send(`Usage: \`${index.getGuildPrefix(msg.guild.id)}${cmd} <New command-prefix to use>\``);
        } else {
            if (args[0].length === 1) {
                index.setGuildPrefix(msg.guild.id, args[0]);

                msg.channel.send(new dc.RichEmbed()
                    .setColor('0xE7193F')
                    .setTitle('Settings changed successfully!')
                    .setDescription(`Prefix has been set to **${index.getGuildPrefix(msg.guild.id)}**`)
                    .setFooter(`On behalf of ${msg.author.tag}`));
            } else {
                msg.channel.send('The prefix may only contain one symbol.');
            }
        }
    } else {
        msg.author.send('You can\'t change the prefix');
    }
}