const Discord = require('discord.js')

module.exports = {
	name: 'purge',
	description: 'Deletes a lot of messages at once',
	type: 'Moderation',
	args: true,
	usage: '[number of messages]',
	example: '5',
	aliases: ['purg', 'bulkdelete', 'delete-bulk', 'bulk-delete', 'prune'],
    permissions: ["MANAGE_MESSAGES"],
	async execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;

        const deleteCount0 = parseInt(args[0], 10);
        var deleteCount1 = deleteCount0 + 1;


        if (!deleteCount0 || deleteCount0 < 2 || deleteCount0 > 99) return msg.reply("Please provide a number between 2 and 99 for the number of messages to delete");

        const fetched = await msg.channel.messages.fetch({limit: deleteCount1});
        msg.channel.bulkDelete(fetched)
            .catch(error => msg.reply(`Couldn't delete messages because of: ${error}`));
	}
}
