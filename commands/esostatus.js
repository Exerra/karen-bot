const Discord = require('discord.js')
const axios = require('axios')

let values = new Map()
let valuesArray = [{ name: "Up", value: "✅" }]

for (let value of valuesArray) {
	values.set(value.name, value.value)
}

const generateValue = (key, value) => {
	return `${key.toUpperCase()} - ${values.get(value)}\n`
}

module.exports = {
	name: 'esostatus',
	description: 'Gets server status of The Elder Scrolls Online game',
	args: false,
	usage: '',
	example: '',
	type: 'Private',
	permissionsLevel: 'Bot Owner',
	async execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;
		const statusEmbed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTitle('ESO server status')
			.setDescription('Server status for the Elder Scrolls Online game')
			.setThumbnail('https://cdn.exerra.xyz/png/eso.png')
			.setAuthor('Zenimax', 'https://cdn.exerra.xyz/png/companies/zenimax/zenimax-small-no_outline.png')
			.setTimestamp()
			.setFooter('Provided by Zenimax')


		let data = await (await axios.get("https://statty.p.rapidapi.com/", {
			headers: {
				'x-rapidapi-host': 'statty.p.rapidapi.com',
				'x-rapidapi-key': process.env.RAPIDAPI_KEY
			},
			params: {
				service: "eso"
			}
		})).data

		let pcValue = ``
		let xboxValue = ``
		let ps4Value = ``

		for (let [key, value] of Object.entries(data.pc)) {
			pcValue += generateValue(key, value)
		}

		for (let [key, value] of Object.entries(data.xbox)) {
			xboxValue += generateValue(key, value)
		}

		for (let [key, value] of Object.entries(data.ps4)) {
			ps4Value += generateValue(key, value)
		}

		statusEmbed.addField("PC", pcValue)
		statusEmbed.addField("Xbox", xboxValue)
		statusEmbed.addField("PS4", ps4Value)

		msg.channel.send(statusEmbed)

		return
	}
}
