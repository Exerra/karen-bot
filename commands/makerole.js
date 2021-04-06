const Discord = require('discord.js')

module.exports = {
  name: 'makerole',
  description: 'Makes a new role with a specified name, color and permission',
  type: 'Moderation',
  args: true,
  usage: '[name] [color (in hex (without #)] [permission (not needed)]',
  example: 'owowhatsthis AD91FF MANAGE_GUILD',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    var allowedToUse = false;
    config.DevIDs.forEach(id => {
        if (msg.author.id == id)
            allowedToUse = true;
    });

    if (msg.member.hasPermission('MANAGE_ROLES') || allowedToUse) {
        if (args[0] == undefined) return msg.channel.send('Please tell me the name')
        else {
            if (msg.member.hasPermission(args[2])) {
                msg.guild.roles.create({
                    data: {
                        name: args[0],
                        color: args[1],
                        permissions: args[2],
                    },
                    reason: `<@${msg.author.id}> created a new role for totally mischevious purposes! Someone go stop this person, or else they will take over the world!!!!`,
                })
                const guildcreateembed = new Discord.MessageEmbed()
                guildcreateembed.setTitle('New role created')
                guildcreateembed.setColor(config.color)
                guildcreateembed.addField('Name', args[0])
                guildcreateembed.addField('Color', args[1])
                guildcreateembed.addField('Permissions', args[2])
                guildcreateembed.setFooter(`Requested by ${msg.author.tag}`, msg.author.avatarURL())
                msg.channel.send(guildcreateembed)
            } else {
                msg.channel.send('Looks like you don\'t have the permissions to do so 😔')
            }
        }
    }
    else {
        msg.channel.send('Only people with MANAGE_ROLES permission can do that!')
    }
  }
}
