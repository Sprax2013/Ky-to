const Discord = require('discord.js');
const api = "https://nekos.life/api/v2/8ball";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'magicball'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    const argsFix = args.join(" ");

    snekfetch.get(api).then(r => {
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