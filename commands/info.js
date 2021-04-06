const Discord = require('discord.js')

module.exports = {
  name: 'info',
  description: 'Returns a bit of info about a mentioned user',
  type: 'Utility',
  args: true,
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    let member = msg.mentions.users.first();
    console.log(member)
    if(member == undefined) {
      let embed = new Discord.MessageEmbed()
        .setTitle(msg.author.username + '\'s Discord profile')
        .setColor(config.color)
        .addField('Discord Name', msg.author.tag)
        .addField('Join date', msg.author.createdAt)
        .addField('Last sent message ID', msg.author.lastMessageID)
        .setImage(msg.author.avatarURL())
        .setFooter(`With ❤️ from ${config.creator}`, config.logo)
      msg.channel.send(embed);   
    }
    else {
      let embed = new Discord.MessageEmbed()
        .setTitle(member.username + '\'s Discord profile')
        .setColor(config.color)
        .addField('Discord Name', member.tag)
        .addField('Join date', member.createdAt)
        .addField('Last sent message ID', member.lastMessageID)
        .setImage(member.avatarURL())
        .setFooter(`With ❤️ from ${config.creator}`, config.logo)
      msg.channel.send(embed);   
    }
  }
}
