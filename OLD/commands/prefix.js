const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async(bot, message, args) => {
    
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You cant change the server prefix");
    if(!args[0] || args[0 == "help"]) return message.channel.send(`do: >prefix <enter new prefix here>`);

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    prefixes[message.guild.id] = {
        prefixes: args[0]
    };


    fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err)
    });

    let sEmbed = new Discord.RichEmbed()
    .setColor("0xE7193F")
    .setTitle("New Prefix set!")
    .setDescription(`Set to ${args[0]}`);

    message.channel.send(sEmbed);
}

module.exports.help = {
    name: "prefix"
}