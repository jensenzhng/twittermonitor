const Discord = require('discord.js.old');
const bot = new Discord.Client();
const tesseract = require("node-tesseract-ocr");
const fs = require('fs'),
    request = require('request');
const Twit = require('twit');

// let usersRequesting = ',veloxbots,kodaiaio,wrathsoftware,rushaio,hawkmesh,aycdjake,destroyerbots,mekrobotics,torpedoAIO,KylinBot,nebulabots,lexus_aio,cybersole,weqiscool,polarisaio,dragonaiobot,ghostaio';
let usersRequesting = '';
let latestTweetID = '',
    x = 1,
    // ocrText = '',
    userEmphasis = '';
let channel;
var T = new Twit({
    consumer_key: 'MFBumnSiFRTBgWCpFFYWmPlBq',
    consumer_secret: '6sbjsRAuKPiV2FG0m63c2jr4fSCzxWYhYhWBCjJIGrotACrpLo',
    access_token: '1351332654222888967-wmBMLkDOON0CUbkgH9CCXahl242AwS',
    access_token_secret: 'onXobopLikZerspTMfusCxlIJVL3kNYvfQRlQOT1cJUHf',
});

bot.on('ready', () => {
    console.log('ready');
    channel = bot.channels.get("737907811895345183");
});

