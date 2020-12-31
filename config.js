require('dotenv').config();

module.exports = {
    prefix: "!",
    token: process.env.DISCORD_TOKEN,
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