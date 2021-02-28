const Discord = require('discord.js.old');

module.exports = {
    name: 'current',
    description: 'Returns a list of current users being monitored.',
    async execute(msg, msgArray, monitor, bot, database) {
        if (monitor.usersRequesting == '') {
            const embed = new Discord.RichEmbed()
                .setColor('GREEN')
                .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                .setTitle(`Monitor Status`)
                .addField(`Current channel target`, `${monitor.channel}`)
                .addField(`Monitoring 0 Accounts.`, `Maybe try adding some? :D`)
                .setTimestamp()
                .setFooter('made with <3 by dragonlordslayer69');
            msg.channel.send(embed);
        } else {
            let userArray = monitor.usersRequesting.split(','),
                statusUsers = '';
            for (let i = 1; i < userArray.length; i++) {
                statusUsers += `\`@${userArray[i]}\`\n`;
            }
            const embed = new Discord.RichEmbed()
                .setColor('GREEN')
                .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                .setTitle(`Monitor Status`)
                .addField(`Current channel target`, `${monitor.channel}`);
            if (monitor.userEmphasis == '') {
                embed.addField(`User Emphasis`, `N/A`)
            } else {
                embed.addField(`User Emphasis`, `\`@${userEmphasis}\``)
            }
            embed.addField(`Monitoring ${userArray.length - 1} Account(s).`, statusUsers)
                .setTimestamp()
                .setFooter('made with <3 by dragonlordslayer69');
            msg.channel.send(embed);
        }
    }
}