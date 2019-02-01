const index = require('./../index');
const loc = index.getLocalization();

const dc = require('discord.js');

module.exports.cmd = {
    name: 'Invite',
    aliases: ['Einladung']
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    msg.channel.send(new dc.RichEmbed()
        .setColor(0x00AE86)
        .setTitle(loc.getStringForGuild(this, '{%cmd}:RichTitle', msg))
        .setDescription(loc.getStringForGuild(this, '{%cmd}:RichDescription', msg).format(index.getDefaultCommandPrefix()))

        .setURL('https://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=526454942328946719')

        .setFooter(loc.getStringForGuild(this, '{%cmd}:RichFooter', msg).format(msg.author.tag.substr(0, msg.author.tag.lastIndexOf('#'))), msg.author.avatarURL));
}