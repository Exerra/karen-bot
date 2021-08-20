const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");

module.exports = (client, guild) => {
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `Disconnect!`,
    "type": 'info'
  })
  let why = statusQuotes[Math.floor(Math.random()*statusQuotes.length)];
  // emergency status
  //why = "⚠️ WELCOME FUNCTIONALITY DISABLED ⚠️"
  client.user.setActivity(config.prefix +`help | ${why}`, { type: "WATCHING" });
}