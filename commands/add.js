const Discord = require('discord.js.old');
const Database = require('../mongodb');

module.exports = {
    name: 'add',
    description: 'Add twitter user to monitor.',
    async execute(msg, msgArray, monitor, bot, database) {
        if (msgArray.length == 2) {
            if (monitor.usersRequesting.toLowerCase().indexOf(msgArray[1].toLowerCase()) == -1) {
                let data = await monitor.checkIfExists(msgArray[1]);
                if (JSON.stringify(data).indexOf('No user matches for specified terms.') != -1) {
                    const embed = new Discord.RichEmbed()
                        .setColor('RED')
                        .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                        .setTitle(`Cannot add \`@${msgArray[1]}\` to the monitor.`)
                        .setDescription(`\`@${msgArray[1]}\` is not a valid user.`)
                        .setTimestamp()
                        .setFooter('made with <3 by dragonlordslayer69');
                    msg.channel.send(embed);
                } else {
                    monitor.resetID(data)
                    const embed = new Discord.RichEmbed()
                        .setColor('GREEN')
                        .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                        .setTitle(`Now Monitoring \`@${msgArray[1]}\``)
                        .setDescription(`Successfully added \`@${msgArray[1]}\` to the monitor.`)
                        .setThumbnail(data[0].profile_image_url_https)
                        .setTimestamp()
                        .setFooter('made with <3 by dragonlordslayer69');
                    msg.channel.send(embed);
                    database.updateUsers(monitor, monitor.usersRequesting + `,${msgArray[1]}`);
                    monitor.usersRequesting += `,${msgArray[1]}`
                        // if (data[0].following == false){
                        //     followUser(data[0].screen_name);
                        // }
                }
            } else {
                const embed = new Discord.RichEmbed()
                    .setColor('RED')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Cannot add \`@${msgArray[1]}\` to the monitor.`)
                    .setDescription(`\`@${msgArray[1]}\` is already being monitored.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            }
        }
    }
}