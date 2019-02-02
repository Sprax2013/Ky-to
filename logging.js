const fs = require('fs');
const mkdirs = require('./utils').mkdirs;

module.exports.WebServer = {
    failedAccess: null,
    invalidToken: null,
    error: (err) => {
        console.error(`<Error-WebServer> ${err.message}`);

        mkdirs('./logs/WebServer/err/', (mkErr) => {
            if (mkErr) {
                console.error(mkErr);
            } else {
                let now = new Date();
                let occurred = now.getTime();

                err.LoggingJS_Occurred = `${occurred} -> ${now.getDate()}. ${toMonth(now.getMonth())} ${now.getFullYear()} (${now.getHours()}:${now.getMinutes()} Uhr)`;

                fs.appendFile(
                    `./logs/WebServer/err/${occurred}.json`,
                    JSON.stringify(err, Object.getOwnPropertyNames(err), 2), (err) => {
                        if (err) {
                            console.error(err);
                        }
                    }
                );
            }
        });
    }
}

function toMonth(monthOfYear) {
    switch (monthOfYear) {
        case 0:
            return 'Jan.';
        case 1:
            return 'Febr.';
        case 2:
            return 'März';
        case 3:
            return 'April';
        case 4:
            return 'Mai';
        case 5:
            return 'Juni';
        case 6:
            return 'July';
        case 7:
            return 'Aug.';
        case 8:
            return 'Sept.';
        case 9:
            return 'Okt.';
        case 10:
            return 'Nov.';
        case 11:
            return 'Dez.';
        default:
            return '???';
    }
}