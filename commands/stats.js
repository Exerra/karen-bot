const Discord = require('discord.js')
const os = require('os')
const moment = require('moment')
require('moment-duration-format')

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
    const info = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTitle('Server Info')
			.setAuthor(`NodeJS ${require('child_process').execSync('node -v').toString()}`, 'https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png')
			.addFields(
        { name: 'CPU', value: `${os.cpus()[0].model}`, inline: false },
        { name: 'Mem Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`, inline: true },
        { name: 'Free Mem', value: `${(os.freemem() / 1024 / 1024).toFixed(1)} MB`, inline: true },
        { name: 'Uptime', value: `${moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]")}`, inline: true },
        { name: 'Users', value: `${memberCount}`, inline: true },
        { name: 'Servers', value: `${guildCount}`, inline: true },
        { name: 'Channels', value: `${channelCount}`, inline: true },
        { name: 'Discord.js', value: Discord.version, inline: true },
        { name: 'Node', value: `${process.version}`, inline: true },
        { name: 'OS', value: `${os.type()}`, inline: true },
			)
      .setThumbnail('https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png')
			.setFooter('Shard time', 'https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png')
      .setTimestamp()
		msg.channel.send(info)
    
  }
}
