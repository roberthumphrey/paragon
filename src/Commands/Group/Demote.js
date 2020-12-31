const Command = require('../../Structures/Command');
const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const User = require('../../Structures/Models/User');
const Rank = require('../../Structures/Models/Rank');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['demo'],
            description: 'Demote a user in the Roblox group & modify their profile accordingly.',
            category: 'Group',
            usage: 'demote <user>'
        });
    }

    async run(message, args) {
        if (!message.member.roles.cache.some(r => ["Officer Corps"].includes(r.name))) return message.reply('You lack the permission to run this command.');

        let user = message.mentions.users.first();

        if (!user) return message.channel.send('A mention is required to demote');
        if (user.id === message.author.id) return message.channel.send('You cannot demote yourself.');

        User.findOne({ discordId: user.id }, async (error, user) => {
            const current = await Rank.findOne({ name: user.rank });
            const rank = current.get('last_name');
            
            const last = await Rank.findOne({ name: rank });
            if (last === null) return message.channel.send('Cannot demote past minimum rank.');
            const points = last.get('minimumPoints');
            const type = last.get('type');
            const num = last.get('rank');
            const name = last.get('name');

            const update = await User.updateOne({ discordId: user.discordId }, { $set: { points, rank: name, rankType: type } });
            await axios({
                method: 'POST',
                url: `${process.env.URI}/users/demote`,
                headers: {
                    Authorization: process.env.KEY
                },
                data: {
                    robloxId: user.robloxId,
                    rank: num
                }
            });

            const embed = new MessageEmbed()
                .setTitle(`User Demoted`)
                .setColor('#87f04a')
                .addField('Username', user.username, true)
                .addField('New Rank', name, true)
                .addField('New Points', points)

            return message.channel.send(embed);
        });
    }
}