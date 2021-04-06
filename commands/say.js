const Discord = require('discord.js')

module.exports = {
  name: 'say',
  description: 'Say a message',
  type: 'Moderation',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    if (msg.member.hasPermission('MANAGE_MESSAGES')) {
      const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const sayMessage = args.join(" ");
      msg.delete().catch(O_o => { });
      msg.channel.send(sayMessage);
    }
  }
}
