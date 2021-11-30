const Discord = require('discord.js')
const Spotify = require('node-spotify-api')
require('dotenv').config()

module.exports = {
  name: 'song',
  description: 'Searches a song and returns Popularity, Album name, Album type, Artist name(s) and Release date',
  type: 'Search',
  args: true,
  usage: '[song]',
  example: 'Break my heart',
  aliases: ['spotify'],
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    // defines some funky args stuff
    args[0] = args.join(' ')
    args[0] = args[0].substring(0)

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
            .search({ type: 'track', query: args[0], limit: '1' })
            .then(action = (response) => {
                // If it doesn't find a response, return error
                if (response.tracks.items[0] == null) return msg.channel.send(`Error: No search results for \`${args[0]}\``)
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
                return msg.channel.send(embed), msg.channel.stopTyping()
            })
    } catch (err) {
        msg.channel.send(err)
    }
  }
}
