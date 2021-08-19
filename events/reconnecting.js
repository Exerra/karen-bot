const axios = require('axios')
require('dotenv').config()
module.exports = (client, guild) => {
  axios.post(`${process.env.API_SERVER}/karen/logs/`, {
    "content": `Reconnecting!`,
    "type": 'info'
  })
  let why = statusQuotes[Math.floor(Math.random()*statusQuotes.length)];
  // emergency status
  //why = "⚠️ WELCOME FUNCTIONALITY DISABLED ⚠️"
  client.user.setActivity(config.prefix +`help | ${why}`, { type: "WATCHING" });
}