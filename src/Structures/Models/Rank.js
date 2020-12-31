const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Rank = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    rank: Number,
    minimumPoints: Number,
    points: Number,
    next: Number,
    next_name: String,
    last_name: String,
    obtainable: Boolean,
    type: String
}, {
    collection: 'ranks'
});

module.exports = mongoose.model('Rank', Rank);