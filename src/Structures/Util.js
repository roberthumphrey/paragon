const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event');

module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;

            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`)
        }

        return arr;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return `${parseFloat(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    capitalize(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    async loadCommands() {
        return glob(`${this.directory}/Commands/**/*.js`).then(commands => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];

                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Command ${name} isn't a class.`);

                const command = new File(this.client, name.toLowerCase());

                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands.`);

                this.client.commands.set(command.name, command);

                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
            }
        });
    }

    async loadEvents() {
        return glob(`${this.directory}/events/**/*.js`).then(events => {
            for (const eventFile of events) {
                delete require.cache[eventFile];

                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) throw new TypeError(`Event ${name} isn't a class.`);
                
                const event = new File(this.client, name);

                if (!(event instanceof Event)) throw new TypeError(`Command ${name} doesn't belong in Commands.`)

                this.client.events.set(event.name, event);

                event.emitter[event.type](name, (...args) => event.run(...args));
            }
        })
    }
}