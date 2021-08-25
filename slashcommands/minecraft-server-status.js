const util = require('minecraft-server-util');
const fs = require('fs')
const Discord = require('discord.js')

module.exports = {
  "name": "mcstatus",
  "description": "Minecraft server status",
  "options": [
    {
      "type": 3,
      "name": "edition",
      "description": "Minecraft edition",
      "required": true,
      "choices": [
        {
          "name": "Java",
          "value": "java"
        },
        {
          "name": "Bedrock (Experimental)",
          "value": "bedrock"
        }
      ]
    },
    {
      "type": 3,
      "name": "ip",
      "description": "Domain/IP of the server",
      "required": true
    }
  ],
  execute(client, interaction) {
    const app = require('../bot.js');
    let config = app.config; 
    const axios = require('axios')

    const embed = new Discord.MessageEmbed().setColor(config.color) 
    let options = interaction.data.options

    // The time to fetch the status of a server (atleast on dev machine) is so slow that the interaction fails
    // Thats why I made it send a "thinking" status so it doesn't time out
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 5
    }})

    if (options[0].value == 'java') {
      // Request the 
      util.status(options[1].value)
        .then(res => {
          const data = res.favicon.split(',')[1]; 
          const buf = new Buffer.from(data, 'base64');
          const file = new Discord.MessageAttachment(buf, 'img.png');

          embed
            .attachFiles(file)
            .setThumbnail('attachment://img.png')
            .setTitle(res.host)
            .addFields(
              { name: "Status", value: "Online" },
              { name: "Version", value: res.version },
              { name: "Online players", value: `${res.onlinePlayers}/${res.maxPlayers}` }
            )
            .setFooter("Minecraft: Java Edition", "https://images-na.ssl-images-amazon.com/images/I/418cEZfh8-L.jpg")
            .setTimestamp()

          new Discord.WebhookClient(client.user.id, interaction.token).send(embed)
        })
        .catch(err => {
          embed
          	.setColor("ff3333")
            .setTitle(options[1].value)
            .setThumbnail("https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706")
            .addFields(
              { name: "Status", value: "Offline" }
            )
            .setFooter("Minecraft: Java Edition", "https://images-na.ssl-images-amazon.com/images/I/418cEZfh8-L.jpg")
            .setTimestamp()

          new Discord.WebhookClient(client.user.id, interaction.token).send(embed)
        })
    } else if (options[0].value == 'bedrock') {
      util.statusBedrock(options[1].value)
        .then(res => {
          embed
            .setTitle(res.host)
            .setThumbnail("https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706")
            .addFields(
              { name: "Status", value: "Online" },
              { name: "Version", value: res.version},
              { name: "Online players", value: `${res.onlinePlayers}/${res.maxPlayers}` }
            )
            .setFooter("Minecraft: Bedrock Edition", "https://images-na.ssl-images-amazon.com/images/I/418cEZfh8-L.jpg")
            .setTimestamp()

          new Discord.WebhookClient(client.user.id, interaction.token).send(embed)
        })
        .catch(err => {
          embed
            .setTitle(options[1].value)
            .setThumbnail("https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706")
            .addFields(
              { name: "Status", value: "Offline" }
            )
            .setColor("ff3333")
            .setFooter("Minecraft: Bedrock Edition", "https://images-na.ssl-images-amazon.com/images/I/418cEZfh8-L.jpg")
            .setTimestamp()

          new Discord.WebhookClient(client.user.id, interaction.token).send(embed)
        })
    }
  }
}
