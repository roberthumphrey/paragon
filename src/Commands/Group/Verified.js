const Command = require('../../Structures/Command');
const User = require('../../Structures/Models/User');
const { MessageEmbed } = require('discord.js');
const { createPaste } = require('hastebin');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['veru', 'users'],
            description: 'Get a list of all unverified users in the server',
            category: 'Groups'
        });
    }

    async run(message, args) {
        let verified = ['ID - Username'];

        User.find({}, (error, users) => {
            users.map(user => {
                verified.push(`${user.robloxId} - ${user.username}`);
            });

            verified.join('\n');

            createPaste(`${verified}`, {
                raw: true,
                contentType: 'text/plain',
                server: 'https://hastebin.com'
            }).then(url => {
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Verified Paragon Anima Users')
                    .addField('Hastebin URL', `${url}`)
                    .setFooter('Will be updated in future update - Robert')

                message.channel.send(embed);
            });
        });
    }
}