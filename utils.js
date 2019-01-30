const dc = require('discord.js');

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
    getGuildID: (obj) => {
        if (obj) {
            if (obj instanceof dc.Message) {
                return obj.guild.id;
            }
        }

        return obj;
    }
}