const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    if (args.length <= 1) {
        msg.channel.send('_**Nutzung:** ``!reply <Nachrichten-ID> Deine Antwort``_');
    } else {
        msg.channel.fetchMessage(args[0]).catch(() => {
            msg.author.send("Die Nachricht, auf die du antworten wolltest, wurde nicht gefunden.\nDu kannst nur Nachrichten aus dem gleichen Channel antworten.\nAchte außerdem darauf die Nachrichten-ID anzugeben.");
        }).then((replyingTo) => {
            if (replyingTo != null) {
                if (msg.channel.type == "text" && !msg.author.bot) {
                    msg.channel.send(new Discord.RichEmbed()
                        .setURL(replyingTo.url)
                        .setColor(4886754)

                        .setAuthor(msg.author.tag, msg.author.avatarURL)
                        .setTitle(`Antwort von ${msg.author.tag} an ${replyingTo.author.tag}`)
                        .setDescription(
                            `_**<@${replyingTo.author.id}> schrieb:**_` +
                            '\n' + (isMessageBotReply(bot, replyingTo) ? getReplyFromBotReply(replyingTo) : replyingTo.content) + '\n\n' +
                            `_**<@${msg.author.id}> hat gerade geantwortet:**_` + '\n' +
                            msg.content.substr(1 + 'reply '.length + replyingTo.id.length)
                        )

                        // .setFooter('Die original Nachricht von ' + msg.author.tag + ' wurde durch den Bot automatisch gelöscht')
                        .setTimestamp());

                    msg.delete();
                } else {
                    msg.reply('Tut mir leid aber dieser Befehl kann hier nicht genutzt werden!');
                }
            }
        });
    }
}

function isMessageBotReply(client, msg) {
    console.log(msg.author.id == client.user.id);
    console.log(msg.embeds.length == 1);
    console.log(msg.embeds[0] != null);

    if (msg.embeds[0] != null) {
        console.log(msg.embeds[0].title != null);

        if (msg.embeds[0].title != null) {
            console.log(msg.embeds[0].title.match(/^Antwort von .* an .*$/g).length == 1);
        }
    }

    return msg.author.id == client.user.id && msg.embeds.length == 1 &&
        msg.embeds[0] != null && msg.embeds[0].title != null && msg.embeds[0].title.match(/^Antwort von .* an .*$/g).length == 1;
}

function getReplyFromBotReply(msg) {
    return msg.embeds[0].description.split('\n')[4];
}

module.exports.help = {
    name: "reply"
}