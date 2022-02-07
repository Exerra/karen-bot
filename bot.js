// Dependencies
const Discord = require('discord.js');
const fs = require('fs');
require('discord-reply');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require("./config.json");
const axios = require("axios");
/* const ytdl = require('ytdl-core'); */
const fetch = require('node-fetch')
const chalk = require('chalk')
client.config = require('./advanced_config.js')
client.kahootnames = require('./kahootnames.js')
require('./modules/functions.js')(client)
var NSFAI = require('nsfai');
require('dotenv').config()
const Spotify = require('node-spotify-api')
const {serverFunc} = require('./modules/serverFunc.js')
const {matchRegex} = require('./modules/regex.js')
const {autoEmbeds} = require('./modules/autoEmbeds.js')

var nsfai = new NSFAI(process.env.NSFAI_KEY);

// commands stuff
let commands = {};
let slashCommands = {}

// mobile status
const Constants = require('./node_modules/discord.js/src/util/Constants.js') // skipcq: JS-0260
//Constants.DefaultOptions.ws.properties.$browser = 'Discord iOS' // Or Discord Android
//Constants.DefaultOptions.fetchAllMembers = true

// winston logger (hopefully gonna replace console.log with this)
const winston = require('winston');
const {log} = require('./modules/log');
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({filename: 'log'}),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

// Permissions
client.levelCache = {}
for (let i = 0; i < client.config.permLevels.length; i++) {
	const thisLevel = client.config.permLevels[i]
	client.levelCache[thisLevel.name] = thisLevel.level
}

// Commands
client.commands = new Discord.Collection()
client.failedCommands = []
client.failedEvents = []
let cmdAlpha = {}
let commandAmount = 0
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	try {
		const command = require(`./commands/${file}`)
		if (!cmdAlpha[command.name.charAt(0)]) {
			cmdAlpha[command.name.charAt(0)] = true
		}
		client.commands.set(command.name, command)
		commandAmount++
	} catch (e) {
		client.failedCommands.push([file.split('.')[0], e.toString()])
		log(`Error while loading command: ${file.split('.')[0]}: ${e}`, "error")
	}
}
log(`${chalk.magenta('[Karen Bot]')} ${chalk.yellow(`[Command]`)} ${chalk.white('[Load]')} Loaded ${commandAmount} commands`)


// Slash Commands
client.slashcommands = new Discord.Collection()
client.slashFailedCommands = []
client.slashFailedEvents = []
let slashCmdAlpha = {}
let slashCommandAmount = 0
const slashCommandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))
for (const file of slashCommandFiles) {
	try {
		const slashCommand = require(`./slashcommands/${file}`)
		if (!slashCmdAlpha[slashCommand.name.charAt(0)]) {
			slashCmdAlpha[slashCommand.name.charAt(0)] = true
		}
		client.slashcommands.set(slashCommand.name, slashCommand)
		slashCommandAmount++
	} catch (e) {
		client.slashFailedCommands.push([file.split('.')[0], e.toString()])
		log(`Error while loading slash command: ${file.split('.')[0]}: ${e}`, "error")
	}
}
log(`${chalk.magenta('[Karen Bot]')} ${chalk.yellow(`[SlashCommand]`)} ${chalk.white('[Load]')} Loaded ${slashCommandAmount} commands`)

// Events
let evAlpha = {}
let events = 0
const eventFiles = fs.readdirSync('events/').filter(file => file.endsWith('.js'))
for (const ev of eventFiles) {
	const eventName = ev.split('.')[0]
	try {
		if (!evAlpha[eventName.charAt(0)]) {
			evAlpha[eventName.charAt(0)] = true
		}
		const evx = require(`./events/${ev}`)
		client.on(eventName, evx.bind(null, client))
		events++
	} catch (e) {
		client.failedEvents.push([eventName, e.toString()])
		log(`Error while loading event: ${eventName}: ${e}`, "error")
	}
}
log(`${chalk.magenta('[Karen Bot]')} ${chalk.yellow('[Event]')} ${chalk.white("[Load]")} Loaded ${events} events`)

