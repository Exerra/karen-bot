const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");
const { log } = require('../modules/log.js');
const {checkIfAPIAccess, checkIfProd} = require("../modules/apiAccess");
const {updateStats} = require("../modules/updateStats");

module.exports = async (client, guild) => {
  // This event triggers when the bot joins a guild.

  log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`, "info")

  if (checkIfProd()) {
    updateStats(client)
  }
}