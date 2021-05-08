const Discord = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Help command',
  type: 'Help',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    var helppagevar = 2;

    // Dev check
    var allowedToUse = false;
    config.DevIDs.forEach(id => {
        if (msg.author.id == id)
            allowedToUse = true;
    });
    // Dev help embed
    if (allowedToUse) {
      var devhelp = new Discord.MessageEmbed()
      devhelp.setTitle('Developer Commands')
      devhelp.setColor(config.color)
      devhelp.setDescription('Developer commands. Only developers can use them!')
      devhelp.addField('Shutdown', 'Shut\'s down the bot')
      devhelp.addField('Reload', 'Changes a value in config.\nAvailable options: version, prefix, logo, creator.')
      devhelp.addField('Eval', 'Evaluates js code')
      devhelp.setFooter(`With ❤️ from ${config.creator} | Page 1 out of ${helppagevar}`, config.logo)
    }
    if (args[0] == undefined || args[0] == '1') {
      var help = new Discord.MessageEmbed()
      if (allowedToUse) help.setTitle(config.helpcreatorreply[Math.floor(Math.random() * config.helpcreatorreply.length)])
      else help.setTitle(`Welcome ${msg.author.username}`)
      help.setThumbnail(msg.author.avatarURL())
      help.setColor(config.color)
      help.setDescription(`I am ${config.botname} v${config.botversion} made by ${config.creator}. Prefix: ${config.prefix}\n**"*"** Means that it's not a command.`)
      help.addField('Moderation*', 'Moderation is enabled on this bot and cannot be changed off at the time being.', true)
      help.addField('Anime/Manga', `Returns information about an Anime or Manga.\nUsage: ${config.prefix}anime/manga [keyword(s)]`)
      help.addField('Reddit', 'Info about Reddit commands')
      help.addField('Profile', `Profile command.\nUsage: ${config.prefix}profile`)
      help.addField('Artist', `Searches up a spotify artist.\nUsage: ${config.prefix}artist [artist]`)
      help.addField('Spotify', `Searches up a spotify song.\nUsage: ${config.prefix}spotify [keyword(s)]`)
      help.addField('Suggest', `Suggest a command/feature.\nUsage:${config.prefix}suggest [suggestion]`)
      help.setFooter(`With ❤️ from ${config.creator} | Page 1 out of ${helppagevar}`, config.logo)
      msg.author.send(help);

      // if args 1 is undefined then sends mod and reddit commands
      if (args[0] == undefined) {
        // sends reddit commands
        let reddit = new Discord.MessageEmbed()
        reddit.setTitle('Reddit commands')
        reddit.setColor(config.color)
        reddit.setDescription('Reddit commands')
        reddit.setThumbnail('https://i.kym-cdn.com/photos/images/newsfeed/000/919/691/9e0.png')
        reddit.addField('New', `Returns the newest posts from a subreddit. \nUsage:${config.prefix}new [subreddit] [number of posts]`)
        reddit.addField('Top', `Returns the top posts from a subreddit. \nUsage:${config.prefix}top [subreddit] [number of posts]`)
        reddit.addField('Random', `Returns a random post from Reddit. \nUsage:${config.prefix}random`)
        reddit.setFooter(`With ❤️ from ${config.creator}`, config.logo)

        // sends mod commands
        let moderation = new Discord.MessageEmbed()
        moderation.setTitle('Moderation commands')
        moderation.setColor(config.color)
        moderation.setThumbnail('https://bot.to/wp-content/uploads/2020/09/security-hammer_5f7031bc036bd.png')
        moderation.setDescription('All moderation commands\n\nThere is a public mod log feature! To use it, create a channel called `public-mod-logs`.')
        moderation.addField('Purge', `Purges a set amount of messages (Must not be older than 2 weeks). Person using this command must be able to manage messages.\nUsage: ${config.prefix}purge [number from 2 to 100].`)
        moderation.addField('Kick', `Kicks the mentioned user. Person using the command must be able to kick.\nUsage: ${config.prefix}kick [user] [reason]`)
        moderation.addField('Ban', `Bans the mentioned user. Person using the command must be able to ban.\nUsage: ${config.prefix}ban [user] [reason]`)
        moderation.addField('Makerole', `Makes a new role based on the parameters. Person using the command must first have MANAGE_ROLES permission, and then have the same permissions as the role they are trying to make.\nUsage: ${config.prefix}makerole [name] [color (hex)] [permission]`)
        moderation.addField('Warn', `Warns a mentioned user. Person using the command must have KICK_MEMBERS permission.\nUsage: ${config.prefix}warn (show (shows all warns for mentioned person))`)
        moderation.addField('Settings', `Change various settings for this guild\nUsage: ${config.prefix}settings`)
        moderation.setFooter(`With ❤️ from ${config.creator}`, config.logo)
        msg.author.send(reddit)
        msg.author.send(moderation)
      }
      // if dev then send devhelp
      if (allowedToUse) msg.author.send(devhelp)
      msg.channel.send('Check your DMs')
    }
    else if (args[0] == '2') {
      var help2 = new Discord.MessageEmbed()
      help2.setTitle('Help 2')
      help2.setThumbnail(msg.author.avatarURL())
      help2.setColor(config.color)
      help2.setDescription(`${config.botname}'s Help Page 2`)
      help2.addField('Info', 'Provides information about a user.')
      help2.addField('qr', `Creates a QR code.\nUsage: ${config.prefix}qr [content]`)
      help2.addField('Creator', 'Info about the creator.')
      help2.addField('Invite', 'Creates Karen Bot\'s invite!')
      help2.addField('uwu', 'UwU-ifies your text!')
      help2.addField('Discord', 'Just invite links to discord servers')
      //help2.addField('SMS', `Only for a limited time ;). Command will be here until credits run out. Usage: ${config.prefix}sms. It will prompt you with additional messages where you input content and telephone number.`)
      help2.setFooter(`With ❤️ from ${config.creator} | Page 2 out of ${helppagevar}`, config.logo)
      msg.author.send(help2)
      msg.channel.send('Check your DMs')
    }
    else if (args[0].toLowerCase() == 'reddit') {
      let reddit = new Discord.MessageEmbed()
      reddit.setTitle('Reddit commands')
      reddit.setColor(config.color)
      reddit.setDescription('Reddit commands')
      reddit.setThumbnail('https://i.kym-cdn.com/photos/images/newsfeed/000/919/691/9e0.png')
      reddit.addField('New', `Returns the newest posts from a subreddit. \nUsage:${config.prefix}new [subreddit] [number of posts]`)
      reddit.addField('Top', `Returns the top posts from a subreddit. \nUsage:${config.prefix}top [subreddit] [number of posts]`)
      reddit.addField('Random', `Returns a random post from Reddit. \nUsage:${config.prefix}random`)
      reddit.setFooter(`With ❤️ from ${config.creator}`, config.logo)
      msg.author.send(reddit)
      msg.channel.send('Check your DMs')
    }
  }
}
