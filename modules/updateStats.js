/*
  This module provides code that updates Karen Bot stats.
  These stats include:
    - Total members
    - Total guilds
    - Discord.js version

  - Written on 2021-12-23 by Exerra
*/


const axios = require("axios")
const Discord = require("discord.js");
const {log} = require("./log");
const chalk = require("chalk");

const updateStats = (client) => {
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
            }).catch(err => {
                console.log(chalk.magenta('[Karen Bot]'), chalk.yellow(`[Stats]`), chalk.red('[Warn]'), `Failed to post stats`)
            })
        }).catch(e => log(e, "error"));
}

exports.updateStats = updateStats