const index = require('./../index');
const Discord = require('discord.js');
const loc = index.getLocalization();
const dc = Discord
module.exports.cmd = {
    name: 'settings',
    aliases: ['Einstellungen']
};
// ${loc.getStringForGuild('google:setAuthor', msg).format(bot.user.id, cmd, args)}
// loc.getStringForGuild('google:setAuthor', msg).format(bot.user.id, cmd, args)
module.exports.onCommand = async (bot, msg, cmd, args = []) => {
    var prefix = index.getGuildPrefix(msg)

    if (args.length > 0) {
        if (args[0].equalsIgnoreCase('lang') || args[0].equalsIgnoreCase('language') || args[0].equalsIgnoreCase('sprache')) {
            if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
                if (args.length > 1) {
                    let lang = loc.getLanguageEnumFromString(args[1]);

                    if (lang) {
                        // Sprache geändert             ${index.getGuildLanguage(msg).name}
                        msg.channel.send(new dc.RichEmbed()
                            .setColor('0xE7193F')
                            .setTitle(loc.getStringForGuild('settings:setTitle', msg).format(bot.user.id, cmd, args))
                            .setDescription(`${loc.getStringForGuild('settings:lang', msg).format(bot.user.id, cmd, args)} ${index.getGuildLanguage(msg).name}`)
                        )
                    } else {
                        // Sprache exestiert nicht + Sprachen auflisten
                        msg.channel.send(new dc.RichEmbed()
                            .setColor('0xE7193F')
                            .setTitle(loc.getStringForGuild('settings:setTitle', msg).format(bot.user.id, cmd, args))
                            .setDescription(loc.getStringForGuild('settings:langNotFound', msg).format(bot.user.id, cmd, args))
                            .addField(`de`, `Deutsch / German`)
                            .addField(`en`, `Englisch / English`)
                        )
                    }
                } else {
                    // Du musst eine Sprache angeben + Sprachen auflisten
                    msg.channel.send(new dc.RichEmbed()
                        .setColor('0xE7193F')
                        .setTitle(loc.getStringForGuild('settings:setTitle', msg).format(bot.user.id, cmd, args))
                        .setDescription(loc.getStringForGuild('settings:langNoString', msg).format(bot.user.id, cmd, args))
                        .addField(`de`, `Deutsch / German`)
                        .addField(`en`, `Englisch / English`)
                    )
                }
            } else {
                // Nicht erlaubt Sprache zu ändern
                msg.channel.send(new dc.RichEmbed()
                    .setColor('0xE7193F')
                    .setTitle(loc.getStringForGuild('settings:setTitle', msg).format(bot.user.id, cmd, args))
                    .setDescription(loc.getStringForGuild('settings:langNoRights', msg).format(bot.user.id, cmd, args))
                )
            }
        } else {
            // Unbekannte Befehlstruktur
            msg.channel.send(new dc.RichEmbed()
                .setColor('0xE7193F')
                .setTitle(loc.getStringForGuild('settings:setTitle', msg).format(bot.user.id, cmd, args))
                .setDescription(loc.getStringForGuild('settings:langwtf', msg).format(bot.user.id, cmd, args))
            )
        }
    } else {
        // Help (!settings)
        msg.channel.send(new dc.RichEmbed()
            .setColor('0xE7193F')
            .setTitle(loc.getStringForGuild('settings:setTitle', msg).format(bot.user.id, cmd, args))
            .addField(loc.getStringForGuild('settings:helpLangD', msg).format(bot.user.id, cmd, args), `${prefix}settings lang`)
        )
    }
}