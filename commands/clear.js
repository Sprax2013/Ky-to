const index = require('./../index');
const loc = index.getLocalization();
const dc = require('discord.js');

module.exports.cmd = {
    name: 'Clear',
    aliases: ['ClearChat', 'cc'],

    category: index.CommandCategory.MODERATOR
};

var messages = new dc.Collection();

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    if (msg.member && msg.member.hasPermission('MANAGE_MESSAGES')) {
        let global = false;
        let count = 50;

        if (args.length >= 1) {
            global = args.includes('-g') || args.includes('-global');

            for (const arg of args) {
                if (!isNaN(Number.parseInt(arg))) {
                    count = Number.parseInt(arg);
                }
            }
        }

        if (count > 0) {
            let reply = await msg.reply(loc.getStringForGuild(this, '{%cmd}:Confirm', msg).format(count, 5));

            messages.set(reply, {
                msg: msg,
                global: global,
                count: count
            });

            reply.react('🤖').then(async () => {
                for (let i = 5; i >= 0; i--) {
                    if (messages.has(reply)) {
                        if (i !== 5) {
                            if (i !== 0) {
                                await reply.edit(`${msg.author}, ${loc.getStringForGuild(this, '{%cmd}:Confirm', msg).format(count, i)}`);
                            } else {
                                reply.edit(loc.getStringForGuild(this, '{%cmd}:Canceled', msg).format(msg.author));
                            }
                        }

                        await index.Utils.sleep(1000);
                    }
                }
            }).catch((err) => {
                console.error(err);

                messages.delete(reply);
                reply.edit(loc.getStringForGuild(this, 'ERR_OCCURRED', msg));
            });
        } else {
            msg.reply(loc.getStringForGuild(this, '{%cmd}:AtLeatOneMessage', msg));
        }
    } else {
        sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:NotAllowed', msg));
    }
}


module.exports.onAddedReaction = async (bot, msgReact, user) => {
    if (msgReact.emoji.name === '🤖' && messages.has(msgReact.message) && messages.get(msgReact.message).msg.author === user) {
        let channel = msgReact.message.channel;
        let data = messages.get(msgReact.message);

        messages.delete(msgReact.message);

        await data.msg.delete();
        await msgReact.message.delete();

        let countLeft = data.count;
        while (countLeft > 0) {
            let nextCount = countLeft >= 100 ? 100 : countLeft;
            countLeft -= nextCount;

            deleteRecentMessages(channel, nextCount);
        }

        channel.send(new dc.RichEmbed()
            .setColor(13632027)

            .setAuthor(user.username, user.avatarURL)
            .setDescription(loc.getStringForGuild(this, '{%cmd}:SuccessFooter', msg).format(`<@${user.id}>`))

            .setTimestamp()
        );
    }
}

async function deleteRecentMessages(channel, count) {
    channel.fetchMessages({
            limit: count
        })
        .then((messages) => {
            channel.bulkDelete(messages, true).then(async () => {
                // Deletes messages older that 14 days
                for (const [key] of messages) {
                    channel.fetchMessage(key).then((msg) => {
                        msg.delete();
                    }).catch((err) => {
                        if (err.code !== 10008) { // Message already deleted
                            console.error(err);
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
}