const Discord = require('discord.js')

module.exports = {
  name: 'say',
  description: 'Say something as Karen Bot',
  options: [
    {
      "type": 3,
      "name": "something_to_say",
      "description": "Its self-explanatory. What do you not understand?",
      "required": true
    }
  ],
  execute(client, interaction) {
    const app = require('../bot.js');
    let config = app.config;
    const axios = require('axios')

    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        content: 'You fucking imbecile.\nYou dared to type this command. Shame on you. Wheres your manager? Where is he?\n\nOh so now your manager isn\'t here somehow. Let me tell you something sweetie, managers *have* to be in work managing the store, so you\'re lying. Your bitch ass ding dong brain really lied. I will tell the CEO of this! I know him1!!!',
        flags: 64
      }
    }})
  }
}
