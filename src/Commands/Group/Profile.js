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
        let user = message.mentions.users.first();

        if (message.author.id !== owners[0]) return message.channel.send('This command is disabled for development.');

        let pro = await this.client.utils.profile('', '', 0, 0, '', '');
        
        let card = new MessageAttachment(pro, `USERNAME_Card_DATETIME.png`);

        message.channel.send(card);
    }
}