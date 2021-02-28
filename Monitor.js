const Twit = require('twit');
const Discord = require('discord.js.old');

module.exports = class Monitor {
    constructor(bot) {
        this.bot = bot;
        this.usersRequesting = '';
        this.latestTweetID = '';
        this.x = 1;
        this.userEmphasis = '';
        this.channel = bot.channels.get("737907811895345183");
        //put twitter api keys here
        this.T = new Twit({
            consumer_key: '',
            consumer_secret: '',
            access_token: '',
            access_token_secret: '',
        });
    }

    getData() {
        console.log("Request " + this.x);
        console.log(this.usersRequesting);
        if (this.usersRequesting != '') {
            try {
                this.T.get('users/lookup', { screen_name: this.usersRequesting, tweet_mode: 'extended' }, (err, data, res) => {
                    if (this.x == 2 || this.x == 3 || this.x == 4) {
                        if (JSON.stringify(data).indexOf('No user matches for specified terms.') == -1) {
                            for (let userNum in data) {
                                if (userNum == 0) {
                                    this.latestTweetID = data[userNum].status.id_str;
                                } else {
                                    this.latestTweetID = ((parseInt(data[userNum].status.id_str) > parseInt(this.latestTweetID))) ? data[userNum].status.id_str : this.latestTweetID;
                                }
                                // if (data[userNum].following == false){
                                //     followUser(data[userNum].screen_name);
                                // }
                            }
                        }
                        console.log('done setting latestTweetID');
                    }
                    for (let userNum in data) {
                        this.checkUser(data[userNum]);
                    }
                });
            } catch (err) {
                console.error(err);
            }
            this.x++;
        }
    }

    checkUser(user) {
        if (user.status != undefined) {
            if (parseInt(user.status.id_str) > parseInt(this.latestTweetID)) {
                console.log(`Detected - ${new Date().getSeconds()}:${new Date().getMilliseconds()}`)
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
                if (this.userEmphasis.toLowerCase() == user.screen_name.toLowerCase()) {
                    this.channel.send('@everyone', { embed: embed });
                } else {
                    this.channel.send(embed);
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
                            this.channel.send(`\`Video/Gif Detected:\` ${videoUrl}`)
                        } else {
                            const embed1 = new Discord.RichEmbed()
                                .setColor('GREEN')
                                .setImage(user.status.extended_entities.media[mediaNum].media_url_https)
                                .setFooter('made with <3 by dragonlordslayer69');
                            this.channel.send(embed1);
                        }
                    }
                }
                this.latestTweetID = user.status.id_str;
            }
        }
    }

    resetID(data) {
        try {
            if (this.latestTweetID == '') {
                this.latestTweetID = data[0].status.id_str;
            } else {
                if (parseInt(data[0].status.id_str) > parseInt(this.latestTweetID)) {
                    this.latestTweetID = data[0].status.id_str;
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    start() {
        setInterval(() => this.getData(), 1200);
    }

    async checkIfExists(user) {
        return new Promise((resolve, reject) => {
            this.T.get('users/lookup', { screen_name: user, tweet_mode: 'extended' }, (err, data, res) => {
                resolve(data)
            });
        });
    }
}