const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");
const { log } = require('../modules/log.js');

module.exports = async (client, guild) => {
  // This event triggers when the bot joins a guild.

  log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`, "info")
  
  let why = await (await fetch(`https://nekos.life/api/v2/why`)).json() // skipcq: JS-0128
}