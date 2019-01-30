const loc = require('./../index').getLocalization();

module.exports.cmd = {
    name: 'ping'
};

module.exports.onCommand = async (bot, msg) => {
    // msg.channel.send(loc.getString('test', loc.LanguageEnum.GERMAN));

    if (msg.isMentioned(bot.user)) {
        msg.channel.send(`Pong! My latency's at ${Math.round(bot.ping)}ms`);
    } else {
        let resMsg = await msg.channel.send('Ping is being investigated... As if it were a criminal :mag:');
        resMsg.edit(`Pong! \`${resMsg.createdTimestamp - msg.createdTimestamp}ms\``);
    }
}