const Discord = require('discord.js')

module.exports = {
  name: ' ',
  description: '',
  type: '',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    let reddit = new Discord.MessageEmbed()
      .setTitle('Reddit commands')
      .setColor(config.color)
      .setDescription('Reddit commands')
      .setThumbnail('https://i.kym-cdn.com/photos/images/newsfeed/000/919/691/9e0.png')
      .addField('New', `Returns the newest posts from a subreddit. Usage:\n${config.prefix}new [subreddit] [number of posts]`)
      .addField('Top', `Returns the top posts from a subreddit. Usage:\n${config.prefix}top [subreddit] [number of posts]`)
      .addField('Random', `Returns a random post from Reddit. Usage:\n${config.prefix}random`)
      .setFooter(`With ❤️ from ${config.creator}`, config.logo)
    msg.channel.send(reddit)
  }
}
