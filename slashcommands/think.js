const Discord = require('discord.js')

module.exports = {
  name: 'think',
  description: 'Make Karen finally think',
  execute(client, interaction) {
    const app = require('../bot.js');
    let config = app.config;
    const axios = require('axios')

    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 5,
      data: {
        content: 'huh'
      }
    }})
  }
}
