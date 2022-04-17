const Discord = require('discord.js')
const fs = require('fs')
const axios = require("axios");
const {serverFunc} = require("../modules/serverFunc");

module.exports = {
	name: 'warn',
	description: 'Warns a user',
	type: 'Moderation',
	args: true,
	usage: '@[user]',
	example: '@Carl-bot',
	permissions: ["MANAGE_GUILD"],
	execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;

		// defines mentioned person
		let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.get(args[1]);

		// defines filter, basically checks if the correct person is replying
		const filter = m => m.author.id === msg.author.id;

		if (!member) return msg.reply("Please mention a valid member of this server");

		if (args[0] == "remove") {
			if (args[2] == undefined) return msg.lineReply("Wheres the warn ID?? It is the large letter and number combination stupid ass.")

			axios({
				"method": "DELETE",
				"url": `${process.env.API_SERVER}/karen/warn`,
				"headers": {
					"Authorization": process.env.AUTH_B64,
					"Content-Type": "application/json; charset=utf-8",
					'User-Agent': process.env.AUTH_USERAGENT
				},
				"auth": {
					"username": process.env.AUTH_USER,
					"password": process.env.AUTH_PASS
				},
				"params": {
					"id": member.id,
					"warnID": args[2],
					"guild": msg.guild.id
				}
			}).then(res => {
				msg.react("✅")
				if (settingsmap.get(member.guild.id).modLogEnabled == false) return

				const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
				if (!modLogChannelConst) return

				const warnEmbed = new Discord.MessageEmbed()
					.setColor(config.color)
					.setTitle("Warn removed")
					.setDescription(`A warn for <@${member.id}> has been removed`)
					.setThumbnail(member.user.avatarURL())
					.setTimestamp(new Date())
					.addField("Moderator", `<@${msg.author.id}>`)
					.addField("Warn ID", args[1])
			}).catch(err => {
				msg.react("⛔")
				if (err.response.status == 404) msg.lineReply("That warn doesnt exist stupid ass bitch ass")
				if (err.response.status == 401) msg.lineReply("Umm, excuse me? Do you think I'm a fool?? That warn came from a different guild you stupid ass")
			})
			return
		}


		let reason = "";

		// actual warn section
		if (member.id == client.user.id) {
			serverFunc.warn(msg.author.id, msg.guild.id, "Trying to warn the mighty Karen", client.user.id).then(res => {
				let user = res.data
				msg.react("✅")


				if (settingsmap.get(msg.guild.id).modLogEnabled == false) return

				const modLogChannelConst = msg.guild.channels.cache.get(settingsmap.get(msg.guild.id).modLogChannel);
				if (!modLogChannelConst) return

				const warnEmbed = new Discord.MessageEmbed()
					.setColor(config.color)
					.setTitle("Member warned")
					.setDescription(`<@${msg.author.id}> has been warned`)
					.setThumbnail(msg.author.avatarURL())
					.setTimestamp(new Date())
					.addField("Reason", "Trying to warn the mighty Karen")
					.addField("Moderator", `<@${client.user.id}>`)
					.addField("Warn ID", res.data.warnID)

				modLogChannelConst.send({ embed: warnEmbed });
			}).catch(err => {
				console.log(err)
				msg.react("⛔")
				msg.channel.send("The API returned an error. Now shoo, try again later")
			})
			return
		}

		if (msg.guild.members.cache.get(msg.author.id).roles.highest.comparePositionTo(member.roles.highest) < 0 && msg.member.user.permLevel <= client.levelCache["Admins"]) return msg.lineReply("employees cannot warn their own managers you half brained imbecile")

		if (args.length > 1) {
			let index = args.indexOf(args[0]);
			args.splice(index, 1)
			args.forEach(d => {
				reason += `${d} `
			})

			serverFunc.warn(member.id, member.guild.id, reason, msg.author.id).then(res => {
				let user = res.data
				msg.react("✅")


				if (settingsmap.get(member.guild.id).modLogEnabled == false) return

				const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
				if (!modLogChannelConst) return

				const warnEmbed = new Discord.MessageEmbed()
					.setColor(config.color)
					.setTitle("Member warned")
					.setDescription(`<@${member.id}> has been warned`)
					.setThumbnail(member.user.avatarURL())
					.setTimestamp(new Date())
					.addField("Reason", reason)
					.addField("Moderator", `<@${msg.author.id}>`)
					.addField("Warn ID", res.data.warnID)

				modLogChannelConst.send({ embed: warnEmbed });
			}).catch(err => {
				console.log(err)
				msg.react("⛔")
				msg.channel.send("The API returned an error. Now shoo, try again later")
			})
			return
		}

		msg.channel
			.send("What is the reason? Type `abort` to, well, abort")
			.then((msg2) => {
				msg.channel
					.awaitMessages(filter, {
						max: 1,
						time: 15000
					})
					.then(collected => {
						if (collected) {
							reason = collected.first().content;
							if (reason == "abort") {
								return msg.channel.send("fine then")
							}
							msg2.edit(`Reason confirmed: ${reason}`)

							serverFunc.warn(member.id, member.guild.id, reason, msg.author.id).then(res => {
								let user = res.data
								msg.react("✅")
								collected.first().delete()
								msg2.delete()


								if (settingsmap.get(member.guild.id).modLogEnabled == false) return

								const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
								if (!modLogChannelConst) return

								const warnEmbed = new Discord.MessageEmbed()
									.setColor(config.color)
									.setTitle("Member warned")
									.setDescription(`<@${member.id}> has been warned`)
									.setThumbnail(member.user.avatarURL())
									.setTimestamp(new Date())
									.addField("Reason", reason)
									.addField("Moderator", `<@${msg.author.id}>`)
									.addField("Warn ID", res.data.warnID)

								modLogChannelConst.send({ embed: warnEmbed });
							}).catch(err => {
								console.log(err)
								msg.react("⛔")
								msg.channel.send("The API returned an error. Now shoo, try again later")
							})
						} else {
							msg.channel.send("Reason not uploaded, time limit ran out.");
							msg.react("⛔")
						}
					})
					.catch(() => {
						msg2.edit(
							"Reason was not entered. Your time limit ran out"
						);
						msg.react("⛔")
					});
			})
	}
}
