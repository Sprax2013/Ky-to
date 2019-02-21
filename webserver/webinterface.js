const index = require('./../index');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect(301, '/wi');
});

router.get('/wi/:token?/:page?', (req, res, next) => {
    let token = req.params.token;

    if (token) {
        token = token.trim();

        let user;
        let guild;
        for (const u of index.client.users.values()) {
            if (u.id === '174140530572263424') {
                user = u;
            }
        }
        for (const g of index.client.guilds.values()) {
            if (g.id === '526127500800163861') {
                guild = g;
            }
        }

        if (isValidToken(token)) {
            require('fs').readFile(`${__dirname}/www/dynamic/wi/index.html`, {
                encoding: 'UTF-8'
            }, (err, data) => {
                if (err) {
                    next(err);
                    return;
                }

                let pageType = 0;

                if (token) {
                    if (token.equalsIgnoreCase('profile')) {
                        pageType = 2;
                    } else {
                        pageType = 1;
                    }
                }

                // TODO replace lang with users/guilds lang.
                res.contentType('html').send(modifyWebinterfacePage(data, token, guild, user, pageType, undefined));
            });
        } else {
            res.sendFile(`${__dirname}/www/dynamic/wi/invalidToken.html`);
        }
    } else {
        res.sendFile(`${__dirname}/www/dynamic/wi/noToken.html`);
    }
});

module.exports = router;

/* Helpers */
function isValidToken(token) {
    return token.lastIndexOf('.') < 0;
}

function modifyWebinterfacePage(rawHTML = '', userToken = '', guild = null, user = null, pageType = 0, langEnum = index.getLocalization().LanguageEnum.ENGLISH) {
    var resultHTML = rawHTML;

    let index = -1;
    while ((index = resultHTML.indexOf('{%', index + 1)) >= 0) {
        let closingIndex = resultHTML.indexOf('}', index);

        let prefix = resultHTML.substring(0, index),
            suffix = resultHTML.substring(closingIndex + 1),
            param = resultHTML.substring(index + 2, closingIndex);

        resultHTML = prefix + getStringForParam(param, userToken, guild, user, pageType, langEnum) + suffix;
    }

    return resultHTML;
}

/* pageTypes: 0=None, 1=Guild, 2=Profile */
function getStringForParam(param, userToken, guild = null, user = null, pageType = 0, langEnum = index.getLocalization().LanguageEnum.ENGLISH) {
    if (param && userToken) {
        switch (param.toUpperCase()) {
            case 'PAGE_URL':
                return 'http://localhost:8089/wi';
            case 'USER_TOKEN':
                return userToken;
            case 'LANG_CODE':
                return langEnum.langCode;
            case 'PAGE_TITLE_SUFFIX':
                if (pageType) {
                    if (pageType == 1 && guild) {
                        return `${guild.name}'s Settings | `;
                    } else if (pageType == 2 && user) {
                        return `${user.username}'s Profile | `;
                    }
                }

                break;
            case 'BOT_INVITE_LINK':
                return 'https://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=526454942328946719';
            case 'BOT_AVATAR':
                if (index.client) {
                    let url = index.client.user.avatarURL;
                    return url.substring(0, url.lastIndexOf('?')) + '?size=128';
                }

                break;
            case 'USER_AVATAR':
                if (user) {
                    let url = user.avatarURL;
                    return url.substring(0, url.lastIndexOf('?')) + '?size=128';
                }

                break;

            case 'NAV_GUILDS':
                let result = '';

                if (index.client && user) {
                    for (const g of index.client.guilds.values()) {
                        if (g.members.has(user.id) && g.members.get(user.id).hasPermission('ADMINISTRATOR')) {
                            let active = guild && g.id === guild.id;
                            result += `<li class="nav-item"><a class="nav-link${active ?' active':''}" href="/wi/${userToken}/${guild.id}">${g.name}${active ?' <span class="sr-only">(Current)</span>':''}</a></li>`;
                        }
                    }
                }

                if (result.length <= 0) {
                    result = '<li class="nav-item"><a class="nav-link" href="#" target="_blank">Invite Kyūto onto a Discord-Server to change some of his settings</a></li>';
                }

                return result;
            default:
                break;
        }
    }

    return '';
}