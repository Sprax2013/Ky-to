const index = require('./../../index');
const Discord = require('discord.js');

module.exports.cmd = {
    name: '8Ball',
    aliases: ['MagicBall'],

    category: index.CommandCategory.NEKOS_LIFE,

    localizationSubGroup: 'Nekos.Life-API'
};

module.exports.onCommand = async (bot, msg = '', cmd = '', args = []) => {
    index.Utils.getJSONFromURL('https://nekos.life/api/v2/8ball', (json) => {
        if (json && json.url) {
            let embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .setTitle(json.response)

                .setImage(json.url)

                .setFooter(`${msg.author.username}'s future has been decided!`);

            if (args.length > 0) {
                embed.setDescription(args.join(' '));
            }

            msg.channel.send(embed);
        } else {
            msg.channel.send(
                new dc.RichEmbed()
                .setColor(0x00AE86)
                .setTitle(loc.getStringForGuild(this, 'ERR_OCCURRED', msg))
            );
        }
    });
}