const Discord = require('discord.js')
const axios = require("axios");
const app = require("../bot.js");

module.exports = {
  name: 'uwu',
  description: 'uwu-ifiesh youw text >w<! ',
  args: true,
  usage: '<text to uwu>',
  example: 'I actually met Xi Jinping when I was just a teenager. I got roped into watching my 3 month old niece while my sister got her hair done. So there I am, sitting in the waiting area of a hair salon with my niece, and who walks in but Xi fucking Jinping himself. I was nervous as shit, and just kept looking at him as he was sitting there with the paper, waiting, but was too scared to say anything to him. Pretty soon my niece started crying, and I\'m trying to quiet her down because I didn\'t want her to bother Xi, but she wouldn\'t stop. Pretty soon he gets up and walks over. He started running his hands through her hair and asked what was wrong. I replied that she was probably hungry or something. So Xi put down his newspaper, picked up my niece and lifted his shirt. He breast fed her right there in the middle of the hair salon. Chill guy, really nice about it. Would let him breast feed my niece again.',
  type: 'Text',
  aliases: ['uwuify', 'uwu-ify'],
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    if (args[0] == null) msg.channel.send("You need to have something to say. >w<")


    if (msg.content.match(/<@[0-9]{18}?>/) || msg.content.match(/@everyone/)) {
      axios({
        "method": "POST",
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
        "data": {
          id: msg.author.id,
          guild: msg.guild.id,
          reason: "stop trying to ping people, dork",
          date: new Date(),
          moderator: client.user.id
        }
      }).then(res => {
        let user = res.data

        if (settingsmap.get(msg.guild.id).modLogEnabled == false) return

        const modLogChannelConst = msg.guild.channels.cache.get(settingsmap.get(msg.guild.id).modLogChannel);
        if (!modLogChannelConst) return

        const warnEmbed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle("Member warned")
            .setDescription(`<@${msg.author.id}> has been warned`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp(new Date())
            .addField("Reason", "stop trying to ping people, dork")
            .addField("Moderator", `<@${client.user.id}>`)
            .addField("Warn ID", res.data.warnID)

        modLogChannelConst.send({ embed: warnEmbed });

        return
      })

      return
    }


    args = args.join(' ')
    let uwu = args
    uwu = uwu.replace(/(?:l|r)/g, 'w')
    uwu = uwu.replace(/(?:L|R)/g, 'w')
    uwu = uwu.replace("no", "nyo")
    uwu = uwu.replace("mo", "myo")
    uwu = uwu.replace("No", "Nyo")
    uwu = uwu.replace("Mo", "Myo")
    uwu = uwu.replace("the", "de")
    uwu = uwu.replace("The", "De")
    uwu = uwu.replace("s", "sh")
    uwu = uwu.replace("S", "Sh")
    uwu = uwu.replace("ok", "oki")
    uwu = uwu.replace(/!+/g, `  >w< `)
    uwu = uwu.replace('source', 'sawuice')
    let f = Math.random() > 0.25
    if (f) {
        let c = uwu.charAt(0)
        uwu = c + '-' + uwu
    }
    msg.channel.send(uwu.toLowerCase() + " uwu!")
  }
}
