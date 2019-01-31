const index = require('./index');

const LanguageEnum = Object.freeze({
    'GERMAN': {
        langCode: 'de',
        name: 'Deutsch',
        synonyms: ['Deutsch']
    },
    'ENGLISH': {
        langCode: 'en',
        name: 'English',
        synonyms: ['Englisch']
    }
});

/* module.exports */

module.exports = {
    LanguageEnum: LanguageEnum,
    getStringForGuild: (commandFile, strIdentifier, guildID, fallBackString = null) => {
        return module.exports.getString(commandFile, strIdentifier, index.getGuildLanguage(index.getUtils.getGuildID(guildID)), fallBackString);
    },
    getString: (commandFile, strIdentifier, langEnum, fallBackString = null) => {
        var result = null;

        if (!langEnum) {
            langEnum = index.getDefaultLanguage();
        }

        if (commandFile && strIdentifier) {
            strIdentifier = strIdentifier.replace(/{%cmd}/gi, `commands:${commandFile.cmd.name}`);
        }

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
            console.error(new Error(`Could not '${strIdentifier}' wurde kein String für die Sprache '${langEnum}' gefunden!`));
            result = module.exports.getString(strIdentifier, index.getDefaultLanguage());

            if (!result) {
                console.error(new Error(`Für '${strIdentifier}' wurde kein String in der Standardsprache '${langEnum}' gefunden!`));
            }
        }

        return result ? result : fallBackString;
    },
    getCommandCategoryForGuild: (cmdCat, guildID) => {
        return module.exports.getCommandCategory(cmdCat, index.getGuildLanguage(index.getUtils.getGuildID(guildID)));
    },
    getCommandCategory: (cmdCat, lang) => {
        return module.exports.getString('CommandCategory:' + cmdCat.name, lang);
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