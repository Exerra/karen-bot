/*
  This module features code required to serve auto embeds.
  Currently it offers two service embeds

  1) Spotify
    - Songs
    - Albums
    - Playlists

  2) Brew.sh
    - Formulae

  TODO: Add Albums to Spotify and add Casks to Brew.sh
  
  - Written on 2021-08-20 by Exerra
*/

const Spotify = require('node-spotify-api')
const { matchRegex } = require('./regex.js')
const axios = require('axios')
const Discord = require('discord.js')
const app = require("../bot.js");

const autoEmbeds = (msg) => {
  // GARBAGE CODE
  const spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  // Args thing for the {{thing}}
  const foundargs = msg.content.split(" ")
  var found = [],          // an array to collect the strings that are found
    rxp = /{{([^}]+)}}/g,
    str = msg,
    curMatch;

  while( curMatch = rxp.exec( str ) ) {
    found.push( curMatch[1].toLowerCase() );
  }

  const spotargs = msg.content.split(" ");

  if (matchRegex(/https:\/\/open\.spotify\.com\/track\//, spotargs[0])) {
    if (!settingsmap.get(msg.guild.id).autoSpotifyEmbed) return
    spotify
      .request(`https://api.spotify.com/v1/tracks/${spotargs[0].substr(31)}`)
      .then(function(data) {
        if (!data.album) return;
        const embed = new Discord.MessageEmbed()
        embed.setTitle(data.name)
        embed.setURL(data.external_urls.spotify)
        embed.setThumbnail(data.album.images[0].url)
        embed.setAuthor('Spotify Song', 'https://cdn.exerra.xyz/png/companies/spotify/240px-Spotify_logo_without_text.png')
        embed.setColor(app.config.color)
        embed.addField('Monthly popularity', `${data.popularity}%`)
        embed.addField('Album name', data.album.name)
        embed.addField('Album Type', data.album.album_type.capitalize())
        // thanks to @levichlev for making this thingy
        // i forgot about "for" loops (i dont really know why) when making this and was stumped on how to make it nicer if there are multiple artists :)
        var aname = 'Artist\'s name'
        if (data.album.artists.length != 1) {
            var a = [];
            for (i in data.album.artists) {
                a[i] = data.album.artists[i].name;
            }
            aname = 'Artist\'s names'
            embed.addField(aname, a.join('\n'))
        } else {
            embed.addField(aname, data.album.artists[0].name)
        }
        embed.addField('Release Date', data.album.release_date + '\n(Year-Month-Day)', true)
        embed.setTimestamp()
        embed.setFooter(`Triggered by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
        msg.delete()
        msg.channel.send(embed)
      })
      .catch(function(err) {
        console.log('eror tiem' + err)
      });
  } else if (matchRegex(/https:\/\/open\.spotify\.com\/artist\//, spotargs[0])) {
    if (!settingsmap.get(msg.guild.id).autoSpotifyEmbed) return
    spotify
      .request(`https://api.spotify.com/v1/artists/${spotargs[0].substr(32)}`)
      .then(function(data) {
        var popularity = data.popularity / 10;
        const embed = new Discord.MessageEmbed()
        embed.setTitle(data.name)
        embed.setURL(data.external_urls.spotify)
        embed.setThumbnail(data.images[0].url)
        embed.setAuthor('Spotify Artist', 'https://cdn.exerra.xyz/png/companies/spotify/240px-Spotify_logo_without_text.png')
        embed.setColor(app.config.color)
        embed.addField('Followers', data.followers.total)
        embed.addField('Monthly popularity', `${data.popularity}%`)
        var aname = 'Genres'
        if (data.genres.length != 1) {
          var a = [];
          for (i in data.genres) {
            a[i] = data.genres[i].toString().capitalize()
          }
          aname = 'Genres'
          embed.addField(aname, a.join('\n'))
        }
        else {
          embed.addField(aname, data.album.genres[0])
        }
        embed.setTimestamp()
        embed.setFooter(`Triggered by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
        return msg.channel.send(embed)


        .catch(function (err) {
          console.error('Error occurred: ' + err);
        });
      })
      .catch(err => {

      })
  } else if (matchRegex(/https:\/\/open\.spotify\.com\/playlist\//, spotargs[0])) {
    if (!settingsmap.get(msg.guild.id).autoSpotifyEmbed) return
    spotify
      .request(`https://api.spotify.com/v1/playlists/${spotargs[0].substr(34)}?total=1`)
      .then(function(data) {
        const embed = new Discord.MessageEmbed()
        embed.setTitle(data.name)
        embed.setURL(data.external_urls.spotify)
        embed.setThumbnail(data.images[0].url)
        embed.setAuthor('Spotify Playlist', 'https://cdn.exerra.xyz/png/companies/spotify/240px-Spotify_logo_without_text.png')
        embed.setColor(app.config.color)
        embed.addField('Owner', `[${data.owner.display_name}](${data.owner.external_urls.spotify})`)
        embed.addField('Followers', data.followers.total)
        embed.addField('Song count', data.tracks.total)
        embed.addField('Collaborative', data.collaborative.toString().capitalize())
        embed.addField('Public', data.public.toString().capitalize())

        embed.setTimestamp()
        embed.setFooter(`Triggered by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))

        msg.channel.send(embed)

      })
  }

  /*
    TODO: Finish this brew search; Finish the brew search settings; Tidy up code; Remove brew.js
  */
  
  // If it found something, continue
  if (found !== []) {
    // If the brewSearch setting is turned off, return
    if (!settingsmap.get(msg.guild.id).brewSearch) return

    for (let i in found) {
      // Call the API
      axios.get(`https://formulae.brew.sh/api/formula/${found[i]}.json`).then(res => {
        let data = res.data
        // Testing stuff, delyeet later
        const embed = new Discord.MessageEmbed()
          .setColor("FFA743")
          .setTitle(data.name)
          .setURL(`https://formulae.brew.sh/formula/${data.name}`)
          .setThumbnail('https://brew.sh/assets/img/homebrew-256x256.png')
          .setDescription(data.desc)
          .setAuthor('brew.sh')
          .addFields(
            { name: `Stable version`, value: data.versions.stable, inline: true },
            { name: "License", value: data.license, inline: true }
          )
          // Check if the bottle files are longer than 1
          // Theyre needed to check compability
          if (data.bottle.stable.files.length != 1) {
            // Gets the keys in the API responses object
            var compabilityItems = Object.keys(data.bottle.stable.files)
            // Testing stuff

            // Function to set compability item, makes the switch statement easier to type && less cluttered
            const setCompabilityItem = (item, value) => {
              compabilityItems[item] = value
            }

            // For each item in the compabilityItems array, check the value and make it more human
            for (let i in compabilityItems) {
              switch(compabilityItems[i]) {
                case 'all':
                  setCompabilityItem(i, 'All macOS and Linux systems')
                  break;
                case 'arm64_monterey':
                  setCompabilityItem(i, 'Apple Silicon Monterey')
                  break;
                case 'monterey':
                  setCompabilityItem(i, 'Intel Monterey')
                  break;
                case 'arm64_big_sur':
                  setCompabilityItem(i, 'Apple Silicon Big Sur')
                  break;
                case 'big_sur':
                  setCompabilityItem(i, 'Intel Big Sur')
                  break;
                case 'catalina':
                  setCompabilityItem(i, 'Intel Catalina')
                  break;
                case 'mojave':
                  setCompabilityItem(i, 'Intel Mojave')
                  break;
                case 'high_sierra':
                  setCompabilityItem(i, 'Intel High Sierra')
                  break;
                case 'sierra':
                  setCompabilityItem(i, 'Intel Sierra')
                  break;
                case 'el_capitan':
                  setCompabilityItem(i, 'Intel El Capitan')
                  break;
                case 'yosemite':
                  setCompabilityItem(i, 'Intel Yosemite')
                  break;
                case 'mavericks':
                  setCompabilityItem(i, 'Intel Mavericks')
                  break;
                case 'x86_64_linux':
                  setCompabilityItem(i, 'x86_64 Linux')
                  break;
              }
            }
            // Add the compability items in a field
            embed.addField("Compability", compabilityItems.join('\n'))
          } else {
            let compabilityItems = Object.keys(data.bottle.stable.files)
              embed.addField("Compability", compabilityItems[0])
          }

          // Checks if outdated, disabled and deprecated is true
          // If it is true, then it adds the field, but if it isn't, it doesn't because it looks ugly
          if (data.outdated == true) embed.addField('Outdated?', data.outdated.toString())
          if (data.disabled == true) embed.addField('Disabled?', data.outdated.toString())
          if (data.deprecated == true) {
            embed.addField('Deprecated?', data.deprecated.toString())
            embed.addField('Date of deprecation', data.deprecated_date, true)
            embed.addField('Reason for deprecation', data.deprecated_reason, true)
          }
          // Total amount of downloads
          embed
            .addFields(
              { name: "Downloads (30d)", value: data.analytics.install['30d'][Object.keys(data.analytics.install['30d'])[0]], inline: true },
              { name: "Downloads (365d)", value: data.analytics.install['365d'][Object.keys(data.analytics.install['365d'])[0]], inline: true }
            )
            .setFooter(`Requested by ${msg.author.username} • Generated at ${data.generated_date}`, msg.author.avatarURL({ dynamic: true }))

          // Ofc, send the message when we're done
          msg.channel.send(embed)
      }, error => {
        // just return
        return
      })
    }
  }
}

exports.autoEmbeds = autoEmbeds