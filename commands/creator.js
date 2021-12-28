/*
	This was made a while ago back before the profile system. I will probably rework this to be similar to the profile command but only show my profile
	Current implementation uses the old "API" that was just a static JSON file hosted along-side https://exerra.xyz using Vercel. The "api.exerra.xyz" has been changed from that to my actual API and now the command is broken.

	- Exerra 2021-12-28
 */





const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
	name: 'creator',
	description: 'Gets information about the creator of Karen Bot',
	type: 'Search',
	args: false,
	disabled: true,
	async execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;
		// Fetches the API
		const apiExerra = await (await fetch(`https://api.exerra.xyz/users/Exerra/stats.json`)).json()

		// Constants
		const exerraLanguageEmbed = new Discord.MessageEmbed()
		const exerraServiceEmbed = new Discord.MessageEmbed()
		const exerraExperienceEmbed = new Discord.MessageEmbed()

		// Language Embed
		exerraLanguageEmbed.setTitle(`${apiExerra.name} (Exerra)`)
		exerraLanguageEmbed.setURL('https://exerra.xyz')
		exerraLanguageEmbed.setColor(config.color)
		exerraLanguageEmbed.setTimestamp()
		exerraLanguageEmbed.setDescription(apiExerra.aboutme)
		exerraLanguageEmbed.addField('Known Languages', apiExerra.skills)
		exerraLanguageEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)

		// Services embed
		exerraServiceEmbed.setTitle(`${apiExerra.name}'s Services`)
		exerraServiceEmbed.setColor(config.color)
		exerraServiceEmbed.setTimestamp()
		exerraServiceEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
		if (apiExerra.services.length != 1) {
			apiExerra.services.forEach(element => {
				exerraServiceEmbed.addField(`${element.name}`, element.description)
			});
		}
		else {
			exerraServiceEmbed.addField(apiExerra.services[0].name, apiExerra.services[0].description)
		}

		// Experience Embed
		exerraExperienceEmbed.setTitle(`${apiExerra.name}'s Experience`)
		exerraExperienceEmbed.setColor(config.color)
		exerraExperienceEmbed.setTimestamp()
		exerraExperienceEmbed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
		if (apiExerra.experience.length != 1) {
			apiExerra.experience.forEach(element => {
				console.log(element)
				exerraExperienceEmbed.addField(`${element.year} - ${element.name}`, element.description)
			});
		}
		else {
			exerraExperienceEmbed.addField(`${apiExerra.experience[0].year} - ${apiExerra.experience[0].name}`, apiExerra.experience[0].description)
		}

		// Sends embeds
		msg.channel.send(exerraLanguageEmbed)
		msg.channel.send(exerraServiceEmbed)
		msg.channel.send(exerraExperienceEmbed)
	}
}
