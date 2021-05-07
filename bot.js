/* 
  TODO: Create a node module to make embeds and message sending easier (maybe make it public too)
*/
// Dependancies
const Discord = require('discord.js');
const fs = require('fs');
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
 
var nsfai = new NSFAI(process.env.NSFAI_KEY);

// commands stuff
let commands = {}; 

// mobile status
const Constants = require('./node_modules/discord.js/src/util/Constants.js')
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
    const why = await (await fetch(`https://nekos.life/api/v2/why`)).json()
    client.user.setActivity(config.prefix +`help | ${why.why}`, { type: "WATCHING" });


    function myTimer() {
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
      myTimer()
      var myVar = setInterval(myTimer, 600000)
    }
    
    /* fs.readdir("./cmds", function(err, files) {
        files.forEach(function(name) {
            commands[name.split(".")[0]] = require("./cmds/" + name);
        });
    }); */
});
client.once('reconnecting', async () => {
    axios.post(`${process.env.API_SERVER}/karen/logs/`, {
      "content": `Reconnecting!`,
      "type": 'info'
    })
    const why = await (await fetch(`https://nekos.life/api/v2/why`)).json()
    client.user.setActivity(config.prefix +`help | ${why.why}`, { type: "WATCHING" });
});
client.once('disconnect', async () => {
    axios.post(`${process.env.API_SERVER}/karen/logs/`, {
      "content": `Disconnect!`,
      "type": 'info'
    })
    const why = await (await fetch(`https://nekos.life/api/v2/why`)).json()
  client.user.setActivity(config.prefix +`help | ${why.why}`, { type: "WATCHING" });
});

client.on("guildDelete", async guild => {
  // this event triggers when the bot is removed from a guild.
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `I have been removed from: ${guild.name} (id: ${guild.id})`,
    "type": 'info'
  })
  const why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
});

client.on("guildCreate", async guild => {
    // This event triggers when the bot joins a guild.
    axios.post(`${process.env.API_SERVER}/karen/logs/`, {
      "content": `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`,
      "type": 'info'
    })
    const why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
});

client.on('guildMemberAdd', async member => {
  const why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
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
});

client.on('message', async msg => {
  if(msg.content.includes(process.env.DISCORD_TOKEN)) return msg.delete()
  if(msg.author.bot || msg.webhookID || !msg.author) return
  // Tbh idk why I did this, I wrote this at like 04:00
  try {
    let guildPrefixLet = settingsmap.get(msg.guild.id).guildPrefix // skipcq: JS-0128
  } catch (err) {
    serverFunc.createGuildSettings(msg.guild.id)
  }
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
  
  if(msg.content.toLowerCase().startsWith(config.prefix)) {
    var args = msg.content.slice(config.prefix.length).split(/\s+/)
    
    var commandName = args.shift().toLowerCase()
    let command = client.commands.get(commandName)
        || client.commands.find(c => c.aliases && c.aliases.includes(commandName))

    if(!command) return;

    const level = client.permLevel(msg)
    if(level < client.levelCache[command.permissionsLevel || "User"]) {
      return msg.channel.send(`Shut up, you're not my mom 😒🙄`)
    }

    msg.author.permLevel = level
    msg.member.user.permLevel = level

    try {
      if(command.args && !args.length) {
        let reply = `Where are the arguments?? Explain yourself, WHERE IN THE FUCK DO YOU SEE ARGUMENTS!?!?!?`

        if(command.usage) {
          reply += `\nProper Usage: \`${config.prefix}${command.name} ${command.usage.replace('shard_count', 4)}\``
        }

        if(command.example) {
          // TODO: Repalce shard_count with a non-static count (-1 since shard 1 is id 0)
          reply += `\n\`${config.prefix}${command.name} ${command.example.replace('shard_count', 3)}\``
        }

        return msg.channel.send(reply)
      }

      if(command.nsfw && !msg.channel.nsfw) {
        if(!msg.channel.name.includes('nsfw')) return msg.channel.send(`Ugh this is an NSFW command, go to an NSFW channel 🙄`)
      }
      await command.execute(client, msg, args)
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
    }
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
