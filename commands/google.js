const Discord = require('discord.js');
const google = require('google');
const index = require('./../index');
const loc = index.getLocalization();
const ico = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png"
google.resultsPerPage = 25;

module.exports.cmd = {
    name: 'google'
};

module.exports.onCommand = async (bot, msg, cmd) => {
    let message = msg
    let args = message.content.split(/[ ]+/);
    let suffix = args.slice(1).join(' ');

    if (!suffix) {
        message.reply(`:warning: You need to give a search Input!`)
    }

    google(suffix, function (err, res) {
        if (err) message.reply(`:warning: ${err}`);

        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];

            if (!link.href) {
                res.next;
            } else {
                return message.channel.send(new Discord.RichEmbed()
                    .setColor(`#ffffff`)
                    .setAuthor(`${loc.getStringForGuild('google:setAuthor', msg).format(bot.user.id, cmd, args)} "${suffix}"`, `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png`)
                    .setDescription(`**Link**: [${link.title}](${link.href})\n**${loc.getStringForGuild('google:setDescription', msg).format(bot.user.id, cmd, args)}**:\n${link.description}`)
                    .setFooter(`${msg.author.tag}` + `'${loc.getStringForGuild('google:setFooter', msg).format(bot.user.id, cmd, args)}`));
            }

            return;
        }
    });
}

// ${loc.getStringForGuild('google:setAuthor', msg).format(bot.user.id, cmd, args)}