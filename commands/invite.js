const Discord = require('discord.js')

module.exports = {
  name: 'invite',
  description: 'Returns an invite link for Karen Bot',
  type: 'Utility',
  args: false,
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    client.generateInvite(["ADMINISTRATOR"]).then(l => {
      msg.channel.send(`Invite Link For Karen Bot:\n${l}`)
    })
  }
}
