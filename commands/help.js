const Discord = require('discord.js.old');

module.exports = {
    name: 'help',
    description: 'Returns a list of commands that you can use with the bot.',
    async execute(msg, msgArray, monitor, bot, database) {
        const embed = new Discord.RichEmbed()
            .setColor('GREEN')
            .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
            .setTitle(`Monitor Help Page`)
            .addField(`.add [twitter user without @]`, `Adds a twitter user to the monitor.\nEx: \`.add user1\``)
            .addField(`.remove [twitter user without @]`, `Removes a twitter user from the monitor.\nEx: \`.remove user1\``)
            .addField(`.current`, `Returns a list of all the accounts that are currently being monitored.`)
            .addField(`.clear`, `Allows you to clear all accounts being monitored. Requires confirmation.`)
            .addField(`.clear emphasis`, `Removes the user emphasis.`)
            .addField(`.target [Discord Channel]`, `Allows you to clear all accounts being monitored.`)
            .addField(`.emphasis [twitter user without @]`, `Will @everyone everytime a tweet from this user is posted.`)
            .addField(`Additional Notes`, `- Commands are not stackable (ie. \`.add user1 user2\` will not work).\n- Don't add too many accounts at once to avoid lag.\n- The Discord channel with \`.target\` must be a clickable reference.`)
            .setTimestamp()
            .setFooter('made with <3 by dragonlordslayer69');
        msg.channel.send(embed);
    }
}