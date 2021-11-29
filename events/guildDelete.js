const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");
const { log } = require('../modules/log.js');
const {checkIfAPIAccess, checkIfProd} = require("../modules/apiAccess");
const {updateStats} = require("../modules/updateStats");

module.exports = async (client, guild) => {

  // this event triggers when the bot is removed from a guild.
  log(`I have been removed from: ${guild.name} (id: ${guild.id})`, "info")

  if (checkIfProd()) {
    updateStats(client)
  }
}