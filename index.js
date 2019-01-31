const fs = require('fs');
const dc = require('discord.js');

createFiles();
const cfg = require('./storage/config.json');
const guilds = require('./storage/guilds.json');

/* module.exports */

module.exports = {
    CommandCategory: Object.freeze({
        'NEKOS_LIFE': {
            name: 'NEKOS_LIFE'
        },
        'ADMIN': {
            name: 'ADMIN'
        },
        'MISC': {
            name: 'MISC'
        }
    }),
    getUtils: require('./utils'),
    getLocalization: () => {
        return localization;
    },
    getDefaultLanguage: () => {
        return localization.getLanguageEnumFromString(cfg.default.lang);
    },
    getDefaultCommandPrefix: () => {
        return cfg.default.prefix;
    },
    getGuildPrefix: (guildID) => {
        guildID = module.exports.getUtils.getGuildID(guildID);

        if (guildID) {
            if (!guilds[guildID] || !guilds[guildID]['prefix']) {
                module.exports.setGuildPrefix(guildID, module.exports.getDefaultCommandPrefix());
            }

            return guilds[guildID]['prefix'];
        }
    },
    setGuildPrefix: (guildID, prefixChar) => {
        guildID = module.exports.getUtils.getGuildID(guildID);

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
    getGuildLanguage: (guildID) => {
        guildID = module.exports.getUtils.getGuildID(guildID);

        if (guildID) {
            if (!guilds[guildID] || !guilds[guildID]['lang']) {
                module.exports.setGuildLanguage(guildID, module.exports.getDefaultLanguage());
            }

            return localization.getLanguageEnumFromString(guilds[guildID]['lang']);
        }
    },
    setGuildLanguage: (guildID, langEnum) => {
        guildID = module.exports.getUtils.getGuildID(guildID);

        let success = false;

        if (guildID && langEnum) {
            if (!guilds[guildID]) {
                guilds[guildID] = {
                    lang: langEnum.langCode
                };

                filesChanged = true;
            } else {
                if (guilds[guildID]['lang'] !== langEnum.langCode) {
                    guilds[guildID]['lang'] = langEnum.langCode;

                    filesChanged = true;
                }
            }

            success = true;
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

const localization = require('./localization');

if (cfg.botToken === 'INSERT_TOKEN_HERE') {
    console.log('Insert your Bot-Token (./storage/config.json)');
    process.exit(1);
} else if (!module.exports.getDefaultLanguage()) {
    console.log('Insert a valid default language and make sure that the translations are complete)');
    process.exit(2);
} else if (!module.exports.getDefaultCommandPrefix()) {
    console.log('There is no default command-prefix in the config!');
    process.exit(3);
}

const client = new dc.Client();
var filesChanged = false;

initCommands();

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
    if (!msg.channel instanceof dc.TextChannel) return; // Vorerst nicht auf DMs reagieren.

    if (cfg.guildList.asWhitelist && !cfg.guildList.guildIDs.includes(msg.guild.id)) return;
    if (!cfg.guildList.asWhitelist && cfg.guildList.guildIDs.includes(msg.guild.id)) return;

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
    client.user.setActivity(`!commands [${client.guilds.size} server${client.guilds.size !==1 ? 's' : ''}]`, {
            type: 'LISTENING'
        })
        // .then(pres => console.log(`Activity set to ${pres.game ? pres.game.name : 'none'}`))
        .catch(console.error);
}

// Alle 30s prüfen, ob Änderungen in die Datei geschrieben werden müssen
setInterval(module.exports.saveToFile, 30 * 1000);

/* private functions */

function createFiles() {
    const defaultConfig = {
        botToken: 'INSERT_TOKEN_HERE',
        default: {
            prefix: ';',
            lang: 'en'
        },
        guildList: {
            asWhitelist: false,
            guildIDs: []
        }
    };

    if (!fs.existsSync('./commands')) {
        fs.mkdirSync('./commands');
    }

    if (!fs.existsSync('./storage')) {
        fs.mkdirSync('./storage');
    }

    if (!fs.existsSync('./storage/config.json')) {
        fs.writeFileSync('./storage/config.json', JSON.stringify(defaultConfig));
    } else {
        fs.writeFileSync('./storage/config.json', JSON.stringify(Object.assign(defaultConfig, JSON.parse(fs.readFileSync('./storage/config.json', 'UTF-8')))));
    }

    if (!fs.existsSync('./storage/guilds.json')) {
        fs.writeFileSync('./storage/guilds.json', '{}');
    }
}

function initCommands() {
    client.cmds = new dc.Collection();
    client.cmdAliases = new dc.Collection();

    let walk = dir => {
        var results = [];
        let list = fs.readdirSync(dir);

        list.forEach(file => {
            file = dir + '/' + file;
            var stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(walk(file));
            } else {
                results.push(file);
            }
        });

        return results;
    }

    let files = walk('./commands');

    //Alle Dateien, die auf .js Enden und nicht mit einem '.' beginnen
    let jsfile = files.filter(f => f.split('/').pop().indexOf('.') !== 0 && f.split(".").pop().toLocaleLowerCase() === 'js');
    if (jsfile.length <= 0) {
        console.log('No commands have been loaded.');
        return;
    }

    jsfile.forEach((f) => {
        let prop = require(f);

        if (prop.cmd) {
            if (!client.cmds.has(prop.cmd.name.toLowerCase())) {
                client.cmds.set(prop.cmd.name.toLowerCase(), prop);
            } else {
                console.log(`The command '${props.cmd.name.toLowerCase()}' has already been registered by another file`);
            }

            let aliasCount = 0;
            if (prop.cmd.aliases) {
                prop.cmd.aliases.forEach(alias => {
                    if (!client.cmdAliases.has(alias.toLowerCase())) {
                        client.cmdAliases.set(alias.toLowerCase(), prop);
                        aliasCount++;
                    } else {
                        console.log(`The alias '${alias.toLowerCase()}' has already been registered by another file`);
                    }
                });
            }

            if (aliasCount > 0) {
                if (aliasCount === 1) {
                    console.log(`'${f.substr('./commands/'.length)}' has been loaded (${aliasCount} alias)!`);
                } else {
                    console.log(`'${f.substr('./commands/'.length)}' has been loaded (${aliasCount} aliases)!`);
                }
            } else {
                console.log(`'${f.substr('./commands/'.length)}' has been loaded!`);
            }
        } else {
            console.log(`Failed loading '${f}': 'cmd' could not be read (missing?)`);
        }
    });
}