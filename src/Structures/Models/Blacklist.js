const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Blacklist = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: {
        unique: true,
        type: String
    },
    username: {
        required: true,
        unique: true,
        type: String
    },
    robloxId: {
        required: true,
        unique: true,
        type: Number
    }
}, {
    collection: 'blacklist'
});

module.exports = mongoose.model('Blacklist', Blacklist);