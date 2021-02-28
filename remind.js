const Discord = require('discord.js.old');

module.exports = {
    name: 'remind',
    description: 'Reminds a user of whatever they want in a certain time frame.',
    async execute(msg, msgArray, monitor, bot) {
        function reminder(remindMsg) {
            const embed = new Discord.RichEmbed()
                .setTitle('Reminder!')
                .setDescription(remindMsg)
                .setColor('GREEN');
            msg.author.send(embed);
        }

        switch (msgArray[1].slice(-1)) {
            case 's':
                {
                    let remindMsg = msg.replace('.remind', '').replace(msgArray[1] + ' ', '');
                    var msDelay = msgArray[1].slice(0, -1) * 1000;
                    const embed = new Discord.RichEmbed()
                        .setTitle('Reminder set!')
                        .setColor('GREEN');
                    msg.send(embed);
                    setTimeout(() => reminder(remindMsg), msDelay);
                    break;
                }
            case 'm':
                {
                    let remindMsg = msg.replace('.remind', '').replace(msgArray[1] + ' ', '');
                    var msDelay = msgArray[1].slice(0, -1) * 60000;
                    const embed = new Discord.RichEmbed()
                        .setTitle('Reminder set!')
                        .setColor('GREEN');
                    msg.send(embed);
                    setTimeout(() => reminder(remindMsg), msDelay);
                    break;
                }
            case 'h':
                {
                    let remindMsg = msg.replace('.remind', '').replace(msgArray[1] + ' ', '');
                    var msDelay = msgArray[1].slice(0, -1) * 3600000;
                    const embed = new Discord.RichEmbed()
                        .setTitle('Reminder set!')
                        .setColor('GREEN');
                    msg.send(embed);
                    setTimeout(() => reminder(remindMsg), msDelay);
                    break;
                }
            case 'd':
                {
                    let remindMsg = msg.replace('.remind', '').replace(msgArray[1] + ' ', '');
                    var msDelay = msgArray[1].slice(0, -1) * 86400000;
                    const embed = new Discord.RichEmbed()
                        .setTitle('Reminder set!')
                        .setColor('GREEN');
                    msg.send(embed);
                    setTimeout(() => reminder(remindMsg), msDelay);
                    break;
                }
        }
    }
}