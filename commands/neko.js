const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
var api = "https://nekos.life/api/v2/img/ngif"
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'neko', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};


module.exports.onCommand = async (bot, msg, cmd, args) => {

    if (mentions = "gif") {
        msg.reply("gif")
    } else {
        msg.reply("png")
    }

    let mentions = Array.from(msg.mentions.users.values());

     var imgNeko = snekfetch.get("https://nekos.life/api/neko").then(r =>{
        const embed = new Discord.RichEmbed()
                .setTitle("Nekos!")
                .setColor(0x00AE86)
                .setFooter(`${msg.author.tag}`+ `'s Waifu`)
                .setImage(r.body.neko, r.body.url)
        msg.channel.send(embed)
     })
}

