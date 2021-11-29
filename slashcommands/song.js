const Discord = require('discord.js')

require('dotenv').config()
const Spotify = require('node-spotify-api')
const {log} = require("../modules/log");

module.exports = {
  name: 'song',
  description: 'Searches a song and returns Popularity, Album name, Album type, Artist name(s) and Release date',
  options: [
    {
      "type": 3,
      "name": "song_to_search",
      "description": "Song to search",
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
        .search({ type: 'track', query: interaction.data.options[0].value, limit: '1' })
        .then(action = (response) => {
          // If it doesn't find a resposne, return error
          if (response.tracks.items[0] == null) {
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

          const embed = new Discord.MessageEmbed()
          embed.setTitle(response.tracks.items[0].name)
          embed.setURL(response.tracks.items[0].external_urls.spotify)
          embed.setThumbnail(response.tracks.items[0].album.images[0].url)
          embed.setAuthor('Spotify', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png')
          embed.setColor(config.color)
          embed.addField('Monthly popularity', `${response.tracks.items[0].popularity}%`)
          embed.addField('Album name', response.tracks.items[0].album.name)
          embed.addField('Album Type', response.tracks.items[0].album.album_type.capitalize())

          // thanks to @levichlev for making this thingy
          // i forgot about "for" loops (i dont really know why) when making this and was stumped on how to make it nicer if there are multiple artists :)
          var aname = 'Artist\'s name'
          if (response.tracks.items[0].album.artists.length != 1) {
              var a = [];
              for (i in response.tracks.items[0].album.artists) {
                  a[i] = response.tracks.items[0].album.artists[i].name;
              }
              aname = 'Artist\'s names'
              embed.addField(aname, a.join('\n'))
          } else {
              embed.addField(aname, response.tracks.items[0].album.artists[0].name)
          }

          embed.addField('Release Date', response.tracks.items[0].album.release_date + '\n(Year-Month-Day)', true)
          embed.setTimestamp()
          
          client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              embeds: [embed]
            }
          }})
        }).catch(err => {
          log(err, "error")
        })
    } catch (err) {
        log(err, "error")
    }
  }
}
