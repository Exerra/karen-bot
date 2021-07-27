// Dependencies
const Discord = require('discord.js');
const fs = require('fs');
require('discord-reply');
const client = new Discord.Client();
const config = require("./config.json");
const axios = require("axios");
/* const ytdl = require('ytdl-core'); */
const fetch = require('node-fetch')
const chalk = require('chalk')
client.config = require('./advanced_config.js')
client.kahootnames = require('./kahootnames.js')
require('./modules/functions.js')(client)
var NSFAI = require('nsfai');
require('dotenv').config()
const Spotify = require('node-spotify-api')
 
var nsfai = new NSFAI(process.env.NSFAI_KEY);

// commands stuff
let commands = {}; 
let slashCommands = {}

// mobile status
const Constants = require('./node_modules/discord.js/src/util/Constants.js') // skipcq: JS-0260
Constants.DefaultOptions.ws.properties.$browser = 'Discord iOS' // Or Discord Android

// winston logger (hopefully gonna replace console.log with this)
const winston = require('winston');
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

// Permissions
client.levelCache = {}
for(let i=0;i<client.config.permLevels.length;i++) {
	const thisLevel = client.config.permLevels[i]
	client.levelCache[thisLevel.name] = thisLevel.level
}

// Commands
client.commands = new Discord.Collection()
client.failedCommands = []
client.failedEvents = []
let cmdAlpha = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[Command]`), chalk.white('[Load]'), `Loading a total of ${commandFiles.length} commands`)
for(const file of commandFiles) {
	try{
		const command = require(`./commands/${file}`)
		if(!cmdAlpha[command.name.charAt(0)]) {
			cmdAlpha[command.name.charAt(0)] = true
		}
		client.commands.set(command.name, command)
	} catch(e) {
		client.failedCommands.push([file.split('.')[0], e.toString()])
		console.error(`Error while loading command: ${file.split('.')[0]}`, e)
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/logs/`,
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
        "content": `Error while loading command: ${file.split('0')[0]}: ${e}`,
        "type": "error"
      }
    })
	}
}


// Slash Commands
client.slashcommands = new Discord.Collection()
client.slashFailedCommands = []
client.slashFailedEvents = []
let slashCmdAlpha = {}
const slashCommandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))
console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[SlashCommand]`), chalk.white('[Load]'), `Loading a total of ${slashCommandFiles.length} commands`)
for(const file of slashCommandFiles) {
	try{
		const slashCommand = require(`./slashcommands/${file}`)
		if(!slashCmdAlpha[slashCommand.name.charAt(0)]) {
			slashCmdAlpha[slashCommand.name.charAt(0)] = true
		}
		client.slashcommands.set(slashCommand.name, slashCommand)
	} catch(e) {
		client.slashFailedCommands.push([file.split('.')[0], e.toString()])
		console.error(`Error while loading command: ${file.split('.')[0]}`, e)
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/logs/`,
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
        "content": `Error while loading slash command: ${file.split('0')[0]}: ${e}`,
        "type": "error"
      }
    })
	}
}
/* let evAlpha = {}
const eventFiles = fs.readdirSync('events/').filter(file => file.endsWith('.js'))
console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[Event]`), chalk.white('[Load]'), `Loading a total of ${eventFiles.length} events`)
for(const ev of eventFiles) {
	const eventName = ev.split('.')[0]
	try {
		if(!evAlpha[eventName.charAt(0)]) {
			evAlpha[eventName.charAt(0)] = true
		}
		const evx = require(`./events/${ev}`)
		client.on(eventName, evx.bind(null, client))
	} catch(e) {
		client.failedEvents.push([eventName, e.toString()])
		console.log(`Error while loading event: ${eventName}`, e)
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/logs/`,
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
        "content": `Error while loading event: ${eventName}: ${e}`,
        "type": "error"
      }
    })
	}
} */

// Gets settingsmap
axios({
	"method": "GET",
	"url": `${process.env.API_SERVER}/karen/settings/map/`,
	"headers": {
		"Authorization": process.env.AUTH_B64,
    'User-Agent': process.env.AUTH_USERAGENT
	},
	"auth": {
		"username": process.env.AUTH_USER,
		"password": process.env.AUTH_PASS
	}
}).then(res => {
    settingsmap = new Map(res.data); // skipcq: JS-0128
})

