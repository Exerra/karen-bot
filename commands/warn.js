const Discord = require('discord.js')
const fs = require('fs')

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
    return msg.channel.send('Currently disabled for maintenance!')

    // defines mentioned person
    let member = msg.mentions.members.first()


    // defines filter, basically checks if the correct personis replying
    const filter = m => m.author.id === msg.author.id;

    // sets warnembed stuff
    const warnembed = new Discord.MessageEmbed()
    warnembed.setColor(config.color)
    warnembed.setThumbnail(member.user.avatarURL())

    if (!member) return msg.reply("Please mention a valid member of this server");

    // shows warns for person TODO: needs to be fixed asap
    var count = 0
    if (args[1] == 'show') {
        try {
            fs.readdirSync(app.dir + "/warns/" + member.id).forEach(file => {
                count++
                fs.readFile(app.dir + "/warns/" + member.id + "/" + file, function (err, data) {
                    embedFunc.sendEmbedOnceYouDonkey(data)
                })
            });
        } catch (e) {}
        let embedFunc = { 
            sendEmbedOnceYouDonkey: (data) => {
                const warnhistory = JSON.parse(data);
                warnembed.addField(`${warnhistory.date}`, `**Reason:** ${warnhistory.reason}\n**Severity:** ${warnhistory.severity}\n**Moderator:** <@${warnhistory.moderator}>`)
                if (count == 1) {
                    msg.channel.send(warnembed)
                } else {
                    count--
                }
            }
        }
            warnembed.setTitle(`Showing warns for ${member.user.tag}`)
            msg.channel.send(warnembed)
        // })
        return
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
    config.DevIDs.forEach(id => {
        if (msg.author.id == id)
            allowedToUse = true;
    });

    // actual warn section
    if (msg.member.hasPermission('KICK_MEMBERS') || allowedToUse) {
        msg.channel
            .send("What is the reason?")
            .then(() => {
                msg.channel
                    .awaitMessages(filter, {
                        max: 1,
                        time: 15000
                    })
                    .then(collected => {
                        if (collected) {
                            reason = collected.first().content;
                            msg.channel.send(`Reason confirmed: ${reason}`);

                            msg.channel
                                .send("Next, please input a severity.")
                                .then(() => {
                                    msg.channel
                                        .awaitMessages(filter, {
                                            max: 1,
                                            time: 15000,
                                        })
                                        .then(collected => {
                                            severity = collected.first().content;
                                            msg.channel.send(`Severity confirmed: ${severity}`);
                                            const warnhistorytemplate = {
                                                server: member.guild.id,
                                                reason: reason,
                                                severity: severity,
                                                date: date + month + year + hours + "-" + minutes,
                                                moderator: msg.author.id
                                            }
                                            if (!fs.existsSync(app.dir + "/warns/" + member.id)) {
                                                fs.mkdirSync(app.dir + "/warns/" + member.id);
                                                fs.writeFileSync(app.dir + "/warns/" + member.id + "/" + date + month + year + hours + "-" + minutes + ".json", JSON.stringify(warnhistorytemplate));
                                                fs.readFile(app.dir + "/warns/" + member.id + "/" + date + month + year + hours + "-" + minutes + ".json", function (err, data) {
                                                    const warnhistory = JSON.parse(data);
                                                    warnembed.setTitle(`Warned ${member.user.tag}`)
                                                    warnembed.addField('**Reason**', warnhistory.reason)
                                                    warnembed.addField('**Severity**', warnhistory.severity)
                                                    warnembed.addField('Moderator', `<@${warnhistory.moderator}>`)
                                                    msg.channel.send(warnembed)
                                                    const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(msg.guild.id).modLogChannel);
                                                    if (!modLogChannelConst) return;
                                                    modLogChannelConst.send(`<@${member.user.id}>`, warnembed)
                                                })
                                            }
                                            else {
                                                fs.writeFileSync(app.dir + "/warns/" + member.id + "/" + date + month + year + hours + "-" + minutes + ".json", JSON.stringify(warnhistorytemplate));
                                                fs.readFile(app.dir + "/warns/" + member.id + "/" + date + month + year + hours + "-" + minutes + ".json", function (err, data) {
                                                    const warnhistory = JSON.parse(data);
                                                    warnembed.setTitle(`Warned ${member.user.tag}`)
                                                    warnembed.addField('**Reason**', warnhistory.reason)
                                                    warnembed.addField('**Severity**', warnhistory.severity)
                                                    warnembed.addField('Moderator', `<@${warnhistory.moderator}>`)
                                                    msg.channel.send(warnembed)
                                                    const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(msg.guild.id).modLogChannel);
                                                    if (!modLogChannelConst) return;
                                                    modLogChannelConst.send(`<@${member.user.id}>`, warnembed)
                                                })
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                            msg.channel.send(
                                                "Severity was not entered. Your time limit ran out"
                                            );
                                        });
                                });
                        } else {
                            msg.channel.send("Reason not uploaded, time limit ran out.");
                        }
                    })
                    .catch(() => {
                        msg.channel.send(
                            "Reason was not entered. Your time limit ran out"
                        );
                    });
            })
    } else {
        msg.channel.send('Error - Permission Denied')
    }
  }
}
