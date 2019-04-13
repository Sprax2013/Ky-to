const index = require('./../index');

const discord = require('discord.js');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect(301, '/wi');
});

router.get('/wi/:token?/:page?', (req, res, next) => {
    let token = req.params.token;

    if (token) {
        token = token.trim();
    }

    let user;

    // DEBUG
    if (token && index.client) {
        for (const u of index.client.users.values()) {
            if (u.id === '174140530572263424') {
                user = u;
            }
        }
    }

    let page = req.params.page;

    if (page) {
        page.trim();
    }

    require('fs').readFile(`${__dirname}/www/dynamic/wi/index.html`, {
        encoding: 'UTF-8'
    }, (err, data) => {
        if (err) {
            next(err);
            return;
        }

        let guild;
        let pageType = 0;

        if (page) {
            if (page.equalsIgnoreCase('Profile')) {
                pageType = 2;
            } else {
                pageType = 1;

                if (index.client.guilds.has(page)) {
                    guild = index.client.guilds.get(page);
                }
            }
        }

        // TODO replace lang with users/guilds lang.
        res.contentType('html').send(modifyWebinterfacePage(data, isValidToken(token) ? token : 'INVALID', isValidGuildID(guild) ? guild : 'INVALID', user, pageType, undefined));
    });
});

module.exports = router;

/* Helpers */
function isValidToken(token) {
    return token && token.lastIndexOf('.') < 0 && /^[a-z0-9]+$/i.test(token);
}

function isValidGuildID(guildID) {
    return guildID && /^[0-9]+$/i.test(guildID);
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
                if (userToken !== 'INVALID') {
                    return userToken;
                }
                break;
            case 'LANG_CODE':
                return langEnum.langCode;
            case 'GUILD_ID':
                if (guild) {
                    return guild.id;
                }

                break;
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
            case 'BOT_NAME':
                if (index.client) {
                    return index.client.user.username;
                }
                break;
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
                            result += `<li class="nav-item"><a class="nav-link${active ? ' active' : ''}" href="/wi/${userToken}/${g.id}">${g.name}${active ? ' <span class="sr-only">(Current)</span>' : ''}</a></li>`;
                        }
                    }
                }

                if (result.length <= 0) {
                    result = '<li class="nav-item"><a class="nav-link" href="{%BOT_INVITE_LINK}" target="_blank">Invite Kyūto onto a Discord-Server to change some of his settings</a></li>';
                }

                return result;
            default:
                break;
        }
    }

    if (param.toUpperCase().startsWith('D_NONE:')) {
        param = param.substring('D_NONE:'.length);

        if (param.equalsIgnoreCase('NoUser')) {
            if (!user) {
                return 'd-none';
            }
        } else

            if (param.equalsIgnoreCase('NoToken')) {
                if (userToken) {
                    return 'd-none';
                }
            } else if (param.equalsIgnoreCase('InvalidToken')) {
                if (userToken !== 'INVALID') {
                    return 'd-none';
                }
            } else if (param.equalsIgnoreCase('InvalidGuild')) {
                if (pageType !== 1 || guild !== 'INVALID') {
                    return 'd-none';
                }
            } else if (param.equalsIgnoreCase('NoPermissionOnGuild')) {
                if (!(guild instanceof discord.Guild) || !user || guild.members.get(user.id).hasPermission('ADMINISTRATOR')) {
                    return 'd-none';
                }
            } else if (param.equalsIgnoreCase('ChooseServer')) {
                if (!user || pageType !== 0) {
                    return 'd-none';
                }
            } else if (param.equalsIgnoreCase('Guild')) {
                if (!(guild instanceof discord.Guild) || !user || !guild.members.get(user.id).hasPermission('ADMINISTRATOR')) {
                    return 'd-none';
                }
            }
    }

    return '';
}