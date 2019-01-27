const index = require('./../index'); // Kann genutzt werden um z.B. die Prefix für eine Gilde zu ändern etc.
const Discord = require('discord.js'); // Praktisch für RichEmbed etc.+
const google = require('google');
module.exports.cmd = {
    name: 'google', // Führt onCommand aus, bei einer Nachricht wie '!template Arg1 Arg2'
};

module.exports.onCommand = async (bot, msg, cmd) => {
    let message = msg
    let args = message.content.split(/[ ]+/);
    let suffix = args.slice(1).join(' ');
    if (!suffix) {
        message.reply(`:warning: You need to give a search Input!`)
    }
    google.resultsPerPage = 25;
    google(suffix, function (err, res) {
        if (err) message.reply(`:warning: ${err}`);
        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            if (!link.href) {
                res.next;
            } else {
                let embed = new Discord.RichEmbed()
                    .setColor(`#ffffff`)
                    .setAuthor(`Result for "${suffix}"`, `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png`)
                    .setDescription(`**Link**: [${link.title}](${link.href})\n**Description**:\n${link.description}`)
                    .setFooter(`${msg.author.tag}`+ `'s Search History`)
                return message.channel.send({
                    embed: embed
                });
            } return
        }
    });
}