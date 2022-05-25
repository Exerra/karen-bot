/*
    Created by Exerra on 24/05/2022
*/
const axios = require("axios");
const Discord = require("discord.js")
const app = require("../bot");
const disbut = require("discord-buttons");
const { config } = require("../bot");
const whoiser = require( "whoiser" );

module.exports = {
	name: 'ip',
	description: 'Returns information about a provided IP address',
	args: true,
	usage: '<ip address>',
	example: '1.1.1.1',
	type: 'Search',
	apiData: {
		usesAnAPI: true,
		listOfAPIs: [
			"shodan",
			"whois"
		]
	},
	async execute(client, msg, args) {
		const { config } = require('../bot.js');

		if (!args[0].match(/(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/)) return msg.channel.send("Incorrect IP provided")
		let ip = args[0]

		let whois = await whoiser(ip).catch(e => {return; msg.channel.send("Incorrect IP provided")})
		let { range, organisation, route, netname, asn, created } = whois

		try {
			let { data, domains, asn, city, isp, country_name, last_update, ports, tags } = await (await axios.get(`https://api.shodan.io/shodan/host/${ip}`, {
				params: {
					key: process.env.SHODAN_KEY
				}
			})).data

			let lastUpdate = parseInt(Date.parse(last_update) / 1000)

			for (let i = 0; i < tags.length; i++) {
				tags[i] = tags[i].capitalize()
			}

			let strings = {
				tags: tags.join(", "),
				technologies: "",
				domains: domains.join(", "),
				ports: ports.join(", ")
			}

			let technologies = []
			data.forEach(p => {
				if (p?.product?.capitalize() == undefined) return

				technologies.push(p?.product?.capitalize())
			})
			strings.technologies = [... new Set(technologies)].join(", ")

			Object.entries(strings).forEach(str => { // Discord doesn't like empty strings, so just populating them
				if (str[1] !== "") return

				strings[str[0]] = "None"
			})

			const embed = new Discord.MessageEmbed()
				.setColor(config.color)
				.setAuthor("Shodan", "https://pbs.twimg.com/profile_images/1105606704090267648/oyZUgnFr_400x400.png")
				.setTitle(ip)
				.setDescription(`IP hosted in \`${city}, ${country_name}\` by \`${isp} (${asn})\``)
				.addField("Tags", strings.tags, true)
				.addField("Technologies", strings.technologies, true)
				.addField("Domains", strings.domains, true)
				.addField("Open ports", strings.ports, true)
				.addField("IP Range", range, true)
				.addField("Route", route, true)
				.addField("Netname", netname, true)
				.addField("IP created", (created == undefined ? "Unknown" : `<t:${parseInt(Date.parse(created) / 1000)}:D>`), true)
				.addField("IP last modified", (whois["last-modified"] == undefined ? "Unknown" : `<t:${parseInt(Date.parse(whois["last-modified"]) / 1000)}:D>`), true)
				.addField("ISP contact", `Phone: \`${organisation.phone}\`${organisation["e-mail"] == undefined ? "" : `, E-Mail: \`${organisation["e-mail"]}\``}`)
				.addField("Last updated by Shodan", `<t:${lastUpdate}:D>`)

			let button = new disbut.MessageButton()
				.setStyle('url')
				.setURL(`https://www.shodan.io/host/${ip}`)
				.setLabel(`View in Shodan`)


			client.api.channels(msg.channel.id).messages.post({
				data: {
					embeds: [embed],
					components: [
						{
							type: 1,
							components: [button]
						}
					],
				}
			});
		} catch (e) {
			if (e.response.data.error !== "No information available for that IP.") return msg.channel.send("Unknown error occured")

			const embed = new Discord.MessageEmbed()
				.setColor(config.color)
				.setAuthor("WHOIS", "https://pbs.twimg.com/profile_images/3493029206/8c2a2a47618aad68f1070cd73e5ecff8_400x400.png")
				.setTitle(ip)
				.setDescription(`IP hosted in \`${organisation.country}\` by \`${organisation["org-name"]} (${asn})\``)
				.addField("IP Range", range, true)
				.addField("Route", route, true)
				.addField("Netname", netname, true)
				.addField("Created", (created == undefined ? "Unknown" : `<t:${parseInt(Date.parse(created) / 1000)}:D>`), true)
				.addField("Last modified", (whois["last-modified"] == undefined ? "Unknown" : `<t:${parseInt(Date.parse(whois["last-modified"]) / 1000)}:D>`), true)
				.addField("ISP contact", `Phone: \`${organisation.phone}\`${organisation["e-mail"] == undefined ? "" : `E-Mail: \`${organisation["e-mail"]}\``}`)

			msg.channel.send(embed)
		}
	}
}