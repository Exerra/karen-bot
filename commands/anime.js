const Discord = require('discord.js')
const Anilist = require('anilist-node')
const anilist = new Anilist()

module.exports = {
  name: 'anime',
  description: 'Returns information about an anime using the Anilist API',
  cooldown: 15,
  args: true,
  usage: '<anime name>',
  example: 'Darling of the Franxx',
  type: 'Search',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    args[0] = args.join(' ')
    if (args[0] == undefined) return msg.channel.send('Ugh, put the anime in there')
    msg.channel.startTyping();
    const run = async () => {
      console.log('yes')
      const search = await anilist.search('anime', args[0])
      if(typeof search.media[0] == 'undefined') return msg.channel.send(`Couldn't find the anime: \`${args[0]}\``)
      const anime = await anilist.media.anime(search.media[0].id)
      const tags = []
      anime.tags.map((tag) => {
        if(!tag.isMediaSpoiler) tags.push(tag.name)
      })
      let animeDescription = anime.description.replace(/<[^>]*>?/gm, '')
      if(animeDescription.length > 1024) {
        animeDescription = `${anime.description.replace(/<[^>]*>?/gm, '').substring(0, 1020)}...`
      }
      if (anime.format == 'MUSIC') return msg.channel.send(`Couldn't find the anime: \`${args[0]}\``)

      const animeEmbed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTitle(anime.title.native || anime.title.romaji || anime.title.english)
        .setURL(anime.siteUrl)
        .setThumbnail(anime.coverImage.large)
        .addField('Score', `${(anime.meanScore / 10).toFixed(1)} / 10`, true)
        .addField('Release Date', `${anime.startDate.month}-${anime.startDate.day}-${anime.startDate.year}\n(Month-Day-Year)`, true)
        .addField('Studio', anime.studios[0].name, true)
        .addField('Genres', anime.genres.join(', '))
        .addField('Description', animeDescription)
        .addField('Tags', tags.join(', '))
        .addField(`Titles`, `**Native:** ${anime.title.native}\n**Romaji:** ${anime.title.romaji}\n**English:** ${anime.title.english}`)
        .setFooter(
          `Requested by: ${msg.author.tag} | Provided by: anilist.co`,
          msg.author.avatarURL({ format: 'png' })
        )
        .setTimestamp()
      msg.channel.send(animeEmbed)
      return msg.channel.stopTyping()
    }
    run()
  }
}
