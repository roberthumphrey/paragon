const Event = require('../../Structures/Event');

module.exports = class extends Event {
    async run(message) {
        const prefix = this.client.prefix;

        if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if (command) {
            command.run(message, args);
        }
    }
}