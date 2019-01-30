const index = require('./index');

const LanguageEnum = Object.freeze({
    'GERMAN': {
        langCode: 'de'
    },
    'ENGLISH': {
        langCode: 'en'
    }
});

/* StackOverflow ftw: https://stackoverflow.com/a/4673436/9346616 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;

        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

/* module.exports */

module.exports = {
    LanguageEnum: LanguageEnum,
    getStringForGuild: (strIdentifier, guildID, fallBackString = null) => {
        return module.exports.getString(strIdentifier, index.getGuildLanguage(guildID), fallBackString);
    },
    getString: (strIdentifier, langEnum, fallBackString = null) => {
        var result = null;

        if (!langEnum) {
            langEnum = index.getDefaultLanguage();
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
    getLanguageEnumFromString: (str) => {
        for (const key in LanguageEnum) {
            if (LanguageEnum.hasOwnProperty(key)) {
                var lang = LanguageEnum[key];

                if (lang.langCode === str) {
                    return lang;
                }
            }
        }

        return null;
    }
};