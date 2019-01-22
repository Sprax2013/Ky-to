const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
var imgNeko = ""
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'neko', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

if(random(2) === 1){
    var api = "https://nekos.life/api/neko"
} else {
    var api = "https://nekos.life/api/v2/img/ngif"
}

console.log(api)





module.exports.onCommand = async (bot, msg, cmd, args) => {

     var imgNeko = snekfetch.get("https://nekos.life/api/neko").then(r =>{
        const embed = new Discord.RichEmbed()
                .setTitle("Nekos!")
                .setColor(0x00AE86)
                .setFooter(`${msg.author.tag}`+ `'s Waifu`)
                .setImage(r.body.neko, r.body.url)
        msg.channel.send(embed)
     })
}

