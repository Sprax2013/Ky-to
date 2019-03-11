const index = require('../../index');
const loc = index.getLocalization();

const API_URL = 'https://nekos.life/api/v2/owoify?text=';

module.exports.cmd = {
    name: 'Owoify',
    aliases: ['owo'],

    category: index.CommandCategory.MISC
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    if (args.length >= 1) {
        index.Utils.getJSONFromURL(API_URL + encodeURIComponent(getText(args)), (json) => {
            if (json && json.owo) {
                msg.reply(json.owo);
            } else {
                msg.reply(loc.getStringForGuild(this, 'ERR_OCCURRED', msg));
            }
        });
    } else {
        msg.reply('`' + loc.getStringForGuild(this, '{%cmd}:cmd.Usage', msg).format(guildPrefix, module.exports.cmd.name) + '`');
    }
}

function getText(args) {
    let result = '';

    for (const word of args) {
        if (result.length > 0) {
            result += ' ';
        }

        result += word;
    }

    return result;
}