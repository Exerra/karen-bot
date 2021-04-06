const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'creator',
  description: 'Gets information about the creator of Karen Bot',
  type: 'Search',
  async execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    // Fetches the API
    const apiExerra = await (await fetch(`https://api.exerra.xyz/users/Exerra/stats.json`)).json()

    // Constants
    const exerraLanguageEmbed = new Discord.MessageEmbed()
    const exerraServiceEmbed = new Discord.MessageEmbed()
    const exerraExperienceEmbed = new Discord.MessageEmbed()

    // Language Embed
    exerraLanguageEmbed.setTitle(`${apiExerra.name} (Exerra)`)
    exerraLanguageEmbed.setURL('https://exerra.xyz')
    exerraLanguageEmbed.setColor(config.color)
    exerraLanguageEmbed.setTimestamp()
    exerraLanguageEmbed.setDescription(apiExerra.aboutme)
    exerraLanguageEmbed.addField('Known Languages', apiExerra.skills)
    exerraLanguageEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)

    // Services embed
    exerraServiceEmbed.setTitle(`${apiExerra.name}'s Services`)
    exerraServiceEmbed.setColor(config.color)
    exerraServiceEmbed.setTimestamp()
    exerraServiceEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
    if (apiExerra.services.length != 1) {
      var sname
      var s
      for (i in apiExerra.services) {
          sname = apiExerra.services[i].name
          s = apiExerra.services[i].description
          exerraServiceEmbed.addField(`${sname}`, s)
      }
    }
    else {
      exerraServiceEmbed.addField(apiExerra.services[0].name, apiExerra.services[0].description)
    }

    // Experience Embed
    exerraExperienceEmbed.setTitle(`${apiExerra.name}'s Experience`)
    exerraExperienceEmbed.setColor(config.color)
    exerraExperienceEmbed.setTimestamp()
    exerraExperienceEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
    if (apiExerra.experience.length != 1) {
        var eactive
        var eyear
        var ename
        var e
        for (i in apiExerra.experience) {
            eactive = apiExerra.experience[i].active
            eyear = apiExerra.experience[i].year
            ename = apiExerra.experience[i].name
            e = apiExerra.experience[i].description
            exerraExperienceEmbed.addField(`${eyear} - ${ename}`, e)
        }
    }
    else {
      exerraExperienceEmbed.addField(`${apiExerra.experience[0].year} - ${apiExerra.experience[0].name}`, apiExerra.experience[0].description)
    }

    // Sends embeds
    msg.channel.send(exerraLanguageEmbed && exerraServiceEmbed && exerraExperienceEmbed)
    msg.channel.send(exerraServiceEmbed)
    msg.channel.send(exerraExperienceEmbed)
  }
}
