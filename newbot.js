const Discord = require('discord.js.old'),
    fs = require('fs');
const bot = new Discord.Client();
const Database = require('./mongodb');
// const config = require('./config.json')
// const tesseract = require("node-tesseract-ocr");
const Monitor = require('./Monitor.js');
let monitor, database;
const prefix = '.';

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on('ready', () => {
    monitor = new Monitor(bot);
    database = new Database();
    console.log('ready');
    console.log(monitor.channel.id);
    database.connect().then(database.fetchUsers(monitor, bot));
    monitor.start();
});

bot.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    let msgArray = msg.content.split(' ');
    let command = msgArray[0].replace(prefix, '');

    if (!bot.commands.has(command)) return;

    try {
        if (msg.member.hasPermission("ADMINISTRATOR")) {
            bot.commands.get(command).execute(msg, msgArray, monitor, bot, database);
        }
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

//bottokenhere
bot.login("").catch(console.error());