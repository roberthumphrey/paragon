const Command = require('../../Structures/Command');
const User = require('../../Structures/Models/User');
const Rank = require('../../Structures/Models/Rank');
const { MessageAttachment } = require('discord.js');
const { owners } = require('../../../config');

const fs = require('fs');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['v', 'ver'],
            description: 'Verify a user\'s Roblox account with Paragon Anima',
            category: 'Group',
            usage: 'profile [mention]'
        });
    }

    async run(message, args) {
        let date = new Date(), formatted = date.toISOString().replace(/T/, '_').replace(/\..+/, '');
        let user = message.mentions.users.first(), userData, username, discordId, rank, rankType, userMarks;
        let rankData, nextRank, rankMarks;

        if (!user) {
            userData = await User.findOne({ discordId: message.author.id });
            if (userData === null) return message.channel.send(`You're not verified.`);

            username = userData.get('username');
            discordId = userData.get('discordId');
            rank = userData.get('rank');
            rankType = userData.get('rankType');
            userMarks = userData.get('points');

            rankData = await Rank.findOne({ name: rank });
            nextRank = rankData.get('next_name');
            rankMarks = rankData.get('next');
        } else {
            userData = await User.findOne({ discordId: user.id });
            if (userData === null) return message.channel.send(`The selected user is not verified.`);

            username = userData.get('username');
            discordId = userData.get('discordId');
            rank = userData.get('rank');
            rankType = userData.get('rankType');
            userMarks = userData.get('userMarks');

            rankData = await Rank.findOne({ name: rank });
            nextRank = rankData.get('next_name');
            rankMarks = rankData.get('next');
        }

        let pro = await this.client.utils.profile(username, rank, userMarks, rankMarks, nextRank, discordId, rankType);
        
        let card = new MessageAttachment(pro, `${username}_Card_${formatted}.png`);

        message.channel.send(card);
    }
}