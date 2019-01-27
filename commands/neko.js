const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
var api = "https://nekos.life/api/v2/img/ngif"
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'neko', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args, ) => {
    const command = args.shift();
    let mentions = Array.from(msg.mentions.users.values());

    if (command === 'gif') {
        var imgNeko = snekfetch.get("https://nekos.life/api/v2/img/ngif").then(r => {
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
            var imgNeko = snekfetch.get("https://nekos.life/api/neko").then(r => {
                let embed = new Discord.RichEmbed()
                    .setTitle("NYAAAAA!")
                    .setColor(0x00AE86)
                    .setFooter(`${msg.author.username}` + `'s Waifu`)
                    .setImage(r.body.neko)
                msg.channel.send(embed)
            })
            return
        }
    }
}