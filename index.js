const fs = require('fs');
const dc = require('discord.js');

createFiles();
const cfg = require('./storage/config.json');
const guilds = require('./storage/guilds.json');

/* module.exports */

module.exports = {
    CommandCategory: Object.freeze({
        'NEKOS_LIFE': {
            __KEY: 'NEKOS_LIFE',
            color: '0xFFB7D8'
        },
        'ADMIN': {
            __KEY: 'ADMIN',
            color: '0xEF2B48'
        },
        'MISC': {
            __KEY: 'MISC',
            color: '0xB7C0EE'
        },
        'INFO': {
            __KEY: 'INFO',
            color: '0xFFFF33'
        }
    }),
    handleGuild: handleGuild,
    Utils: require('./utils'),
    getLocalization: () => {
        return localization;
    },
    getDefaultLanguage: () => {
        return localization.getLanguageEnumFromString(cfg.default.lang);
    },
    getConsoleLangugage: () => {
        return localization.getLanguageEnumFromString(cfg.consoleLang);
    },
    getDefaultCommandPrefix: () => {
        if (cfg.default.prefix && cfg.default.prefix.length === 1) {
            return cfg.default.prefix;
        }
    },
    hasGuildPrefix: (guildID) => {
        guildID = module.exports.Utils.getGuildID(guildID);

        return guildID && guilds[guildID] && guilds[guildID]['prefix'];
    },
    getGuildPrefix: (guildID) => {
        guildID = module.exports.Utils.getGuildID(guildID);

        if (guildID) {
            if (!guilds[guildID] || !guilds[guildID]['prefix']) {
                module.exports.setGuildPrefix(guildID, module.exports.getDefaultCommandPrefix());
            }

            return guilds[guildID]['prefix'];
        }
    },
    setGuildPrefix: (guildID, prefixChar) => {
        guildID = module.exports.Utils.getGuildID(guildID);

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
        guildID = module.exports.Utils.getGuildID(guildID);

        if (guildID) {
            if (!guilds[guildID] || !guilds[guildID]['lang']) {
                module.exports.setGuildLanguage(guildID, module.exports.getDefaultLanguage());
            }

            return localization.getLanguageEnumFromString(guilds[guildID]['lang']);
        }
    },
    setGuildLanguage: (guildID, langEnum) => {
        guildID = module.exports.Utils.getGuildID(guildID);

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

            console.log(localization.getStringForConsole('Bot:Console:SavedToFile', 'Changes have automatically been written to {0}').format('./storage'));
        }
    },
    forceSaveToFile: () => {
        fs.writeFile('./storage/config.json', JSON.stringify(cfg), (err) => {
            if (err) {
                console.error(err);
            }
        });
        fs.writeFile('./storage/guilds.json', JSON.stringify(guilds), (err) => {
            if (err) {
                console.error(err);
            }
        });

        filesChanged = false;
    },

    getSprax2013APIToken: () => {
        return cfg.Sprax2013_API_Token;
    }
}

const localization = require('./localization');

if (!module.exports.getConsoleLangugage()) {
    console.error('Your console-language in ./storage/config.json seems to be invalid');
    process.exit(1);
} else if (cfg.botToken === 'INSERT_TOKEN_HERE') {
    console.error(localization.getStringForConsole('Bot:Console:InsertBotToken', 'Insert your Bot-Token {0}').format('(./storage/config.json)'));
    process.exit(2);
} else if (!module.exports.getDefaultLanguage()) {
    console.error(localization.getStringForConsole('Bot:Console:InvalidDefaultLanguage', 'Your default language in {0} seems to be invalid').format('./storage/config.json'));
    process.exit(3);
} else if (!module.exports.getDefaultCommandPrefix()) {
    console.error(localization.getStringForConsole('Bot:Console:InvalidDefaultPrefix', 'The default prefix in {0} seems to be invalid!').format('./storage/config.json'));
    process.exit(4);
}

require('./webserver/webserver'); // Start WebServer or crash

const client = new dc.Client();
var filesChanged = false;

initCommands();

/* Discord */

client.on('ready', () => {
    let guildCount = 0,
        guildsIgnoredCount = 0,
        channelCount = 0,
        clientCount = 0,
        botCount = 0;

    for (const guild of client.guilds.values()) {
        if (handleGuild(guild)) {
            guildCount++;
            channelCount += guild.channels.size;

            for (const member of guild.members.values()) {
                if (member.user.bot) {
                    if (member.user !== client.user) {
                        botCount++;
                    }
                } else {
                    clientCount++;
                }
            }

            if (!module.exports.hasGuildPrefix(guild)) {
                sendInitMsgToGuildOwner(guild);
            }
        } else {
            guildsIgnoredCount++;
        }
    }

    console.log(
        localization.getStringForConsole(
            'Bot:Console:Status', 'Bot is active on {0} guilds (while ignoring {1} guilds), in {2} channels for {3} clients (+{4} Bots)')
        .format(`${guildCount} ${localization.getWordForConsole('Guild', guildCount)}`,
            `${guildsIgnoredCount} ${localization.getWordForConsole('Guild', guildsIgnoredCount)}`,
            `${channelCount} ${localization.getWordForConsole('Channel', channelCount)}`,
            `${clientCount} ${localization.getWordForConsole('Client', clientCount)}`,
            `${botCount} ${localization.getWordForConsole('Bot', botCount)}`
        )
    );

    updateBotActivity();
});

