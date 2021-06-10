const Discord = require('discord.js')

module.exports = {
  name: 'improvements',
  description: 'Improvements',
  type: 'Utility',
  args: false,
  usage: '',
  example: '',
  aliases: ['i'],
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;

    let allowed = false

    let namesToCallStaff = [
      "my little raviolis",
      "assholes",
      "retail employees that I will scream at later"
    ]

    // defines filter, basically checks if the correct person is replying
    const filter = m => m.author.id === msg.author.id;

    if (msg.channel.id == '799287441914855444') allowed = true // This command is (currently) only for one guild, so this is a check to see if the channel its being sent in is correct

    if (process.env.VALIDATION !== undefined) allowed = true
    if (!allowed) return msg.channel.send('Restricted <:karen:851057272041898024>')

    msg.channel
      .send("What will be the improvement? (Your next message will get reacted to)")
      .then(mxg => {
          msg.channel
              .awaitMessages(filter, {
                  max: 1,
                  time: 60000
              })
              .then(collected => {
                  if (collected) {
                    // Deletes the "m!improvements" message
                    msg.delete()
                    // Deletes the message that the bot sent
                    mxg.delete()

                    // Just defines the message taht the user sent after the bot's message
                    const mlg = collected.first()
                    // React
                    mlg.react(`👍`)
                    mlg.react(`😐`)
                    mlg.react(`👎`)

                    // Set a timeout, probably will be 24hr but heroku restarts the bot often so I don't know hmm
                    setTimeout(() => {
                      // Gonna assign them to variables since maybe I will add more info in them and its a bit tedious to type "mlg.reactions.cache.get('emoji').valueIWantToGet"
                      let thumbsUp = mlg.reactions.cache.get('👍')
                      let neutral = mlg.reactions.cache.get('😐')
                      let thumbsDown = mlg.reactions.cache.get('👎')

                      // Removes the karen's reactions from the count
                      thumbsUp.count = thumbsUp.count - 1
                      neutral.count = neutral.count - 1
                      thumbsDown.count = thumbsDown.count - 1

                      // Create embed and assing basic values to it
                      let embed = new Discord.MessageEmbed()
                        .setColor(config.color) // Color should always be the config.color one, except if its some moderation thing that needs it
                        .setDescription(`Ding ding ding ${namesToCallStaff.randomize()}, the vote for this improvement has ended. Here are the results`)
                        .setTimestamp(thumbsUp.message.createdTimestamp) // Since reactions provide info about the message they're attached to, I can just use a reaction's info about the message
                        .addFields(
                          {name: "Votes for Yes 👍", value: thumbsUp.count},
                          {name: "Votes for Neutral 😐", value: neutral.count},
                          {name: "Votes for No 👎", value: thumbsDown.count}
                        )

                      // I can't really think of a better way so yay if/else if statements (PLEASE MAKE A PR WITH A BETTER WAY IF YOU SEE THIS my brain is kinda jelly rn)
                      
                      // If one is larger than the rest
                      if (thumbsUp.count > neutral.count && thumbsUp.count > thumbsDown.count) embed.setTitle('Results: Majority voted Yes')
                      else if (neutral.count > thumbsUp.count && neutral.count > thumbsDown.count) embed.setTitle('Results: Majority voted Neutral')
                      else if (thumbsDown.count > thumbsUp.count && thumbsDown.count > neutral.count) coembed.setTitle('Results: Majority voted No')

                      // If 2 are equal but larger than the 3rd
                      else if (thumbsUp.count == neutral.count && thumbsUp.count > thumbsDown.count && neutral.count > thumbsDown.count) embed.setTitle('Results: Tie between Yes and Neutral')
                      else if (thumbsUp.count == thumbsDown.count && thumbsUp.count > neutral.count && thumbsDown.count > neutral.count) embed.setTitle('Results: Tie between Yes and No')
                      else if (thumbsDown.count == neutral.count && thumbsDown.count > thumbsUp.count && neutral.count > thumbsUp.count) embed.setTitle('Results: Tie between Neutral and No')

                      // Else if no one voted
                      else if (thumbsUp.count == 0 && neutral.count == 0 && thumbsDown.count == 0) embed.setTitle('Results: No one voted')

                      // Else if everything is equal
                      else if (thumbsUp.count == neutral.count && neutral.count == thumbsDown.count) embed.setTitle('Results: Tie')

                      // i want to shoot myself for this code

                      mlg.lineReply(embed)
                    }, 6000) // 6 seconds for testing, later change to 24hr or something
                  }
              }).catch((err) => {
                mxg.delete()
                msg.channel.send(
                    "Improvement wasn't entered in 60s. Aborting"
                ).then(mng => { setTimeout(() => mng.delete(), 20000) })
            });
      })
  }
}
