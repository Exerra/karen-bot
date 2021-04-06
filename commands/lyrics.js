const Discord = require('discord.js')
const lyricsParse = require('lyrics-parse');

module.exports = {
  name: 'lyrics',
  description: 'Returns lyrics for a song',
  type: 'Search',
  args: true,
  usage: '[song]',
  example: 'Break my heart',
  async execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    if (args[0] == null) args[0] = "You need to put in a song!"
    args = args.join(' ')

    // awaits lyrics
    const lyrics = await lyricsParse(args);  

    // If the lyrics are found, send them, otherwise log "No Lyrics Found."
    try {
        const lyricEmbed = new Discord.MessageEmbed()
        lyricEmbed.setColor(config.color)
        lyricEmbed.setAuthor('lyrics-parse')
        lyricEmbed.setTitle('Lyrics')
        lyricEmbed.setDescription(lyrics)
        lyricEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
        msg.channel.send(lyricEmbed)
    } catch (err) {
        msg.channel.send('Error: Lyrics exceed 2048 characters')
    }
  }
}
