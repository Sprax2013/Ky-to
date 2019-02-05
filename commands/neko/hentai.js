const index = require('./../../index');
const loc = index.getLocalization();

const dc = require('discord.js');

const apiURL_NSFW = ['https://nekos.life/api/v2/img/hentai', 'https://nekos.life/api/v2/img/solo', 'https://nekos.life/api/v2/img/tits'],
    apiURL_NSFW_FEET = 'https://nekos.life/api/v2/img/feet',
    // apiURL_NSFW_YURI = ['https://nekos.life/api/v2/img/yuri', 'https://nekos.life/api/v2/img/eroyuri'],    // GIF version
    apiURL_NSFW_BJ = 'https://nekos.life/api/v2/img/blowjob',

    apiURL_GIF_NSFW = [
        'https://nekos.life/api/v2/img/Random_hentai_gif', 'https://nekos.life/api/v2/img/pwankg', 'https://nekos.life/api/v2/img/solog',
        'https://nekos.life/api/v2/img/classic', 'https://nekos.life/api/v2/img/kuni', 'https://nekos.life/api/v2/img/boobs'
    ],
    apiURL_GIF_NSFW_FEET = 'https://nekos.life/api/v2/img/feetg',
    // apiURL_GIF_NSFW_ANAL = 'https://nekos.life/api/v2/img/anal', // Non-Gif version ??
    apiURL_GIF_NSFW_BJ = 'https://nekos.life/api/v2/img/bj';

module.exports.cmd = {
    name: 'Hentai',

    category: index.CommandCategory.NEKOS_LIFE,

    localizationSubGroup: 'Nekos.Life-API'
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    if (!msg.channel.nsfw) {
        msg.reply(loc.getStringForGuild(this, 'Bot:ChannelNotNSFW', msg));
        return;
    }

    let url = apiURL_NSFW.random();
    let footerIdent = '{%cmd}:RichFooter_NSFW';

    if (args.length >= 1) {
        let gif = args.includes('gif') || args.includes('animated');

        let feet = args.includes('feet') || args.includes('foot');
        // let yuri = args.includes('yuri') || args.includes('lesbian');
        let bj = args.includes('blowjob') || args.includes('bj');

        if (gif) {
            if (feet) {
                url = apiURL_GIF_NSFW_FEET;
            }
            //  else if (yuri) {
            //     url = apiURL_GIF_NSFW_YURI;
            // }
            else if (bj) {
                url = apiURL_GIF_NSFW_BJ;
            } else {
                url = apiURL_GIF_NSFW.random();
            }

            footerIdent += '_Animated';
        } else if (feet) {
            url = apiURL_NSFW_FEET;
        }
        //  else if (yuri) {
        //     url = apiURL_NSFW_YURI;
        // }
        else if (bj) {
            url = apiURL_NSFW_BJ;
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