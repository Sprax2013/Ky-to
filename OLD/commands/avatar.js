const Discord = require("discord.js");

module.exports.run =async (bot, message, args) => {

let embed = new Discord.RichEmbed()
.setFooter(`${message.author}`+ `'s Avatar`)
.setImage(message.author.avatarURL)
.setColor('#212121')

message.channel.send(embed)
}
module.exports.help = {
    name: "avatar"
}