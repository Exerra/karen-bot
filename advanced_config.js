const config = {
    "self": "702896046480818218",
    "trueOwner": "391878815263096833",
    // Bot Owner IDs, useful for the new internal permissions system. Should always be a level 4 permission level.
    "ownerID": ['391878815263096833', '166601149774954496'],
    //           Amiichu
    // Bot Admins, Level 3 permission level.
    "admins": [''],
    // Bot support, level 2 permission level, still a large amount of commands at your disposal.
    "support": [''],
    // Shh... It's the secret service
    "secret_service": [''],
    permLevels: [
        // This is the lowest permission level, this is for non-roled users.
        {
          level: 0,
          name: 'User',
          check: () => true
        },
        // This is your permission level, the staff level should always be above the rest of the roles.
        /* {
          level: 2,
          name: 'Server Moderator',
          check: msg => {
            try {
              const modRole = msg.guild.roles.cache.find(r => r.name.toLowerCase() == msg.settings.modRole.toLowerCase())
              if(modRole && msg.member.roles.cache.has(modRole.id)) return true
            } catch (e) {
              return false
            }
          }
        },
        {
          level: 3,
          name: 'Server Administrator',
          check: msg => {
            try {
              const adminRole = msg.guild.roles.find(r => r.name.toLowerCase() == msg.settings.adminRole.toLowerCase())
              if(modRole && msg.member.roles.cache.has(adminRole.id)) return true
            } catch (e) {
              return false
            }
          }
        }, */
        // This is the server owner (guild owner)
        {
          level: 1,
          name: 'Server Owner',
          check: msg => {
            return msg.channel.type == 'text' ? (msg.guild.ownerID == msg.author.id ? true : false) : false
          }
        },
        // Bot support is a special inbetween level that has the equivalent of server owner access to any server
        // This is just to troubleshoot the bot on behalf of the owners
        {
          level: 2,
          name: 'Bot Support',
          check: msg => msg.client.config.support.includes(msg.author.id)
        },
        // Secret Service is a even more special inbetween level that has the equivalent of bot support but also some extra commands.
        // The secret service shouldn't be called more than ten times within a week. (Excluding chaotic weeks where people try to break into the the Ava system)
        // The secret service has 8.5 level permissions because they really only need to have blacklist and whitelist permissions
        {
          level: 2.5,
          name: 'Secret Service',
          check: msg => msg.client.config.secret_service.includes(msg.author.id)
        },
        // Bot admin has some limited access like reloading commands and messing with high level currency commands. Just a large selection of commands
        {
          level: 3,
          name: 'Bot Admin',
          check: msg => msg.client.config.admins.includes(msg.author.id)
        },
        // This is the bot owner, this should be the highest permission level available.
        // The reason this should be the highest level is because of dangerous commands such as eval or exec
        // The bot owner should have all the power over all other permissions
        {
          level: 4,
          name: 'Bot Owner',
          check: msg => msg.client.config.ownerID.includes(msg.author.id)
        },
        // This is the true owner, this is the man with the plan, the brains and the brawn.
        // Anyways, this is the highest permissions level achievable.
        // This should only be given to the bot's true owner (the owner of the bot application and first to write code)
        {
          level: 5,
          name: 'True Owner',
          check: msg => msg.client.config.trueOwner == msg.author.id
        },
        // ***undocumented***
        {
          level: 99,
          name: 'Self',
          check: msg => msg.client.config.self == msg.author.id
        }
      ]
}

module.exports = config
