const Discord = require('discord.js.old');

module.exports = {
    name: 'target',
    description: 'Changes the channel reference in which to send tweet info to.',
    async execute(msg, msgArray, monitor, bot, database) {
        if (msgArray.length == 2) {
            if (msgArray[1].indexOf("<#") == -1) {
                const embed = new Discord.RichEmbed()
                    .setColor('RED')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Please provide a valid channel target.`)
                    .setDescription(`\`${msgArray[1]}\` is not a valid channel.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            } else {
                database.updateChannel(monitor, msgArray[1].split("<#")[1].replace(">", ""))
                monitor.channel = bot.channels.get(msgArray[1].split("<#")[1].replace(">", ""));
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Updated post channel for all tweet content`)
                    .setDescription(`All new tweet content will be posted in ${msgArray[1]}.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            }
        }
    }
}