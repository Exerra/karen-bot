const Discord = require('discord.js')
const axios = require('axios')
require('dotenv').config()

module.exports = {
  name: 'profile',
  description: 'Profile command',
  type: 'Profile',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    let embed = new Discord.MessageEmbed();
    embed.setColor(config.color);

    if (args[0] == undefined) {
        // Tries to get profile from server
        axios({
            "method": "POST",
            "url": `${process.env.API_SERVER}/karen/profile/get/`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "data": {
                "id": msg.author.id
            }
        }).then((response) => {
            // If success, return profile
            //const profile = JSON.parse(response.data.profile);
            embed.setTitle(`${msg.author.username}'s profile`);
            embed.setThumbnail(msg.author.avatarURL({ dynamic: true }));
            embed.addField("Description", response.data.profile.description);
            embed.addField(`Birthday`, response.data.profile.birthday)
            embed.addField(`Created at`, msg.author.createdAt)
            embed.addField("Gender", response.data.profile.gender)
            embed.addField("Country", response.data.profile.country);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            if (response.data.profile.rank != "") embed.addField("Flowered?", response.data.profile.rank);
            embed.addField("Languages", response.data.profile.languages);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            msg.channel.send(embed);
        }, (error) => {
            // If error (which means person doesn't have a profile), return error
            if (error.response.status === 404) {
                embed.setTitle("Profile command: error");
                embed.setDescription(`You do not have a profile!\nDo ${config.prefix}profile create to create an empty profile(cross-server)`);
                msg.channel.send(embed);
            } else {
                let serverErrorEmbed =  new Discord.MessageEmbed()
                    .setTitle(`Server error`)
                    .setThumbnail('https://img.icons8.com/bubbles/2x/error.png')
                    .setColor("ff3333")
                    .setDescription('Uh-oh! A wild error appeared!')
                    .addField('Possible cause', 'It is likely that Karen Bot while communicating with its central server that has all of the profiles, got flagged as something malicious by [Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200172676-Understanding-Cloudflare-DDoS-protection) systems. It is also plausible that the server is either on maintenance or has just crashed.')
                    .addField('So.. what now?', 'Run the command a bit later. IF any outages have happened, the maintainer of Karen Bot has been notified and is on the case already :)')
                    .setFooter(`With ❤️ from ${config.creator}`, config.logo)
                msg.channel.send(serverErrorEmbed)
            }
        });
    }
    else if (args[0].toLowerCase() == "create") {
        // Gets profile from server
        axios({
            "method": "POST",
            "url": `${process.env.API_SERVER}/karen/profile/get/`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "data": {
                "id": msg.author.id
            }
        }).then((response) => {
            // If server returns profile, return error because person already has a profile
            embed.setTitle("Profile command: error");
            embed.setDescription(`You already have a profile!\nDo ${config.prefix}profile to show your profile(cross-server)`);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            msg.channel.send(embed);
        }, (error) => {
            // If server returns a 404, create profile
            const profile = {
                description: "None",
                gender: "Not specified",
                birthday: "Not specified",
                country: "None",
                rank: "",
                languages: "None"
            }
            embed.setTitle("Profile creation");
            embed.setDescription(`Profile has been created successfully.\nDo ${config.prefix}profile to show your profile(cross-server)`);
            // Sends profile to server
            axios({
                "method": "POST",
                "url": `${process.env.API_SERVER}/karen/profile/`,
                "headers": {
                    "Authorization": process.env.AUTH_B64,
                    "Content-Type": "application/json; charset=utf-8",
                    'User-Agent': process.env.AUTH_USERAGENT
                },
                "auth": {
                    "username": process.env.AUTH_USER,
                    "password": process.env.AUTH_PASS
                },
                "data": {
                    profile,
                    "id": msg.author.id
                }
            })
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            msg.channel.send(embed);
        });
    }
    else if (args[0].toLowerCase() == "set") {
        let profile = {};
        // Tries to get profile from server. I did this so if there isn't a profile, it returns an error and because command reads profile
        axios({
            "method": "POST",
            "url": `${process.env.API_SERVER}/karen/profile/get/`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "data": {
                "id": msg.author.id
            }
        }).then((response) => {
            let profile = response.data.profile
            if (!args[1]) { // i typed 0 instead of 1
                embed.setTitle("Profile error: ");
                embed.setDescription("Specify a field to set.\n- Description\n-Gender\n- Birthday\n- Country\n- Languages.");
                embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                msg.channel.send(embed);
            }
            else if (args[1].toLowerCase() == "country") {
                if (!args[2]) {
                    embed.setTitle("Profile error: ");
                    embed.setDescription("You need to specify a country.");
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                } else {
                    profile.country = args[2];
                    embed.setTitle("Profile command: Success");
                    embed.setDescription("You have successfully set your country to " + args[2]);
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                }
            }
            else if (args[1].toLowerCase() == 'gender') {
                if (!args[2]) {
                    embed.setTitle("Profile error: ")
                    embed.setDescription("You need to specify a gender.")
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                }
                else {
                    profile.gender = args[2];
                    embed.setTitle(`Profile command: Success`)
                    embed.setDescription(`You have succesefully set your gender to ` + args[2])
                    msg.channel.send(embed);
                }
            }
            else if (args [1].toLowerCase() == 'birthday' || args[1].toLowerCase() == `bday` || args[1].toLowerCase() == `birthdate`) {
                if (!args[2]) {
                    embed.setTitle(`Profile error: `)
                    embed.setDescription(`You need to specify a birthday`)
                    msg.channel.send(embed)
                }
                else {
                    profile.birthday = args[2]
                    embed.setTitle("Profile command: Success");
                    embed.setDescription("You have successfully set your birthday to " + args[2]);
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                }
            }
            else if (args[1].toLowerCase() == "languages" || args[1].toLowerCase() == "language") {
                if (!args[2]) {
                    embed.setTitle("Profile error: ");
                    embed.setDescription("You need to specify the spoken, seperated by `-`.");
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                } else {
                    const languages = args[2].split('-');
                    let string = "";
                    languages.forEach(function (value) {
                        string = string + "\n" + value;
                    });
                    profile.languages = string;
                    embed.setTitle("Profile command: Success");
                    embed.setDescription("You have successfully set your spoken languages.");
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                }
            }
            else if (args[1].toLowerCase() == "description" || args[1].toLowerCase() == "desc") {
                if (!args[2]) {
                    embed.setTitle("Profile error: ");
                    embed.setDescription("You need to specify the description.");
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                } else {
                    let string = "";
                    for (let i = 2; i < args.length; i++) {
                        string = string + " " + args[i];
                    }
                    profile.description = string;
                    embed.setTitle("Profile command: Success");
                    embed.setDescription("You have successfully set your description.");
                    embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                    msg.channel.send(embed);
                }
            }
            else {
                embed.setTitle("Profile error: ");
                embed.setDescription("That field doesn't exist or you don't have permissions to set it.");
                embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                msg.channel.send(embed);
            }
            axios({
                "method": "POST",
                "url": `${process.env.API_SERVER}/karen/profile/`,
                "headers": {
                    "Authorization": process.env.AUTH_B64,
                    "Content-Type": "application/json; charset=utf-8",
                    'User-Agent': process.env.AUTH_USERAGENT
                },
                "auth": {
                    "username": process.env.AUTH_USER,
                    "password": process.env.AUTH_PASS
                },
                "data": {
                    profile,
                    "id": msg.author.id
                }
            })
        }, (error) => {
            embed.setTitle("Profile error: ");
            embed.setDescription(`You don't have a profile yet. Make one with "${config.prefix}profile create"`);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            msg.channel.send(embed);
        });
    }
    else if (args[0].toLowerCase() == "help") {
        embed.setTitle("Profile command: help")
        embed.addField(`${config.prefix}profile`, `Shows your profile.`)
		embed.addField(`${config.prefix}profile [create]`, `Creates your profile.`)
        embed.addField(`${config.prefix}profile [set]`, `Sets a field in your profile.`)
        embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
        msg.channel.send(embed);
    }
    else if (msg.mentions.users.first()) {
        let member = msg.mentions.users.first();
        let mention = new Discord.MessageEmbed()
        axios({
            "method": "POST",
            "url": `${process.env.API_SERVER}/karen/profile/get/`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "data": {
                "id": member.id
            }
        }).then((response) => {
            embed.setTitle(`${member.username}'s profile`);
            embed.setThumbnail(member.avatarURL());
            embed.addField("Description", response.data.profile.description);
            embed.addField(`Birthday`, response.data.profile.birthday)
            embed.addField(`Created at`, member.createdAt)
            embed.addField("Gender", response.data.profile.gender)
            embed.addField("Country", response.data.profile.country);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            if (response.data.profile.rank != "") embed.addField("Flowered?", response.data.profile.rank);
            embed.addField("Languages", response.data.profile.languages);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            msg.channel.send(embed)
        }, (error) => {
            if (error.response.status === 404) {
                embed.setTitle("Profile command: error");
                embed.setDescription(`This person does not have a profile.`);
                msg.channel.send(embed);
            } else {
                let serverErrorEmbed =  new Discord.MessageEmbed()
                    .setTitle(`Server error`)
                    .setThumbnail('https://img.icons8.com/bubbles/2x/error.png')
                    .setColor("ff3333")
                    .setDescription('Uh-oh! A wild error appeared!')
                    .addField('Possible cause', 'It is likely that Karen Bot while communicating with its central server that has all of the profiles, got flagged as something malicious by [Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200172676-Understanding-Cloudflare-DDoS-protection) systems. It is also plausible that the server is either on maintenance or has just crashed.')
                    .addField('So.. what now?', 'Run the command a bit later. IF any outages have happened, the maintainer of Karen Bot has been notified and is on the case already :)')
                    .setFooter(`With ❤️ from ${config.creator}`, config.logo)
                msg.channel.send(serverErrorEmbed)
            }
        });
    }
  }
}
