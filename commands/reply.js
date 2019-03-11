const index = require('./../index');
const loc = index.getLocalization();
const dc = require('discord.js');

module.exports.cmd = {
    name: 'Reply',
    aliases: ['r', 'Quote'],

    category: index.CommandCategory.MISC
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    if (args.length <= 1) {
        msg.channel.send(loc.getStringForGuild(this, '{%cmd}:cmd.Usage', msg).format(guildPrefix, module.exports.cmd.name));
    } else {
        msg.channel.fetchMessage(args[0]).catch(() => {
            msg.reply(loc.getStringForGuild(this, '{%cmd}:MessageNotFound', msg));
        }).then((replyingTo) => {
            if (replyingTo) {
                let replyingToIsReply = isReply(bot, guildPrefix, replyingTo);

                msg.channel.send(
                    new dc.RichEmbed()
                    .setTitle(loc.getStringForGuild(this, '{%cmd}:URLToMessage', msg))
                    .setURL(replyingTo.url)

                    .setColor(4886754)

                    .setAuthor(msg.author.tag, msg.author.avatarURL)

                    .addField(loc.getStringForGuild(this, '{%cmd}:MessageFrom', msg).format(index.Utils.getUsernameFromUser(getOriginalAuthor(replyingToIsReply, replyingTo))),
                        `${getMessage(replyingToIsReply, replyingTo)}`)

                    .addBlankField()

                    .addField(loc.getStringForGuild(this, '{%cmd}:ReplyFrom', msg).format(index.Utils.getUsernameFromUser(msg.author)),
                        `${getReply(args)}`)

                    .setFooter(`${guildPrefix}${module.exports.cmd.name}`, bot.user.avatarURL)
                    .setTimestamp()
                );

                msg.delete();
            }
        });
    }
}

function isReply(bot, guildPrefix, msg) {
    return msg.author === bot.user && msg.embeds[0] && msg.embeds[0].footer && msg.embeds[0].footer.text === (guildPrefix + module.exports.cmd.name);
}

function getOriginalAuthor(isReply, msg) {
    if (isReply) {
        return msg.embeds[0].author.name;
    } else {
        return msg.author;
    }
}

function getMessage(isReply, msg) {
    if (isReply) {
        return msg.embeds[0].fields[2].value;
    } else {
        return msg.content;
    }
}

function getReply(args) {
    let result = '';

    for (const word of args.slice(1)) {
        if (result.length > 0) {
            result += ' ';
        }

        result += word;
    }

    return result;
}