bot.on('message', async msg => {
    let msgArray = msg.content.split(' ');
    if (msgArray[0] == '.add' && msgArray.length == 2) {
        if (usersRequesting.toLowerCase().indexOf(msgArray[1].toLowerCase()) == -1) {
            T.get('users/lookup', { screen_name: msgArray[1], tweet_mode: 'extended' }, (err, data, res) => {
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
                    resetID(data)
                    const embed = new Discord.RichEmbed()
                        .setColor('GREEN')
                        .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                        .setTitle(`Now Monitoring \`@${msgArray[1]}\``)
                        .setDescription(`Successfully added \`@${msgArray[1]}\` to the monitor.`)
                        .setThumbnail(data[0].profile_image_url_https)
                        .setTimestamp()
                        .setFooter('made with <3 by dragonlordslayer69');
                    msg.channel.send(embed);
                    usersRequesting += `,${msgArray[1]}`
                        // if (data[0].following == false){
                        //     followUser(data[0].screen_name);
                        // }
                }
            })
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
    if (msgArray[0] == '.remove' && msgArray.length == 2) {
        if (usersRequesting.toLowerCase().indexOf(msgArray[1].toLowerCase()) == -1) {
            const embed = new Discord.RichEmbed()
                .setColor('RED')
                .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                .setTitle(`Cannot remove \`@${msgArray[1]}\` from the monitor.`)
                .setDescription(`The user \`@${msgArray[1]}\` is not being monitored.`)
                .setTimestamp()
                .setFooter('made with <3 by dragonlordslayer69');
            msg.channel.send(embed);
        } else {
            usersRequesting = usersRequesting.toLowerCase().replace(',' + msgArray[1].toLowerCase(), '');
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
    if (msgArray[0] == '.current') {
        if (usersRequesting == '') {
            const embed = new Discord.RichEmbed()
                .setColor('GREEN')
                .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                .setTitle(`Monitor Status`)
                .addField(`Current channel target`, `${channel}`)
                .addField(`Monitoring 0 Accounts.`, `Maybe try adding some? :D`)
                .setTimestamp()
                .setFooter('made with <3 by dragonlordslayer69');
            msg.channel.send(embed);
        } else {
            let userArray = usersRequesting.split(','),
                statusUsers = '';
            for (let i = 1; i < userArray.length; i++) {
                statusUsers += `\`@${userArray[i]}\`\n`;
            }
            const embed = new Discord.RichEmbed()
                .setColor('GREEN')
                .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                .setTitle(`Monitor Status`)
                .addField(`Current channel target`, `${channel}`);
            if (userEmphasis == '') {
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
    if (msgArray[0] == '.help') {
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
    if (msgArray[0] == '.clear') {
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
            if (usersRequesting == '') {
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
                        usersRequesting = '';
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
    if (msgArray[0] == '.target' && msgArray.length == 2) {
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
            channel = bot.channels.get(msgArray[1].split("<#")[1].replace(">", ""));
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
    if (msgArray[0] == '.emphasis' && msgArray.length == 2) {
        if (usersRequesting.toLowerCase().indexOf(msgArray[1].toLowerCase()) == -1) {
            const embed = new Discord.RichEmbed()
                .setColor('RED')
                .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
                .setTitle(`Cannot emphasize \`@${msgArray[1]}\``)
                .setDescription(`\`@${msgArray[1]}\` is not currently being monitored.`)
                .setTimestamp()
                .setFooter('made with <3 by dragonlordslayer69');
            msg.channel.send(embed);
        } else {
            userEmphasis = msgArray[1];
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
    // if (msgArray[0] == '.overclock'){
    //     delay = 250;
    //     const embed = new Discord.RichEmbed()
    //         .setColor('GREEN')
    //         .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
    //         .setTitle(`Overclocking requests for 2 minutes`)
    //         .setDescription(`The monitor has been overclocked. It will resume to normal in 2 minutes.`)
    //         .setFooter('made with <3 by dragonlordslayer69');
    //     msg.channel.send(embed);
    //     setTimeout(() => {
    //         delay = 750;
    //     }, 2 * 1000 * 60)
    // }
});

bot.login("NzI5ODgxMDQ0NzA2Mzk0MTgy.XwPYsQ.rx-UDFlgcyFfeYpO16n2u6Y-Its").catch(console.error());

//Idea for switching api keys: keep a global variable that starts at 1, everytime you run the setinterval you increase the variable
//check alo.js for example, use T.setAuth

function resetID(data) {
    try {
        if (latestTweetID == '') {
            latestTweetID = data[0].status.id_str;
        } else {
            if (parseInt(data[0].status.id_str) > parseInt(latestTweetID)) {
                latestTweetID = data[0].status.id_str;
            }
        }
    } catch (err) {
        console.log(err)
    }
}

function checkUser(user) {
    if (user.status != undefined) {
        if (parseInt(user.status.id_str) > parseInt(latestTweetID)) {
            console.log(`hi ${new Date().getSeconds()}:${new Date().getMilliseconds()}`)
            let tweettext = user.status.full_text;
            let urls = JSON.parse(JSON.stringify(user.status.entities.urls)),
                linksInTweet = '';
            const embed = new Discord.RichEmbed()
                .setColor('GREEN');
            if (user.status.in_reply_to_status_id != null || user.status.in_reply_to_screen_name != null) {
                if (user.status.is_quote_status) {
                    embed.setTitle(`New Quoted Tweet Detected From \`@${user.screen_name}\``);
                } else {
                    embed.setTitle(`New Reply Detected From \`@${user.screen_name}\``);
                }
            } else if (user.status.is_quote_status) {
                embed.setTitle(`New Quoted Tweet Detected From \`@${user.screen_name}\``);
            } else if (user.status.hasOwnProperty('retweeted_status')) {
                embed.setTitle(`New Retweet Detected From \`@${user.screen_name}\``);
            } else {
                embed.setTitle(`New Tweet Detected From \`@${user.screen_name}\``);
            }
            for (let urlEntity in urls) {
                tweettext = tweettext.replace(urls[urlEntity]["url"], urls[urlEntity]["expanded_url"])
                linksInTweet += `${urls[urlEntity]["expanded_url"]}\n`
            }
            embed.addField(`Detected Text`, tweettext);
            if (linksInTweet != '') {
                embed.addField(`Links In Tweet`, linksInTweet)
            }
            if (user.status.entities.user_mentions.length > 0) {
                let userMentions = '';
                for (let mentionNum in user.status.entities.user_mentions) {
                    userMentions += `[${user.status.entities.user_mentions[mentionNum].name}](https://twitter.com/${user.status.entities.user_mentions[mentionNum].screen_name})\n`
                }
                console.log(userMentions)
                embed.addField(`Users Mentioned`, userMentions)
            }
            embed
                .addField(`Helpful Links`, `**[[Tweet]](https://twitter.com/${user.screen_name}/status/${user.status.id_str}) - [[Profile]](https://twitter.com/${user.screen_name}/) - [[Following]](https://twitter.com/${user.screen_name}/following)**`)
                .setThumbnail(user.profile_image_url_https)
                .setTimestamp()
                .setFooter('made with <3 by dragonlordslayer69');
            if (userEmphasis.toLowerCase() == user.screen_name.toLowerCase()) {

                channel.send('@everyone', { embed: embed });
            } else {
                channel.send(embed);
            }
            if (user.status.hasOwnProperty('extended_entities')) {
                for (let mediaNum in user.status.extended_entities.media) {
                    let videoUrl = '';
                    if (user.status.extended_entities.media[mediaNum].type == 'video' || user.status.extended_entities.media[mediaNum].type == 'animated_gif') {
                        let bitrate = 0;
                        for (let videoNum in user.status.extended_entities.media[mediaNum].video_info.variants) {
                            if (user.status.extended_entities.media[mediaNum].video_info.variants[videoNum].hasOwnProperty('bitrate')) {
                                if (user.status.extended_entities.media[mediaNum].video_info.variants[videoNum].bitrate >= bitrate) {
                                    videoUrl = user.status.extended_entities.media[mediaNum].video_info.variants[videoNum].url;
                                    bitrate = user.status.extended_entities.media[mediaNum].video_info.variants[videoNum].bitrate;
                                }
                            }
                        }
                        channel.send(`\`Video/Gif Detected:\` ${videoUrl}`)
                    } else {
                        const embed1 = new Discord.RichEmbed()
                            .setColor('GREEN')
                            .setImage(user.status.extended_entities.media[mediaNum].media_url_https)
                            .setFooter('made with <3 by dragonlordslayer69');
                        channel.send(embed1);
                    }
                }
            }
        }
    }
}
//                 let proccessingTime = Date.now();
//                 download(user.status.extended_entities.media[0].media_url_https, '/Users/jensenzhang/Desktop/test.jpg', function() {
//                     console.log('done');
//                     tesseract.recognize("/Users/jensenzhang/Desktop/test.jpg", {
//                             lang: "eng",
//                             oem: 1,
//                             psm: 3,
//                         })
//                         .then(text => {
//                             var regExp = /[a-zA-Z]/g;
//                             if (regExp.test(text)) {
//                                 const embed = new Discord.RichEmbed()
//                                     .setColor('GREEN')
//                                     .setTitle(`OCR Results for \`@${user.screen_name}\``)
//                                     .setDescription(text)
//                                     .setFooter(`made with <3 by dragonlordslayer69 | processed in ${Date.now() - proccessingTime} ms`);
//                                 channel.send(embed);
//                             }
//                         })
//                         .catch(error => {
//                             console.log(error.message)
//                         })
//                 });
//             }
//             latestTweetID = user.status.id_str;
//         }
//     }
// }

// async function ocr(url, proccessingTime) {
//     await worker.load();
//     await worker.loadLanguage('eng');
//     await worker.initialize('eng');
//     const { data: { text } } = await worker.recognize(url);
//     const embed1 = new Discord.RichEmbed()
//         .setColor('GREEN')
//         .setTitle('OCR')
//         .setDescription(text)
//         .setFooter(`made with <3 by dragonlordslayer69 | Processed in ${Date.now() - proccessingTime} ms`);
//     channel.send(embed1);
// }

function download(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

// function followUser(userToFollow) {
//     T.post('friendships/create', { screen_name: userToFollow }, (err, data, res) => {
//         if (err == undefined) {
//             console.log(`Followed ${userToFollow}`)
//         }
//     });
// }

function getData() {
    console.log("Request " + x);
    if (usersRequesting != '') {
        try {
            // if (x % 3 == 0) {
            //     T.setAuth({
            //         consumer_key: 'aTlQNpyZrXHL2LYIffdzZFiou',
            //         consumer_secret: 'YppEjHTV29BvcugEHooSMtCijGxqyoIMPWiGZtCxflrOpQw1UE',
            //         access_token: '1249149427727634432-VNHQaCnk1ahqUg3Xm1GnC77ygl0iOE',
            //         access_token_secret: '4PsFxAxIwtZoPzCRjJlGw9JLtrogDNDlLO1zCLnkMO0YP',
            //     })
            // } else if (x % 2 == 0) {
            //     T.setAuth({
            //         consumer_key: 'PEPvotd7k4kPEhuEqPGSbm7eS',
            //         consumer_secret: 'kjvTCKpy1OlPKClmJg0CUsD5h2b8dbVfzWjxGbWpossI1A58kY',
            //         access_token: '1249149427727634432-Om1qmoj82DLINuvg20xqLcD0EU7Uoy',
            //         access_token_secret: 'MhHgAsrzeC5E1QDRPFzMXW1l9RRktZgvF7uAvhdC8qJVC',
            //     })
            // } else {
            //     T.setAuth({
            //         consumer_key: 'PMac88QI8OWxrD83gskPZ30zo',
            //         consumer_secret: 'yEjwILrxoCJObT4EdzVuRfKk5dzG7NjKMDywE7JankCupJSpTY',
            //         access_token: '1249149427727634432-mQnOim6gHC6AbIKN5jK6H0iGEyZSWv',
            //         access_token_secret: 'HLNoiw763H4Lp7d373jRJSVYiPC6lxDSBjMzRla3t588w',
            //     })
            // }
            T.get('users/lookup', { screen_name: usersRequesting, tweet_mode: 'extended' }, (err, data, res) => {
                if (x == 2 || x == 3 || x == 4) {
                    for (let userNum in data) {
                        if (userNum == 0) {
                            latestTweetID = data[userNum].status.id_str;
                        } else {
                            latestTweetID = ((parseInt(data[userNum].status.id_str) > parseInt(latestTweetID))) ? data[userNum].status.id_str : latestTweetID;
                        }
                        // if (data[userNum].following == false){
                        //     followUser(data[userNum].screen_name);
                        // }
                    }
                    console.log('done setting latestTweetID');
                }
                for (let userNum in data) {
                    checkUser(data[userNum]);
                }
            });
        } catch (err) {
            console.error(err.message);
        }
        x++;
    }
}

setInterval(getData, 430);

/*to do:
.clear command - done
picture/video/gif support - done
pastebin scraping
new endpoint!!!!!
more api keys
ocr - done
*/