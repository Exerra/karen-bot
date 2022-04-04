/*
  This module defines various functions related to the Karen Bot API
  It includes stuff like:
    - Creating settings for guilds
    - Updating settings for guilds
    - Fetching settings
    - Creating guild profile (shh)
    - Updating guild profile (again, shh)
    - Getting guild profile (I think you get the idea by now, shh)
    - Get, post, delete user profiles

  - Written on 2022-04-04 by Exerra
*/

const axios = require('axios')
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
			phishingAction: "warn",
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
			"data": JSON.stringify([...settingsmap])
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
			"data": JSON.stringify([...settings])
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
			"data": JSON.stringify([...guildProfile])
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
			"data": JSON.stringify([...profile])
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
	pushCommands: (commands, slashCommands) => {
		axios({
			"method": "POST",
			"url": `${process.env.API_SERVER}/karen/commands/`,
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
				"commands": commands,
				"slashCommands": slashCommands
			}
		})
	},
	warn: async (id, guild, reason, moderator) => {
		return await axios({
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
				id: id,
				guild: guild,
				reason: reason,
				date: new Date(),
				moderator: moderator
			}
		})
	},
	users: {
		get: async (id) => {
			return await axios.get(`${process.env.API_SERVER}/karen/profile`, { params: { id: id } })
		},
		post: async (id, description = "", gender = "", birthday = "", country = "", rank = "", languages = "", email = "", website = "", twitter = "") => {
			let profile = {
				description,
				gender,
				birthday,
				country,
				rank,
				languages,
				email,
				website,
				twitter
			}

			return await axios({
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
					"id": id
				}
			})
		},
		delete: async (id) => {
			return await axios.delete(`${process.env.API_SERVER}/karen/profile`, { params: { id: id } })
		}
	}
}

exports.serverFunc = serverFunc