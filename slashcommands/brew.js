const Discord = require('discord.js')

module.exports = {
  name: 'brew',
  description: 'Search brew.sh',
  options: [
    {
        "type": 3,
        "name": "formulae",
        "description": "Brew.sh formulae to search for",
        "required": true
    }
  ],
  execute(client, interaction) {
    const app = require('../bot.js');
    let config = app.config;
    const axios = require('axios')

    var author = client.users.cache.find(user => user.id === interaction.member.user.id)

    axios.get(`https://formulae.brew.sh/api/formula/${interaction.data.options[0].value}.json`).then(res => {
      let data = res.data

      const embed = new Discord.MessageEmbed()
        .setColor("FFA743")
        .setTitle(data.name)
        .setURL(`https://formulae.brew.sh/formula/${data.name}`)
        .setThumbnail('https://brew.sh/assets/img/homebrew-256x256.png')
        .setDescription(data.desc)
        .setAuthor('brew.sh')
        .addFields(
          { name: `Stable version`, value: data.versions.stable, inline: true },
          { name: "License", value: data.license, inline: true }
        )
        // Check if the bottle files are longer than 1
        // Theyre needed to check compability
        if (data.bottle.stable.files.length != 1) {
          // Gets the keys in the API responses object
          var compabilityItems = Object.keys(data.bottle.stable.files)
          // Testing stuff

          // Function to set compability item, makes the switch statement easier to type && less cluttered
          const setCompabilityItem = (item, value) => {
            compabilityItems[item] = value
          }

          // For each item in the compabilityItems array, check the value and make it more human
          for (let i in compabilityItems) {
            switch(compabilityItems[i]) {
              case 'all':
                setCompabilityItem(i, 'All macOS and Linux systems')
                break;
              case 'arm64_big_sur':
                setCompabilityItem(i, 'Apple Silicon Big Sur')
                break;
              case 'big_sur':
                setCompabilityItem(i, 'Intel Big Sur')
                break;
              case 'catalina':
                setCompabilityItem(i, 'Intel Catalina')
                break;
              case 'mojave':
                setCompabilityItem(i, 'Intel Mojave')
                break;
              case 'high_sierra':
                setCompabilityItem(i, 'Intel High Sierra')
                break;
              case 'sierra':
                setCompabilityItem(i, 'Intel Sierra')
                break;
              case 'el_capitan':
                setCompabilityItem(i, 'Intel El Capitan')
                break;
              case 'yosemite':
                setCompabilityItem(i, 'Intel Yosemite')
                break;
              case 'mavericks':
                setCompabilityItem(i, 'Intel Mavericks')
                break;
              case 'x86_64_linux':
                setCompabilityItem(i, 'x86_64 Linux')
                break;
            }
          }
          // Add the compability items in a field
          embed.addField("Compability", compabilityItems.join('\n'))
        } else {
          let compabilityItems = Object.keys(data.bottle.stable.files)
            embed.addField("Compability", compabilityItems[0])
        }

        // Checks if outdated, disabled and deprecated is true
        // If it is true, then it adds the field, but if it isn't, it doesn't because it looks ugly
        if (data.outdated == true) embed.addField('Outdated?', data.outdated.toString())
        if (data.disabled == true) embed.addField('Disabled?', data.outdated.toString())
        if (data.deprecated == true) {
          embed.addField('Deprecated?', data.deprecated.toString())
          embed.addField('Date of deprecation', data.deprecated_date, true)
          embed.addField('Reason for deprecation', data.deprecated_reason, true)
        }
        // Total amount of downloads
        embed
          .addFields(
            { name: "Downloads (30d)", value: data.analytics.install['30d'][Object.keys(data.analytics.install['30d'])[0]], inline: true },
            { name: "Downloads (365d)", value: data.analytics.install['365d'][Object.keys(data.analytics.install['365d'])[0]], inline: true }
          )
          .setFooter(`Requested by ${author.username} • Generated at ${data.generated_date}`, author.avatarURL({ dynamic: true }))

        // Ofc, send the message when we're done
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              embeds: [embed]
            }
        }})
    }, error => {
      // just return
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              content: 'Um, u sure about that? Are you like 100% sure that that formulae exists? Maaaybe you confused it with a cask package? No? Well then either you misspelled or more likely your dumbass is remembering wrong',
              flags: 64
            }
        }})
    })
  }
}
