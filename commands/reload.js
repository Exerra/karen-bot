const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
  name: 'reload',
  description: '',
  type: 'Private',
  permissionsLevel: 'Bot Owner',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    // variables for picture reload
    const filter = m => m.author.id === msg.author.id;
    let reason = "";

    fs.readFile(app.dir + "/config.json", function (err, data) {
        if (args[0] == undefined) return msg.channel.send('args[0] is not defined')
        else if (args[0] == 'version') {
            config.botversion = args[1]
            msg.channel.send(`Changed version to ${args[1]}`)
            fs.writeFileSync(app.dir + "/config.json", JSON.stringify(config, null, 4));
        }
        else if (args[0] == 'prefix') {
            config.prefix = args[1]
            msg.channel.send(`Changed prefix to ${args[1]}`)
            fs.writeFileSync(app.dir + "/config.json", JSON.stringify(config, null, 4));
        }
        else if (args[0] == 'logo') {
            config.logo = args[1]
            msg.channel.send(`Changed logo to ${args[1]}`)
            fs.writeFileSync(app.dir + "/config.json", JSON.stringify(config, null, 4));
        }
        else if (args[0] == 'creator') {
            config.creator = args[1]
            msg.channel.send(`Changed creator to ${args[1]}`)
            fs.writeFileSync(app.dir + "/config.json", JSON.stringify(config, null, 4));
        }
        else if (args[0] == 'picture') {
            msg.channel
            .send("What is the reason?")
            .then(() => {
                msg.channel
                    .awaitMessages(filter, {
                        max: 0,
                        time: "05000"
                    })
                    .then(collected => {
                        if (collected) {
                            let newProfilePicture = collected.first().content;
                            client.user.setAvatar(newProfilePicture)
                            msg.channel.send(`Changed profile picture!`);
                        }
                    })
            })
        }
        client.user.setActivity(config.prefix +`help`, { type: "WATCHING" });
    })
  }
}
