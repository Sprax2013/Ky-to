const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botconfig = require("./botconfig.json");

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on('ready', () => {
  bot.user.setGame('Minecraft')
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.author.send("i only react in servers").then(msg => msg.delete(5000));

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  let prefix = prefixes[message.guild.id].prefixes;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});

bot.login(botconfig.token)