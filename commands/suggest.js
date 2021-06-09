const Discord = require('discord.js')
const axios = require('axios')

module.exports = {
  name: 'suggest',
  description: 'Suggest a feature, bug fix or a modification to a command',
  type: '',
  alias: ['suggestion', 'idea', 'bug', 'bugfix', 'bug-fix'],
  args: true,
  usage: '[suggestion]',
  example: 'create a web dashboard',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    // defines stuff
    args[0] = args.join(' ')
    args[0] = args[0].substring(0)

    // if no suggestion, return and send warning
    if (args[0] == undefined) return msg.channel.send('No suggestion provided')

    // makes embed
    const suggestEmbed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setTitle('Suggestion sent')
      .setDescription(args[0])
    msg.channel.send(suggestEmbed)

    // sends webhook
    axios.post(process.env.SUGGESTION_WEBHOOK, {
        "content": args[0],
        "embeds": null,
        "username": `${msg.author.tag} (${msg.author.id})`,
        "avatar_url": msg.author.avatarURL({ dynamic: true })
    })
  }
}
