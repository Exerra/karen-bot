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

    const ignoreError = () => { return true }

    let guild = client.guilds.cache.get(interaction.guild_id)
    var member = guild.members.cache.find(user => user.id === interaction.member.user.id)
    var member2 = client.users.cache.find(user => user.id === interaction.member.user.id)

	  client.api.interactions(interaction.id, interaction.token).callback.post({data: {
	      type: 4,
	      data: {
	        content: 'You fucking imbecile.\nYou dared to type this command. Shame on you. Wheres your manager? Where is he?\n\nOh so now your manager isn\'t here somehow. Let me tell you something sweetie, managers *have* to be in work managing the store, so you\'re lying. Your bitch ass ding dong brain really lied. I will tell the CEO of this! I know him1!!!',
	        flags: 64
	      }
	    }})
	  return

    member2.send(`fuck you. thats what you get you devil! REPEL THE DEMONS! UNBLOW!!! YOU ARE DESTROYED FOREVER!!! AND YOU WILL NEVER BE BACK!!!! thank you god... let it happen... cause it to happen`).catch(() => ignoreError())
    member2.send('https://cdn.exerra.xyz/png/kenneth_copeland.png').catch(() => ignoreError())
    setTimeout(() => {
      member.kick("fuck them")
    }, 2000)
  }
}
