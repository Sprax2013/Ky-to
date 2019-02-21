const index = require('./../index');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect(301, '/wi');
});

router.get('/wi/:token?/:page?', (req, res, next) => {
    let token = req.params.token;

    if (token) {
        if (token.lastIndexOf('.') >= 0) {
            // Zu 100% kein Token sondern z. B. eine .css-Datei
            next();
            return;
        }

        token = token.trim();

        let user;
        let guild;

        for (const u of index.client.users.values()) {
            if (u.id === '174140530572263424') {
                user = u;
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

                res.contentType('html').send(modifyWebinterfacePage(data, guild, user));
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

function modifyWebinterfacePage(rawHTML = '', guild = null, user = null) {
    var resultHTML = rawHTML;

    let index = -1;
    while ((index = resultHTML.indexOf('{%', index + 1)) >= 0) {
        let closingIndex = resultHTML.indexOf('}', index);

        let prefix = resultHTML.substring(0, index),
            suffix = resultHTML.substring(closingIndex + 1),
            param = resultHTML.substring(index + 2, closingIndex);

        resultHTML = prefix + getStringForParam(param, guild, user) + suffix;
    }

    return resultHTML;
}

function getStringForParam(param, guild = null, user = null) {
    // <li class="nav-item"><!-- class="active" --><a class="nav-link" href="#">GuildName1<!--<span class="sr-only">(Current)</span>--></a></li>

    if (param) {
        switch (param.toUpperCase()) {
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
            default:
                break;
        }
    }

    return '';
}