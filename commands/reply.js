const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.reply(args)
}


function s() {
    if (args.length <= 1) {
        msg.channel.send('_**Nutzung:** ``!reply <Nachrichten-ID> Deine Antwort``_');
    } else {
        msg.channel.fetchMessage(args[0]).catch(() => {
            msg.author.send("Die Nachricht, auf die du antworten wolltest, wurde nicht gefunden.\nDu kannst nur Nachrichten aus dem gleichen Channel antworten.\nAchte außerdem darauf die Nachrichten-ID anzugeben.");
        }).then((replyingTo) => {
            if (replyingTo != null) {
                if (msg.channel.type == "text") {
                    msg.channel.send(new discord.RichEmbed()
                        .setURL(replyingTo.url)
                        .setColor(4886754)

                        .setAuthor(msg.author.tag, msg.author.avatarURL)
                        .setTitle(`Antwort von ${msg.author.tag} an ${replyingTo.author.tag}`)
                        .setDescription(
                            `_**<@${replyingTo.author.id}> schrieb:**_` +
                            '\n' + (isMessageBotReply(replyingTo) ? getReplyFromBotReply(replyingTo) : replyingTo.content) + '\n\n' +
                            `_**<@${msg.author.id}> hat gerade geantwortet:**_` + '\n' +
                            msg.content.substr(cfg.prefix.length + 'reply '.length + replyingTo.id.length)
                        )

                        .setFooter('Die original Nachricht von ' + msg.author.tag + ' wurde durch den Bot automatisch gelöscht')
                        .setTimestamp());

                    msg.delete();
                } else {
                    msg.reply('Tut mir leid aber dieser Befehl kann hier nicht genutzt werden!');
                }
            }
        });
    }
}




module.exports.help = {
    name: "reply"
}