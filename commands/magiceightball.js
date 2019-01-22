const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const api = "https://nekos.life/api/v2/8ball";
var imgNeko = ""
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'magicball', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
     var imgNeko = snekfetch.get(api).then(r =>{
        const embed = new Discord.RichEmbed()
                .setTitle(r.body.response)
                .setColor(0x00AE86)
                .setFooter(`${msg.author.tag} made me do this!`)
                .setImage(r.body.url)
                console.log(r.body.url)
        msg.channel.send(embed)
     })
}


