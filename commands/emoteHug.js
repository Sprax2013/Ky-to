const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const api = "https://nekos.life/api/hug";
var imgNeko = ""
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'hug', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    if (args.length === 0) {
        msg.reply(":warning: You need someone to Hug :(")
    } else {
        var imgNeko = snekfetch.get(api).then(r =>{
            const embed = new Discord.RichEmbed()
                    .setTitle(`${msg.author.tag} hugs ${args}`)
                    .setColor(0xFF4F5D) 
                    .setImage(r.body.url)
            msg.channel.send(embed)
        })
    }
}