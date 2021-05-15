const Discord = require('discord.js')
const KahootSpam = require('kahoot-spam')
let api = KahootSpam

module.exports = {
  name: 'kahoot',
  description: 'Spams a kahoot lobby',
  type: 'Private',
  args: true,
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;

    // Old method of handling allowed to use IDs but fuck it ima keep it in
    var allowedToUse = false;
     config.DevIDs.forEach(id => {
         if (msg.author.id == id)
             allowedToUse = true;
     });

     config.resourceIntensiveTaskAllowedIDs.forEach(id => {
         if (msg.author.id == id)
             allowedToUse = true;
     });

    if (allowedToUse){
      try {
        var i = 1
        msg.channel.send(`Done ;)`)
        while (i !== 1000) {
          api.spam(args[0], app.client.kahootnames.names[Math.floor(Math.random() * app.client.kahootnames.names.length)], 1)
          i++
        }
      } catch(err) {console.log(err)}
    } else {
      msg.channel.send('The Kahoot command is very resource intensive, so it is restricted. The creator personally selects people who she want\'s to allow this command')
    }
  }
}
