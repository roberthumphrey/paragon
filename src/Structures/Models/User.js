const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: String,
    username: String,
    robloxId: Number,
    points: Number,
    rankType: String,
    rank: String
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', User);