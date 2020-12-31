const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const User = require('../../Structures/Models/User');
const Rank = require('../../Structures/Models/Rank');
const axios = require('axios').default;

let apiUri = 'http://localhost:3000';

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['promo'],
            description: 'Promote a user in the Roblox group & modify their profile accordingly.',
            category: 'Group',
            usage: 'promote <user>'
        });
    }

    async run(message, args) {
        if (!message.member.roles.cache.some(r => ["Officer Corps"].includes(r.name))) return message.reply('You lack the permission to run this command.');

        let user = message.mentions.users.first();

        if (!user) return message.channel.send('A mention is required to promote');
        if (user.id === message.author.id) return message.channel.send('You cannot promote yourself.');

        User.findOne({ discordId: user.id }, async (error, user) => {
            const current = await Rank.findOne({ name: user.rank });
            const rank = current.get('next_name');
            
            const next = await Rank.findOne({ name: rank });
            const points = next.get('minimumPoints');
            const type = next.get('type');
            const num = next.get('rank');
            const name = next.get('name');

            if (name === 'Arbiter') return message.channel.send('Cannot promote past maximum rank.');

            const update = await User.updateOne({ discordId: user.discordId }, { $set: { points, rank: name, rankType: type } });
            await axios({
                method: 'POST',
                url: `${process.env.URI}/users/promote`,
                headers: {
                    Authorization: process.env.KEY
                },
                data: {
                    robloxId: user.robloxId,
                    rank: num
                }
            });

            const embed = new MessageEmbed()
                .setTitle(`User Promoted`)
                .setColor('#87f04a')
                .addField('Username', user.username, true)
                .addField('New Rank', name, true)
                .addField('New Points', points)

            return message.channel.send(embed);
        });
    }
}