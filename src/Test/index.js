const mongoose = require('mongoose');
const Client = require('../Structures/Client');
const config = require('../../config');

const delay = ms => new Promise(res => setTimeout(res, ms));

const loginTest = async () => {
    const client = new Client(config);

    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    mongoose.connect(`mongodb+srv://${config.database.username}:${config.database.password}@${config.database.uri}/${config.database.name}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { 
        console.log('Database Service is Connected');
    });

    client.start().then(() => {
        console.log('Bot logged into Discord');
    });

    await delay(20000);

    console.log('Test Concluded');
    process.exit();
}

loginTest();