const Discord = require('discord.js.old');

module.exports = {
    name: 'emphasis',
    description: 'Emphasizes user on monitor.',
    async execute(msg, msgArray, monitor, bot, database) {
        if (msgArray.length == 2) {
            if (monitor.usersRequesting.toLowerCase().indexOf(msgArray[1].toLowerCase()) == -1) {
                const embed = new Discord.RichEmbed()
                    .setColor('RED')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Cannot emphasize \`@${msgArray[1]}\``)
                    .setDescription(`\`@${msgArray[1]}\` is not currently being monitored.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            } else {
                monitor.userEmphasis = msgArray[1];
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Emphasized \`@${msgArray[1]}\``)
                    .setDescription(`Successfully emphasized \`${msgArray[1]}\` - all tweets from this user will @everyone.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            }
        }
    }
}