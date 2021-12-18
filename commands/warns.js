const Discord = require('discord.js')
const fs = require('fs')
const axios = require("axios");
const app = require("../bot.js");

module.exports = {
    name: 'warns',
    description: 'Show user warns',
    type: 'Moderation',
    args: true,
    usage: '@[user]',
    example: '@Carl-bot',
    execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;

        // defines mentioned person
        let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

        if (!member) return msg.lineReply("Please mention a valid member of this server");

        axios.get(`${process.env.API_SERVER}/karen/profile`, {
            headers: {
                "User-Agent": process.env.AUTH_USERAGENT
            },
            params: {
                id: member.id,
                fetchUser: true,
                includeWarns: true
            }
        }).then(res => {
            let user = res.data
            let warns = res.data.warns
            warns.sort((a, b) => new Date(b.date) - new Date(a.date))
            if (args[1] !== "all") warns = warns.filter(item => item.guild == msg.guild.id);

            const warnEmbed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle(`${args[1] == "all" ? "All warns" : "Guild warns"} for ${user.username}`)
                .setThumbnail(user.avatar.url.png)

            for (let i = 0; i < (warns.length > 10 ? 10 : warns.length); i++) {
                warnEmbed.addField(
                    `${warns[i].id}`,
                    `**Reason:** ${warns[i].reason}
                    **Moderator:** <@${warns[i].moderator}>${args[1] == "all" ? `\n**Guild:** ${warns[i].guild}` : ""}
                    **Date:** ${new Date(warns[i].date).toISOString().substring(0, 10)}`
                )
            }
            warnEmbed.setFooter(`Showing ${warns.length > 10 ? 10 : warns.length}/${warns.length} warns`)
            msg.lineReply(warnEmbed)
        })
    }
}
