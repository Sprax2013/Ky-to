const index = require('./../index');
const dc = require('discord.js');

module.exports.cmd = {
    name: 'invite'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    msg.channel.send(new dc.RichEmbed()
        .setTitle(">> Invite Link <<")
        .setDescription(`Use **${index.getDefaultCommandPrefix()}commands** after the Bot is installed!`)
        .setColor(0x00AE86)
        .setURL(`https://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=526454942328946719`)
        .setFooter(`${msg.author.username}` + `'s request has been fulfilled`));
}