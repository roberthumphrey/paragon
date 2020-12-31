const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Verification = new Schema({
    _id: Schema.Types.ObjectId,
    channelId: String,
    discordId: String,
    username: String,
    robloxId: Number,
    rankType: String,
    rank: String,
    points: Number
}, {
    collection: 'verification'
});

module.exports = mongoose.model('Verification', Verification);