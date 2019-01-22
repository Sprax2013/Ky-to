const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const dc = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'commands', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    var prefix = index.getGuildPrefix(msg.guild.id)
    
    const embed = new dc.RichEmbed()
    .setTitle("Kyūto Command List")
    .setDescription(`Current Prefix: **${prefix}**`)

    .setColor(0x00AE86)
    .setFooter("As requested by " + msg.author.tag)

    .addBlankField(true)
    .addField("This is a field title, it can hold 256 characters",
    "This is a field value, it can hold 1024 characters.")

   
    msg.channel.send({embed});


}