// Gets guildProfile map //! Levels are not yet released online so hush hush
axios({
	"method": "GET",
	"url": `${process.env.API_SERVER}/karen/guildProfile/map/`,
	"headers": {
		"Authorization": process.env.AUTH_B64,
    'User-Agent': process.env.AUTH_USERAGENT
	},
	"auth": {
		"username": process.env.AUTH_USER,
		"password": process.env.AUTH_PASS
	}
}).then(res => {
  guildProfile = new Map(res.data);
})

//* A bunch of functions for guild settings and stuff
const serverFunc = {
  /**
    *  @param {number} guild - The guild where to create settings
  */
  createGuildSettings: (guild) => {
    settingsmap.set(guild, {
      guildPrefix: "",
      moderatorOnlyCommands: false,
      timezone: "",
      karenMode: true,
      swearProtectionEnabled: false,
      modLogEnabled: false,
      modLogChannel: "",
      welcomeEnabled: false,
      welcomeChannel: "",
      antiNSFW: false,
      autoSpotifyEmbed: false,
      brewSearch: false,
      modLogSettingsBool: {
        memberJoined: false,
        memberLeft: false,
        memberBanned: false,
        memberUnbanned: false,
        messageEdited: false,
        messageDeleted: false,
        messageContainsSwear: false,
        bulkMessageDeletion: false,
        channelCreated: false,
        channelDeleted: false,
        roleCreated: false,
        roleUpdated: false,
        roleGiven: false,
        roleRemoved: false,
        nicknameChanged: false,
        modCommandUsed: false,
        memberJoinedVoiceChannel: false,
        memberLeftVoiceChannel: false,
        memberMovedToVoiceChannel: false,
        logInvites: false
      }
    })
    axios({
        "method": "POST",
        "url": `${process.env.API_SERVER}/karen/settings/map/`,
        "headers": {
          "Authorization": process.env.AUTH_B64,
          "Content-Type": "application/json; charset=utf-8",
          'User-Agent': process.env.AUTH_USERAGENT
        },
        "auth": {
          "username": process.env.AUTH_USER,
          "password": process.env.AUTH_PASS
        },
        "data": JSON.stringify([... settingsmap])
    })
  },
  /**
    *  @param {Map} settings - Settings to update
  */
  updateGuildSettings: (settings) => {
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/settings/map/`,
      "headers": {
        "Authorization": process.env.AUTH_B64,
        "Content-Type": "application/json; charset=utf-8",
        'User-Agent': process.env.AUTH_USERAGENT
      },
      "auth": {
        "username": process.env.AUTH_USER,
        "password": process.env.AUTH_PASS
      },
      "data": JSON.stringify([... settings])
    })
  },
  getSettingsMap: () => {
    axios({
      "method": "GET",
      "url": `${process.env.API_SERVER}/karen/settings/map/`,
      "headers": {
        "Authorization": process.env.AUTH_B64,
        'User-Agent': process.env.AUTH_USERAGENT
      },
      "auth": {
        "username": process.env.AUTH_USER,
        "password": process.env.AUTH_PASS
      }
    }).then(res => {
      settingsmap = new Map(res.data); // skipcq: JS-0128
    })
  },
  /**
    *  @param {number} guild - Guild where it takes place
    *  @param {number} user - User which activated it
  */
  createGuildProfile: (guild, user) => {
    guildUser = `${guild}-${user}`
    guildProfile.set(guildUser, {
      money: 100,
      level: 1,
    })
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/guildProfile/map/`,
      "headers": {
        "Authorization": process.env.AUTH_B64,
        "Content-Type": "application/json; charset=utf-8",
        'User-Agent': process.env.AUTH_USERAGENT
      },
      "auth": {
        "username": process.env.AUTH_USER,
        "password": process.env.AUTH_PASS
      },
      "data": JSON.stringify([... guildProfile])
    })
    console.log(guildProfile)
  },
  /**
    *  @param {Map} profile - Updated profile
  */
  updateGuildProfile: (profile) => {
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/guildProfile/map/`,
      "headers": {
        "Authorization": process.env.AUTH_B64,
        "Content-Type": "application/json; charset=utf-8",
        'User-Agent': process.env.AUTH_USERAGENT
      },
      "auth": {
        "username": process.env.AUTH_USER,
        "password": process.env.AUTH_PASS
      },
      "data": JSON.stringify([... profile])
    })
  },
  getGuildProfile: () => {
    axios({
      "method": "GET",
      "url": `${process.env.API_SERVER}/karen/guildProfile/map/`,
      "headers": {
        "Authorization": process.env.AUTH_B64,
        'User-Agent': process.env.AUTH_USERAGENT
      },
      "auth": {
        "username": process.env.AUTH_USER,
        "password": process.env.AUTH_PASS
      }
    }).then(res => {
      guildProfile = new Map(res.data);
    })
  },
}

let statusQuotes = [
  "5G causes corona cancer",
  "I have a medical condition that doesn't let me wear masks",
  "Corona vaccines put Microsoft chips in you",
  "Vaccines cause autism",
  "The earth is flat",
  "One two three four you all suck and need to get baptised",
  "im gay for jesus mom, mary",
  "THE LOCHNESS MONSTER HAS RETURNED",
  "AAAAAAAAAAAAAAAAAAAAAAA",
  "THE PURGE IS COMING",
  "WHERE ARE MY KIDS",
  "luki works for the government",
  "I ATE MARIJUANA BREAD PLEASE HELP",
  "are you vaccinated? no? good",
  "BUT THIS MOMMY BLOG SAYS ITS BAD",
  "facebook is best social media"
]

client.once('ready', async () => {
  logger.log('info', `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  if (process.env.VALIDATION  == undefined) {
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/logs/`,
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
        "content": `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`,
        "type": "info"
      }
    }) 
  }

  /* client.user.setActivity(`${client.guilds.cache.size} servers | ` + config.prefix +`help`, { type: "WATCHING" }); */
  let why = statusQuotes[Math.floor(Math.random()*statusQuotes.length)];
  // emergency status
  //why = "⚠️ WELCOME FUNCTIONALITY DISABLED ⚠️"
  client.user.setActivity(config.prefix +`help | ${why}`, { type: "WATCHING" });

  let statsTimeout = () => {
    const promises = [
      client.shard.fetchClientValues('guilds.cache.size'),
      client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
    ];

    Promise.all(promises)
    .then(results => {
      const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
      const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

      axios({
        "method": "POST",
        "url": `${process.env.API_SERVER}/karen/stats/`,
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
          "servercount": `${totalGuilds}`,
          "users": `${totalMembers}`,
          "DiscordJS": `${Discord.version}`
        }
      })
    })
    .catch(console.error);
  }
  if (process.env.VALIDATION  == undefined) {
    statsTimeout()
    var myVar = setInterval(statsTimeout, 600000)
  }

  // ------------- Slash commands -------------

  // Puts the slash commands in ./slashcommands/ in an array
  let slashCommandsArr = client.slashcommands.array()

  // For each command, create a slash command
  for(const command of slashCommandsArr) {
    //                                            Only used for testing
    client.api.applications(client.user.id)/* .guilds('701064832136249355') */.commands.post({data: {
      "name": command.name,
      "description": command.description,
      "options": command.options
    }})
  }

  // When a slash command is triggered
  client.ws.on('INTERACTION_CREATE', async interaction => {

    // Get the slash command that was triggered and  assign it to command
    var slashCommandName = interaction.data.name
    let command = client.slashcommands.get(slashCommandName)
        || client.slashcommands.find(c => c.aliases && c.aliases.includes(slashCommandName))


    // Execute command
    try {
      await command.execute(client, interaction)
    } catch (error) {
      console.error(error)
      axios({
        "method": "POST",
        "url": `${process.env.API_SERVER}/karen/logs/`,
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
          "content": `Slash command "${command.name}" by ${interaction.member.user.id} - ${error}`,
          "type": "error"
        }
      })
      axios.post(process.env.REGULAR_WEBHOOK, {
        "content": `Slash command "${command.name}" by ${interaction.member.user.id} - ${error}`,
        "embeds": null,
        "username": 'Karen Bot Error (Slash)',
        "avatar_url": "https://karen.exerra.xyz/assets/BotLogoNoOutline.png"
      })
    }
  })
});
client.once('reconnecting', async () => {
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `Reconnecting!`,
    "type": 'info'
  })
  let why = statusQuotes[Math.floor(Math.random()*statusQuotes.length)];
  // emergency status
  //why = "⚠️ WELCOME FUNCTIONALITY DISABLED ⚠️"
  client.user.setActivity(config.prefix +`help | ${why}`, { type: "WATCHING" });
});
client.once('disconnect', async () => {
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `Disconnect!`,
    "type": 'info'
  })
  let why = statusQuotes[Math.floor(Math.random()*statusQuotes.length)];
  // emergency status
  //why = "⚠️ WELCOME FUNCTIONALITY DISABLED ⚠️"
  client.user.setActivity(config.prefix +`help | ${why}`, { type: "WATCHING" });
});

client.on("guildDelete", async guild => {
  // this event triggers when the bot is removed from a guild.
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `I have been removed from: ${guild.name} (id: ${guild.id})`,
    "type": 'info'
  })
  let why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
});

client.on("guildCreate", async guild => {
  // This event triggers when the bot joins a guild.
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`,
    "type": 'info'
  })
  let why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
});

