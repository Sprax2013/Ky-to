const index = require('./index');

const LanguageEnum = Object.freeze({
    'ENGLISH': {
        __KEY: 'ENGLISH',

        langCode: 'en',
        name: 'English',
        synonyms: ['Englisch']
    },
    'GERMAN': {
        __KEY: 'GERMAN',

        langCode: 'de',
        name: 'Deutsch',
        synonyms: ['Deutsch']
    }
});

/* module.exports */

module.exports = {
    LanguageEnum: LanguageEnum,
    getStringForConsole: (strIdentifier, fallBackString = null) => {
        return module.exports.getString(null, strIdentifier, index.getConsoleLangugage(), fallBackString);
    },
    getStringForGuild: (commandFile, strIdentifier, guildID, fallBackString = null) => {
        return module.exports.getString(commandFile, strIdentifier, index.getGuildLanguage(index.Utils.getGuildID(guildID)), fallBackString);
    },
    getString: (commandFile, strIdentifier, langEnum, fallBackString = null) => {
        var result = null;

        if (!langEnum) {
            langEnum = index.getDefaultLanguage();
        }

        if (commandFile && commandFile.cmd) {
            let replacer = commandFile.cmd.localizationSubGroup ?
                `Commands:${commandFile.cmd.localizationSubGroup}:${commandFile.cmd.name}` :
                `Commands:${commandFile.cmd.name}`;

            strIdentifier = strIdentifier.replace(/{%cmd}/gi, replacer);
        }
        strIdentifier = strIdentifier.replace(/{%voc}/gi, 'Vocabulary');

        var langJSON;

        try {
            langJSON = require(`./lang/${langEnum.langCode}.json`);

            if (langJSON) {
                let identArr = strIdentifier.split(':');

                if (identArr.length > 0) {
                    let lastElem = identArr.pop();

                    let json = langJSON;

                    for (const key of identArr) {
                        if (json.hasOwnProperty(key)) {
                            json = json[key];
                        }
                    }

                    result = json[lastElem];
                } else {
                    result = langJSON[strIdentifier];
                }
            }
        } catch (err) {
            console.error(err);
        }

        if (!result && langEnum !== index.getDefaultLanguage()) {
            console.error(`Für '${strIdentifier}' wurde kein String in der Sprache '${langEnum.__KEY}' gefunden!`);
            let defaultLang = index.getDefaultLanguage();
            result = module.exports.getString(commandFile, strIdentifier, defaultLang);

            if (!result) {
                console.error(`Für '${strIdentifier}' wurde kein String in der Standardsprache '${defaultLang.__KEY}' gefunden!`);
            }
        }

        return result ? result : fallBackString;
    },

    getWordForConsole: (word, count = 1, fallBackString = word) => {
        return module.exports.getWord(word, index.getConsoleLangugage(), count, fallBackString);
    },
    getWordForGuild: (word, guildID, count = 1, fallBackString = word) => {
        return module.exports.getWord(word, index.getGuildLanguage(index.Utils.getGuildID(guildID)), count, fallBackString);
    },
    getWord: (word, langEnum, count = 1, fallBackString = word) => {
        var result = module.exports.getString(null, `{%voc}:${word}`, langEnum, fallBackString);

        if (typeof result === 'object') {
            let keys = Object.keys(result);

            if (count === 0 && (keys.includes('Zero') || keys.includes('Plural'))) {
                result = keys.includes('Zero') ? result.Zero : result.Plural;
            } else if (count === 1 && keys.includes('Singular')) {
                result = result.Singular;
            } else if (keys.includes('Plural')) {
                result = result.Plural;
            }
        }

        return result;
    },

    getCommandCategoryForGuild: (cmdCat, guildID) => {
        return module.exports.getCommandCategory(cmdCat, index.getGuildLanguage(index.Utils.getGuildID(guildID)));
    },
    getCommandCategory: (cmdCat, lang) => {
        return module.exports.getString(null, `CommandCategory:${cmdCat.__KEY}`, lang);
    },

    getLanguageNameForGuild: (langToGetNameFor, guildID) => {
        return module.exports.getLanguageName(langToGetNameFor, index.getGuildLanguage(index.Utils.getGuildID(guildID)));
    },
    getLanguageName: (langToGetNameFor, lang) => {
        return module.exports.getString(null, `{%voc}:Languages:${langToGetNameFor.__KEY}`, lang);
    },

    getLanguageEnumFromString: (str) => {
        for (const key in LanguageEnum) {
            if (LanguageEnum.hasOwnProperty(key)) {
                var lang = LanguageEnum[key];

                if (key.equalsIgnoreCase(str) || lang.langCode.equalsIgnoreCase(str)) {
                    return lang;
                } else if (lang.synonyms) {
                    for (const synonym of lang.synonyms) {
                        if (synonym.equalsIgnoreCase(str)) {
                            return lang;
                        }
                    }
                }
            }
        }

        return null;
    }
};