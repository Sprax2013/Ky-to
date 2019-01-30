const Discord = require('discord.js');
const api = "https://nekos.life/api/v2/img/avatar";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'avatar'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    snekfetch.get(api).then(r => {
        const embed = new Discord.RichEmbed()
            .setTitle("Oh my, how Lewd! >.<")
            .setColor(0x00AE86)
            .setFooter(`${msg.author.tag}` + `'s new Avatar`)
            .setImage(r.body.url)
        msg.channel.send(embed)
    })
}