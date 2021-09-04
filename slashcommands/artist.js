const Discord = require('discord.js')

require('dotenv').config()
const Spotify = require('node-spotify-api')

module.exports = {
  name: 'artist',
  description: 'Returns information about an artist from the Spotify API',
  options: [
    {
      "type": 3,
      "name": "artist_to_search",
      "description": "Artist to search",
      "required": true
    }
  ],
  execute(client, interaction) {
    const app = require('../bot.js');
    let config = app.config;
    const axios = require('axios')

    // creates the spotify object.
    // i suspect i culd make it const for the prettier colours...
    // yeah ima do that
    const spotify = new Spotify({
      id: process.env.SPOTIFY_ID,
      secret: process.env.SPOTIFY_SECRET
    });

    // Tries to search
    try {
      spotify
        .search({ type: 'artist', query: interaction.data.options[0].value, limit: '1' })
        .then(action = (response) => {
          // If it doesn't find a resposne, return error
          if (response.artists.items[0] == null) {
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
              type: 4,
              data: {
                content: `Error: No search results for \`${interaction.data.options[0].value}\``,
                flags: 64
              }
            }})
            return
          }
          // idk?
          action.response = response;

          var popularity = response.artists.items[0].popularity / 10;
					const embed = new Discord.MessageEmbed()
					embed.setTitle(response.artists.items[0].name)
					embed.setURL(response.artists.items[0].external_urls.spotify)
					embed.setThumbnail(response.artists.items[0].images[0].url)
					embed.setAuthor('Spotify', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png')
					embed.setColor(config.color)
					embed.addField('Followers', response.artists.items[0].followers.total)
					embed.addField('Monthly popularity', `${response.artists.items[0].popularity}%`)
					var aname = 'Genres'
					if (response.artists.items[0].genres.length != 1 && response.artists.items[0].genres.length != 0) {
							var a = [];
							for (i in response.artists.items[0].genres) {
								a[i] = response.artists.items[0].genres[i].toString().capitalize()
							}
							aname = 'Genres'
							embed.addField(aname, a.join('\n'))
					}
					else {
							if (response.artists.items[0].genres.length == 0) {
								embed.addField(aname, 'Artist hasn\'t defined them yet')
							} else {
								embed.addField(aname, response.artists.items[0].album.genres[0])
							}
					}
					embed.setTimestamp()
          
          client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              embeds: [embed]
            }
          }})
        }).catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }
}
