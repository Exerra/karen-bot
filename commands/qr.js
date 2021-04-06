const Discord = require('discord.js')
var QRCode = require('qrcode');
const { type } = require("os");
const fs = require('fs')

module.exports = {
  name: 'qr',
  description: 'Creates a QR code with your specified content',
  type: 'Image',
  usage: '[content]',
  example: 'This is an example of the content',
  args: true,
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    args[0] = args.join(' ')
    args[0] = args[0].substring(0)
    QRCode.toFile(app.dir + "/qr/" + msg.author.id + ".png", args[0], function (err, url) {msg.channel.send('Here you go', { files: [app.dir + "/qr/" + msg.author.id + ".png"]})})
  }
}
