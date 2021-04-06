const axios = require('axios')

module.exports = client => {
  /*
    PERMISSION LEVEL FUNCTION

    This is a very basic permissions system for commands which uses "levels"
    "spaces" are intentionally left blank so you can add them if you want.
    NEVER GIVE ANYONE BUT THE OWNER THE LEVEL 4! By default this can run any command
    including the VERY DANGEROUS `eval` and `exec` commands!
  */
    client.permLevel = (msg) => {
        let permlvl = 0
        const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1)
        while(permOrder.length) {
        const currentLevel = permOrder.shift()
        if(currentLevel.check(msg)) {
            permlvl = currentLevel.level
            break
        }
        }
        return permlvl
    }
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    Array.prototype.randomize = function() {
        return this[Math.floor(Math.random() * this.length)]
    }
    Object.defineProperty(String.prototype, "toProperCase", {
        toProperCase: () => {this.charAt(0).toUpperCase() + this.slice(1);}
    })
    String.prototype.sayHi = function() {
        return 'Hi, My name is ' + this
    };

    client.code = (lang, contents) => {
      return `${'```'}${lang}\n${contents}${'\n```'}`
    }

    client.serverFuncFUCK = {
        createGuildSettings: (guild) => {
            settingsmap.set(guild, {
                guildPrefix: "",
                moderatorOnlyCommands: false,
                timezone: "",
                karenMode: true,
                swearProtectionEnabled: true,
                modLogEnabled: false,
                modLogChannel: "",
                welcomeEnabled: false,
                welcomeChannel: "",
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
                "url": `${app.apiserver}/karen/settings/map/`,
                "headers": {
                    "Authorization": "Basic VXNlcjo4NzYmamhHdXlnSlk=",
                    "Content-Type": "application/json; charset=utf-8"
                },
                "auth": {
                    "username": "User",
                    "password": "876&jhGuygJY"
                },
                "data": JSON.stringify([... settingsmap])
            })
        },
        updateGuildSettings: (settings) => {
            axios({
                "method": "POST",
                "url": `${app.apiserver}/karen/settings/map/`,
                "headers": {
                "Authorization": "Basic VXNlcjo4NzYmamhHdXlnSlk=",
                "Content-Type": "application/json; charset=utf-8"
                },
                "auth": {
                "username": "User",
                "password": "876&jhGuygJY"
                },
                "data": JSON.stringify([... settings])
            })
        },
        getSettingsMap: () => {
            axios({
                "method": "GET",
                "url": `${app.apiserver}/karen/settings/map/`,
                "headers": {
                "Authorization": "Basic VXNlcjo4NzYmamhHdXlnSlk="
                },
                "auth": {
                "username": "User",
                "password": "876&jhGuygJY"
                }
            }).then(res => {
                client.settingsmap = new Map(res.data);
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
                "url": `${app.apiserver}/karen/guildProfile/map/`,
                "headers": {
                "Authorization": "Basic VXNlcjo4NzYmamhHdXlnSlk=",
                "Content-Type": "application/json; charset=utf-8"
                },
                "auth": {
                "username": "User",
                "password": "876&jhGuygJY"
                },
                "data": JSON.stringify([... guildProfile])
            })
            console.log(guildProfile)
        },
        updateGuildProfile: (profile) => {
            axios({
                "method": "POST",
                "url": `${app.apiserver}/karen/guildProfile/map/`,
                "headers": {
                "Authorization": "Basic VXNlcjo4NzYmamhHdXlnSlk=",
                "Content-Type": "application/json; charset=utf-8"
                },
                "auth": {
                "username": "User",
                "password": "876&jhGuygJY"
                },
                "data": JSON.stringify([... profile])
            })
        },
        getGuildProfile: () => {
            axios({
                "method": "GET",
                "url": `${app.apiserver}/karen/guildProfile/map/`,
                "headers": {
                "Authorization": "Basic VXNlcjo4NzYmamhHdXlnSlk="
                },
                "auth": {
                "username": "User",
                "password": "876&jhGuygJY"
                }
            }).then(res => {
                guildProfile = new Map(res.data);
            })
        },
    }
}