client.on('guildMemberAdd', async member => {
  let why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
  axios({
    "method": "POST",
    "url": `${process.env.API_SERVER}/karen/profile/get/`,
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
      "id": member.id
    }
  }).then((response) => {
    // If success, return
    return
  }, (error) => {
    // If error (which means person doesn't have a profile), create one
    const profile = {
      description: "None",
      gender: "Not specified",
      birthday: "Not specified",
      country: "None",
      rank: "",
      languages: "None"
    }
    // Sends profile to server
    axios({
      "method": "POST",
      "url": `${process.env.API_SERVER}/karen/profile/`,
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
        profile,
        "id": member.id
      }
    })
  });

  // this is my shitty way of handling role adds
  // dont call me out on this, this is our little secret ok?
  if (member.guild.id == '826439565086425098') {
    let role = member.guild.roles.cache.find(r => r.name === "peasants");
    member.roles.add(role)
  }
  if (member.guild.id == '828999868239708220') {
    let role1 = member.guild.roles.cache.get("829007236222812222");
    let role2 = member.guild.roles.cache.get("829007055745974312");
    let role3 = member.guild.roles.cache.get("829006864574185502");
    let role4 = member.guild.roles.cache.get("829032788652195850");
    let role5 = member.guild.roles.cache.get('829005429655863387')
    member.roles.add(role1)
    member.roles.add(role2)
    member.roles.add(role3)
    member.roles.add(role4)
    member.roles.add(role5)
  }
  if (settingsmap.get(member.guild.id).welcomeEnabled == false) return;
  const channel = member.guild.channels.cache.find(ch => ch.id == settingsmap.get(member.guild.id).welcomeChannel);
  channel.send(`Welcome to this server, ${member}.`);
  member.send('READ THE RULES\nDO IT NOW\nYOU BETTER FUCKING DO IT\n\n\n~~dont take it seriously, but like please do read the rules :)~~ ')
});

