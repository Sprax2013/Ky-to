const index = require('./../../index');
const Discord = require('discord.js');
var nekoimg = "https://nekos.life/api/neko"
var nekogif = "https://nekos.life/api/v2/img/ngif"
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'neko'
};

module.exports.onCommand = async (bot, msg, cmd, args, ) => {
    const command = args.shift();
    let mentions = Array.from(msg.mentions.users.values());

    if (command === 'gif') {
        snekfetch.get(nekogif).then(r => {
            let embed = new Discord.RichEmbed()
                .setTitle("NYAAAAA!")
                .setColor(0x00AE86)
                .setFooter(`${msg.author.username}` + `'s Animated Waifu`)
                .setImage(r.body.url)
            msg.channel.send(embed)
        })
        return
    }
    if (command === 'help') {
        let embed = new Discord.RichEmbed()
            .setTitle("Neko Help")
            .setColor(0x00AE86)
            .addBlankField(true)
            .addField(`${index.getGuildPrefix(msg.guild.id)}neko `, `Shows you a Image of a Neko.`)
            .addField(`${index.getGuildPrefix(msg.guild.id)}neko gif`, `Shows you a GIF of a Neko.`)
            .addField(`${index.getGuildPrefix(msg.guild.id)}neko help`, `Shows you this List.`)

        msg.channel.send(embed)
        return
    } else {
        if (mentions.length === 0) {
            snekfetch.get(nekoimg).then(r => {
                let embed = new Discord.RichEmbed()
                    .setTitle("NYAAAAA!")
                    .setColor(0x00AE86)
                    .setFooter(`${msg.author.username}` + `'s Waifu     |     Try ${index.getGuildPrefix(msg.guild.id)}neko help for more `)
                    .setImage(r.body.neko)
                msg.channel.send(embed)
            })
            return
        }
    }
}