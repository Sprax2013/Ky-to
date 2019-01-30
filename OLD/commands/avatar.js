const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.channel.send(new Discord.RichEmbed()
        .setFooter(`${message.author}` + `'s Avatar`)
        .setImage(message.author.avatarURL)
        .setColor('#212121'));
}
module.exports.help = {
    name: 'avatar'
}