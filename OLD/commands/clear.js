// ToDo: Recode

const Discord = require("discord.js");

module.exports.run = async (bot, msg) => {
    if (msg.channel.type == "text") {
        if (msg.member != null && msg.member.hasPermission('MANAGE_MESSAGES')) {
            msg.channel.fetchMessages().catch((err) => {
                msg.author.send('Es gab einen Fehler, beim Leeren des Nachrichtenverlaufes von ``' + msg.channel.name + '``: ' + err.message);
            }).then((messages) => {
                messages.filter((m => {
                    m.delete().catch((err) => {
                        msg.author.send('Es gab einen Fehler, beim Leeren des Nachrichtenverlaufes von ``' + msg.channel.name + '``: ' + err.message);
                    });
                }));

                msg.channel.send(new Discord.RichEmbed()
                    .setColor(13632027)

                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setDescription(`Der Chat-Verlauf wurde von <@${msg.author.id}> geleert`)

                    .setTimestamp()
                );
            });
        } else {
            msg.delete();
            msg.author.send('Du hast keinen Zugriff auf den Befehl ``!clear``!');
        }
    } else if (msg.channel.type == "dm") {
        msg.channel.fetchMessages().catch((err) => {
            msg.author.send('Es gab einen Fehler, beim Leeren des Nachrichtenverlaufes von ``' + msg.channel.name + '``: ' + err.message);
        }).then((messages) => {
            messages.filter((m => {
                if (m.author.id == bot.user.id) {
                    m.delete().catch((err) => {
                        msg.author.send('Es gab einen Fehler, beim Leeren des Nachrichtenverlaufes von ``' + msg.channel.name + '``: ' + err.message);
                    });
                }
            }));

            msg.channel.send(new Discord.RichEmbed()
                .setColor(13632027)

                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setDescription(`Du hast den Chat-Verlauf geleert...\nJedenfalls alle Nachrichten von mir`)

                .setTimestamp()
            );
        });
    } else {
        msg.author.send('Der Befehl ``!clear`` kann hier nicht genutzt werden!');
    }
}



module.exports.help = {
    name: "clear"
}