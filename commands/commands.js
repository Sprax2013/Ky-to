const dc = require('discord.js'); // Praktisch für RichEmbed etc.
const index = require('./../index');
const Discord = require('discord.js'); // Praktisch für RichEmbed etc.

module.exports.cmd = {
    name: 'help'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    const start = new Discord.RichEmbed()
      .setTitle("Help")
      .setDescription(`Here is a full List of all the Commands. \n Prefix on your Server: **${index.getGuildPrefix(msg.guild.id)}**`)
      .setColor(0x7067CF)
    msg.author.send(start)

    const api = new Discord.RichEmbed()
    .setTitle("API")
    .setDescription("API Commands provided by **nekos.life**.")
    .addBlankField(true)
    .setColor(0xFFB7D8)

    .addField(`${index.getGuildPrefix(msg.guild.id)}nekos`, `!neko Show's a Image of a Neko. Use !neko help for more Information.`)
    .addField(`${index.getGuildPrefix(msg.guild.id)}lewd`, `**[NSFW]** Show's a Image of a Lewd Girl.`)
    .addField(`${index.getGuildPrefix(msg.guild.id)}cum`, `**[NSFW]** Show's a Image of a Lewd Girl.`)
    .addField(`${index.getGuildPrefix(msg.guild.id)}fox`, `Show's a Image of a Fox Girl.`)
    .addField(`${index.getGuildPrefix(msg.guild.id)}magicball`, `Let the Fate decide!`)
    .addField(`${index.getGuildPrefix(msg.guild.id)}hug`, `Lets you hug another User.`)
  msg.author.send(api)



  const commands = new Discord.RichEmbed()
  .setTitle("Commands")
  .setDescription("Helpful Commands for you and your Server.")
  .addBlankField(true)
  .setColor(0xB7C0EE)

  .addField(`${index.getGuildPrefix(msg.guild.id)}help`, `Shows you this List.`)
  .addField(`${index.getGuildPrefix(msg.guild.id)}google`, `Lets you Google right from the Discord Chat.`)
  .addField(`${index.getGuildPrefix(msg.guild.id)}invite`, `Generates a Bot Invite Link for you to share.`)
  .addField(`${index.getGuildPrefix(msg.guild.id)}ping`, `Shows you your Ping.`)
msg.author.send(commands)



const admin = new Discord.RichEmbed()
.setTitle("Admin Commands")
.setDescription("Commands that help you Administrate your Server.")
.addBlankField(true)
.setColor(0xEF2B48)

.addField(`${index.getGuildPrefix(msg.guild.id)}prefix`, `**[ADMINISTRATOR]** Lets you set the Prefix for the Bot.`)
msg.author.send(admin)
}