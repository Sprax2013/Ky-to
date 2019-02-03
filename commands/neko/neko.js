const index = require('./../../index');
const loc = index.getLocalization();

const dc = require('discord.js');

const apiURL = 'https://nekos.life/api/v2/img/neko',
    apiURL_NSFW = 'https://nekos.life/api/v2/img/lewd';
const apiURL_GIF = 'https://nekos.life/api/v2/img/ngif',
    apiURL_GIF_NSFW = 'https://nekos.life/api/v2/img/nsfw_neko_gif';

module.exports.cmd = {
    name: 'Neko',

    category: index.CommandCategory.NEKOS_LIFE,
    
    localizationSubGroup: 'Nekos.Life-API'
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    let url = apiURL;
    let footerIdent = '{%cmd}:RichFooter';

    if (args.length >= 1) {
        let gif = args.includes('gif') || args.includes('animated');
        let nsfw = args.includes('nsfw') || args.includes('lewd');

        if (nsfw && !msg.channel.nsfw) {
            msg.reply(loc.getStringForGuild(this, 'NOT_NSFW_CHANNEL', msg));
            return;
        }

        if (gif && !nsfw) {
            url = apiURL_GIF;

            footerIdent += '_Animated';
        } else if (gif && nsfw) {
            url = apiURL_GIF_NSFW;

            footerIdent += '_Animated_NSFW';
        } else if (!gif && nsfw) {
            url = apiURL_NSFW;

            footerIdent += '_NSFW';
        } else {
            url = apiURL;
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