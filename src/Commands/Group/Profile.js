const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const User = require('../../Structures/Models/User');
const Rank = require('../../Structures/Models/Rank');
let squares = ':white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';

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

        if (user) {
            User.findOne({ discordId: user.id }, (error, result) => {
                if (!result) return message.channel.send(`That user isn't verified.`);

                Rank.findOne({ name: result.rank }, async (error, rank) => {
                    const next = await Rank.findOne({ name: rank.next_name });
                    const obtainable = next.get('obtainable');

                    let decimal = result.points / rank.next;

                    if (decimal >= .1 && decimal < .2) {
                        squares = ':red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .2 && decimal < .3) {
                        squares = ':red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .3 && decimal < .4) {
                        squares = ':red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .4 && decimal < .5) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .5 && decimal < .6) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .6 && decimal < .7) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .7 && decimal < .8) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .8 && decimal < .9) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .9 && decimal < 1) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square:';
                    } else if (decimal === 1) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square:';
                    }

                    let embed;

                    if (obtainable) {
                        embed = new MessageEmbed()
                            .setTitle(`${result.username}'s Profile`)
                            .setColor('#87f04a')
                            .addField('Rank', result.rank)
                            .addField(`Marks [${result.points}]`, [
                                `${squares} (**${Math.round(result.points / rank.next * 100)}%**)`,
                                `Need **${rank.next - result.points}** Marks to rank up to **${rank.next_name}**`
                            ])
                    } else {
                        embed = new MessageEmbed()
                            .setTitle(`${result.username}'s Profile`)
                            .setColor('#87f04a')
                            .addField('Rank', result.rank)
                            .addField(`Marks [${result.points}]`, [
                                `Max obtainable rank has been achieved.`
                            ])
                    }

                    return message.channel.send(embed);
                });
            });
        } else {
            User.findOne({ discordId: message.author.id }, (error, result) => {
                if (!result) return message.channel.send(`You're not verified.`);

                Rank.findOne({ name: result.rank }, async (error, rank) => {
                    const next = await Rank.findOne({ name: rank.next_name });
                    const obtainable = next.get('obtainable');

                    let decimal = result.points / rank.next;

                    if (decimal >= .1 && decimal < .2) {
                        squares = ':red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .2 && decimal < .3) {
                        squares = ':red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .3 && decimal < .4) {
                        squares = ':red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .4 && decimal < .5) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .5 && decimal < .6) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .6 && decimal < .7) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .7 && decimal < .8) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .8 && decimal < .9) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square: :white_large_square:';
                    } else if (decimal >= .9 && decimal < 1) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :white_large_square:';
                    } else if (decimal === 1) {
                        squares = ':red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square: :red_square:';
                    }

                    let embed;

                    if (obtainable) {
                        embed = new MessageEmbed()
                            .setTitle(`${result.username}'s Profile`)
                            .setColor('#87f04a')
                            .addField('Rank', result.rank)
                            .addField(`Marks [${result.points}]`, [
                                `${squares} (**${Math.round(result.points / rank.next * 100)}%**)`,
                                `Need **${rank.next - result.points}** Marks to rank up to **${rank.next_name}**`
                            ])
                    } else {
                        embed = new MessageEmbed()
                            .setTitle(`${result.username}'s Profile`)
                            .setColor('#87f04a')
                            .addField('Rank', result.rank)
                            .addField(`Marks [${result.points}]`, [
                                `Max obtainable rank has been achieved.`
                            ])
                    }

                    return message.channel.send(embed);
                });
            });
        }
    }
}