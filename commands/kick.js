const Discord = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user',
    type: 'Moderation',
    args: true,
    usage: '@[user] [reason]',
    example: "391878815263096833 spamming",
    async execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;
        if (msg.member.hasPermission('KICK_MEMBERS')) {

            let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

            if (!member)
                return msg.reply("Please mention a valid member of this server");

                if (!member.kickable)
                return msg.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

            let reason = args.slice(1).join(' ');
            if (!reason) reason = "No reason provided";

            await member.send(`onmg AHahaHAHahaAHAHAHAHA im wheezing rn you got kicked from ${msg.guild.name} (id: ${msg.guild.id}) for ${reason}. thats what you get you devil! REPEL THE DEMONS! UNBLOW!!! YOU ARE DESTROYED FOREVER!!! AND YOU WILL NEVER BE BACK!!!! thank you god... let it happen... cause it to happen`)
            await member.send('https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/04/05/16/kenneth-copeland-blow-coronavirus.png?width=1200')

            await member.kick(reason)
                .catch(error => msg.reply(`Sorry ${msg.author} I couldn't kick because of : ${error}`));
            const kickMessage = {
                title: `Member kicked`,
                description: `${member.user.tag} has been kicked`,
                thumbnail: {
                    url: member.user.avatarURL(),
                },
                color: `${config.colordecimal}`,
                footer: {
                    text: `Author - ${config.creator}`,
                    icon_url: `${config.logo}`
                },
                "fields": [
                    {
                        "name": `Member`,
                        "value": `${member.user.tag}`,
                        "inline": false
                    },
                    {
                        "name": `Moderator`,
                        "value": `${msg.author.tag}`,
                        "inline": false
                    },
                    {
                        "name": `Reason`,
                        "value": `${reason}`,
                        "inline": false
                    }
                ]
            };
            msg.channel.send({ embed: kickMessage });
            console.log(member)
            if (settingsmap.get(member.guild.id).modLogEnabled == false) return
            const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
            if (!modLogChannelConst) return;
            modLogChannelConst.send({ embed: kickMessage });
        } else return msg.reply("Sorry, you don't have permissions to use this!");
    }
}
