const Discord = require('discord.js')
const axios = require('axios')
require('dotenv').config()

module.exports = {
  name: 'profile',
  description: 'Profile command',
  type: 'User',
  execute(client, msg, args) {
    const app = require('../bot.js');
    let config = app.config;
    var pronoun
    let embed = new Discord.MessageEmbed()
        .setColor(config.color);

    let serverErrorEmbed =  new Discord.MessageEmbed()
        .setTitle(`Server error`)
        .setThumbnail('https://img.icons8.com/bubbles/2x/error.png')
        .setColor("ff3333")
        .setDescription('Uh-oh! A wild error appeared!')
        .addField('Possible cause', 'It is likely that Karen Bot while communicating with its central server that has all of the profiles, got flagged as something malicious by [Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200172676-Understanding-Cloudflare-DDoS-protection) systems. It is also plausible that the server is either on maintenance or has just crashed.')
        .addField('So.. what now?', 'Run the command a bit later. IF any outages have happened, [the status page](https://status.exerra.xyz) will have information.')
        .setFooter(`With ❤️ from ${config.creator}`, config.logo)

    /**
     * 
     * @param {string} pronouns - The response body for the pronoun.db API call
     */
    const determinePronouns = (pronouns) => {
        switch (pronouns) {
            case 'unspecified':
                pronoun = 'unspecified'
                break;
            case 'hh':
                pronoun = 'he/him'
                break;
            case 'hi':
                pronoun = 'he/it'
                break;
            case 'hs':
                pronoun = 'he/she'
                break;
            case 'ht':
                pronoun = 'he/they'
                break;
            case 'ih':
                pronoun = 'it/him'
                break;
            case 'ii':
                pronoun = 'it/its'
                break;
            case 'is':
                pronoun = 'it/she'
                break;
            case 'it':
                pronoun = 'it/they'
                break;
            case 'shh':
                pronoun = 'she/he'
                break;
            case 'sh':
                pronoun = 'she/her'
                break;
            case 'si':
                pronoun = 'she/it'
                break;
            case 'st':
                pronoun = 'she/it'
                break;
            case 'th':
                pronoun = 'they/he'
                break;
            case 'ti':
                pronoun = 'they/it'
                break;
            case 'ts':
                pronoun = 'they/she'
                break;
            case 'tt':
                pronoun = 'they/them'
                break;
            case 'any':
                pronoun = 'Any'
                break;
            case 'other':
                pronoun = 'Other'
                break;
            case 'ask':
                pronoun = 'Ask me'
                break;
            case 'avoid':
                pronoun = 'Use my name'
                break;
        }
    }
     

    /**
     * 
     * @param {string} username - Username of the person the profile belongs to
     * @param {string} avatarURL - Avatar's profile of the person who it belongs to
     * @param {string} description - Description set in profile
     * @param {string} pronouns - Users pronouns
     * @param {string} birthday - Description set in the profile
     * @param {string} createdAt - When the user has been created
     * @param {string} gender - Users gender set in the profile
     * @param {string} country - Users country set in the profile
     * @param {string} rank - Users rank (aka flower)
     * @param {string} languages - Users languages set in the profile
     * @param {string} email - Users email
     * @param {string} website - Users website (domain)
     * @param {string} twitter - Users twitter handle
     */
    const sendProfile = (username, avatarURL, description, pronouns, birthday, createdAt, gender, country, rank, languages, email, website, twitter, id) => {
        // Variable to check how much fields the top line has
        // Useful for adding spacers
        let topLineFieldAmount = 0

        embed.setTitle(`${username}'s profile`);
        embed.setThumbnail(avatarURL);
        embed.addField("Description", description)

        // Adds the contact info fields
        if (!website.isEmpty()) embed.addField('Website', `[${website.replace(/(^\w+:|^)\/\//, '')}](${website} '${msg.author.username}'s website')`, true); topLineFieldAmount++
        if (!email.isEmpty()) embed.addField('Email', `[${email}](mailto:${email})`, true); topLineFieldAmount++
        if (!twitter.isEmpty()) embed.addField('Twitter', `[@${twitter}](https://twitter.com/${twitter} '${msg.author.username}'s twitter')`, true); topLineFieldAmount++

        // Switch statement to determine how much spacers to use
        // If topLineFieldAmount is 0 (aka no contact fields), then do nothing
        // If it is 1, then add 2 spacers
        // If it is 2, then add 1 spacer
        // If it is 3 then do nothing
        switch (topLineFieldAmount) {
            case 0:
                break;
            case 1:
                embed.addField('\u200B', '\u200B', true)
                embed.addField('\u200B', '\u200B', true)
                break;
            case 2:
                embed.addField('\u200B', '\u200B', true)
                break;
            case 3:
                break;
        }

        embed.addField(`Birthday`, birthday)

        // If there are no pronouns, notify the person that, well, there are no pronouns
        // else, display the pronouns
        if (pronouns == '' || pronouns == undefined || pronouns == "unspecified") embed.addField("Pronouns", 'Not specified. [Add them here](https://pronoundb.org/me)', true)
        else embed.addField("Pronouns", pronouns, true)
        embed.addField("Gender", gender, true)
        embed.addField("Country", country, true)

        embed.addField("Languages", languages, true);
        if (rank != "") embed.setAuthor("Flowered", "https://cdn.exerra.xyz/png/discord/cherry_36x36.png")
        embed.addField('\u200B', '\u200B', true)

        //embed.addField(`Account created at`, createdAt)
        embed.setFooter(`Account created at`)
        embed.setTimestamp(createdAt)

        if (id === client.config.trueOwner) embed.setAuthor("Karen Bot developer", "https://cdn.exerra.xyz/png/discord/verified-bot-developer.png")
        msg.channel.send(embed)
    }

    if (args[0] == undefined) {
        // Tries to get profile from server
        axios({
            "method": "GET",
            "url": `${process.env.API_SERVER}/karen/profile`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "params": {
                "id": msg.author.id
            }
        }).then((response) => {
            // If success, return profile
            sendProfile(msg.author.username,
                msg.author.avatarURL({ dynamic: true }),
                response.data.profile.description,
                response.data.profile.pronouns,
                response.data.profile.birthday,
                msg.author.createdAt,
                response.data.profile.gender,
                response.data.profile.country,
                response.data.profile.rank,
                response.data.profile.languages,
                response.data.profile.email,
                response.data.profile.website,
                response.data.profile.twitter,
                msg.author.id
            )
        }, (error) => {
            // If error (which means person doesn't have a profile), do a fucking hacky thing
            if (error.response.status === 404) {
                const profile = {
                    description: "I am someone who got their profile auto generated by a bot",
                    gender: "Not specified",
                    birthday: "Not specified",
                    country: "None",
                    rank: "",
                    languages: "None"
                }
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
                        "id": user.id
                    }
                }).then((response) => {
                    // If success, return profile
                    axios({
                        "method": "GET",
                        "url": `${process.env.API_SERVER}/karen/profile`,
                        "headers": {
                            "Authorization": process.env.AUTH_B64,
                            "Content-Type": "application/json; charset=utf-8",
                            'User-Agent': process.env.AUTH_USERAGENT
                        },
                        "auth": {
                            "username": process.env.AUTH_USER,
                            "password": process.env.AUTH_PASS
                        },
                        "params": {
                            "id": msg.author.id
                        }
                    }).then((response) => {
                        // If success, return profile
                        sendProfile(msg.author.username,
                            msg.author.avatarURL({ dynamic: true }),
                            response.data.profile.description,
                            response.data.profile.pronouns,
                            response.data.profile.birthday,
                            msg.author.createdAt,
                            response.data.profile.gender,
                            response.data.profile.country,
                            response.data.profile.rank,
                            response.data.profile.languages,
                            response.data.profile.email,
                            response.data.profile.website,
                            response.data.profile.twitter,
                            msg.author.id
                        )
                    })
                })
            } else {
                msg.channel.send(serverErrorEmbed)
            }
        });
    }
    else if (args[0].toLowerCase() == "create") {
        // Gets profile from server
        axios({
            "method": "GET",
            "url": `${process.env.API_SERVER}/karen/profile`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "params": {
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
                country: "International waters",
                rank: "",
                languages: "None",
                email: "",
                website: "",
                twitter: ""
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
    else if (args[0].toLowerCase() == "delete") {
        // Try to get a profile for the user
        axios({
            "method": "GET",
            "url": `${process.env.API_SERVER}/karen/profile`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "params": {
                "id": msg.author.id
            }
        }).then((response) => {
            // If the user has a profile, go forward with the deletion process
            axios({
                "method": "DELETE",
                "url": `${process.env.API_SERVER}/karen/profile`,
                "headers": {
                    "Authorization": process.env.AUTH_B64,
                    "Content-Type": "application/json; charset=utf-8",
                    'User-Agent': process.env.AUTH_USERAGENT
                },
                "auth": {
                    "username": process.env.AUTH_USER,
                    "password": process.env.AUTH_PASS
                },
                "params": {
                    "id": msg.author.id
                }
            }).then((response) => {
                // If profile succesefully got deleted, tell the user
                embed.setTitle("Profile command: Success");
                embed.setDescription(`Damn you really had to delete your profile :pensiveaf:\nHere have a cookie for all the work you spent on your profile that you just thanos snapped. [cookie](${response.data.congratulationsomgyoudidsowellimsoooooooproudofyou})`);
                embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
                msg.channel.send(embed);
            }, error => {
                // If a server error happened, return an error
                if (error.response.status >= 500) return msg.channel.send(serverErrorEmbed)
            })
        }, (error) => {
            // If server returns an error (aka user does not have a profile), send an error message stating that they do not have a profile
            embed.setTitle("Profile command: error");
            embed.setDescription(`You do not have a profile! You can create one with "${config.prefix}profile create"!`);
            embed.setFooter(`With ❤️ from ${config.creator}`, config.logo)
            msg.channel.send(embed);
        })
    }
    else if (args[0].toLowerCase() == "set") {
        let profile = {};
        // Tries to get profile from server. I did this so if there isn't a profile, it returns an error and because command reads profile
        axios({
            "method": "GET",
            "url": `${process.env.API_SERVER}/karen/profile`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "params": {
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
            "method": "GET",
            "url": `${process.env.API_SERVER}/karen/profile`,
            "headers": {
                "Authorization": process.env.AUTH_B64,
                "Content-Type": "application/json; charset=utf-8",
                'User-Agent': process.env.AUTH_USERAGENT
            },
            "auth": {
                "username": process.env.AUTH_USER,
                "password": process.env.AUTH_PASS
            },
            "params": {
                "id": member.id
            }
        }).then((response) => {
            sendProfile(
                member.username,
                member.avatarURL({ dynamic: true }),
                response.data.profile.description,
                response.data.profile.pronouns,
                response.data.profile.birthday,
                member.createdAt,
                response.data.profile.gender,
                response.data.profile.country,
                response.data.profile.rank,
                response.data.profile.languages,
                response.data.profile.email,
                response.data.profile.website,
                response.data.profile.twitter,
                member.id
            )
        }, (error) => {
            if (error.response.status === 404) {
                embed.setTitle("Profile command: error");
                embed.setDescription(`This person does not have a profile.`);
                msg.channel.send(embed);
            } else {     
                msg.channel.send(serverErrorEmbed)
            }
        });
    }
  }
}
