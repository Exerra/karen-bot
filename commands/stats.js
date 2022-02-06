const Discord = require('discord.js')
const os = require('os')
const moment = require('moment')
const exec = require('child_process').execSync
require('moment-duration-format')
const axios = require("axios");

const format = (seconds) => {
    const pad = (s) => {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);

    return `${pad(hours)}hrs, ${pad(minutes)}min, ${pad(seconds)}s`

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}




module.exports = {
  name: 'stats',
  description: '',
  type: 'Private',
  permissionsLevel: 'Bot Owner',
  async execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    const guildCount = (await client.shard.fetchClientValues('guilds.cache.size')).reduce((prev, val) => prev + val, 0)
    const memberCount = (await client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')).reduce((prev, val) => prev + val, 0)
    const channelCount = (await client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.channels.cache.size, 0)')).reduce((prev, val) => prev + val, 0)
    const phishingLinks = (await axios.get(`${process.env.API_SERVER}/scam/stats`)).data.links
      let osImageURL = ""
      let osName = exec("uname")

      switch (true) {
          case /Darwin/.test(osName):
              osImageURL = "https://cdn.exerra.xyz/png/companies/apple/macOS.png"
              break;
          case /Ubuntu/.test(osName):
              osImageURL = "https://cdn.exerra.xyz/png/companies/canonical/ubuntu_transparent.png"
              break;
          case /Linux/.test(osName):
              osImageURL = "https://cdn.exerra.xyz/png/companies/linux/tux_transparent.png"
              break;
          case /Windows/.test(osName):
              osImageURL = "https://cdn.exerra.xyz/png/companies/microsoft/windows_2012.png"
              break;
      }

    const info = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTitle('Server Info')
        .setAuthor(`NodeJS ${require('child_process').execSync('node -v').toString()}`, 'https://cdn.exerra.xyz/png/nodejs/1162x1280.png')
        .addFields(
            { name: 'CPU', value: `${os.cpus()[0].model == "DO-Regular" ? "Shared 1 vCPU" : os.cpus()[0].model}`, inline: false },
            { name: 'Mem Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`, inline: true },
            { name: 'Free Mem', value: `${(os.freemem() / 1024 / 1024).toFixed(1)} MB`, inline: true },
            { name: 'Uptime', value: `${moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]")}`, inline: true },
            { name: 'Users', value: `${memberCount}`, inline: true },
            { name: 'Servers', value: `${guildCount}`, inline: true },
            { name: 'Channels', value: `${channelCount}`, inline: true },
            { name: 'Discord.js', value: Discord.version, inline: true },
            { name: 'OS', value: osName, inline: true },
            { name: 'Phishing links', value: phishingLinks, inline: true },
        )
        .setThumbnail(osImageURL)
        .setFooter(`Server uptime - ${format(os.uptime())}`)
        .setTimestamp()


        msg.channel.send(info)

  }
}
