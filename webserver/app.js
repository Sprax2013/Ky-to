const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev')); // ToDo: Log to File (Non 200 und 304 Anfragen)

// Anfrage konnte nicht zugeordnet werden
app.use((req, res, next) => {
    // DEBUG
    // if (req.path === '/500') {
    //     var err = new Error('Debug: HTTP-500');
    //     err.name = 'DebugError';

    //     return next(err);
    // }

    res.status(404).sendFile(`${__dirname}/www-error/404.html`, (err) => {
        if (err) {
            next(err);
        }
    });
});

// Ein Fehler ist aufgetreten
app.use((err, req, res, next) => {
    if (err.name != 'DebugError') {
        require('./../logging').WebServer.error(err);
    }

    res.status(500).sendFile(`${__dirname}/www-error/500.html`, (err) => {
        // Falls 500.html nicht existiert
        if (err) {
            res.format({
                text: () => {
                    res.send('500 Internal Server Error');
                },

                html: () => {
                    res.send('<h1>500 Internal Server Error</h1>');
                },

                json: () => {
                    res.send({
                        error: '500 Internal Server Error'
                    });
                }
            });
        }
    });
});

module.exports = app;