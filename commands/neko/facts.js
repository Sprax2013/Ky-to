const index = require('./../../index');
const loc = index.getLocalization();

const dc = require('discord.js');

const apiURL = 'https://nekos.life/api/v2/img/gecg';

module.exports.cmd = {
    name: 'Facts',
    aliases: ['Fact', 'Gecfdo'],

    category: index.CommandCategory.NEKOS_LIFE,

    localizationSubGroup: 'Nekos.Life-API'
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    index.Utils.getJSONFromURL((apiURL), (json) => {
        if (json && json.url) {
            msg.channel.send(
                new dc.RichEmbed()
                .setColor(0x00AE86)
                .setTitle(loc.getStringForGuild(this, '{%cmd}:RichTitle', msg))

                .setImage(json.url)

                .setFooter(loc.getStringForGuild(this, '{%cmd}:RichFooter', msg)
                    .format(index.Utils.getUsernameFromUser(msg)), msg.author.avatarURL)
            );
        } else {
            msg.channel.send(
                new dc.RichEmbed()
                .setColor(0x00AE86)
                .setTitle(loc.getStringForGuild(this, 'ERR_OCCURRED', msg))
            );
        }
    });
}