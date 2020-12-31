const { Client, Collection } = require('discord.js');
const Util = require('./Util');

module.exports = class AdaptiveClient extends Client {
    constructor(options = {}) {
        super({
            disableMentions: 'everyone'
        });

        this.validate(options);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();
        this.utils = new Util(this);
        this.owners = options.owners;
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be in the form of an object.');
        if (!options.token) throw new Error('Options should contain a token.');
        if (!options.prefix) throw new Error('Options should contain a prefix.');
        if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be contained in a string.');

        this.token = options.token;
        this.prefix = options.prefix;
    }

    async start(token = this.token) {
        this.utils.loadCommands();
        this.utils.loadEvents();

        super.login(token);
    }
}