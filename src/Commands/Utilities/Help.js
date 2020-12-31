const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['h'],
            description: 'Displays the help menu for the bot',
            category: 'Utilities',
            usage: 'help [command]'
        });
    }

    async run(message, [command]) {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            
        if (command) {
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
            if (!cmd) return message.channel.send(`Invalid command name. \`${command}\``);

            embed.setAuthor(`${this.client.utils.capitalize(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
            embed.setDescription([
                `**Aliases** ❯ ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'None'}`,
                `**Description** ❯ ${cmd.description}`,
                `**Category** ❯ ${cmd.category}`,
                `**Usage** ❯ ${this.client.prefix}${cmd.usage}`
            ]);
        } else {
            embed.setDescription([
                `These are the available commands for ${message.guild.name}`,
                `This server's prefix is \`${this.client.prefix}\``,
                `Command Parameters: \`<>\` is required, \`[]\` is optional`
            ]);
            
            let categories;

            if (!this.client.owners.includes(message.author.id)) {
                categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
            } else {
                categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
            }

            for (const category of categories) {
                embed.addField(`**${this.client.utils.capitalize(category)}**`, this.client.commands.filter(cmd =>
                    cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
            }
        }

        return message.channel.send(embed);
    }
}