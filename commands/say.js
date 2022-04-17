const Discord = require('discord.js')

module.exports = {
	name: 'say',
	description: 'Say a message',
	type: 'Moderation',
	permissions: ["MANAGE_MESSAGES"],
	execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;

		const sayMessage = args.join(" ");
		msg.delete().catch(O_o => {});
		msg.channel.send(sayMessage);
	}
}
