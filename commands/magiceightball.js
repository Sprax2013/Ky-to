const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const api = "https://nekos.life/api/v2/8ball";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'magicball', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    const argsFix = args.join(" ");

    var imgNeko = snekfetch.get(api).then(r => {
        if (argsFix <= 1) {
            const embed = new Discord.RichEmbed()
                .setTitle(r.body.response)
                .setDescription(argsFix)
                .setColor(0x00AE86)
                .setFooter(`${msg.author.username}` + `'s Future has been decided!`)
                .setImage(r.body.url)
            msg.channel.send(embed)
            return
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle(argsFix)
                .setColor(0x00AE86)
                .setFooter(`${msg.author.username}` + `'s Future has been decided!`)
                .setImage(r.body.url)
            msg.channel.send(embed)
            return
        }
    })
}