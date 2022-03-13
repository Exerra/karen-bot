const Discord = require('discord.js')
const Spotify = require('node-spotify-api');
/* const app = require('../bot.js'); */
require('dotenv').config()

module.exports = {
  name: 'artist',
  description: 'Returns information about an artist from the Spotify API',
  type: 'Search',
  cooldown: 5,
  args: true,
  usage: '[artist name]',
  example: 'Dua Lipa',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    args[0] = args.join(' ')
    args[0] = args[0].substring(0)
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    /* String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    } */

    try {
        spotify
            .search({ type: 'artist', query: args[0], limit: '1' })
            .then(action = (response) => {
                if (response.artists.items[0] == null) return msg.channel.send(`Error: No search results for \`${args[0]}\``)
                action.response = response;
                
                var popularity = response.artists.items[0].popularity / 10;
                const embed = new Discord.MessageEmbed()
                embed.setTitle(response.artists.items[0].name)
                embed.setURL(response.artists.items[0].external_urls.spotify)
                embed.setThumbnail(response.artists.items[0].images[0].url)
                embed.setAuthor('Spotify', 'https://cdn.exerra.xyz/png/companies/spotify/240px-Spotify_logo_without_text.png')
                embed.setColor(config.color)
                embed.addField('Followers', response.artists.items[0].followers.total)
                embed.addField('Monthly popularity', `${response.artists.items[0].popularity}%`)
                var aname = 'Genres'
                console.log(response.artists.items[0])
                if (response.artists.items[0].genres.length != 0) {
                    var a = [];
                    for (i in response.artists.items[0].genres) {
                        a[i] = response.artists.items[0].genres[i].toString().capitalize()
                    }
                    aname = 'Genres'
                    embed.addField(aname, a.join('\n'))
                } else {
                    if (response.artists.items[0].genres.length == 0) {
                        embed.addField(aname, 'Artist hasn\'t defined them yet')
                    }
                }
                embed.setTimestamp()
                return msg.channel.send(embed)
            })
    } catch (err) {
        msg.channel.send(err)
    }
  }
}
