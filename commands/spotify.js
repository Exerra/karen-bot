const Discord = require('discord.js')
const Spotify = require('node-spotify-api')
require('dotenv').config()

module.exports = {
  name: 'spotify',
  description: 'Searches a song and returns Popularity, Album name, Album type, Artist name(s) and Release date',
  type: 'Search',
  args: true,
  usage: '[song]',
  example: 'Break my heart',
  aliases: ['song'],
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    args[0] = args.join(' ')
    args[0] = args[0].substring(0)
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

/*     String.prototype.capitalize = () => {
      return this.charAt(0).toUpperCase() + this.slice(1);
    } */

    try {
        spotify
            .search({ type: 'track', query: args[0], limit: '1' })
            .then(function action(response) {
                if (response.tracks.items[0] == null) return msg.channel.send(`Error: No search results for \`${args[0]}\``)
                action.response = response;
                msg.channel.send(`:compass: Looking up \`${args[0]}\``).then(async (msg) => {
                    var popularity = response.tracks.items[0].popularity / 10;
                    const embed = new Discord.MessageEmbed()
                    embed.setTitle(response.tracks.items[0].name)
                    embed.setURL(response.tracks.items[0].external_urls.spotify)
                    embed.setThumbnail(response.tracks.items[0].album.images[0].url)
                    embed.setAuthor('Spotify', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/240px-Spotify_logo_without_text.svg.png')
                    embed.setColor(config.color)
                    embed.addField('Popularity', `${Math.trunc(response.tracks.items[0].popularity / 10)} / 10`)
                    embed.addField('Album name', response.tracks.items[0].album.name)
                    embed.addField('Album Type', response.tracks.items[0].album.album_type.capitalize())
                    var aname = 'Artist\'s name'
                    if (response.tracks.items[0].album.artists.length != 1) {
                        var a = [];
                        for (i in response.tracks.items[0].album.artists) {
                            a[i] = response.tracks.items[0].album.artists[i].name;
                        }
                        aname = 'Artist\'s names'
                        embed.addField(aname, a.join('\n'))
                    }
                    else {
                        embed.addField(aname, response.tracks.items[0].album.artists[0].name)
                    }
                    embed.addField('Release Date', response.tracks.items[0].album.release_date + '\n(Year-Month-Day)', true)
                    embed.setTimestamp()
                    return msg.edit('Here you go!').then(() => { msg.edit(embed) })


                        .catch(function (err) {
                            console.error('Error occurred: ' + err);
                        });

                })
            })
    } catch (err) {
        msg.channel.send(err)
    }
  }
}
