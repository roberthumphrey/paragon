const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const Blacklist = require('../../Structures/Models/Blacklist');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['blr', "blrem"],
            description: 'Remove blacklist for user by ROBLOX ID',
            category: 'Group',
            usage: 'blacklistremove <id>'
        });
    }

    async run(message, args) {
        if (!message.member.roles.cache.some(r => ["Officer Corps"].includes(r.name))) return message.reply('You lack the permission to run this command.');

        let user = args[0];

        if (user.length < 1) return message.channel.send('Too few usernames provided (min/max: 1)');
        if (typeof parseInt(user) !== 'number') return message.channel.send('User to remove must be a Roblox ID');

        Blacklist.findOneAndDelete({ robloxId: parseInt(user) }).then(deleted => {
            const embed = new MessageEmbed()
                .setTitle(`User removed from the Blacklist`)
                .setColor('#87f04a')
                .addField('Success', 'User successfully removed from the blacklist');

            return message.channel.send(embed);
        }).catch(error => {
            return console.log(error);
        });
    }
}
