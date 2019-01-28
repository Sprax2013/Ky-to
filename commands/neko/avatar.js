const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const api = "https://nekos.life/api/v2/img/avatar";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'avatar', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {

        var imgNeko = snekfetch.get(api).then(r => {
            const embed = new Discord.RichEmbed()
                .setTitle("Oh my, how Lewd! >.<")
                .setColor(0x00AE86)
                .setFooter(`${msg.author.tag}` + `'s new Avatar`)
                .setImage(r.body.url)
            msg.channel.send(embed)
        })
}