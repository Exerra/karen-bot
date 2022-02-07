const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");
const chalk = require("chalk")
const figlet = require('figlet');
const Discord = require('discord.js')
const {serverFunc} = require('../modules/serverFunc.js');
const {log} = require('../modules/log.js');
const {updateStats} = require("../modules/updateStats");
const {checkIfAPIAccess, checkIfProd} = require("../modules/apiAccess");
const {settings} = require("../modules/settings");


module.exports = (client, guild) => {
	let statusQuotes = app.config.statusQuotes
	if (process.env.VALIDATION == undefined) {
		axios({
			"method": "POST",
			"url": `${process.env.API_SERVER}/karen/logs/`,
			"headers": {
				"Authorization": process.env.AUTH_B64,
				"Content-Type": "application/json; charset=utf-8",
				'User-Agent': process.env.AUTH_USERAGENT
			},
			"auth": {
				"username": process.env.AUTH_USER,
				"password": process.env.AUTH_PASS
			},
			"data": {
				"content": `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`,
				"type": "info"
			}
		})
	}

	/* client.user.setActivity(`${client.guilds.cache.size} servers | ` + config.prefix +`help`, { type: "WATCHING" }); */
	let why = statusQuotes[Math.floor(Math.random() * statusQuotes.length)];
	// emergency status
	//why = "⚠️ WELCOME FUNCTIONALITY DISABLED ⚠️"
	client.user.setPresence(
		{
			activity: {
				name: `${app.config.prefix}help | ${why}`,
				type: 'WATCHING'
			},
			status: "dnd" // online, idle, invisible, dnd
		}
	)

	const promises = [
		client.shard.fetchClientValues('guilds.cache.size'),
		client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
	];

	Promise.all(promises)
		.then(results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
			log(chalk.white(`${chalk.magenta.bold(`[Karen Bot]`)} ${chalk.yellow(`[Bot]`)} [Started] Karen Bot has started in ${chalk.yellow.bold(totalGuilds + " stores")} with ${chalk.yellow.bold(totalMembers + " retail employees")}\n`))
			log(`If you are contributing to Karen Bot, please refer to ${chalk.blue.underline('https://docs.karen.exerra.xyz/#/development/etiquette')} for commit etiquette.`)
		})

	if (checkIfProd()) {
		updateStats(client)
		serverFunc.pushCommands(client.commands, client.slashcommands)
	}

	// ------------- Slash commands -------------

	// Puts the slash commands in ./slashcommands/ in an array
	let slashCommandsArr = client.slashcommands.array()

	// For each command, create a slash command
	for (const command of slashCommandsArr) {
		let data = {
			name: command.name,
			description: command.description,
			options: command.options
		}

		if (command.type != undefined) data.type = command.type

		//                                            Only used for testing
		client.api.applications(client.user.id)/* .guilds('701064832136249355') */.commands.post({data: data})
	}

	// When a slash command is triggered
	client.ws.on('INTERACTION_CREATE', async interaction => {

		if (interaction.data.component_type == 3) {
			console.log(interaction)
			if (interaction.data.custom_id == "settingsMessageMenu") {
				let id = interaction.data.values[0]
				let command = client.settings.get(id)
				try {
					await command.execute(client, interaction)
				} catch (e) {
					console.log(e)
				}
			}
			return
		}

		if (interaction.data.component_type == 2) {
			let regex = new RegExp(/([0-9]{17,18})-(settings)-(.*)/)

			if (regex.exec(interaction.data.custom_id)) {
				let regexResult = regex.exec(interaction.data.custom_id)
				let id = regexResult[1]
				let action = regexResult[3]
				if (interaction.member.user.id != id) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
						type: 4,
						data: {
							content: `Go die in a fire you moronic creature`,
							flags: 64
						}
					}})

				settingsmap.set(interaction.guild_id, {...settingsmap.get(interaction.guild_id), phishingAction: action})
				serverFunc.updateGuildSettings(settingsmap)
				client.api.interactions(interaction.id, interaction.token).callback.post({data: {
					type: 4,
					data: {
						content: `Set action to ${action}`,
					}
				}})
			}
			return
		}

		// Get the slash command that was triggered and  assign it to command
		var slashCommandName = interaction.data.name
		let command = client.slashcommands.get(slashCommandName)
			|| client.slashcommands.find(c => c.aliases && c.aliases.includes(slashCommandName))


		// Execute command
		try {
			await command.execute(client, interaction)
		} catch (error) {
			console.error(error)

			log(`Slash command "${command.name}" by ${interaction.member.user.id} - ${error}`, "error", true)

			axios.post(process.env.REGULAR_WEBHOOK, {
				"content": `Slash command "${command.name}" by ${interaction.member.user.id} - ${error}`,
				"embeds": null,
				"username": 'Karen Bot Error (Slash)',
				"avatar_url": "https://karen.exerra.xyz/assets/BotLogoNoOutline.png"
			})
		}
	})
}