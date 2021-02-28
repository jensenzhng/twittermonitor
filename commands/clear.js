const Discord = require('discord.js.old');

module.exports = {
    name: 'clear',
    description: 'Clears all accounts on the monitor.',
    async execute(msg, msgArray, monitor, bot, database) {
        if (msgArray.length == 2 && msgArray[1] == 'emphasis') {
            if (userEmphasis == '') {
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Oops!`)
                    .setDescription(`There are no users being emphasized right now.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            } else {
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Cleared user emphasis`)
                    .setDescription(`Tweets from \`@${userEmphasis}\` will no longer be emphasized.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
                userEmphasis = '';
            }
        } else {
            if (monitor.usersRequesting == '') {
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Oops!`)
                    .setDescription(`There are currently no accounts being monitored. You can't clear nothing! Try adding some accounts.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                msg.channel.send(embed);
            } else {
                const embed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                    .setTitle(`Are you sure you want to clear the monitor? This will remove all accounts, regardless of how many accounts are currently being monitored.`)
                    .setDescription(`React with 👍 to confirm. This will delete in 15 seconds.`)
                    .setTimestamp()
                    .setFooter('made with <3 by dragonlordslayer69');
                let clearMessage = await msg.channel.send(embed);

                clearMessage.react('👍').catch(err => { console.log(err) });

                clearMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == '👍'), { max: 1, time: 15000 }).then(collected => {
                    if (collected.first().emoji.name == '👍') {
                        const embed = new Discord.RichEmbed()
                            .setColor('GREEN')
                            .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                            .setTitle(`Cleared the monitor.`)
                            .setDescription(`All accounts have been cleared from the monitor. Please type \`.help\` to see more monitor commands.`)
                            .setTimestamp()
                            .setFooter('made with <3 by dragonlordslayer69');
                        database.updateUsers(monitor, '');
                        monitor.usersRequesting = '';
                        clearMessage.delete();
                        msg.channel.send(embed);
                    } else {
                        clearMessage.delete();
                        message.reply('Bruh');
                    }
                }).catch(() => {
                    const embed = new Discord.RichEmbed()
                        .setColor('GREEN')
                        .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                        .setTitle(`There has been no reaction within 15 seconds.`)
                        .setDescription(`All previously monitored accounts still remain on the monitor. Please type \`.help\` to see more monitor commands.`)
                        .setTimestamp()
                        .setFooter('made with <3 by dragonlordslayer69');
                    clearMessage.delete();
                    msg.channel.send(embed);
                });
            }
        }
    }
}