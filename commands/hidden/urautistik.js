const index = require('./../../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.

module.exports.cmd = {
    name: 'urautistik',

    category: index.CommandCategory.HIDDEN
};

module.exports.onCommand = async (bot, msg, cmd, args = [], guildPrefix) => {
    msg.reply('no u');
}