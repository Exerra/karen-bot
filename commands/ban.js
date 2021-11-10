const Discord = require('discord.js')
//var nsfai = new NSFAI(process.env.NSFAI_KEY);

module.exports = {
    name: 'ban',
    description: 'Bans a mentioned user',
    type: 'Moderation',
    args: true,
    usage: '@[user] [reason]',
    aliases: ['b'],
    example: "391878815263096833 spamming",
    async execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;
        
        const ignoreError = () => { return true }
        
        if (msg.member.hasPermission('BAN_MEMBERS')) {

            // Defines member
            // msg.mentions.members.first() checks if a member is mentioned (e.g "m!ban @Occult")
            // msg.guild.members.cache.get() gets member by ID if a member is not mentioned (e.g "m!ban 391878815263096833") 
            let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
            // If it can't find a user (if an invalid member is mentioned, or an invalid ID is provided), send an error
            if (!member) return msg.reply("Please mention a valid member of this server");
            // If Karen can't ban a user (e.g if Karen's roles are below the person meant to be banned, or if Karen doesn't have permissions), throw an error
            if (!member.bannable) return msg.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
            
            // Define the reason
            let reason = args.slice(1).join(' ');
            // If reason is undefined, make the reason to that
            if (!reason) reason = "No reason provided";

            try {
                await member.send(`onmg AHahaHAHahaAHAHAHAHA im wheezing rn you got banned from ${msg.guild.name} (id: ${msg.guild.id}) for ${reason}. excuse me how the hell did u get banend?? aaaaaanyway... thats what you get you devil! REPEL THE DEMONS! UNBLOW!!! YOU ARE DESTROYED FOREVER!!! AND YOU WILL NEVER BE BACK!!!! thank you god... let it happen... cause it to happen`).catch(() => ignoreError())
                await member.send('https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/04/05/16/kenneth-copeland-blow-coronavirus.png?width=1200').catch(() => ignoreError())
                await member.send('oh and btw 5g causes corona cancer and reptiliioans are hacking our brrains from mars while probing our pets so like you should be saying thanks for getting educated 😒').catch(() => ignoreError())
            } catch (err) {
                //
            }
            // Time for public humiliation
            await member.ban({reason}).catch(error => msg.reply(`Sorry ${msg.author} I couldn't ban because of : ${error}`));
            const embed = {
                title: `Member banned`,
                description: `${member.user.tag} has been banned`,
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

            /*
            const handleResult = (result) => {
                if (result.sfw) {
                    embed.thumbnail = {
                        url: member.user.avatarURL()
                    }
                    return
                } else {
                    embed.thumbnail = {
                        url: "https://media.istockphoto.com/vectors/under-18-sign-warning-symbol-over-18-only-censored-eighteen-age-older-vector-id1217456453?k=20&m=1217456453&s=170667a&w=0&h=Fjz5NovEEW75UON8b4c-roJFCwtYuwPL-EiqyDzbBCg="
                    }
                }
            }
*/
            //nsfai.predict(url).then(handleResult).catch(handleError);

            // Sends ban message in the channel where it got executed
            msg.channel.send({ embed });
            // Checks if modlog is enabled
            if (settingsmap.get(member.guild.id).modLogEnabled == false) return
            // If modlog is enabled then finds the channel by id
            const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
            // If it can't find it then just return
            if (!modLogChannelConst) return;
            // Send embed
            modLogChannelConst.send({ embed });
        }
        else {
            msg.channel.send('Looks like somebody here doesn\'t have ban permissions!')
        }
    }
}
