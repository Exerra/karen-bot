const Discord = require('discord.js')
const axios = require('axios')
const {log} = require("../modules/log");

module.exports = {
	name: 'new',
	description: 'Returns new posts from a specified subredit using the Reddit API',
	type: 'Reddit',
	usage: '[subreddit (without r/)] [number of posts (max is 10)]',
	example: 'kittykankles 3',
	args: true,
	apiData: {
		usesAnAPI: true,
		listOfAPIs: [
			"reddit"
		]
	},
	async execute(client, msg, args) {
		const app = require('../bot.js');
		let config = app.config;
		let mes = args.slice(0);

		if (mes === "") {
			msg.reply("You need to type subreddit name here!");
		} else {
			try {
				if (args[1] !== undefined && args[1] > 10) {
					msg.reply(`I can't send you more than **10** messages.`);
				} else {
					let res;
					if (args[1] === undefined) {
						res = await axios.get(
							`https://www.reddit.com/r/${args[0]}/new.json?limit=1&sort=new`
						);
					} else {
						res = await axios.get(
							`https://www.reddit.com/r/${args[0]}/new.json?limit=${args[1]}&sort=new`
						);
					}

					const posts = res.data.data.children;

					if (posts.length == 0) {
						return msg.reply(`Nothing new in **${args[0]}**.`);
					}

					for (const post of posts) {
						if (post.data.over_18 === true && msg.channel.nsfw === false) {
							return msg.reply(
								`Post is NSFW, go execute this command in an nsfw channel or something 🙄`
							);
						} else {
							const text = post.data;
							const extension = [".jpg", ".png", ".svg", ".mp4", ".gif"];
							const date = new Date(text["created_utc"] * 1000);
							let image;
							let pre;
							let media;
							let des;
							if (text.selftext.length > 1000) {
								des = text.selftext.substring(0, 999) + "...";
							} else {
								des = text.selftext
							}

							if (text.preview !== undefined) {
								pre = text.preview.images[0].source.url;
							}

							if (text.media !== null) {
								media = text.thumbnail
							}

							if (extension.includes(text.url.slice(-4))) {
								image = text.url;
							} else if (pre !== null || media !== null) {
								if (media !== null) {
									image = media;
								} else {
									image = pre;
								}
							} else {
								image = null;
							}

							if (text.title.length > 256) text.title = text.title.truncate(256)

							const embed = {
								title: `${text.title}`,
								url: `https://www.reddit.com${text.permalink}`,
								author: {
									name: text.author,
									icon_url:
										"https://i.kym-cdn.com/photos/images/newsfeed/000/919/691/9e0.png"
								},
								description: des,
								timestamp: date,
								image: {
									url: image
								},
								color: `${config.colordecimal}`,
								"fields": [
									{
										"name": `❤ Upvoted by`,
										"value": `${text.ups} people`,
										"inline": true
									},
									{
										"name": `💬 Commented by`,
										"value": `${text.num_comments} people`,
										"inline": true
									}
								]
							};
							await msg.channel.send({embed});
						}
					}
				}
			} catch (err) {
				log(error, "error")
				msg.reply("No subreddits named `" + mes + "`.");
			}
		}
	}
}
