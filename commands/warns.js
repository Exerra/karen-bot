const Discord = require('discord.js')
const fs = require('fs')
const axios = require("axios");
const app = require("../bot.js");
const disbut = require('discord-buttons');
const {serverFunc} = require("../modules/serverFunc");

module.exports = {
    name: 'warns',
    description: 'Show user warns',
    type: 'Moderation',
    args: true,
    usage: '@[user]',
    example: '@Carl-bot',
    apiData: {
        usesAnAPI: true,
        listOfAPIs: [
            "exerre"
        ]
    },
    execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;

        // defines mentioned person
        let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

        if (!member) return msg.lineReply("Please mention a valid member of this server");

        serverFunc.users.get(member.id, true, true).then(res => {
            let user = res.data
            let warns = res.data.warns
            warns.sort((a, b) => new Date(b.date) - new Date(a.date))
            if (args[1] !== "all") warns = warns.filter(item => item.guild == msg.guild.id);

            const warnEmbed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle(`${args[1] == "all" ? "All warns" : "Guild warns"} for ${user.username}`)
                .setThumbnail(user.avatar.url.png)

            for (let i = 0; i < (warns.length > 5 ? 5 : warns.length); i++) {
                warnEmbed.addField(
                    `${warns[i].id}`,
                    `**Reason:** ${warns[i].reason}
                    **Moderator:** <@${warns[i].moderator}>${args[1] == "all" ? `\n**Guild:** ${warns[i].guild}` : ""}
                    **Date:** <t:${Math.floor(new Date(warns[i].date).getTime() / 1000)}>`
                )
            }

            warnEmbed.setFooter(`Showing ${warns.length > 5 ? 5 : warns.length}/${warns.length} warns`)

            let button = new disbut.MessageButton()
                .setStyle('url')
                .setURL(`https://check.exerra.xyz/warns/${args[1] == "all" ? member.id : `${msg.guild.id}/${member.id}`}`)
                .setLabel(`View all ${args[1] == "all" ? "" : "guild"} warns`)

            client.api.channels(msg.channel.id).messages.post({
                data: {
                    embeds: [warnEmbed],
                    components: [
                        {
                            type: 1,
                            components: [button]
                        }
                    ],
                }
            });
        })
    }
}