client.on('guildCreate', (guild) => {
    if (handleGuild(guild)) {
        console.log(localization.getStringForConsole('Bot:Console:JoinedGuild', 'I have been added to \'{0}\' (ID: {1})').format(guild.name, guild.id))

        sendInitMsgToGuildOwner(guild);
    }

    updateBotActivity();
});

client.on('guildDelete', (guild) => {
    if (handleGuild(guild)) {
        console.log(localization.getStringForConsole('Bot:Console:LeftGuild', 'I have been removed from \'{0}\' (ID: {1})').format(guild.name, guild.id));
    }

    updateBotActivity();
});

client.on('error', (err) => {
    console.error(err);
})

client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.channel instanceof dc.TextChannel) return; // Vorerst nicht auf DMs reagieren.

    if (!handleGuild(msg)) return;

    var guildPrefix = module.exports.getGuildPrefix(msg.guild.id);
    if (msg.content.indexOf(guildPrefix) !== 0) return;

    const args = msg.content.slice(1).trim().split(/ +/g);
    const cmdOrg = args.shift();
    const cmd = cmdOrg.toLowerCase();

    if (client.cmds.has(cmd)) {
        client.cmds.get(cmd).onCommand(client, msg, cmdOrg, args, guildPrefix);
    } else if (client.cmdAliases.has(cmd)) {
        client.cmdAliases.get(cmd).onCommand(client, msg, cmdOrg, args, guildPrefix);
    } else {
        msg.channel.send(localization.getStringForGuild(null, 'UnknownCommand', msg));
    }
});

client.login(cfg.botToken);

function updateBotActivity() {
    client.user.setActivity(`${module.exports.getDefaultCommandPrefix()}Commands [${client.guilds.size} server${client.guilds.size !== 1 ? 's' : ''}]`, {
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
        Sprax2013_API_Token: 'INSERT_TOKEN_HERE',
        consoleLang: 'de',
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
        console.log(localization.getStringForConsole('Bot:Console:NoCommandsLoaded', 'No commands were loaded'));
        return;
    }

    jsfile.forEach((f) => {
        let prop = require(f);

        if (prop.cmd) {
            let cmdPath = f.substr('./commands/'.length);

            if (!prop.cmd.category) {
                prop.cmd.category = module.exports.CommandCategory.MISC;
            }

            if (!client.cmds.has(prop.cmd.name.toLowerCase())) {
                client.cmds.set(prop.cmd.name.toLowerCase(), prop);
            } else {
                console.log(localization.getStringForConsole('Bot:Console:AlreadyRegistered', '\'{0}\' tried to register the {2} \'{1}\' that is already in use by another file').format(cmdPath, props.cmd.name, localization.getWordForConsole('Command')));
            }

            let aliasCount = 0;
            if (prop.cmd.aliases) {
                prop.cmd.aliases.forEach(alias => {
                    if (!client.cmdAliases.has(alias.toLowerCase())) {
                        client.cmdAliases.set(alias.toLowerCase(), prop);
                        aliasCount++;
                    } else {
                        console.log(localization.getStringForConsole('Bot:Console:AlreadyRegistered', '\'{0}\' tried to register the {2} \'{1}\' that is already in use by another file').format(cmdPath, props.cmd.name, localization.getWordForConsole('Alias')));
                    }
                });
            }

            if (aliasCount > 0) {
                console.log(localization.getStringForConsole('Bot:Console:CommandLoadedWithAliases', '\'{0}\' has been loaded ({1})!').format(cmdPath, `${aliasCount} ${localization.getWordForConsole('Alias', aliasCount)}`));
            } else {
                console.log(localization.getStringForConsole('Bot:Console:CommandLoaded', '\'{0}\' has been loaded!').format(cmdPath));
            }
        } else {
            console.log(localization.getStringForConsole('Bot:Console:InvalidCommandFile', '\'{0}\' is invalid - Please compare it to \'{1}\'').format(f, './commands/.template.js'));
        }
    });
}

function handleGuild(guildID) {
    guildID = module.exports.Utils.getGuildID(guildID);

    return (cfg.guildList.asWhitelist && cfg.guildList.guildIDs.includes(guildID)) || (!cfg.guildList.asWhitelist && !cfg.guildList.guildIDs.includes(guildID));
}

function sendInitMsgToGuildOwner(guild) {
    guild.owner.send(localization.getStringForGuild(null, 'Bot:ThanksForInvite', guild).format(module.exports.getGuildPrefix(guild)));
}