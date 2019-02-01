const index = require('./../../index');
const loc = index.getLocalization();

const dc = require('discord.js');

const apiURL = 'https://nekos.life/api/v2/img/avatar',
    apiURL_NSFW = 'https://nekos.life/api/v2/img/nsfw_avatar';

module.exports.cmd = {
    name: 'Avatar',

    localizationSubGroup: 'Neko'
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    index.Utils.getJSONFromURL(apiURL, (json) => {
        if (json && json.url) {
            msg.channel.send(
                new dc.RichEmbed()
                .setColor(0x00AE86)
                .setTitle(loc.getStringForGuild(this, '{%cmd}:RichTitle', msg))

                .setImage(json.url)

                .setFooter(loc.getStringForGuild(this, '{%cmd}:RichFooter', msg)
                    .format(index.Utils.getUsernameFromUser(msg), `${guildPrefix}Help ${this.cmd.name}`), msg.author.avatarURL)
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