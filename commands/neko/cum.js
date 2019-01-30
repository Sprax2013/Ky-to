const Discord = require('discord.js');
const api = "https://nekos.life/api/v2/img/cum";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'cum'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    if (msg.channel.nsfw === false) {
        return msg.reply(":warning: Yea.. no this channel isn't NSFW.")
    } else {
        snekfetch.get(api).then(r => {
            const embed = new Discord.RichEmbed()
                .setTitle("Oh my, how Lewd! >.<")
                .setColor(0x00AE86)
                .setFooter(`${msg.author.tag}` + `'s Waifu`)
                .setImage(r.body.url)
            msg.channel.send(embed)
        })
    }
}