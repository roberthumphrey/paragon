const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const User = require('../../Structures/Models/User');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['rm', 'rxp'],
            description: 'Take a specified amount of marks from a user or users',
            category: 'Group',
            usage: 'remmarks <points> <reason (event)> <user(s)>'
        });
    }

    async run(message, args) {
        if (!message.member.roles.cache.some(r => ["Officer Corps"].includes(r.name))) return message.reply('You lack the permission to run this command.');

        let points = args[0];
        let usersRaw = message.mentions.users, users = [], newUsers = [];
        let min = 1, max = 1000;

        if (!points) return message.channel.send(`Points value is required (1-1000)`);

        usersRaw.map(user => users.push(user.id));

        if (!users.length) return message.channel.send(`At least one user is required (mention)`);

        if (points >= min && points <= max) {
            let find = await User.find({ discordId: users });
            find.map(usr => newUsers.push(usr.discordId));

            let update = await User.updateMany({ discordId: newUsers }, { $inc: { points: -points } });

            const embed = new MessageEmbed()
                .setTitle(`Marks have been Removed`)
                .setColor('#87f04a')
                .addField('Number of Marks', points, true)
                .addField('Number of Users', update.n, true)
                .addField(`User${newUsers.length > 1 ? 's' : ''}`, newUsers.map(user => `<@${user}>`))

            return message.channel.send(embed);
        } else {
            return message.channel.send(`Points value must be between ${min}-${max}`);
        }
    }
}