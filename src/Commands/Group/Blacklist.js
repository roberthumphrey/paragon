const Command = require('../../Structures/Command');
const Blacklist = require('../../Structures/Models/Blacklist');
const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['bl'],
            description: 'Blacklist one or many users by ROBLOX username',
            category: 'Utilities'
        });
    }

    async run(message, args) {
        Blacklist.find({}).then(users => {
            const embed = new MessageEmbed()
                .setTitle(`Users added to the Blacklist`)
                .setColor('#87f04a')
                .addField('Number of Users', users.length)
                .addField(`Username`, users.map(user => `${user.username}`), true)
                .addField(`Roblox ID`, users.map(user => `${user.robloxId}`), true)
                .addField(`Discord ID`, users.map(user => `${user.discordId.length > 0 ? user.discordId : 'Not Set'}`), true)

            return message.channel.send(embed);
        }).catch(error => {
            if (error) return console.error(error);
        });
    }
}