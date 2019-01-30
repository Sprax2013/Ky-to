const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const loc = index.getLocalization();
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'settings', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
    aliases: ['Einstellungen'] // Alternative Bezeichnungen des Befehls (Kann auch als Fallback dienen)
};

module.exports.onCommand = async (bot, msg, cmd, args = []) => {
    if (args.length > 0) {
        if (args[0].equalsIgnoreCase('lang') || args[0].equalsIgnoreCase('language') || args[0].equalsIgnoreCase('sprache')) {
            if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
                if (args.length > 1) {
                    let lang = loc.getLanguageEnumFromString(args[1]);

                    if (lang) {
                        index.setGuildLanguage(msg, lang);
                        msg.channel.send(`Ich werde nun überwiegend auf ${index.getGuildLanguage(msg).name} schreiben`);
                    } else {
                        msg.channel.send(`Die gewünschte Sprache behersche ich noch nicht.`);

                        msg.channel.send('// TODO Bekannte Sprachen auflisten');
                    }
                } else {
                    msg.channel.send(`Du musst eine Sprache angeben: ${index.getGuildPrefix(msg)}${cmd} <Sprache>`);

                    msg.channel.send('// TODO Bekannte Sprachen auflisten');
                }
            } else {
                msg.channel.send('Du darfst meine Sprache nicht verändern!');
            }
        } else {
            msg.channel.send('Unbekannte Befehlstruktur.');

            msg.channel.send('// TODO Command-Help auflisten');
        }
    } else {
        msg.channel.send('// TODO Command-Help auflisten');
    }
}