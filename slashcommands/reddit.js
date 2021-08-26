const Discord = require('discord.js')

module.exports = {
  "name": "reddit",
  "description": "Various reddit commands",
  "options": [
    {
      "type": 1,
      "name": "top",
      "description": "Check top posts in a subreddit",
      "options": [
        {
          "type": 3,
          "name": "subreddit",
          "description": "Subreddit to check (without r/)",
          "required": true,
          "choices": []
        },
        {
          "type": 4,
          "name": "count",
          "description": "How many messages to send (max is 10)",
          "required": false
        }
      ]
    },
    {
      "type": 1,
      "name": "random",
      "description": "Get random posts from Reddit",
      "options": [
        {
          "type": 4,
          "name": "count",
          "description": "How many messages to send (max is 10)",
          "required": false
        }
      ]
    },
    {
      "type": 1,
      "name": "new",
      "description": "Check new posts in a subreddit",
      "options": [
        {
          "type": 3,
          "name": "subreddit",
          "description": "Subreddit to check (without r/)",
          "required": true
        },
        {
          "type": 4,
          "name": "count",
          "description": "How many messages to send (max is 10)",
          "required": false
        }
      ]
    }
  ],
  async execute(client, interaction) {
    const app = require('../bot.js');
    let config = app.config;
    const axios = require('axios')

    // The post(s) will be put here
    let res

    let options = interaction.data.options
    console.log(options[0])

    // Just for error handling
    if (options[0].type !== 1) return

    if (options[0].name == 'top') {
    	if (options[0].options[1] !== undefined && options[0].options[1].value > 10) {
    		client.api.interactions(interaction.id, interaction.token).callback.post({data: {
		      type: 4,
		      data: {
		        content: `I can't send you more than **10** messages!`,
		        flags: 64
		      }
		    }})

		    return
    	} else if (options[0].options[1] == undefined) {
    		res = await axios.get(
          `https://www.reddit.com/r/${options[0].options[0].value}/top.json?limit=1&sort=week`
        );
    	} else {
    		res = await axios.get(
          `https://www.reddit.com/r/${options[0].options[0].value}/top.json?limit=${options[0].options[1].value}&sort=week`
        );
    	}

    	const posts = res.data.data.children;
      if (posts.length == 0) {
        return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
		      type: 4,
		      data: {
		        content: `There are no top posts on **${options[0].options[0].value}**. `,
		        flags: 64
		      }
		    }})
      }

	    console.log(interaction)

    	for (const post of posts) {
        if (post.data.over_18 === true && client.channels.cache.get(interaction.channel_id).nsfw === false) {
					client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			      type: 4,
			      data: {
			        content: `This post is NSFW! Try get it on NSFW channel!`,
			        flags: 64
			      }
			    }})

			    return
        } else {

        	client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			      type: 5
			    }})
			    
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

          const embed = new Discord.MessageEmbed()
          	.setAuthor(text.author, "https://i.kym-cdn.com/photos/images/newsfeed/000/919/691/9e0.png")
          	.setColor(config.color)
          	.setTitle(text.title)
          	.setURL(`https://www.reddit.com${text.permalink}`)
          	.setDescription(des)
          	.setImage(image)
          	.addFields(
          		{ name: `❤ Upvoted by`, value: `${text.ups} people`, inline: true },
          		{ name: `💬 Commented by`, value: `${text.num_comments} people`, inline: true }
          	)
          	.setFooter(`Author - ${config.creator}`, config.logo)
          	.setTimestamp(date)

          await new Discord.WebhookClient(client.user.id, interaction.token).send(embed)
        }
      }


    }
  }
}
