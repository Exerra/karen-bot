const Discord = require(`discord.js`)
const backup = require("discord-backup");
const axios = require('axios')
const fs = require('fs');
require('dotenv').config()

module.exports = {
	name: `backup`,
	description: ``,
	type: `Private`,
	args: true,
	usage: `<create/load/view> <backup_id (load and view only)>`,
	example: `load 754996287338265696`,
	permissionsLevel: 'Bot Owner',
	async execute(client, msg, args) {
		const app = require(`../bot.js`);
		let config = app.config
		if(![`create`, `load`, `view`].includes(args[0].toLowerCase())) return msg.channel.send(`Please select to either create, load, or view a backup.`)
		if([`load`, `view`].includes(args[0].toLowerCase()) && !args[1]) return msg.channel.send(`To load or view a backup, you need to provide a backup id.`)
		if(args[0] == `create`) {
			backup.setStorageFolder("backups/");
			let bd = await backup.create(msg.guild, {
				jsonBeautify: true,
				maxMessagesPerChannel: args[2]
			})

			axios({
				"method": "POST",
				"url": `${process.env.API_SERVER}/karen/backups/post/${bd.id}`,
				"headers": {
					"Authorization": process.env.AUTH_B64,
					"Content-Type": "application/json; charset=utf-8",
					'User-Agent': process.env.AUTH_USERAGENT
				},
				"auth": {
					"username": process.env.AUTH_USER,
					"password": process.env.AUTH_PASS
				},
				"data": bd
			})
			msg.author.send(`:heavy_check_mark: Backup of **${msg.guild.name}** saved!`,
				new Discord.MessageEmbed()
					.setAuthor(`${msg.guild.name} - Backup ${bd.id}`, msg.guild.iconURL({ dynamic:true, format: `png` }))
					.setColor(config.color)
					.setDescription(`Backup \`${bd.id}\` Saved!`)
					.addField(`Backup ID`, `\`${bd.id}\``, true)
					.setFooter(msg.author.tag, msg.author.avatarURL({ dynamic: true, format: `png` }))
					.setThumbnail(client.user.avatarURL({ dynamic: true, format: `png` })))
				.then(() => {
					msg.lineReply(`<@!${msg.author.id}>, bing bong check dms`)
				})
				.catch(_ => {
					msg.channel.send(`:warning: Couldn\`t send DM. The following may contain sensitive server information. Please store this information and delete the message soon after.`).then(mxg => {
						setTimeout(mxg => {
							mxg.delete()
						}, 15e3, mxg)
						msg.channel.send(`:heavy_check_mark: Backup of **${msg.guild.name}** saved!`,
							new Discord.MessageEmbed()
								.setAuthor(`${msg.guild.name} - Backup ${bd.id}`, msg.guild.iconURL({ dynamic:true, format: `png` }))
								.setDescription(`Backup \`${bd.id}\` Saved!`)
								.addField(`Backup ID`, `\`${bd.id}\``, true)
								.setFooter(msg.author.tag, msg.author.avatarURL({ dynamic: true, format: `png` }))
								.setThumbnail(client.user.avatarURL({ dynamic: true, format: `png` })))
					})
				})
		} else if(args[0] == `load`) {
			msg.delete()
			msg.channel.send(`:satellite: Fetching backup. Please wait...`).then(async mxg => {
				console.log(args[1])
				await axios({
					"method": "GET",
					"url": `${process.env.API_SERVER}/karen/backups/get/${args[1]}`,
					"headers": {
						"Authorization": process.env.AUTH_B64,
						'User-Agent': process.env.AUTH_USERAGENT
					},
					"auth": {
						"username": process.env.AUTH_USER,
						"password": process.env.AUTH_PASS
					}
				}).then(res => {
					fs.writeFileSync(app.dir + "/commands/backups/" + args[1] + ".json", JSON.stringify(res.data))
					console.log('yes')
				})
				backup.setStorageFolder(app.dir + "/commands/backups/");
				backup.fetch(args[1])
					.then(async (bi) => {
						mxg.delete()
						msg.channel.send(`Backup Found!`)
						backup.setStorageFolder(app.dir + "/commands/backups/");
						backup.load(bi.id, msg.guild).then(() => {
							backup.setStorageFolder(app.dir + "/commands/backups/");
							backup.remove(bi.id)
						})
					})
					.catch((err) => {
						// Log the error just in case
						console.error(err)
						mxg.delete()
						msg.channel.send(`:x: Backup Not Found... Please note that the backup id is **case-sensitive**`)
					})
			})
		} else if(args[0] == `view`) {
			msg.delete()
			msg.channel.send(`:satellite: Fetching backup. Please wait...`).then(mxg => {
				backup.fetch(args[1])
					.then(async (bi) => {
						const date = new Date(bi.data.createdTimestamp).toDateString();
						const guild = await client.guilds.fetch(bi.data.guildID)
						let embed = new Discord.MessageEmbed()
							.setAuthor(`${guild.name} - Backup Information`, guild.iconURL({ dynamic: true, format: `png` }))
							.addField("Backup ID", bi.id, true)
							.addField("Server ID", bi.data.guildID, true)
							.addField("Size", `${bi.size} mb`, true)
							.addField("Created", formatedDate, true)
							.setColor("#F15152");
					})
					.catch((err) => {
						// Log the error just in case
						console.error(err)
						mxg.delete()
						msg.channel.send(`:x: Backup Not Found... Please note that the backup id is **case-sensitive**`)
					})
			})
		}
	}
}
