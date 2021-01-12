const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event');
const { createCanvas } = require('canvas');
const axios = require('axios').default;
const { api: { uri, key } } = require('../../config.js');

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

    async profile(username, rank, userMarks, rankMarks, nextRank, discordId, rankType) {
        let canvas = createCanvas(700, 500)
        let ctx = canvas.getContext('2d');

        // Profile Information
        ctx.beginPath();
        ctx.fillStyle = '#f5f5fa';
        ctx.fillRect(50, 150, 280, 220);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#ebebf0';
        ctx.fillRect(50, 370, 280, 80);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#ffdcaa';
        ctx.fillRect(50, 150, 280, 30);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 18px arial';
        ctx.fillText('User Statistics', 60, 172);

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText('Marks', 79, 215);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText(`${userMarks} Marks`, 92, 240);
        ctx.fillText(`${userMarks >= 12000 ? 'At max obtainable rank' : `${rankMarks - userMarks} Marks until ${nextRank}`}`, 92, 257);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText('Game', 79, 290);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText('295 KO\'s', 92, 315);
        ctx.fillText('100 WO\'s', 92, 332);
        ctx.fillText('2d12h16m Played', 92, 349);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#646464'
        ctx.moveTo(79, 222);
        ctx.lineTo(140, 222);
        ctx.moveTo(79, 297);
        ctx.lineTo(140, 297);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#646464';
        ctx.moveTo(50, 150);
        ctx.lineTo(330, 150);
        ctx.lineTo(330, 450);
        ctx.lineTo(50, 450);
        ctx.closePath();
        ctx.stroke();

        // Rank Information
        ctx.beginPath();
        ctx.fillStyle = '#f5f5fa';
        ctx.fillRect(370, 150, 280, 220);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#ebebf0';
        ctx.fillRect(370, 370, 280, 80);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#fffaaa';
        ctx.fillRect(370, 150, 280, 30);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 18px arial';
        ctx.fillText('Rank Information', 380, 172);

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText('Main Group', 399, 215);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText(rank, 412, 240);
        ctx.fillText(`${rankType} Rank`, 412, 257);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText('Divisional', 399, 290);
        ctx.stroke();

        ctx.fillStyle = '#646464';
        ctx.font = 'bold 15px arial';
        ctx.fillText('Paragon Guard', 412, 315);
        ctx.font = 'bold 12px arial';
        ctx.fillText('Elite Paragon Guard', 417, 332);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(399, 222);
        ctx.lineTo(505, 222);
        ctx.moveTo(399, 297);
        ctx.lineTo(505, 297);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#646464';
        ctx.moveTo(370, 150);
        ctx.lineTo(650, 150);
        ctx.lineTo(650, 450);
        ctx.lineTo(370, 450);
        ctx.closePath();
        ctx.stroke();

        // User Information
        ctx.beginPath();
        ctx.fillStyle = '#646464';
        ctx.font = 'bold 40px arial';
        ctx.fillText(username, 40, 93);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = '#646464';
        ctx.font = 'bold 18px arial';
        ctx.fillText(discordId, 40, 120);
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = '#646464';
        ctx.lineWidth = 3;
        ctx.moveTo(40, 130);
        ctx.lineTo(660, 130);
        ctx.stroke();

        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.stroke();

        const buffer = canvas.toBuffer();

        return buffer;
    }

    async accept(userId) {
        const call = await axios({ 
            method: 'POST',
            url: `https://${uri}/users/check`,
            headers: {
                Authorization: key
            },
            data: {
                id: userId
            }
        });

        const response = call.data;

        switch(response.code) {
            case 1:
                return true;
            case 2:
                return true;
            case 3:
                return false;
        }
    }

    async loadCommands() {
        return glob(`${this.directory}Commands/**/*.js`).then(commands => {
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
        return glob(`${this.directory}Events/**/*.js`).then(events => {
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