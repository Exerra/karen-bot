const Discord = require('discord.js')
const fs = require('fs')
const {log} = require("../modules/log");
const app = require("../bot.js");

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

    const saveConfig = () => fs.writeFileSync(app.dir + "/config.json", JSON.stringify(config, null, 4));

    fs.readFile(app.dir + "/config.json", function (err, data) {

        switch (args[0]) {
            case "version": {
                config.botversion = args[1]
                msg.channel.send(`Changed version to ${args[1]}`)
                saveConfig()
            }
            case "prefix": {
                config.prefix = args[1]
                msg.channel.send(`Changed prefix to ${args[1]}`)
                saveConfig()
                let why = config.statusQuotes[Math.floor(Math.random()*config.statusQuotes.length)];
                client.user.setActivity(config.prefix +`help | ${why}`, { type: "WATCHING" });
            }
            case "logo": {
                config.logo = args[1]
                msg.channel.send(`Changed logo to ${args[1]}`)
                saveConfig()
            }
            case "creator": {
                config.creator = args[1]
                msg.channel.send(`Changed creator to ${args[1]}`)
                saveConfig()
            }
            case "picture": {
                msg.channel
                    .send("What will be the new pfp?")
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
        }
    })
  }
}
