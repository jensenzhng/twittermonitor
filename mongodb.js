const mongoose = require('mongoose');
const { findOneAndDelete } = require('./models/user');
const User = require('./models/user')

//put mongodb connection uri here
let dbURI = '';

module.exports = class mongodb {
    constructor() {}

    async connect() {
        return new Promise((res, rej) => {
            mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
                .then(result => {
                    res('connected');
                })
                .catch(err => console.log(err));
        })
    }

    async fetchUsers(monitor, bot) {
        User.findById({ _id: '601f5a3511b1a49c53b46f6c' }).then(res => {
            console.log(res)
            monitor.usersRequesting = res.usersRequesting;
            monitor.channel = bot.channels.get(res.channel);
        })
    }

    async updateChannel(monitor, channel) {
        User.findOneAndUpdate({ channel: monitor.channel.id }, { channel: channel })
            .then(() => {
                console.log('updated!');
            });
        //put the id of the schema that contains users here 
        User.findById({ _id: '601f5a3511b1a49c53b46f6c' }).then(res => {
            console.log(res);
        })
    }

    async updateUsers(monitor, newList) {
        User.findOneAndUpdate({ usersRequesting: monitor.usersRequesting }, { usersRequesting: newList })
            .then(() => {
                console.log('updated!');
            });
        //put the id of the schema that contains users here 
        User.findById({ _id: '601f5a3511b1a49c53b46f6c' }).then(res => {
            console.log(res);
        })
    }
}