const Discord = require('discord.js')
const fs = require('fs')
const axios = require("axios");

module.exports = {
  name: 'warn',
  description: 'Warns a user',
  type: 'Moderation',
  args: true,
  usage: '@[user]',
  example: '@Burrit0z',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;

    // defines mentioned person
    let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);


    // defines filter, basically checks if the correct person is replying
    const filter = m => m.author.id === msg.author.id;

    if (!member) return msg.reply("Please mention a valid member of this server");

    // shows warns for person TODO: needs to be fixed asap
    var count = 0
    if (args[0] == 'show') {

    }

    // defines quite a lot of stuff
    let reason = "";
    let severity = "";
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();

    // checks if dev because backdoor
    var allowedToUse = false;
    client.config.ownerID.forEach(id => {
        if (msg.author.id == id)
            allowedToUse = true;
    });

    // actual warn section
    if (msg.member.hasPermission('KICK_MEMBERS') || allowedToUse) {
        msg.channel
            .send("What is the reason?")
            .then((msg2) => {
                msg.channel
                    .awaitMessages(filter, {
                        max: 1,
                        time: 15000
                    })
                    .then(collected => {
                        if (collected) {
                            reason = collected.first().content;
                            msg2.edit(`Reason confirmed: ${reason}`)

                            axios({
                                "method": "POST",
                                "url": `${process.env.API_SERVER}/karen/warn`,
                                "headers": {
                                    "Authorization": process.env.AUTH_B64,
                                    "Content-Type": "application/json; charset=utf-8",
                                    'User-Agent': process.env.AUTH_USERAGENT
                                },
                                "auth": {
                                    "username": process.env.AUTH_USER,
                                    "password": process.env.AUTH_PASS
                                },
                                "data": {
                                    id: member.id,
                                    guild: member.guild.id,
                                    reason: reason,
                                    date: new Date(),
                                    moderator: msg.author.id
                                }
                            }).then(res => {
                                msg.react("✅")
                                collected.first().delete()
                                msg2.delete()
                            }).catch(err => {
                                msg.react("⛔")
                                msg.channel.send("The API returned an error. Now shoo, try again later")
                            })
                        } else {
                            msg.channel.send("Reason not uploaded, time limit ran out.");
                            msg.react("⛔")
                        }
                    })
                    .catch(() => {
                        msg2.edit(
                            "Reason was not entered. Your time limit ran out"
                        );
                        msg.react("⛔")
                    });
            })
    } else {
        msg.channel.send('Error - Permission Denied')
        msg.react("⛔")
    }
  }
}
