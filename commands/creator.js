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
	//disabled: true,
	async execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;

		const empty = (str) => {
			if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === "")
				return true;
			else
				return false;
		}


		// Fetches from the API
		const exerra = await (await fetch(`${process.env.API_SERVER}/karen/profile?id=391878815263096833&fetchUser=true`)).json()

		const embed = new Discord.MessageEmbed()

		// Variable to check how much fields the top line has
		// Useful for adding spacers
		let topLineFieldAmount = 0

		embed.setTitle(`${exerra.username}'s profile`);
		embed.setThumbnail(exerra.avatar.url.webp);
		embed.addField("Description", exerra.profile.description)

		if (!empty(exerra.profile.website)) embed.addField('Website', `[${exerra.profile.website.replace(/(^\w+:|^)\/\//, '')}](${exerra.profile.website} '${exerra.username}'s website')`, true); topLineFieldAmount++
		if (!empty(exerra.profile.email)) embed.addField('Email', `[${exerra.profile.email}](mailto:${exerra.profile.email})`, true); topLineFieldAmount++
		if (!empty(exerra.profile.twitter)) embed.addField('Twitter', `[@${exerra.profile.twitter}](https://twitter.com/${exerra.profile.twitter} '${exerra.username}'s twitter')`, true); topLineFieldAmount++

		// Switch statement to determine how much spacers to use
		switch (topLineFieldAmount) {
			case 0:
				break;
			case 1:
				embed.addField('\u200B', '\u200B', true)
				embed.addField('\u200B', '\u200B', true)
				break;
			case 2:
				embed.addField('\u200B', '\u200B', true)
				break;
			case 3:
				break;
		}

		embed.addField(`Birthday`, exerra.profile.birthday)

		embed.addField("Pronouns", exerra.profile.pronouns, true)
		embed.addField("Gender", exerra.profile.gender, true)
		embed.addField("Country", exerra.profile.country, true)

		embed.addField("Languages", exerra.profile.languages, true);
		embed.addField('\u200B', '\u200B', true)

		exerra.accentColor != null ? embed.setColor(exerra.accentColor) : embed.setColor(config.color)

		embed.setAuthor("Karen Bot developer", "https://cdn.exerra.xyz/png/discord/verified-bot-developer.png")

		msg.channel.send(embed)
	}
}
