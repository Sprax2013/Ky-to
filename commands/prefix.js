const index = require('./../index');
const loc = index.getLocalization();

const settings = require('./settings');

module.exports.cmd = {
    name: 'Prefix',
    aliases: ['Präfix'],

    category: index.CommandCategory.ADMIN
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    let newArgs = [loc.getWordForGuild('Prefix', msg)];

    if (args.length >= 1) {
        newArgs.push(args[0]);
    }

    settings.onCommand(bot, msg, 'Settings', newArgs, guildPrefix);
}