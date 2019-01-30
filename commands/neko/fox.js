const Discord = require('discord.js');
const api = "https://nekos.life/api/v2/img/fox_girl";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'fox'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    snekfetch.get(api).then(r => {
        const embed = new Discord.RichEmbed()
            .setTitle("Ring Ding Ding Ding Dinge Dinge Ding.")
            .setColor(0x00AE86)
            .setFooter(`${msg.author.tag}` + `'s Waifu`)
            .setImage(r.body.url)
        msg.channel.send(embed)
    })
}