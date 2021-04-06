const Discord = require('discord.js')
const axios = require('axios')

module.exports = {
  name: 'top',
  description: 'Returns top posts from a specified subreddit using the Reddit API',
  type: 'Reddit',
  usage: '[subreddit (withour r/)] [amount of posts (max is 10)]',
  example: 'kittykankles 5',
  args: true,
  async execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    let mes = msg.content.slice(0);

    if (mes === "") {
      msg.reply("You need to type subreddit name here!");
    } else {
      try {
        if (args[1] !== undefined && args[1] > 10) {
          msg.reply(`I can't send you more than **10** messages!`);
        } else {
          let res;
          if (args[1] === undefined) {
            res = await axios.get(
              `https://www.reddit.com/r/${args[0]}/top.json?limit=1&sort=week`
            );
          } else {
            res = await axios.get(
              `https://www.reddit.com/r/${args[0]}/top.json?limit=${args[1]}&sort=week`
            );
          }

          const posts = res.data.data.children;
          if (posts.length == 0) {
            return msg.reply(
              `There are no top posts on **${args[0]}**. `
            );
          }

          for (const post of posts) {
            if (post.data.over_18 === true && msg.channel.nsfw === false) {
              return msg.reply(
                `This post is NSFW! Try get it on NSFW channel!`
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
                footer: {
                  text: `Author - ${config.creator}`,
                  icon_url: `${config.logo}`
                },
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
              await msg.channel.send({ embed });
            }
          }
        }
      } catch (Error) {
        console.log(Error);
        msg.reply("No subreddits named `" + mes + "`.");
      }
    }
  }
}
