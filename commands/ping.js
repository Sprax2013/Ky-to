module.exports.cmd = {
    name: 'Ping'
};

module.exports.onCommand = async (bot, msg) => {
    if (msg.isMentioned(bot.user)) {
        msg.channel.send(loc.getStringForGuild(this, '{%cmd}:BotPing', msg).format(Math.round(bot.ping)));
    } else {
        let resMsg = await msg.channel.send(loc.getStringForGuild(this, '{%cmd}:BeingAppreciated', msg));
        resMsg.edit(loc.getStringForGuild(this, '{%cmd}:UserPing', msg).format(Math.round((resMsg.createdTimestamp - msg.createdTimestamp) - bot.ping)));
    }
}