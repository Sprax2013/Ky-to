const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'invite', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    const embed = new dc.RichEmbed()
    .setTitle(">> Invite Link <<")
    .setDescription(`Use **${index.getGuildPrefix(msg.guild.id)}commands** after the Bot is installed!`)
    .setColor(0x00AE86)
    .setURL(`https://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=526454942328946719`)
    .setFooter(`${msg.author.username}`+ `'s request has been fulfilled`)
    msg.channel.send(embed)
}