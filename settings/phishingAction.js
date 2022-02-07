/*
    Created by Exerra on 07/02/2022
*/

const Discord = require("discord.js");
const axios = require("axios");
const disbut = require("discord-buttons");
const app = require("../bot.js");

module.exports = {
	name: 'phishingAction',
	async execute(client, interaction) {

		let config = app.config;
		let user = interaction.member.user


		const spamEmbed = new Discord.MessageEmbed()
			.setTitle("Scam block")
			.setColor(config.color)
			.setDescription("Pick what Karen Bot will do to scammers using the buttons down below.")
			.addField("Ban", "Karen will ban and warn the scammer.", true)
			.addField("Kick", "Karen will kick and warn the scammer.", true)
			.addField("Warn (default)", "Karen will just warn them.", true)
			.setFooter(`${(await axios.get(`${process.env.API_SERVER}/scam/stats`)).data.links} blocked links`)
			.setThumbnail("https://cdn.exerra.xyz/png/phishing.png")
			.setTimestamp()

		let banButton = new disbut.MessageButton()
			.setStyle('red')
			.setLabel(`Ban`)
			.setID(`${user.id}-settings-ban`)

		let kickButton = new disbut.MessageButton()
			.setStyle("blurple")
			.setLabel(`Kick`)
			.setID(`${user.id}-settings-kick`)

		let warnButton = new disbut.MessageButton()
			.setStyle("green")
			.setLabel(`Warn`)
			.setID(`${user.id}-settings-warn`)

		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [spamEmbed],
					components: [
						{
							type: 1,
							components: [banButton, kickButton, warnButton]
						}
					]
				}
			}
		})
	}
}