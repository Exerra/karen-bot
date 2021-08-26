// * YOINKED FROM @Julz4455

const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
  name: 'commands',
  description: 'Command searching',
  usage: '<command_type>',
  aliases: ['help', 'command'],
  cooldown: 5,
  type: 'Utility',
  execute(client, msg, args) {
    const app = require('../bot.js')
    let config = app.config
    const data = 'Here\'s a list of all my commands filtered by type:'
    const commandsArr = msg.client.commands.array()

    if(!args.length) {
      let filteredByType = {}
      for(const command of commandsArr) {
        let commandType = command.type || 'Uncategorized'
        filteredByType[commandType] += `${command.name}, `
      }
      let finalMsg = ""
      for(let [key, value] of Object.entries(filteredByType)) {
        if(key == 'Private' && msg.member.user.permLevel != 10) continue
        finalMsg += `${emojiForKey(key)} **${key}**\n\`\`\`${value.replace("undefined", "").trim().slice(0, -1)}\`\`\`\n`
      }
      return msg.author.send(data)
        .then(() => {
          msg.author.send(finalMsg)
          msg.author.send(`\nYou can send \`${config.prefix}help <command name>\` to get info on a specific command!\nOh and also, you can go to https://docs.karen.exerra.xyz/#/users/commands to view commands`)
          if(msg.channel.type == 'dm') return;
          msg.reply('I\'ve sent you a DM with all my commands!')
        })
        .catch(err => {
          console.error(`Could not send help DM to ${msg.author.tag}.\n`, err)
          msg.reply('It seems as though I couldn\'t DM you. Do you have DMs disabled?\Oh well, you can go to https://docs.karen.exerra.xyz/#/users/commands to view commands')
        })
    }
    const name = args[0].toLowerCase()
    const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name))

    if(!command) {
      let commandFilesTMP = fs.readdirSync('.')
      let commandFiles = []
      commandFilesTMP.forEach(f => {
        commandFiles.push(f.split('.')[0])
      })
      if(commandFiles.includes(name) && msg.author.permLevel == 10) return msg.channel.send(`This command wasn't loaded due to an error. Try reloading the command and checking logs for more info.`)
      return msg.reply(`Hmm... \`${name}\` doesn't seem to be a valid command.`)
    }
    let commandDetails = new Discord.MessageEmbed()
      .setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
      .setColor(config.color)
      .setTitle(`Details for: ${command.name}`)
      .setThumbnail(msg.author.avatarURL({ size: 512, dynamic: true, format: "png" }))
      .setAuthor(`Karen Bot command details`, client.user.avatarURL({ size: 128, dynamic: true, format: "png" }))
      .setTimestamp()
      .addFields(
        { name: 'Aliases', value: `${typeof command.aliases == "undefined" ? 'None' : command.aliases.join(", ")}`, inline: true },
        { name: 'Description', value: `${command.description}`, inline: true },
        { name: 'Usage', value: `\`${config.prefix}${command.name} ${command.usage || ""}\``, inline: false },
        { name: 'Example', value: `\`${config.prefix}${command.name} ${command.example || ""}\``, inline: false },
        { name: 'NSFW', value: `${typeof command.nsfw == "boolean"? (command.nsfw ? "Yes" : "No") : "No"}`, inline: true }
      )
      msg.channel.send(commandDetails)
  }
}

emojiForKey = key => {
  let keys = ['Moderation', 'Fun', 'Misc', 'Image', 'Currency', 'Emoji', 'Private', 'Utility', 'NSFW', 'Music', 'Settings', 'Text']
  switch (key) {
    case 'Moderation':
      return ":shield:"
    case 'Fun':
      return ":smiley:"
    case 'NSFW':
      return ":smirk:"
    case 'Misc':
      return ":neutral_face:"
    case 'Image':
      return ":frame_photo:"
    case 'Currency':
      return ":moneybag:"
    case 'Emoji':
      return ":smile:"
    case 'Private':
      return ":lock:"
    case 'Utility': 
      return ":wrench:"
    case 'Music':
      return ":loud_sound:"
    case 'Settings':
      return ":gear:"
    case 'Text':
      return ":regional_indicator_t:"
    case 'User':
      return '<:dorime:824992571406155801>'
    case 'Search':
      return ':compass:'
    case 'Under Development':
      return ':keyboard:'
    case 'Reddit':
      return '<:redditplat:841329105575215134>'
    case 'Uncategorized':
      return ':question:'
    default:
      return ":grey_question:"
  }
}
