const index = require('./../index');
const loc = index.getLocalization();

const dc = require('discord.js');

module.exports.cmd = {
    name: 'Settings',
    aliases: ['Setting', 'Einstellungen', 'Einstellung'],

    category: index.CommandCategory.ADMIN
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    var embedTitel = loc.getStringForGuild(this, '{%voc}:Settings', msg);

    if (args.length > 0) {
        if (args[0].equalsIgnoreCase('language') || args[0].equalsIgnoreCase('lang') || args[0].equalsIgnoreCase('sprache')) {
            embedTitel = `${embedTitel} - ${loc.getStringForGuild(this, '{%voc}:Language', msg)}`;

            if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
                if (args.length > 1) {
                    let currLang = index.getGuildLanguage(msg);
                    let lang = loc.getLanguageEnumFromString(args[1]);

                    if (lang) {
                        if (lang !== currLang) {
                            index.setGuildLanguage(msg, lang);

                            // Sprache wurde gesetzt
                            sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Lang:Set', msg).format(index.getGuildLanguage(msg).name));
                        } else {
                            // Sprache bereits gesetzt
                            sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Lang:AlreadySet', msg).format(index.getGuildLanguage(msg).name));
                        }
                    } else {
                        // Sprache nicht gefunden
                        sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Lang:NotFound', msg));
                    }
                } else {
                    // Keine Sprache angegeben
                    msg.channel.send(
                        addLanguageFields(
                            new dc.RichEmbed()
                            .setColor('0xE7193F')
                            .setTitle(embedTitel)
                            .setDescription(
                                loc.getStringForGuild(this, '{%cmd}:Lang:NoneGiven', msg)
                                .format(`${guildPrefix}${cmd} ${args[0]} <${loc.getStringForGuild(this, '{%voc}:Language', msg)}>`)
                            )
                            .addBlankField(), msg)
                    );
                }
            } else {
                // Keine Admin-Rechte
                sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Lang:NotAllowed', msg));
            }
        } else if (args[0].equalsIgnoreCase('prefix') || args[0].equalsIgnoreCase('präfix')) {
            embedTitel = `${embedTitel} - ${loc.getStringForGuild(this, '{%voc}:Prefix', msg)}`;

            if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
                if (args.length > 1) {
                    if (args[1].length === 1) {
                        if (args[1] !== guildPrefix) {
                            index.setGuildPrefix(msg, args[1]);

                            // Präfix wurde gesetzt
                            sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Prefix:Set', msg).format(args[1]));
                        } else {
                            // Präfix ist bereits gesetzt
                            sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Prefix:AlreadySet', msg).format(guildPrefix));
                        }
                    } else {
                        // Präfix länger als 1 Zeichen
                        sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Prefix:TooLong', msg));
                    }
                } else {
                    // Keine Präfix angegeben
                    sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Prefix:NoneGiven', msg)
                        .format(`${guildPrefix}${cmd} ${args[0]} <${loc.getStringForGuild(this, '{%voc}:Prefix', msg)}>`));
                }
            } else {
                // Keine Admin-Rechte
                sendBasicRichEmbed(msg, embedTitel, loc.getStringForGuild(this, '{%cmd}:Prefix:NotAllowed', msg));
            }
        } else {
            sendCommandUsage(msg, cmd, guildPrefix, embedTitel);
        }
    } else {
        sendCommandUsage(msg, cmd, guildPrefix, embedTitel);
    }
}

function addLanguageFields(richEmbed, msg) {
    if (richEmbed && richEmbed instanceof dc.RichEmbed) {
        let currLang = index.getGuildLanguage(msg);

        for (const key in loc.LanguageEnum) {
            if (loc.LanguageEnum.hasOwnProperty(key)) {
                const lang = loc.LanguageEnum[key];

                if (currLang !== lang) {
                    richEmbed.addField(lang.langCode, `${lang.name} (${loc.getLanguageNameForGuild(lang, msg)})`);
                }
            }
        }
    }

    return richEmbed;
}

function sendBasicRichEmbed(msg, embedTitel, description) {
    msg.channel.send(
        new dc.RichEmbed()
        .setColor('0xE7193F')
        .setTitle(embedTitel)
        .setDescription(description)
    );
}

function sendCommandUsage(msg, cmd, guildPrefix, embedTitel) {
    let vocLanguage = loc.getStringForGuild(module.exports, '{%voc}:Language', msg);
    let vocPrefix = loc.getStringForGuild(module.exports, '{%voc}:Prefix', msg);

    msg.channel.send(
        new dc.RichEmbed()
        .setColor('0xE7193F')
        .setTitle(embedTitel)
        .setDescription(`${loc.getStringForGuild(module.exports, '{%cmd}:cmd.Description', msg)}`)
        .addBlankField()

        .addField(vocLanguage, '{0}{1} {2} <{3}>'.format(guildPrefix, cmd, 'Language', vocLanguage))
        .addField(vocPrefix, '{0}{1} {2} <{3}>'.format(guildPrefix, cmd, 'Prefix', vocPrefix))
    );
}