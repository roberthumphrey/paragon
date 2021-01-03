const Command = require('../../Structures/Command');
const Blacklist = require('../../Structures/Models/Blacklist');
const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['bla', "bladd"],
            description: 'Blacklist one or many users by ROBLOX username',
            category: 'Group',
            usage: 'blacklistadd <username(s)>'
        });
    }

    async run(message, args) {
        if (!message.member.roles.cache.some(r => ["Officer Corps"].includes(r.name))) return message.reply('You lack the permission to run this command.');

        let usernames = args, userInfo = [];
        let min = 1, max = 12;

        if (usernames.length < min) return message.channel.send('Too few usernames provided (min. 1)');
        if (usernames.length > max) return message.channel.send('Too many usernames provided (max. 12)');

        const raw = await axios({
            method: 'POST',
            url: `https://users.roblox.com/v1/usernames/users`,
            data: {
                usernames: usernames,
                excludeBannedUsers: true
            }
        });

        const users = raw.data.data;

        if (users.length < min) return message.channel.send('No users found by the usernames provided.');

        users.map(user => {
            let userTemplate = { username: user.name, robloxId: user.id, discordId: '' };

            userInfo.push(userTemplate);
        });

        Blacklist.insertMany(userInfo).then(done => {
            const embed = new MessageEmbed()
                .setTitle(`Users added to the Blacklist`)
                .setColor('#87f04a')
                .addField('Number of Users', userInfo.length)
                .addField(`User${userInfo.length > 1 ? 's' : ''}`, userInfo.map(user => `${user.username}`))

            return message.channel.send(embed);
        }).catch(error => {
            if (error.code === 11000) {
                const embed = new MessageEmbed()
                    .setTitle(`Error adding to Blacklist`)
                    .setColor('#87f04a')
                    .addField('Error', 'Cannot add same user to database.')

                return message.channel.send(embed);
            }
        });
    }
}

// !bladd XPLT30 XPLTBABYBEAR XPLTCENT XPLTEGLIXS XPLTINRAIDS XPLTKYLE XPLTPAIN XPLTREACH XPLTROSE XPLTSKlLLZ XPLTSlN XPLTJACK