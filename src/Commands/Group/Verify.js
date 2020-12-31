const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const Verification = require('../../Structures/Models/Verification');
const User = require('../../Structures/Models/User');
const Rank = require('../../Structures/Models/Rank');
const { Types } = require('mongoose');
const axios = require('axios').default;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['v', 'ver'],
            description: 'Verify a user\'s Roblox account with Paragon Anima',
            category: 'Group',
            usage: 'verify'
        });
    }

    async run(message, args) {
        let username = args[0];
        if (!username || typeof username !== 'string') return message.channel.send('You need to input a username in order to verify.');
    
        const uRaw = await axios.get(`http://api.roblox.com/users/get-by-username?username=${username}`);
        const user = uRaw.data;

        if (!user.Username) return message.channel.send(`${username} is an invalid Roblox username.`);

        const gRaw = await axios.get(`http://api.roblox.com/users/${user.Id}/groups`);
        const groups = gRaw.data;
        const group = groups.filter(g => g.Id === 1025605)[0];

        if (!group) return message.channel.send(`User ${user.Username} is not in Chain of Paragons.`);

        const tRaw = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.Id}&size=180x180&format=Png&isCircular=true`);
        const thumbnail = tRaw.data.data[0].imageUrl;

        Verification.findOne({ discordId: message.author.id }, (error, result) => {
            if (result) return message.channel.send(`You've already begun a verification session.`);

            User.findOne({ discordId: message.author.id }, async (error, result) => {
                if (result) return message.channel.send(`You already have a verified Roblox account: ${userRecord.username}`);

                const rank = await Rank.findOne({ name: group.Role });
                let type = rank.get('type');
                let minimumPoints = rank.get('minimumPoints');

                const newUser = new Verification({
                    _id: new Types.ObjectId(),
                    channelId: message.channel.id,
                    discordId: message.author.id,
                    username: user.Username,
                    robloxId: user.Id,
                    rankType: type,
                    rank: group.Role,
                    points: minimumPoints
                });

                newUser.save().catch(error => {
                    throw new Error(`An error occurred when creating a new user.`);
                });
        
                const embed = new MessageEmbed()
                    .setColor('#87f04a')
                    .setThumbnail(thumbnail)
                    .addField('Username', user.Username, true)
                    .addField('Roblox ID', user.Id, true)
                    .addField('Group Rank', group.Role)
                    .addField('Instructions', `Hello, ${user.Username}!\n\nIn order to verify, you must join [this](https://roblox.com/) game. Once in, click the button and your account will automatically be verified.`);
        
                message.channel.send(embed);
            });
        });
    }
}