if (process.env.APIACCESS !== "true") console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[API]`), chalk.red('[Warn]'), `Without API access many features are disabled`)

require('./server.js')
const {isScam, isURL} = require("./modules/url");

// Gets settings
axios({
	"method": "GET",
	"url": `${process.env.API_SERVER}/karen/settings/map/`,
	"headers": {
		"Authorization": process.env.AUTH_B64,
		'User-Agent': process.env.AUTH_USERAGENT
	},
	"auth": {
		"username": process.env.AUTH_USER,
		"password": process.env.AUTH_PASS
	}
}).then(res => {
	settingsmap = new Map(res.data); // skipcq: JS-0128
	console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[Settings]`), chalk.white('[Load]'), `Loaded guild settings`)
}).catch(err => {
	console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[Settings]`), chalk.red('[Warn]'), `Failed to load guild settings`)
})

// Gets guildProfile map //! Levels are not yet released online so hush hush
axios({
	"method": "GET",
	"url": `${process.env.API_SERVER}/karen/guildProfile/map/`,
	"headers": {
		"Authorization": process.env.AUTH_B64,
		'User-Agent': process.env.AUTH_USERAGENT
	},
	"auth": {
		"username": process.env.AUTH_USER,
		"password": process.env.AUTH_PASS
	}
}).then(res => {
	guildProfile = new Map(res.data);
})

client.on('message', async msg => {

	if (msg.author.id == "235148962103951360") {
		serverFunc.warn("235148962103951360", msg.guild.id, "carl sucks stinky stuff", client.user.id)
	}

	let argsWithoutPrefix = msg.content.split(/\s+/)

	argsWithoutPrefix.forEach(async d => {
		if (await !isURL(d)) return
		let scam = await isScam(d)
		if (!scam) return

		let spamBeGoneID = "939520237110460447"

		if (msg.guild.members.cache.find(fn => fn.id == spamBeGoneID) != undefined) {
			if (msg.guild.members.cache.find(fn => fn.id == spamBeGoneID).presence.status != "offline") return serverFunc.warn(msg.author.id, msg.guild.id, "Sending phishing links, nerd", client.user.id)
		}

		msg.delete()

		let reason = "Sending phishing links"
		let member = msg.guild.members.cache.get(msg.author.id)
		let embed = {}

		if (settingsmap.get(msg.guild.id).phishingAction == "kick") {
			if (!member.kickable) return
			await member.send(`onmg AHahaHAHahaAHAHAHAHA im wheezing rn you got kicked from ${msg.guild.name} (id: ${msg.guild.id}) for ${reason}. thats what you get you devil! REPEL THE DEMONS! UNBLOW!!! YOU ARE DESTROYED FOREVER!!! AND YOU WILL NEVER BE BACK!!!! thank you god... let it happen... cause it to happen`).catch(() => null)
			await member.send('https://cdn.exerra.xyz/png/kenneth_copeland.png').catch(() => null)
			await member.kick(reason)
			embed = {
				title: `Scammer nerd kicked`,
				description: `${member.user.tag} has been kicked`,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				color: `${config.colordecimal}`,
				timestamp: new Date(),
				"fields": [
					{
						"name": `Member`,
						"value": `<@${member.user.id}>`,
						"inline": false
					},
					{
						"name": `Moderator`,
						"value": `<@${client.user.id}>`,
						"inline": false
					},
					{
						"name": `Reason`,
						"value": `${reason}`,
						"inline": false
					}
				]
			};
		}
		else if (settingsmap.get(msg.guild.id).phishingAction == "ban") {
			if (!member.bannable) return console.log("bruh")
			await member.send(`onmg AHahaHAHahaAHAHAHAHA im wheezing rn you got banned from ${msg.guild.name} (id: ${msg.guild.id}) for ${reason}. thats what you get you devil! REPEL THE DEMONS! UNBLOW!!! YOU ARE DESTROYED FOREVER!!! AND YOU WILL NEVER BE BACK!!!! thank you god... let it happen... cause it to happen`).catch(() => null)
			await member.send('https://cdn.exerra.xyz/png/kenneth_copeland.png').catch(() => null)
			await member.send('oh and btw 5g causes corona cancer and reptiliioans are hacking our brrains from mars while probing our pets so like you should be saying thanks for getting educated 😒').catch(() => null)
			await member.ban({reason}).catch(error => null);
			embed = {
				title: `Scammer nerd banned`,
				description: `${member.user.tag} has been banned`,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				color: `${config.colordecimal}`,
				timestamp: new Date(),
				"fields": [
					{
						"name": `Member`,
						"value": `<@${member.user.id}>`,
						"inline": false
					},
					{
						"name": `Moderator`,
						"value": `<@${client.user.id}>`,
						"inline": false
					},
					{
						"name": `Reason`,
						"value": `${reason}`,
						"inline": false
					}
				]
			};
		}

		serverFunc.warn(msg.author.id, msg.guild.id, "Sending phishing links, nerd", client.user.id).then(res => {
			if (settingsmap.get(msg.guild.id).modLogEnabled == false) return

			const modLogChannelConst = msg.guild.channels.cache.get(settingsmap.get(msg.guild.id).modLogChannel);
			if (!modLogChannelConst) return

			const warnEmbed = new Discord.MessageEmbed()
				.setColor(config.color)
				.setTitle("Member warned")
				.setDescription(`<@${msg.author.id}> has been warned`)
				.setThumbnail(msg.author.avatarURL())
				.setTimestamp(new Date())
				.addField("Reason", "Sending phishing links, nerd")
				.addField("Moderator", `<@${client.user.id}>`)
				.addField("Warn ID", res.data.warnID)

			modLogChannelConst.send({ embed: warnEmbed });
			if (embed != {}) modLogChannelConst.send({ embed: embed });
		})
	})

	if (msg.content.includes(process.env.DISCORD_TOKEN)) return msg.delete()
	if (msg.author.bot || msg.webhookID || !msg.author) return

	// el troll
	for (let i in config.trolls) {
		let troll = config.trolls[i]

		if (msg.content.toLowerCase().includes(troll.content)) {
			if (troll.guildID == undefined) {
				if (troll.id == "") msg.lineReply(troll.reply)
				else if (msg.author.id == troll.id) msg.lineReply(troll.reply)
				return
			}

			if (troll.guildID != msg.guild.id) return

			if (troll.id == "") msg.lineReply(troll.reply)
			else if (msg.author.id == troll.id) msg.lineReply(troll.reply)
		}
	}

	// Tbh idk why I did this, I wrote this at like 04:00
	try {
		let guildPrefixLet = settingsmap.get(msg.guild.id).guildPrefix // skipcq: JS-0128
		if (settingsmap.get(msg.guild.id).brewSearch == undefined) {
			await settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), brewSearch: false})
			serverFunc.updateGuildSettings(settingsmap)
		}

		if (settingsmap.get(msg.guild.id).phishingAction == undefined) {
			await settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), phishingAction: "warn"})
			serverFunc.updateGuildSettings(settingsmap)
		}
	} catch (err) {
		if (msg.guild.id == '793297057216856085') console.log(1.2)
		serverFunc.createGuildSettings(msg.guild.id)
	}

	autoEmbeds(msg)

	if (msg.attachments.size > 0) {
		if (msg.attachments.every(attachIsImage)) {
			//something
		}
	}

	function attachIsImage(msgAttach) {
		var url = msgAttach.url;

		function handleResult(result) {
			if (result.sfw) {
				return
			} else {
				msg.reply('NSFW images are not allowed in SFW channels!')
				msg.delete()
			}
		}

		function handleError(error) {
			console.error('hm');
		}

		if (settingsmap.get(msg.guild.id).antiNSFW == false) return;
		if (msg.channel.nsfw) return;
		nsfai.predict(url).then(handleResult).catch(handleError);
	}

	const executeCommand = async (prefix) => {
		var args = msg.content.slice(prefix.length).split(/\s+/)

		var commandName = args.shift().toLowerCase()
		let command = client.commands.get(commandName)
			|| client.commands.find(c => c.aliases && c.aliases.includes(commandName))

		if (!command) return;

		const level = client.permLevel(msg)
		if (level < client.levelCache[command.permissionsLevel || "User"]) {
			return msg.channel.send(`Shut up, you're not my mom 😒🙄`)
		}

		msg.author.permLevel = level
		msg.member.user.permLevel = level

		try {

			if (command.disabled) {
				return msg.lineReply("Its ✨ disabled ✨\n\n\n\n\n\n\n..just like you apparently lMFAOOO")
			}

			if (command.args && !args.length) {
				let reply = `Where are the arguments?? Explain yourself, WHERE IN THE FUCK DO YOU SEE ARGUMENTS!?!?!?`

				if (command.usage) {
					reply += `\nProper Usage: \`${prefix}${command.name} ${command.usage.replace('shard_count', 4)}\``
				}

				if (command.example) {
					reply += `\n\`${prefix}${command.name} ${command.example.replace('shard_count', 3)}\``
				}
				return msg.channel.send(reply)
			}

			if (command.nsfw && !msg.channel.nsfw) {
				if (!msg.channel.name.includes('nsfw')) return msg.channel.send(`Ugh this is an NSFW command, go to an NSFW channel 🙄`)
			}

			msg.channel.startTyping()
			await command.execute(client, msg, args)
			msg.channel.stopTyping()
		} catch (error) {
			console.error(error)
			log(`"${msg}" by ${msg.author.id} - ${error}`, "error", true)

			axios.post(process.env.REGULAR_WEBHOOK, {
				"content": `"${msg}" by ${msg.author.id} - ${error}`,
				"embeds": null,
				"username": 'Karen Bot Error',
				"avatar_url": "https://karen.exerra.xyz/assets/BotLogoNoOutline.png"
			})
			msg.reply('there was an error trying to execute that command.')
			msg.channel.stopTyping()
		}
	}

	if (msg.content.toLowerCase().startsWith(config.prefix)) executeCommand(config.prefix)
	else if (settingsmap.get(msg.guild.id).guildPrefix !== "") {
		if (msg.content.toLowerCase().startsWith(settingsmap.get(msg.guild.id).guildPrefix)) executeCommand(settingsmap.get(msg.guild.id).guildPrefix)
	}

	config.badwords.forEach(function (value) {
		if (msg.content.toLowerCase() == value) {
			if (msg.author.permLevel >= 4) return;
			if (!settingsmap.get(msg.guild.id).swearProtectionEnabled) return;
			msg.delete();
			msg.reply(config.swearreply.randomize());
		}
	});

	// Literally the first lines of code in this project (back in 2019 or something). I find it funny how this has sorta became my "author check"
	if (msg.content.toLowerCase() === '> >run ping') {
		msg.channel.send(`**Running Ping.exe...**`).then((msg) => {
			setTimeout(() => {
				msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**').then((msg) => {
					setTimeout(() => {
						msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**\n> >run Ping Pong').then((msg) => {
							setTimeout(() => {
								msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**\n> >run Ping Pong \n**Running Ping Pong subroutine**').then((msg) => {
									setTimeout(() => {
										msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**\n> >run Ping Pong \n**Running Ping Pong subroutine**\n**Error:** Subroutine corrupted, cancelling.');
									}, 2000)
								});
							}, 2000)
						});
					}, 2000)
				});
			}, 2000)
		});
	}
});


client.login(process.env.DISCORD_TOKEN);
exports.client = client;
exports.config = config;
exports.commands = commands;
exports.Discord = Discord;
exports.serverFunc = serverFunc;
exports.dir = __dirname;
