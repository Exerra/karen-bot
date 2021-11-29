const Discord = require('discord.js')

module.exports = {
  name: 'invite',
  description: 'Returns an invite link for Karen Bot',
  type: 'Utility',
  args: false,
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;

    msg.channel.send('https://discord.com/oauth2/authorize?client_id=914834579465052210&scope=applications.commands%20bot&permissions=8')
  }
}
