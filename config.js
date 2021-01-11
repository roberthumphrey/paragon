let path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });

module.exports = {
    prefix: process.env.NODE_ENV === 'production'
                ? process.env.PREFIX
                : process.env.DEV_PREFIX,
    token: process.env.NODE_ENV === 'production'
                ? process.env.DISCORD_TOKEN
                : process.env.DEV_TOKEN,
    database: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        uri: process.env.DB_URI,
        name: process.env.DB
    },
    owners: [
        "112329563849117696"
    ],
    api: {
        uri: process.env.URI,
        key: process.env.KEY
    }
}