const Discord = require('discord.js')
let fs = require('fs');
const axios = require('axios');
const {settings} = require("cluster");
const disbut = require("discord-buttons");
require('dotenv').config()

module.exports = {
	name: 'settings',
	description: 'Server settings',
	type: 'Settings',
    permissions: ["MANAGE_GUILD"],
	apiData: {
		usesAnAPI: true,
		listOfAPIs: [
			"exerra"
		]
	},
	async execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;
		// * filter for the followup question, basically makes sure the correct person can respond
		const filter = m => m.author.id === msg.author.id;

		// fetches the map object

		// * saves the map object
		app.serverFunc.getSettingsMap()
		const settingsInfoEmbed = new Discord.MessageEmbed()
			.setColor(config.color)

		if (settingsmap.get(msg.guild.id).autoSpotifyEmbed == undefined) {
			settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), autoSpotifyEmbed: false})
			serverFunc.updateGuildSettings(settingsmap)
		}

		if (args[0] == undefined || args[0].toLowerCase() == 'help') {
			// * If the guild is not in the map, add it to map and pipe it over to exserver
			if (settingsmap.get(msg.guild.id) == undefined) app.serverFunc.createGuildSettings(msg.guild.id)
			settingsInfoEmbed.setTitle(`Settings for ${msg.guild.name}`)
			settingsInfoEmbed.setThumbnail(msg.guild.iconURL())
			settingsInfoEmbed.setDescription(`All the settings for this guild.\nUsage: ${config.prefix}settings set [setting]`)
			settingsInfoEmbed.addField('AntiSwear', `Delets all messages with swear words in them\nCurrent setting: **${settingsmap.get(msg.guild.id).swearProtectionEnabled}**`, true)
			if (settingsmap.get(msg.guild.id).welcomeChannel === "") settingsInfoEmbed.addField('Welcome', `Sends a welcome message when a person joins this server.\n**Current settings:**\nWelcome Enabled: **${settingsmap.get(msg.guild.id).welcomeEnabled}**\nWelcome channel N/A`, true)
			else settingsInfoEmbed.addField('Welcome', `Sends a welcome message when a person joins this server.\n**Current settings:**\nWelcome Enabled: **${settingsmap.get(msg.guild.id).welcomeEnabled}**\nWelcome channel <#${settingsmap.get(msg.guild.id).welcomeChannel}>`, true)

			if (settingsmap.get(msg.guild.id).modLogChannel === "") settingsInfoEmbed.addField('ModLog', `Sends logs of kick/warn/ban\n**Current settings:**\nMod Log Enabled: **${settingsmap.get(msg.guild.id).modLogEnabled}**\nMod Log channel N/A`, true)
			else settingsInfoEmbed.addField('ModLog', `Sends logs of kick/warn/ban\n**Current settings:**\nMod Log Enabled: **${settingsmap.get(msg.guild.id).modLogEnabled}**\nMod Log channel <#${settingsmap.get(msg.guild.id).modLogChannel}>`, true)

			if (settingsmap.get(msg.guild.id).antiNSFW == false) settingsInfoEmbed.addField('AntiNSFW', `Removes NSFW images if posted in a SFW channel\n**Currently Disabled**`, true)
			else settingsInfoEmbed.addField('AntiNSFW', `Removes NSFW images if posted in a SFW channel\n**Currently Enabled**`, true)

			if (settingsmap.get(msg.guild.id).autoSpotifyEmbed == false) settingsInfoEmbed.addField('AutoSpotifyEmbed', `Automatically sends an embed with song info if a spotify link is sent\n**Currently Disabled**`, true)
			else settingsInfoEmbed.addField('AutoSpotifyEmbed', `Automatically sends an embed with song info if a spotify link is sent\n**Currently Enabled**`, true)

			if (settingsmap.get(msg.guild.id).guildPrefix == "") settingsInfoEmbed.addField('Prefix', `A custom prefix for this guild\n**Currently disabled**`, true)
			else settingsInfoEmbed.addField('Prefix', `A custom prefix for this guild\n**Currently "${settingsmap.get(msg.guild.id).guildPrefix}"**`, true)

			if (settingsmap.get(msg.guild.id).brewSearch == false) settingsInfoEmbed.addField('BrewSearch', `Automatically sends an embed with brew.sh formulae info if triggered by {{formulae}}\n**Currently Disabled**`, true)
			else settingsInfoEmbed.addField('BrewSearch', `Automatically sends an embed with brew.sh formulae info if triggered by {{formulae}}\n**Currently Enabled**`, true)

			settingsInfoEmbed.addField('Scam', `Blocks scam links\nCurrent setting: **${settingsmap.get(msg.guild.id).phishingAction}**`, true)

			// Empty, just like my emotions - Amelia
			settingsInfoEmbed.addField('\u200B', '\u200B', true)
			settingsInfoEmbed.addField('\u200B', '\u200B', true)

			msg.channel.send(settingsInfoEmbed)
		} else if (args[0].toLowerCase() == 'set') {
			// * If setting to change is antiswear and args[2] is not defined, ask followup questions
			if (args[1].toLowerCase() == 'antiswear' && args[2] == undefined) {
				msg.channel
					.send("What do you want to set it to? Options: True, False")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									antiSwearCollected = collected.first().content;
									if (antiSwearCollected.toLowerCase() == 'true') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											swearProtectionEnabled: true
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`AntiSwear setting confirmed: ${antiSwearCollected}`);
										return //refreshMap()
									} else if (antiSwearCollected.toLowerCase() == 'false') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											swearProtectionEnabled: false
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`AntiSwear setting confirmed: ${antiSwearCollected}`);
										return //refreshMap()
									}
									msg.channel.send('Wrong input! Options: True, False')
								}
							})
					})
			} else if (args[1].toLowerCase() == 'antiswear') {
				// * OTHERWISE check if args[2] is a valid response and set the setting accordingly :)
				if (args[2].toLowerCase() == 'true') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), swearProtectionEnabled: true})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`AntiSwear setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				} else if (args[2].toLowerCase() == 'false') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), swearProtectionEnabled: false})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`AntiSwear setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				}
				msg.channel.send('Wrong input! Options: True, False')
			}

			// ---------------------------------

			if (args[1].toLowerCase() == 'antinsfw' && args[2] == undefined) {
				msg.channel
					.send("What do you want to set it to? Options: True, False")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									AntiNSFWCollected = collected.first().content;
									if (AntiNSFWCollected.toLowerCase() == 'true') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											antiNSFW: true
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`AntiNSFW setting confirmed: ${AntiNSFWCollected}`);
										return //refreshMap()
									} else if (AntiNSFWCollected.toLowerCase() == 'false') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											antiNSFW: false
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`AntiNSFW setting confirmed: ${AntiNSFWCollected}`);
										return //refreshMap()
									}
									msg.channel.send('Wrong input! Options: True, False')
								}
							})
					})
			} else if (args[1].toLowerCase() == 'antinsfw') {
				// * OTHERWISE check if args[2] is a valid response and set the setting accordingly :)
				if (args[2].toLowerCase() == 'true') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), antiNSFW: true})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`AntiNSFW setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				} else if (args[2].toLowerCase() == 'false') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), antiNSFW: false})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`AntiNSFW setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				}
				msg.channel.send('Wrong input! Options: True, False')
			}

			// ---------------------------------

			if (args[1].toLowerCase() == 'brewsearch' && args[2] == undefined) {
				msg.channel
					.send("What do you want to set it to? Options: True, False")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									brewSearchCollected = collected.first().content;
									if (brewSearchCollected.toLowerCase() == 'true') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											brewSearch: true
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`brewSearch setting confirmed: ${brewSearchCollected}`);
										return //refreshMap()
									} else if (brewSearchCollected.toLowerCase() == 'false') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											brewSearch: false
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`brewSearch setting confirmed: ${brewSearchCollected}`);
										return //refreshMap()
									}
									msg.channel.send('Wrong input! Options: True, False')
								}
							})
					})
			} else if (args[1].toLowerCase() == 'brewsearch') {
				// * OTHERWISE check if args[2] is a valid response and set the setting accordingly :)
				if (args[2].toLowerCase() == 'true') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), brewSearch: true})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`brewSearch setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				} else if (args[2].toLowerCase() == 'false') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), brewSearch: false})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`brewSearch setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				}
				msg.channel.send('Wrong input! Options: True, False')
			}

			// ---------------------------------

			if (args[1].toLowerCase() == 'modlog' && args[2] == undefined) {
				msg.channel
					.send("Do you want it on? Options: Yes, No")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									doYouWantItOn = collected.first().content;
									if (doYouWantItOn.toLowerCase() == 'no') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											modLogEnabled: false
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send('Alright, turned modlog off.')
									} else if (doYouWantItOn.toLowerCase() == 'yes') {
										msg.channel
											.send("Modlog is on. Next, input the channel where the logs will be sent.")
											.then(() => {
												msg.channel
													.awaitMessages(filter, {
														max: 1,
														time: 15000,
													})
													.then(collected => {
														modLogChannel = collected.first().content.slice(2, -1);
														let collectedWelcomeChannel = msg.guild.channels.cache.find(c => c.id == modLogChannel)
														if (!collectedWelcomeChannel) return msg.channel.send('Incorrect channel provided')
														settingsmap.set(msg.guild.id, {
															...settingsmap.get(msg.guild.id),
															modLogEnabled: true,
															modLogChannel: modLogChannel
														})
														app.serverFunc.updateGuildSettings(settingsmap)
														msg.channel.send(`Alright, turned modlog on and set the channel to <#${modLogChannel}>.`)
													})

											})
									}
								}
							})
					})
			}

			// ---------------------------------

			if (args[1].toLowerCase() == 'welcome' && args[2] == undefined) {
				msg.channel
					.send("Do you want it on? Options: Yes, No")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									doYouWantItOn = collected.first().content;
									if (doYouWantItOn.toLowerCase() == 'no') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											welcomeEnabled: false
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send('Alright, turned welcome off.')
									} else if (doYouWantItOn.toLowerCase() == 'yes') {
										msg.channel
											.send("Welcome is on. Next, input the channel where the logs will be sent.")
											.then(() => {
												msg.channel
													.awaitMessages(filter, {
														max: 1,
														time: 15000,
													})
													.then(collected => {
														collectedContent = collected.first().content.slice(2, -1);
														let collectedWelcomeChannel = msg.guild.channels.cache.find(c => c.id == collectedContent)
														if (!collectedWelcomeChannel) return msg.channel.send('Incorrect channel provided')
														settingsmap.set(msg.guild.id, {
															...settingsmap.get(msg.guild.id),
															welcomeEnabled: true,
															welcomeChannel: collectedContent
														})
														app.serverFunc.updateGuildSettings(settingsmap)
														msg.channel.send(`Alright, turned welcome on and set the channel to <#${collectedContent}>.`)
													})

											})
									}
								}
							})
					})
			}

			// ---

			if (args[1].toLowerCase() == 'autospotifyembed' && args[2] == undefined) {
				msg.channel
					.send("What do you want to set it to? Options: True, False")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									autoSpotifyEmbedCollected = collected.first().content;
									if (autoSpotifyEmbedCollected.toLowerCase() == 'true') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											autoSpotifyEmbed: true
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`AutoSpotifyEmbed setting confirmed: ${autoSpotifyEmbedCollected}`);
										return //refreshMap()
									} else if (autoSpotifyEmbedCollected.toLowerCase() == 'false') {
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											autoSpotifyEmbed: false
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`AutoSpotifyEmbed setting confirmed: ${autoSpotifyEmbedCollected}`);
										return //refreshMap()
									}
									msg.channel.send('Wrong input! Options: True, False')
								}
							})
					})
			} else if (args[1].toLowerCase() == 'autospotifyembed') {
				// * OTHERWISE check if args[2] is a valid response and set the setting accordingly :)
				if (args[2].toLowerCase() == 'true') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), autoSpotifyEmbed: true})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`AutoSpotifyEmbed setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				} else if (args[2].toLowerCase() == 'false') {
					settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), autoSpotifyEmbed: false})
					app.serverFunc.updateGuildSettings(settingsmap)
					msg.channel.send(`AutoSpotifyEmbed setting confirmed: ${args[2].toLowerCase()}`);
					return //refreshMap()
				}
				msg.channel.send('Wrong input! Options: True, False')
			}
			// ---------------------------------

			if (args[1].toLowerCase() == 'prefix' && args[2] == undefined) {
				msg.channel
					.send("What prefix should I use? If you do not want a prefix, type \"none\"")
					.then(() => {
						msg.channel
							.awaitMessages(filter, {
								max: 1,
								time: 15000
							})
							.then(collected => {
								if (collected) {
									let prefixToUse = collected.first().content;
									if (prefixToUse.toLowerCase() !== "") {
										if (prefixToUse.toLowerCase() == "none") {
											settingsmap.set(msg.guild.id, {
												...settingsmap.get(msg.guild.id),
												guildPrefix: ""
											})
											app.serverFunc.updateGuildSettings(settingsmap)
											msg.channel.send(`Alright, turned off guild prefix.`)
											return
										}
										settingsmap.set(msg.guild.id, {
											...settingsmap.get(msg.guild.id),
											guildPrefix: prefixToUse
										})
										app.serverFunc.updateGuildSettings(settingsmap)
										msg.channel.send(`Alright, set guild prefix to ${prefixToUse}.`)

									}
								}
							})
					})
			}

			if (args[1].toLowerCase() == 'scam' && args[2] == undefined) {
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
					.setID(`${msg.author.id}-settings-ban`)

				let kickButton = new disbut.MessageButton()
					.setStyle("blurple")
					.setLabel(`Kick`)
					.setID(`${msg.author.id}-settings-kick`)

				let warnButton = new disbut.MessageButton()
					.setStyle("green")
					.setLabel(`Warn`)
					.setID(`${msg.author.id}-settings-warn`)

				client.api.channels(msg.channel.id).messages.post({
					data: {
						embeds: [spamEmbed],
						components: [
							{
								type: 1,
								components: [banButton, kickButton, warnButton]
							}
						],
					}
				});
			}
		}
	}
}
