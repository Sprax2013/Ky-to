const index = require('./../../index');
const loc = index.getLocalization();

const dc = require('discord.js');

const apiURL_NSFW = 'https://nekos.life/api/v2/img/cum_jpg',
    apiURL_GIF_NSFW = 'https://nekos.life/api/v2/img/cum';

module.exports.cmd = {
    name: 'Cum',
    aliases: ['Cummie'],

    category: index.CommandCategory.NEKOS_LIFE,

    localizationSubGroup: 'Nekos.Life-API'
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    if (!msg.channel.nsfw) {
        msg.reply(loc.getStringForGuild(this, 'Bot:ChannelNotNSFW', msg));
        return;
    }

    let url = apiURL_NSFW;
    let footerIdent = '{%cmd}:RichFooter_NSFW';

    if (args.length >= 1) {
        let gif = args.includes('gif') || args.includes('animated');

        if (gif) {
            url = apiURL_GIF_NSFW;

            footerIdent = '{%cmd}:RichFooter_NSFW';
        }
    }

    index.Utils.getJSONFromURL(url, (json) => {
        if (json && json.url) {
            msg.channel.send(
                new dc.RichEmbed()
                .setColor(0x00AE86)
                .setTitle(loc.getStringForGuild(this, '{%cmd}:RichTitle', msg))

                .setImage(json.url)
                .setFooter(loc.getStringForGuild(this, footerIdent, msg)
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