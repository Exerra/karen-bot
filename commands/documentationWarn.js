/*
    Created by Exerra on 04/04/2022
*/

const Discord = require('discord.js')
const fs = require('fs')
const axios = require("axios");
const {serverFunc} = require("../modules/serverFunc");
const app = require("../bot.js");

module.exports = {
	name: 'docwarn',
	description: 'Warns a user without sending a log',
	type: 'Moderation',
	args: true,
	usage: '@[user]',
	example: '@Carl-bot',
	execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;

		// defines mentioned person
		let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.get(args[1]);

		// defines filter, basically checks if the correct person is replying
		const filter = m => m.author.id === msg.author.id;

		if (!member) return msg.reply("Please mention a valid member of this server");


		let reason = "";

		// actual warn section

		if (member.id == client.user.id) {
			serverFunc.warn(msg.author.id, msg.guild.id, "Trying to warn the mighty Karen", client.user.id).then(res => {
				let user = res.data
				msg.react("✅")
			}).catch(err => {
				console.log(err)
				msg.react("⛔")
				msg.channel.send("The API returned an error. Now shoo, try again later")
			})
			return
		}

		if (msg.guild.members.cache.get(msg.author.id).roles.highest.comparePositionTo(member.roles.highest) < 0 && msg.author.permLevel < client.levelCache["Admins"]) return msg.lineReply("employees cannot warn their own managers you half brained imbecile")

		if (args.length > 1) {
			let index = args.indexOf(args[0]);
			args.splice(index, 1)
			args.forEach(d => {
				reason += `${d} `
			})

			serverFunc.warn(member.id, member.guild.id, reason, msg.author.id).then(res => {
				let user = res.data
				msg.react("✅")
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
