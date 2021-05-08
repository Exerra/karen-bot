const Discord = require('discord.js')

module.exports = {
  name: 'ban',
  description: 'Bans a mentioned user',
  type: 'Moderation',
  args: true,
  async execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    if (msg.member.hasPermission('BAN_MEMBERS')) {
        let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
        if (!member) return msg.reply("Please mention a valid member of this server");
        if (!member.bannable) return msg.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
        
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        // Time for public humiliation
        await member.ban({reason})
            .catch(error => msg.reply(`Sorry ${msg.author} I couldn't ban because of : ${error}`));
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
