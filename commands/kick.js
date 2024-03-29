const Discord = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user',
    type: 'Moderation',
    args: true,
    aliases: ['k'],
    usage: '@[user] [reason]',
    example: "391878815263096833 spamming",
    permissions: ["KICK_MEMBERS"],
    async execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;

        const ignoreError = () => { return true }

        let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

        if (!member)
            return msg.reply("Why can't no one mention a valid member of this guild??");

            if (!member.kickable)
            return msg.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        await member.send(`onmg AHahaHAHahaAHAHAHAHA im wheezing rn you got kicked from ${msg.guild.name} (id: ${msg.guild.id}) for ${reason}. thats what you get you devil! REPEL THE DEMONS! UNBLOW!!! YOU ARE DESTROYED FOREVER!!! AND YOU WILL NEVER BE BACK!!!! thank you god... let it happen... cause it to happen`).catch(() => ignoreError())
        await member.send('https://cdn.exerra.xyz/png/kenneth_copeland.png').catch(() => ignoreError())

        await member.kick(reason)
            .catch(error => msg.reply(`Sorry ${msg.author} I couldn't kick because of : ${error}`));
        const kickMessage = {
            title: `Member kicked`,
            description: `${member.user.tag} has been kicked`,
            thumbnail: {
                url: member.user.avatarURL(),
            },
            color: `${config.colordecimal}`,
            timestamp: new Date(),
            "fields": [
                {
                    "name": `Member`,
                    "value": `<@${member.user.id}>`,
                    "inline": false
                },
                {
                    "name": `Moderator`,
                    "value": `<@${msg.author.id}>`,
                    "inline": false
                },
                {
                    "name": `Reason`,
                    "value": `${reason}`,
                    "inline": false
                }
            ]
        };
        console.log(member)
        if (settingsmap.get(member.guild.id).modLogEnabled == false) return msg.channel.send({ embed: kickMessage });

        const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
        if (!modLogChannelConst) return msg.channel.send({ embed: kickMessage });

        modLogChannelConst.send({ embed: kickMessage });
        msg.react("✅")
    }
}
