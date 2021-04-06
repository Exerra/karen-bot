const Discord = require('discord.js')

module.exports = {
  name: 'picture',
  description: 'Returns a mentioned users picture',
  type: 'Search',
  args: true,
  usage: '@[user]',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    let member = msg.mentions.users.first();
    if (member == undefined) msg.reply('Please tell me which profile picture to get.');
    else {
        let embed = new Discord.MessageEmbed()
        .setTitle(member.username + '\'s profile picture.')
        .setColor(config.color)
        .setImage(member.avatarURL({ dynamic: true }))
        .setFooter(`With ❤️ from ${config.creator}`, config.logo)
        msg.channel.send(embed);
    }
  }
}
