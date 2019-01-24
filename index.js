const fs = require('fs');
const dc = require('discord.js');
var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");

const client = new dc.Client();

createFiles();
const cfg = require('./storage/config.json');
const guilds = require('./storage/guilds.json');

if (cfg.botToken === 'INSERT_TOKEN_HERE') {
    console.log('Insert your Bot-Token (./storage/config.json)');
    process.exit(1);
}

var filesChanged = false;

initCommands();

function createFiles() {
    if (!fs.existsSync('./commands')) {
        fs.mkdirSync('./commands');
    }

    if (!fs.existsSync('./storage')) {
        fs.mkdirSync('./storage');
    }

    if (!fs.existsSync('./storage/config.json')) {
        fs.writeFileSync('./storage/config.json', JSON.stringify({
            botToken: 'INSERT_TOKEN_HERE',
            default: {
                prefix: '!'
            }
        }));
    }

    if (!fs.existsSync('./storage/guilds.json')) {
        fs.writeFileSync('./storage/guilds.json', '{}');
    }
}

function initCommands() {
    client.cmds = new dc.Collection();
    client.cmdAliases = new dc.Collection();

    fs.readdir('./commands', (err, files) => {
        if (err) {
            console.log(err);
            return;
        }

        //Alle Dateien, die auf .js Enden und nicht mit einem '.' beginnen
        let jsfile = files.filter(f => f.indexOf('.') !== 0 && f.split(".").pop().toLocaleLowerCase() === 'js');
        if (jsfile.length <= 0) {
            console.log('No commands have been loaded.');
            return;
        }

        jsfile.forEach((f) => {
            let props = require(`./commands/${f}`);

            if (props.cmd) {
                if (!client.cmds.has(props.cmd.name.toLowerCase())) {
                    client.cmds.set(props.cmd.name.toLowerCase(), props);
                } else {
                    console.log(`The command '${props.cmd.name.toLowerCase()}' has already been registered by another file`);
                }

                let aliasCount = 0;
                if (props.cmd.aliases) {
                    props.cmd.aliases.forEach(alias => {
                        if (!client.cmdAliases.has(alias.toLowerCase())) {
                            client.cmdAliases.set(alias.toLowerCase(), props);
                            aliasCount++;
                        } else {
                            console.log(`The alias '${alias.toLowerCase()}' has already been registered by another file`);
                        }
                    });
                }

                if (aliasCount > 0) {
                    if (aliasCount === 1) {
                        console.log(`'${f}' has been loaded (${aliasCount} alias)!`);
                    } else {
                        console.log(`'${f}' has been loaded (${aliasCount} aliases)!`);
                    }
                } else {
                    console.log(`'${f}' has been loaded (no aliases)!`);
                }

            } else {
                console.log(`Failed loading '${f}': 'cmd' could not be read (missing?)`);
            }
        });
    });
}


/* Discord */

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    updateBotActivity();
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

    updateBotActivity();
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

    updateBotActivity();
});

client.on("message", msg => {
    if (msg.author.bot) return;
    if (!msg.channel instanceof dc.TextChannel) return; // Vorerst keine DMs. Statt commands soll er normal chatten c:
    if (msg.content.indexOf(module.exports.getGuildPrefix(msg.guild.id)) !== 0) return;

    const args = msg.content.slice(1).trim().split(/ +/g);
    const cmdOrg = args.shift();
    const cmd = cmdOrg.toLowerCase();

    if (client.cmds.has(cmd)) {
        client.cmds.get(cmd).onCommand(client, msg, cmdOrg, args);
    } else if (client.cmdAliases.has(cmd)) {
        client.cmdAliases.get(cmd).onCommand(client, msg, cmdOrg, args);
    } else {
        msg.channel.send('Unknown Command :thinking:');
    }
});

client.login(cfg.botToken);

function updateBotActivity() {
    if (client.guilds.size === 1) {
        client.user.setActivity(`on ${client.guilds.size} server`);
    } else {
        client.user.setActivity(`on ${client.guilds.size} servers`);
    }
}

/* module.exports */

module.exports = {
    getGuildPrefix: guildID => {
        if (guildID) {
            if (!guilds[guildID] || !guilds[guildID]['prefix']) {
                module.exports.setGuildPrefix(guildID, cfg.default.prefix);
            }

            return guilds[guildID]['prefix'];
        }
    },
    setGuildPrefix: (guildID, prefixChar) => {
        let success = false;

        if (guildID && prefixChar) {
            if (prefixChar.length === 1) {
                if (!guilds[guildID]) {
                    guilds[guildID] = {
                        prefix: prefixChar
                    };

                    filesChanged = true;
                } else {
                    if (guilds[guildID]['prefix'] !== prefixChar) {
                        guilds[guildID]['prefix'] = prefixChar;

                        filesChanged = true;
                    }
                }

                success = true;
            }
        }

        return success;
    },
    saveToFile: () => {
        if (filesChanged) {
            module.exports.forceSaveToFile();
            console.log('Changes have automatically been written to ./storage');
        }
    },
    forceSaveToFile: () => {
        fs.writeFile('./storage/config.json', JSON.stringify(cfg), (err) => {
            if (err) {
                console.log(err);
            }
        });
        fs.writeFile('./storage/guilds.json', JSON.stringify(guilds), (err) => {
            if (err) {
                console.log(err);
            }
        });

        filesChanged = false;
    }
}

// Alle 30s prüfen, ob Änderungen in die Datei geschrieben werden müssen
setInterval(module.exports.saveToFile, 30 * 1000);

// HTML Server weil Alpha was testen will :3
var server = http.createServer(function(req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done);
  });
  
  server.listen(8000);