client.on('message', async msg => {

  if (msg.guild.id == '793297057216856085') console.log(msg.content)

  // We do a little trolling
  if (msg.author.id == "867057530891272262") {
    if (msg.embeds.length) {
      return
    }
    msg.delete()
  }

  if(msg.content.includes(process.env.DISCORD_TOKEN)) return msg.delete()
  if(msg.author.bot || msg.webhookID || !msg.author) return

  if (msg.guild.id == '793297057216856085') console.log(1)
  // Tbh idk why I did this, I wrote this at like 04:00
  try {
    if (msg.guild.id == '793297057216856085') console.log(1.1)
    let guildPrefixLet = settingsmap.get(msg.guild.id).guildPrefix // skipcq: JS-0128
    if (settingsmap.get(msg.guild.id).brewSearch == undefined) {
      await settingsmap.set(msg.guild.id, {...settingsmap.get(msg.guild.id), brewSearch: false})
      if (msg.guild.id == '793297057216856085') console.log("1.1.1")
      serverFunc.updateGuildSettings(settingsmap)
      console.log(msg.guild.id)
    }
  } catch (err) {
    if (msg.guild.id == '793297057216856085') console.log(1.2)
    serverFunc.createGuildSettings(msg.guild.id)
  }


  // GARBAGE CODE
  const spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });
  const matchSpotifyTrackUrl = (url) => {
    var p = /https:\/\/open\.spotify\.com\/track\//;
    return (url.match(p)) ? true : false ;
  }

  const matchSpotifyArtistUrl = (url) => {
    var p = /https:\/\/open\.spotify\.com\/artist\//;
    return (url.match(p)) ? true : false ;
  }

  const matchSpotifyPlaylistUrl = (url) => {
    var p = /https:\/\/open\.spotify\.com\/playlist\//;
    return (url.match(p)) ? true : false ;
  }

  // Args thing for the {{thing}}
  const foundargs = msg.content.split(" ")
  var found = [],          // an array to collect the strings that are found
    rxp = /{{([^}]+)}}/g,
    str = msg,
    curMatch;

  while( curMatch = rxp.exec( str ) ) {
    found.push( curMatch[1].toLowerCase() );
  }

  const spotargs = msg.content.split(" ");

  if (matchSpotifyTrackUrl(spotargs[0])) {
    if (!settingsmap.get(msg.guild.id).autoSpotifyEmbed) return
    spotify
      .request(`https://api.spotify.com/v1/tracks/${spotargs[0].substr(31)}`)
      .then(function(data) {
        if (!data.album) return;
        const embed = new Discord.MessageEmbed()
        embed.setTitle(data.name)
        embed.setURL(data.external_urls.spotify)
        embed.setThumbnail(data.album.images[0].url)
        embed.setAuthor('Spotify Song', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png')
        embed.setColor(config.color)
        embed.addField('Monthly popularity', `${Math.trunc(data.popularity / 10)} / 10`)
        embed.addField('Album name', data.album.name)
        embed.addField('Album Type', data.album.album_type.capitalize())
        // thanks to @levichlev for making this thingy
        // i forgot about "for" loops (i dont really know why) when making this and was stumped on how to make it nicer if there are multiple artists :)
        var aname = 'Artist\'s name'
        if (data.album.artists.length != 1) {
            var a = [];
            for (i in data.album.artists) {
                a[i] = data.album.artists[i].name;
            }
            aname = 'Artist\'s names'
            embed.addField(aname, a.join('\n'))
        } else {
            embed.addField(aname, data.album.artists[0].name)
        }
        embed.addField('Release Date', data.album.release_date + '\n(Year-Month-Day)', true)
        embed.setTimestamp()
        embed.setFooter(`Triggered by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
        msg.delete()
        msg.channel.send(embed)
      })
      .catch(function(err) {
        console.log('eror tiem' + err)
      });
  } else if (matchSpotifyArtistUrl(spotargs[0])) {
    if (!settingsmap.get(msg.guild.id).autoSpotifyEmbed) return
    spotify
      .request(`https://api.spotify.com/v1/artists/${spotargs[0].substr(32)}`)
      .then(function(data) {
        var popularity = data.popularity / 10;
        const embed = new Discord.MessageEmbed()
        embed.setTitle(data.name)
        embed.setURL(data.external_urls.spotify)
        embed.setThumbnail(data.images[0].url)
        embed.setAuthor('Spotify Artist', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png')
        embed.setColor(config.color)
        embed.addField('Followers', data.followers.total)
        embed.addField('Monthly popularity', `${Math.trunc(data.popularity / 10)} / 10`)
        var aname = 'Genres'
        if (data.genres.length != 1) {
          var a = [];
          for (i in data.genres) {
            a[i] = data.genres[i].toString().capitalize()
          }
          aname = 'Genres'
          embed.addField(aname, a.join('\n'))
        }
        else {
          embed.addField(aname, data.album.genres[0])
        }
        embed.setTimestamp()
        embed.setFooter(`Triggered by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))
        return msg.channel.send(embed)


        .catch(function (err) {
          console.error('Error occurred: ' + err);
        });
      })
      .catch(err => {

      })
  } else if (matchSpotifyPlaylistUrl(spotargs[0])) {
    if (!settingsmap.get(msg.guild.id).autoSpotifyEmbed) return
    spotify
      .request(`https://api.spotify.com/v1/playlists/${spotargs[0].substr(34)}?total=1`)
      .then(function(data) {
        const embed = new Discord.MessageEmbed()
        embed.setTitle(data.name)
        embed.setURL(data.external_urls.spotify)
        embed.setThumbnail(data.images[0].url)
        embed.setAuthor('Spotify Playlist', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png')
        embed.setColor(config.color)
        embed.addField('Owner', `[${data.owner.display_name}](${data.owner.external_urls.spotify})`)
        embed.addField('Followers', data.followers.total)
        embed.addField('Song count', data.tracks.total)
        embed.addField('Collaborative', data.collaborative.toString().capitalize())
        embed.addField('Public', data.public.toString().capitalize())

        embed.setTimestamp()
        embed.setFooter(`Triggered by ${msg.author.username}`, msg.author.avatarURL({ dynamic: true }))

        msg.channel.send(embed)

      })
  }

  /*
    TODO: Finish this brew search; Finish the brew search settings; Tidy up code; Remove brew.js
  */
  
  // If it found something, continue
  if (found !== []) {
    // If the brewSearch setting is turned off, return
    if (!settingsmap.get(msg.guild.id).brewSearch) return

    for (let i in found) {
      // Call the API
      axios.get(`https://formulae.brew.sh/api/formula/${found[i]}.json`).then(res => {
        let data = res.data
        // Testing stuff, delyeet later
        const embed = new Discord.MessageEmbed()
          .setColor("FFA743")
          .setTitle(data.name)
          .setURL(`https://formulae.brew.sh/formula/${data.name}`)
          .setThumbnail('https://brew.sh/assets/img/homebrew-256x256.png')
          .setDescription(data.desc)
          .setAuthor('brew.sh')
          .addFields(
            { name: `Stable version`, value: data.versions.stable, inline: true },
            { name: "License", value: data.license, inline: true }
          )
          // Check if the bottle files are longer than 1
          // Theyre needed to check compability
          if (data.bottle.stable.files.length != 1) {
            // Gets the keys in the API responses object
            var compabilityItems = Object.keys(data.bottle.stable.files)
            // Testing stuff

            // Function to set compability item, makes the switch statement easier to type && less cluttered
            const setCompabilityItem = (item, value) => {
              compabilityItems[item] = value
            }

            // For each item in the compabilityItems array, check the value and make it more human
            for (let i in compabilityItems) {
              switch(compabilityItems[i]) {
                case 'all':
                  setCompabilityItem(i, 'All macOS and Linux systems')
                  break;
                case 'arm64_big_sur':
                  setCompabilityItem(i, 'Apple Silicon Big Sur')
                  break;
                case 'big_sur':
                  setCompabilityItem(i, 'Intel Big Sur')
                  break;
                case 'catalina':
                  setCompabilityItem(i, 'Intel Catalina')
                  break;
                case 'mojave':
                  setCompabilityItem(i, 'Intel Mojave')
                  break;
                case 'high_sierra':
                  setCompabilityItem(i, 'Intel High Sierra')
                  break;
                case 'sierra':
                  setCompabilityItem(i, 'Intel Sierra')
                  break;
                case 'el_capitan':
                  setCompabilityItem(i, 'Intel El Capitan')
                  break;
                case 'yosemite':
                  setCompabilityItem(i, 'Intel Yosemite')
                  break;
                case 'mavericks':
                  setCompabilityItem(i, 'Intel Mavericks')
                  break;
                case 'x86_64_linux':
                  setCompabilityItem(i, 'x86_64 Linux')
                  break;
              }
            }
            // Add the compability items in a field
            embed.addField("Compability", compabilityItems.join('\n'))
          } else {
            let compabilityItems = Object.keys(data.bottle.stable.files)
              embed.addField("Compability", compabilityItems[0])
          }

          // Checks if outdated, disabled and deprecated is true
          // If it is true, then it adds the field, but if it isn't, it doesn't because it looks ugly
          if (data.outdated == true) embed.addField('Outdated?', data.outdated.toString())
          if (data.disabled == true) embed.addField('Disabled?', data.outdated.toString())
          if (data.deprecated == true) {
            embed.addField('Deprecated?', data.deprecated.toString())
            embed.addField('Date of deprecation', data.deprecated_date, true)
            embed.addField('Reason for deprecation', data.deprecated_reason, true)
          }
          // Total amount of downloads
          embed
            .addFields(
              { name: "Downloads (30d)", value: data.analytics.install['30d'][Object.keys(data.analytics.install['30d'])[0]], inline: true },
              { name: "Downloads (365d)", value: data.analytics.install['365d'][Object.keys(data.analytics.install['365d'])[0]], inline: true }
            )
            .setFooter(`Requested by ${msg.author.username} • Generated at ${data.generated_date}`, msg.author.avatarURL({ dynamic: true }))

          // Ofc, send the message when we're done
          msg.channel.send(embed)
      }, error => {
        // just return
        return
      })
    }
  }
  // garbage code end



  if (msg.attachments.size > 0) {
    if (msg.attachments.every(attachIsImage)){
      //something
    }
  }
          
  function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    function handleResult(result) {
      if (result.sfw) {
        return
      } else {
        msg.reply('NSFW images are not allowed in SFW channels!')
        msg.delete()
      }
    }
    
    function handleError(error) {
      console.error('hm');
    }
    if (settingsmap.get(msg.guild.id).antiNSFW == false) return;
    if (msg.channel.nsfw) return;
    nsfai.predict(url).then(handleResult).catch(handleError);
  }

  const executeCommand = async (prefix) => {
    if (msg.guild.id == '793297057216856085') console.log(2)
    var args = msg.content.slice(prefix.length).split(/\s+/)
    
    var commandName = args.shift().toLowerCase()
    let command = client.commands.get(commandName)
        || client.commands.find(c => c.aliases && c.aliases.includes(commandName))

    if(!command) return;

    const level = client.permLevel(msg)
    if(level < client.levelCache[command.permissionsLevel || "User"]) {
      return msg.channel.send(`Shut up, you're not my mom 😒🙄`)
    }
    if (msg.guild.id == '793297057216856085') console.log(3)

    msg.author.permLevel = level
    msg.member.user.permLevel = level

    try {
      if(command.args && !args.length) {
        let reply = `Where are the arguments?? Explain yourself, WHERE IN THE FUCK DO YOU SEE ARGUMENTS!?!?!?`

        if(command.usage) {
          reply += `\nProper Usage: \`${prefix}${command.name} ${command.usage.replace('shard_count', 4)}\``
        }

        if(command.example) {
          // TODO: Repalce shard_count with a non-static count (-1 since shard 1 is id 0)
          reply += `\n\`${prefix}${command.name} ${command.example.replace('shard_count', 3)}\``
        }
        if (msg.guild.id == '793297057216856085') console.log(4)
        return msg.channel.send(reply)
      }

      if(command.nsfw && !msg.channel.nsfw) {
        if(!msg.channel.name.includes('nsfw')) return msg.channel.send(`Ugh this is an NSFW command, go to an NSFW channel 🙄`)
      }

      msg.channel.startTyping()
      await command.execute(client, msg, args)
      msg.channel.stopTyping()
    } catch (error) {
      console.error(error)
      axios({
        "method": "POST",
        "url": `${process.env.API_SERVER}/karen/logs/`,
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
          "content": `"${msg}" by ${msg.author.id} - ${error}`,
          "type": "error"
        }
      })
      axios.post(process.env.REGULAR_WEBHOOK, {
        "content": `"${msg}" by ${msg.author.id} - ${error}`,
        "embeds": null,
        "username": 'Karen Bot Error',
        "avatar_url": "https://karen.exerra.xyz/assets/BotLogoNoOutline.png"
      })
      msg.reply('there was an error trying to execute that command.')
      msg.channel.stopTyping()
    }
  }

  if (msg.content.toLowerCase().startsWith(config.prefix)) executeCommand(config.prefix)
  else if (settingsmap.get(msg.guild.id).guildPrefix !== "") {
    if (msg.content.toLowerCase().startsWith(settingsmap.get(msg.guild.id).guildPrefix)) executeCommand(settingsmap.get(msg.guild.id).guildPrefix)
  }

  var message = msg.content.toLowerCase();
  config.badwords.forEach(function(value) {
    if(msg.content.toLowerCase() == value) {
      if (msg.author.permLevel >= 4) return;
      if (!settingsmap.get(msg.guild.id).swearProtectionEnabled) return;
      msg.delete();
      msg.reply(config.swearreply.randomize());
    }
  });

  // Literally the first lines of code in this project (back in 2019 or something). I find it funny how this has sorta became my "author check"
  if(message === '> >run ping') {
      msg.channel.send(`**Running Ping.exe...**`).then((msg)=> {
          setTimeout(() => {
            msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**').then((msg)=> {
              setTimeout(() => {
                msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**\n> >run Ping Pong').then((msg)=> {
                  setTimeout(() => {
                    msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**\n> >run Ping Pong \n**Running Ping Pong subroutine**').then((msg)=> {
                      setTimeout(() => {
                          msg.edit('**Running Ping.exe...**\n**Found subroutine named "Ping Pong"**\n> >run Ping Pong \n**Running Ping Pong subroutine**\n**Error:** Subroutine corrupted, cancelling.');
                      }, 2000)
                    });
                  }, 2000)
                });
              }, 2000)
            });
          }, 2000)
        });
  }
});


client.login(process.env.DISCORD_TOKEN);
exports.client = client;
exports.config = config;
exports.commands = commands;
exports.Discord = Discord;
exports.serverFunc = serverFunc;
exports.dir = __dirname;
