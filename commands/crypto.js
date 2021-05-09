const Discord = require('discord.js')

module.exports = {
  name: 'crypto',
  description: 'A command that checks crypto prices',
  type: 'search',
  args: false,
  usage: '',
  example: '',
  aliases: ['c'],
  async execute(client, msg, args) {
    const app = require('../bot.js')
    let config = app.config
    const fetch = require('node-fetch')
    let crypto = String()
    const embed = new Discord.MessageEmbed().setTimestamp().setColor(config.color)

    if (args[0] == 'bitcoin' || args[0] == 'btc') crypto = 'Bitcoin'
    else if (args[0] == 'dogecoin' || args[0] == 'doge') crypto = 'Dogecoin'
    else if (args[0] == 'ethereum' || args[0] == 'eth') crypto = 'Ethereum'
    else {
      embed.setColor('RED')
      embed.setTitle('Error: No (valid) crypto mentioned')
      msg.channel.send(embed)
      return
    }

    const res = await (await fetch(`https://api.blockchair.com/${crypto.toLowerCase()}/stats`)).json()
    const result = res.data
    embed.setAuthor('Blockchair', 'https://loutre.blockchair.io/images/twitter_card.png')
    embed.setTitle(`Statistics for ${crypto}`)
    embed.setThumbnail(`https://cdn.exerra.xyz/files/png/crypto/${crypto}.png`)
    embed.addFields(
      { name: "Price", value: `$${result.market_price_usd}`, inline: false },
      { name: "Price change (24h)", value: `${parseFloat(result.market_price_usd_change_24h_percentage).toFixed(2)}%`, inline: true},
      { name: "Median transaction fee (24h)", value: `$${parseFloat(result.median_transaction_fee_usd_24h).toFixed(2)}`, inline: true},
      { name: "Inflation (24h)", value: `$${parseInt(result.inflation_usd_24h)}`, inline: true  },
      { name: "Blocks", value: result.blocks, inline: true },
      { name: "Market dominance", value: `${result.market_dominance_percentage}%`, inline: true},
      {name : "Transactions", value: `${result.transactions}`, inline: true}
    )
    embed.setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
    msg.channel.send(embed)
  }
}
