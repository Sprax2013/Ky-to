const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const lewdgif = "https://nekos.life/api/v2/img/nsfw_neko_gif";
const lewdimg = "https://nekos.life/api/lewd/neko";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'lewd', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args, ) => {
    const index = require('./../../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
    const command = args.shift();
    let mentions = Array.from(msg.mentions.users.values());
    if (msg.channel.nsfw === false) {
        return msg.reply(":warning: Yea.. no this channel isn't NSFW.")
    }
    if (command === 'gif') {
        var imgNeko = snekfetch.get(lewdgif).then(r => {
            let embed = new Discord.RichEmbed()
            .setTitle("Oh my, how Lewd! >.<")
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
            .addField(`${index.getGuildPrefix(msg.guild.id)}lewd `, `Shows you a Image of a Lewd Neko.`)
            .addField(`${index.getGuildPrefix(msg.guild.id)}lewd gif`, `Shows you a GIF of a Lewd Neko.`)
            .addField(`${index.getGuildPrefix(msg.guild.id)}lewd help`, `Shows you this List.`)

        msg.channel.send(embed)
        return
    } else {
        if (mentions.length === 0) {
            var imgNeko = snekfetch.get(lewdimg).then(r => {
                let embed = new Discord.RichEmbed()
                .setTitle("Oh my, how Lewd! >.<")
                    .setColor(0x00AE86)
                    .setFooter(`${msg.author.username}` + `'s Waifu     |     Try ${index.getGuildPrefix(msg.guild.id)}lewd help for more `)
                    .setImage(r.body.neko)
                msg.channel.send(embed)
            })
            return
        }
    }
}