const mongoose = require('mongoose');
const Client = require('./Structures/Client');
const config = require('../config');

const client = new Client(config);

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://${config.database.username}:${config.database.password}@${config.database.uri}/${config.database.name}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => { 
    console.log('Database Service is Connected');
});

client.start();