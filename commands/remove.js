const Discord = require('discord.js.old');
const database = require('../mongodb');

module.exports = {
    name: 'remove',
    description: 'Remove twitter user from monitor.',
    async execute(msg, msgArray, monitor, bot, database) {
        if (msgArray.length == 2) {
            if (monitor.usersRequesting.toLowerCase().indexOf(msgArray[1].toLowerCase()) == -1) {
                const embed = new Discord.RichEmbed()
                    .setColor('RED')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Cannot remove \`@${msgArray[1]}\` from the monitor.`)
                    .setDescription(`The user \`@${msgArray[1]}\` is not being monitored.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            } else {
                database.updateUsers(monitor, monitor.usersRequesting.toLowerCase().replace(',' + msgArray[1].toLowerCase(), ''));
                monitor.usersRequesting = monitor.usersRequesting.toLowerCase().replace(',' + msgArray[1].toLowerCase(), '');
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Removed \`@${msgArray[1]}\` from the monitor.`)
                    .setDescription(`The user \`@${msgArray[1]}\` has been removed from the monitor.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            }
        }
    }
}