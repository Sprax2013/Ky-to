const index = require('./../index');
const loc = index.getLocalization();

const querystring = require('querystring');
const dc = require('discord.js');

const apiURL = 'https://api.sprax2013.de/google/search?token={0}&q={1}&hl={2}';

module.exports.cmd = {
    name: 'Google',
    aliases: ['Web'],

    category: index.CommandCategory.MISC
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    let query = msg.content.substring(guildPrefix.length + cmd.length).trim();

    for (const user of msg.mentions.users.values()) {
        query = query.replaceAll(`<@${user.id}>`, index.Utils.getUsernameFromUser(user));
    }

    if (query && query.length > 0 && query.length <= 2048) {
        index.Utils.getJSONFromURL(apiURL
            .format(querystring.escape(index.getSprax2013APIToken()), querystring.escape(query), querystring.escape(index.getGuildLanguage(msg).langCode)),
            (json) => {
                if (json) {
                    let title, description, url, imgUrl;

                    if (Object.keys(json.rhs).length > 0) {
                        title = `${json.rhs.title} (${json.rhs.subTitle})`;
                        description = `${json.rhs.info.text} - ${json.rhs.info.url}`;
                        url = json.rhs.info.url;
                        imgUrl = json.rhs.img.src;
                    } else if (json.results.length > 0) {
                        title = json.results[0].title;
                        url = json.results[0].url;
                        description = json.results[0].description;
                    } else {
                        msg.channel.send(
                            new dc.RichEmbed()
                            .setColor(0x046CF4)
                            .setTitle(loc.getStringForGuild(this, '{%cmd}:NoResults', msg))
                        );

                        return;
                    }

                    let richEmbed = new dc.RichEmbed()
                        .setColor(0x046CF4)
                        .setTitle(title)

                        .setDescription(description);

                    if (url) {
                        richEmbed.setURL(url);
                    }

                    if (imgUrl) {
                        richEmbed.setImage(imgUrl);
                    }

                    msg.channel.send(richEmbed);
                }
            });
    } else if (query.length <= 0) {
        msg.reply(loc.getStringForGuild(this, '{%cmd}:NoQuery', msg));
    } else {
        msg.reply(loc.getStringForGuild(this, '{%cmd}:QueryTooLong', msg));
    }
}