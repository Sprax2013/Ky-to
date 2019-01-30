const index = require('./../index');
const loc = index.getLocalization();

module.exports.cmd = {
    name: 'settings',
    aliases: ['Einstellungen']
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