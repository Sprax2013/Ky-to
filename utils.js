const fs = require('fs');
const path = require('path');

const request = require('request');
const dc = require('discord.js');

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

/* StackOverflow ftw: https://stackoverflow.com/a/2140723/9346616 */
if (!String.prototype.equalsIgnoreCase) {
    String.prototype.equalsIgnoreCase = function (str) {
        return typeof str === 'string' ?
            this.localeCompare(str, undefined, {
                sensitivity: 'accent'
            }) === 0 :
            this === str;
    };
}

/* module.exports */

module.exports = {
    getUsernameFromUser: (user) => {
        if (user) {
            let tag;

            if (user instanceof dc.User) {
                tag = user.tag;
            } else if (user instanceof dc.Message) {
                tag = user.author.tag;
            } else if (typeof user === 'string') {
                tag = user;
            }

            if (tag) {
                return tag.substr(0, tag.lastIndexOf('#'));
            }
        }

        return null;
    },
    getGuildID: (obj) => {
        if (obj) {
            if (obj instanceof dc.Message) {
                return obj.guild.id;
            } else if (obj instanceof dc.Guild) {
                return obj.id;
            }
        }

        return obj;
    },
    getJSONFromURL: (url, callback) => {
        request({
            url: url,
            headers: {
                'User-Agent': 'Kyuto (Discord-Bot by @Sprax2013#2070 and @aph#2050)'
            }
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else if (res.statusCode === 200) {
                try {
                    callback(JSON.parse(body));
                    return;
                } catch (err) {
                    console.error(err);
                }
            }

            callback(null);
        });
    }
}

module.exports.mkdirs = (dirPath, callback) => {
    if (typeof dirPath === 'function') {
        dirPath = dirPath();
    }

    dirPath = path.resolve(dirPath);

    try {
        if (!fs.existsSync(dirPath)) {
            var tempPath;

            dirPath.split(/[/\\]/).forEach((dirName) => {
                tempPath ? tempPath = path.join(tempPath, dirName) : tempPath = dirName;

                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath);
                }
            });
        }

        if (callback) {
            callback();
        }

        return true;
    } catch (err) {
        if (callback) {
            callback(err);
        }

        return false;
    }
}