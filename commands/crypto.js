const Discord = require('discord.js')

module.exports = {
	name: 'crypto',
	description: 'A command that checks crypto prices',
	type: 'Search',
	args: true,
	usage: '[cryptocurrency]',
	example: 'dogecoin',
	async execute(client, msg, args) {
		// Defines stuff
		const app = require('../bot.js')
		let config = app.config
		const fetch = require('node-fetch')
		// Used to determine what cryptocurrency to fetch
		let crypto = String()
		// Create an embed and add a timestamp, footer and color
		const embed = new Discord.MessageEmbed().setTimestamp().setColor(config.color).setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
		// Converts args[0] (aka what cryptocurrency to fetch) to lowercase
		args[0] = args[0].toLowerCase()
		let median_transaction_fee
		// Used for limited availability warning
		let limited_availability = false

		const listOfCrypto = [
			{ longName: 'Dogecoin', shortName: 'doge', limitedAvailability: false },
			{ longName: 'Ethereum', shortName: 'eth', limitedAvailability: false },
			{ longName: 'Bitcoin', shortName: 'btc', limitedAvailability: false },
			{ longName: 'Litecoin', shortName: 'ltc', limitedAvailability: false },
			{ longName: 'Ripple', shortName: 'xrp', limitedAvailability: true },
			{ longName: 'Groestlcoin', shortName: 'grs', limitedAvailability: false },
			{ longName: 'Stellar', shortName: 'xlm', limitedAvailability: true },
			{ longName: 'Dash', shortName: 'dash', limitedAvailability: false }
		]

		for await (let item of listOfCrypto) {
			if (args[0] == item.longName.toLowerCase() || args[0] == item.shortName) crypto = item.longName, limited_availability = item.limitedAvailability
		}

		if (crypto == "") {
			embed.setColor('RED')
			embed.setAuthor('Error')
			embed.setTitle('No (valid) cryptocurrency mentioned')
			embed.setThumbnail('https://www.freeiconspng.com/uploads/orange-error-icon-0.png')
			embed.setDescription('For a full list of supported cryptocurrencies, [click here!](https://docs.karen.exerra.xyz/supported-crypto-currencies)')
			msg.channel.send(embed)
			return
		}

		// Fetches the Blockchair API with the selected cryptocurrency
		const res = await (await fetch(`https://api.blockchair.com/${crypto.toLowerCase()}/stats`)).json()

		// Makes it so I dont have to type in res.data.field, but I can just do result.field (way quicker)
		const result = res.data

		// Credit the API
		embed.setAuthor('Blockchair', 'https://loutre.blockchair.io/images/twitter_card.png')
		embed.setTitle(`Statistics for ${crypto}`)

		// So since some cryptocurrencies are not fully supported by the Blockchair API, this provides a warning for those
		if (limited_availability) embed.setDescription(`⚠️ Warning: There is limited information for ${crypto}`)

		// Fetches image for crypto from my CDN
		embed.setThumbnail(`https://cdn.exerra.xyz/files/png/crypto/${crypto}.png`)

		// While testing I noticed that some cryptocurrencies have quite low median transaction fees
		// soooo
		// I added a bit of code to change the amount of numbers after decimals if needed
		if (parseFloat(result.median_transaction_fee_usd_24h) <= 0.01) median_transaction_fee = parseFloat(result.median_transaction_fee_usd_24h).toFixed(11)
		else median_transaction_fee = parseFloat(result.median_transaction_fee_usd_24h).toFixed(2)

		// This adds a bunch of fields for the embed, pretty self-explanatory
		embed.addFields(
			{ name: "Price", value: `$${result.market_price_usd}`, inline: false },
			{ name: "Price change (24h)", value: `${parseFloat(result.market_price_usd_change_24h_percentage).toFixed(2)}%`, inline: true},
			{ name: "Median transaction fee (24h)", value: `$${median_transaction_fee}`, inline: true},
			{ name: "Inflation (24h)", value: `$${parseInt(result.inflation_usd_24h)}`, inline: true  },
			{ name: "Blocks", value: parseInt(result.blocks), inline: true },
			{ name: "Market dominance", value: `${parseFloat(result.market_dominance_percentage)}%`, inline: true },
			{ name : "Transactions", value: `${parseInt(result.transactions)}`, inline: true  },
		)
		return msg.channel.send(embed)
	}
}
