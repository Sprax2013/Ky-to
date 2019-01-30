const Discord = require('discord.js'); // Praktisch für RichEmbed etc.
const api = "https://nekos.life/api/hug";
const snekfetch = require('snekfetch');

module.exports.cmd = {
    name: 'hug' // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd, args) => {
    let mentions = Array.from(msg.mentions.users.values());

    if (mentions.length === 0) {
        msg.reply(":warning: You need someone to Hug :(")
    } else {
        snekfetch.get(api).then(r => {
            let tag1 = msg.author.tag,
                tag2 = mentions[0].tag;

            let title = tag1 === tag2 ?
                `${tag1.substr(0, tag1.lastIndexOf('#'))} hugs him-/herself` :
                `${tag1.substr(0, tag1.lastIndexOf('#'))} hugs ${tag2.substr(0, tag2.lastIndexOf('#'))}`;

            const embed = new Discord.RichEmbed()
                .setTitle(title)
                .setColor(0xFF4F5D)
                .setImage(r.body.url)
            msg.channel.send(embed)
        })
    }
}