const Discord = require('discord.js')

module.exports = {
  name: 'esostatus',
  description: 'Gets server status of The Elder Scrolls Online game',
  type: 'Utility',
  args: false,
  usage: 'esostatus',
  example: '',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    const { EsoStatus } = require("@dov118/eso-status");

    EsoStatus.getEsoStatus().then(data => {
      console.log(data.eso_store)
      const esostatusembed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTitle('ESO server status')
        .setDescription('Server status for the Elder Scrolls Online game')
        .setThumbnail('https://cdn.exerra.xyz/files/png/eso.png')
        .setAuthor('Zenimax', 'https://cdn.exerra.xyz/files/png/companies/zenimax/zenimax-small-no_outline.png')
        .addFields(
          { name: 'Store', value: data.eso_store.raw_information },
          { name: 'Accounts', value: data.account_system.raw_information },
          { name: 'PC EU', value: data.pc_eu.raw_information },
          { name: 'PC NA', value: data.pc_na.raw_information },
          { name: 'Public Test Server', value: data.pts.raw_information },
          { name: 'Xbox NA', value: data.xbox_na.raw_information },
          { name: 'Xbox EU', value: data.xbox_eu.raw_information },
          { name: 'PS NA', value: data.ps_na.raw_information },
          { name: 'PS EU', value: data.ps_eu.raw_information },
          { name: 'Website', value: data.site_web.raw_information }
        )
        .setTimestamp()
        .setFooter('Provided by Zenimax')
      

      msg.channel.send(esostatusembed)
    })
  }
}
