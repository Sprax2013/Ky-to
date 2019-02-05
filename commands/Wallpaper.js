const index = require('./../index');
const loc = index.getLocalization();

const dc = require('discord.js');

const apiURL = 'https://nekos.life/api/v2/img/wallpaper'
// , apiURL_NSFW = ''
;

module.exports.cmd = {
    name: 'Wallpaper',

    category: index.CommandCategory.MISC
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    let url = apiURL;
    let footerIdent = '{%cmd}:RichFooter';

    // if (args.length >= 1) {
    //     let gif = args.includes('gif') || args.includes('animated');

    //     if (gif) {
    //         url = apiURL_GIF;

    //         footerIdent += '_Animated';
    //     }
    // }

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