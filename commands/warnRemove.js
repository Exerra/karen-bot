const Discord = require('discord.js')
const fs = require('fs')
const axios = require("axios");
const app = require("../bot.js");

module.exports = {
    name: 'removewarn',
    description: 'Removes a warn from user',
    type: 'Moderation',
    args: true,
    usage: 'remove @[user] [warnID]',
    example: '@Carl-bot 5e1039097fc9ee968a6a68a606c50bac',
    execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;

        // checks if dev because backdoor
        var allowedToUse = false;
        client.config.ownerID.forEach(id => {
            if (msg.author.id == id)
                allowedToUse = true;
        });

        if (!msg.member.hasPermission('KICK_MEMBERS') || !allowedToUse) return msg.lineReply("Who the fuck are you? Get a manager for this one, sweetie")

        // defines mentioned person
        let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

        if (msg.guild.members.cache.get(msg.author.id).roles.highest.comparePositionTo(member.roles.highest) < 0 && !allowedToUse) return msg.lineReply("employees cannot do this to their own managers you half brained imbecile")

        // defines filter, basically checks if the correct person is replying
        const filter = m => m.author.id === msg.author.id;

        if (!member) return msg.lineReply("Please mention a valid member of this server");

        if (args[1] == undefined) return msg.lineReply("Wheres the warn ID?? It is the large letter and number combination stupid ass.")

        axios({
            "method": "DELETE",
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
            "params": {
                "id": member.id,
                "warnID": args[1],
                "guild": msg.guild.id
            }
        }).then(res => {
            msg.react("✅")
            if (settingsmap.get(member.guild.id).modLogEnabled == false) return

            const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
            if (!modLogChannelConst) return

            const warnEmbed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle("Warn removed")
                .setDescription(`A warn for <@${member.id}> has been removed`)
                .setThumbnail(member.user.avatarURL())
                .setTimestamp(new Date())
                .addField("Moderator", `<@${msg.author.id}>`)
                .addField("Warn ID", res.data.warnID)

            modLogChannelConst.send({ embed: warnEmbed });
        }).catch(err => {
            msg.react("⛔")
            if (err.response.status == 404) msg.lineReply("That warn doesnt exist stupid ass bitch ass")
            if (err.response.status == 401) msg.lineReply("Umm, excuse me? Do you think I'm a fool?? That warn came from a different guild you stupid ass")
        })
        return
    }
}
