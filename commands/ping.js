const Discord = require('discord.js')
const { config } = require('dotenv')

module.exports = {
  name: 'ping',
  description: 'Ping!',
  type: 'Utility',
  execute(client, msg, args) {
    let start = new Date().getTime()
    const app = require('../bot.js');
    let config = app.config;
    let elapsed
    let sendElp
    msg.channel.send('pong!\n'+`\`${client.ws.ping}ms\` heartbeat ping`).then(mxg => {
      sendElp = new Date().getTime() - start
      start = new Date().getTime()
      mxg.channel.send(`API ping time: \`${sendElp}ms\``).then(myg => {
        myg.edit(`Editing...`).then(mzg => {
          elapsed = new Date().getTime() - start
          mxg.delete()
          mzg.edit('\u200b', new Discord.MessageEmbed()
            .setTitle('Pong!')
            .setColor(client.ws.ping > 1000 ? 'RED' : client.ws.ping > 800 ? 'ORANGE' : config.color)
            .setAuthor(msg.author.username, msg.author.avatarURL({ type: 'png', dynamic: true }))
            .addField('Heartbeat', `\`${client.ws.ping}ms\``, true)
            .addField('API', `\`${sendElp}ms\``, true)
            .addField('Message Edit', `\`${elapsed}ms\``, true)
            .setFooter(`yes`))
        })
      })
    })
  }
}
