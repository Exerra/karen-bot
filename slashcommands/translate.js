const Discord = require('discord.js')
const app = require("../bot.js");
const axios = require("axios");

module.exports = {
	name: 'Translate to English',
	type: 3,
	description: '',
	options: [],
	execute(client, interaction) {
		const app = require('../bot.js');
		let config = app.config;
		const axios = require('axios')

		let messageID = interaction.data.target_id
		let message = interaction.data.resolved.messages[messageID]

		let subscriptionKey = process.env.AZURE_TRANSLATOR_KEY1
		let endpoint = process.env.AZURE_TRANSLATOR_TEXTENDPOINT
		let location = process.env.AZURE_TRANSLATOR_REGION

		axios({
			baseURL: endpoint,
			url: '/translate',
			method: 'post',
			headers: {
				'Ocp-Apim-Subscription-Key': subscriptionKey,
				'Ocp-Apim-Subscription-Region': location,
				'Content-type': 'application/json'
			},
			params: {
				'api-version': '3.0',
				'to': ["en"]
			},
			data: [{
				'text': message.content
			}],
			responseType: 'json'
		}).then(res => {
			let sourceLang = res.data[0].detectedLanguage.language
			let destinationLang = res.data[0].translations[0].to
			let translatedText = res.data[0].translations[0].text

			client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: `**Translation from ${sourceLang} to ${destinationLang}**:\n\n${translatedText}`,
						flags: 64
					}
				}})
		}).catch(err => {
			console.log(err.response.data)
		})
	}
}
