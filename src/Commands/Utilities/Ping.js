const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { api: { uri } } = require('../../../config');
const ping = require('node-http-ping');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['p', 'up'],
            description: 'Gets information about the bot\'s ping',
            category: 'Utilities'
        });
    }

    async run(message, args) {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`Pong!`, this.client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription('Pinging...')
            
        const msg = await message.channel.send(embed);
        const latency = msg.createdTimestamp - message.createdTimestamp;

        ping(uri).then(time => {
            msg.edit(embed.setDescription([
                `**Bot Latency** ❯ \`${latency}ms\``,
                `**DAPI Response Time** ❯ \`${Math.round(this.client.ws.ping)}ms\``,
                `**Astral API Response Time** ❯ \`${time}ms\``
            ]));
        }).catch(error => {
            console.log(error);
        });
    }
}
