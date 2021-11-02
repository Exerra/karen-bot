const Discord = require('discord.js')
const fs = require('fs')
const MusicKitClass = require("node-musickit-api")
require('dotenv').config()

var MusicKit = new MusicKitClass({
  key: process.env.MUSICKITKEY.replace(/\\n/g, '\n').toString(),
  teamId: process.env.MUSICKITTEAMID,
  keyId: process.env.MUSICKITKEYID
})

module.exports = {
  name: 'applemusic',
  description: 'apple music comd',
  type: 'music',
  args: false,
  aliases: ["a"],
  usage: '',
  example: '',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;

    args[0] = args.join(' ')
    args[0] = args[0].substring(0)

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if(result){
          var r= parseInt(result[1], 16);
          var g= parseInt(result[2], 16);
          var b= parseInt(result[3], 16);
          return [r,g,b];//return 23,14,45 -> reformat if needed 
      } 
      return null;
    }

    function millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    MusicKit.search("lv", ["songs", "artists"], args[0], (err, res) => {
      if (err) {
        console.log(err.response.data)
        console.log(err.response.data.errors[0].source)
        return
      }

      let data = res.results.songs.data
      console.log(data[0].attributes.artwork.url.replace(/\{.}/g, '256'))

      console.log(hexToRgb(data[0].attributes.artwork.bgColor))

      const embed = new Discord.MessageEmbed()
        .setAuthor('Apple Music')
        .setColor(hexToRgb(data[0].attributes.artwork.bgColor))
        .setThumbnail(data[0].attributes.artwork.url.replace(/\{.}/g, '256'))
        .setTitle(data[0].attributes.name)
        .setURL(data[0].attributes.url)
        .addField('Duration', millisToMinutesAndSeconds(data[0].attributes.durationInMillis), true)
        .addField('Lyrics?', data[0].attributes.hasLyrics.toString(), true)
        .addField('Album name', data[0].attributes.albumName)
        .addField('Artist name', data[0].attributes.artistName)
        .addField("Genres", data[0].attributes.genreNames.filter(e => e !== 'Music').join('\n'))
        .setFooter('Released at')
        .setTimestamp(data[0].attributes.releaseDate)
      
      msg.channel.send(embed)
    }, 1)

    /* MusicKit
      .searchSong("lv", "1444996259", (err, res) => {
        if (err) return console.log(err)
        let data = res.data
        console.log(data[0].attributes.artwork.url.replace(/\{.}/g, '256'))

        console.log(hexToRgb(data[0].attributes.artwork.bgColor))

        const embed = new Discord.MessageEmbed()
          .setColor(hexToRgb(data[0].attributes.artwork.bgColor))
          .setThumbnail(data[0].attributes.artwork.url.replace(/\{.}/g, '256'))
          .setTitle(data[0].attributes.name)

        msg.channel.send(embed)
        fs.writeFileSync('applemusic.json', JSON.stringify(data,0,4))
      }) */
  }
}
