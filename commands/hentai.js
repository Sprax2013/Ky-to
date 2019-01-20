const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const api = "https://nekos.life/api/lewd/neko";
var imgNeko = ""
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'lewd', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
     var imgNeko = snekfetch.get(api).then(r =>{
        const embed = new Discord.RichEmbed()
                .setTitle("Nekos!")
                .setColor(0x00AE86)
                .setFooter(`${msg.author}`+ `'s Waifu`)
                .setImage(r.body.neko)
        msg.channel.send(embed)
     })
}