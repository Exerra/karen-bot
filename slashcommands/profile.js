const Discord = require('discord.js')
const axios = require('axios')
require('dotenv').config()

module.exports = {
  name: 'profile',
  description: 'Profile command',
  options: [
    {
        type: 6,
        name: 'user',
        description: 'User to get profile of',
        required: false
    }
  ],
  execute(client, interaction) {
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
     * @param {string} str - String to check if it is undefined or empty
     * @returns True if string is undefined or empty, false if it isn't
     */
    const empty = (str) => {
        if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === "")
            return true;
        else
            return false;
    }

    /**
     * 
     * @param {string} pronouns - The response body for the pronoum.db API call
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
    const sendProfile = (username, avatarURL, description, pronouns, birthday, createdAt, gender, country, rank, languages, email, website, twitter) => {
        // Variable to check how much fields the top line has
        // Useful for adding spacers
        let topLineFieldAmount = 0

        embed.setTitle(`${username}'s profile`);
        embed.setThumbnail(avatarURL);
        embed.addField("Description", description)

        // Adds the contact info fields
        if (!empty(website)) embed.addField('Website', `[${website.replace(/(^\w+:|^)\/\//, '')}](${website} '${author.username}'s website')`, true); topLineFieldAmount++
        if (!empty(email)) embed.addField('Email', `[${email}](mailto:${email})`, true); topLineFieldAmount++
        if (!empty(twitter)) embed.addField('Twitter', `[@${twitter}](https://twitter.com/${twitter} '${author.username}'s twitter')`, true); topLineFieldAmount++
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
        if (pronouns == '' || pronouns == undefined) embed.addField("Pronouns", 'Not added. [Add them here](https://pronoundb.org/me)', true)
        else embed.addField("Pronouns", pronouns, true)
        embed.addField("Gender", gender, true)
        embed.addField("Country", country, true)

        embed.addField("Languages", languages, true);
        if (rank != "") embed.addField("Flowered?", rank, true);
        embed.addField('\u200B', '\u200B', true)

        //embed.addField(`Account created at`, createdAt)
        embed.setFooter(`Account created at`)
        embed.setTimestamp(createdAt)
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
              embeds: [embed]
            }
        }})
    }

    if (interaction.data.options == undefined) {
        var author = client.users.cache.find(user => user.id === interaction.member.user.id)
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
                "id": author.id
            }
        }).then((response) => {
            // If success, return profile
            //const profile = JSON.parse(response.data.profile);
            axios({
                "method": "GET",
                "url": "https://pronoundb.org/api/v1/lookup",
                "params": {
                    "platform": "discord",
                    "id": author.id
                }
            }).then(res => {
                determinePronouns(res.data.pronouns)
                sendProfile(author.username,
                    author.avatarURL({ dynamic: true }),
                    response.data.profile.description,
                    pronoun,
                    response.data.profile.birthday,
                    author.createdAt,
                    response.data.profile.gender,
                    response.data.profile.country,
                    response.data.profile.rank,
                    response.data.profile.languages,
                    response.data.profile.email,
                    response.data.profile.website,
                    response.data.profile.twitter
                )
            }, error => sendProfile(author.username, author.avatarURL({ dynamic: true }), response.data.profile.description, pronoun, response.data.profile.birthday, author.createdAt, response.data.profile.gender, response.data.profile.country, response.data.profile.rank, response.data.profile.languages))
        }, (error) => {
            // If error (which means person doesn't have a profile), return error
            if (error.response.status === 404) {
                embed.setTitle("Profile command: error");
                embed.setDescription(`You do not have a profile!\nDo ${config.prefix}profile create to create an empty profile(cross-server)`);
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                      embeds: [embed]
                    }
                }})
            } else {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                      embeds: [serverErrorEmbed]
                    }
                }})
            }
        });
    }
    else if (interaction.data.options !== undefined) {
        let member = client.users.cache.find(user => user.id === interaction.data.options[0].value);
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
            axios({
                "method": "GET",
                "url": "https://pronoundb.org/api/v1/lookup",
                "params": {
                    "platform": "discord",
                    "id": member.id
                }
            }).then(res => {
                determinePronouns(res.data.pronouns)

                sendProfile(
                    member.username,
                    member.avatarURL({ dynamic: true }),
                    response.data.profile.description,
                    pronoun,
                    response.data.profile.birthday,
                    member.createdAt,
                    response.data.profile.gender,
                    response.data.profile.country,
                    response.data.profile.rank,
                    response.data.profile.languages,
                    response.data.profile.email,
                    response.data.profile.website,
                    response.data.profile.twitter
                )
            }, error => sendProfile(member.username, member.avatarURL({ dynamic: true }), response.data.profile.description, pronoun, response.data.profile.birthday, member.createdAt, response.data.profile.gender, response.data.profile.country, response.data.profile.rank, response.data.profile.languages, response.data.profile.email, response.data.profile.website, response.data.profile.twitter))
        }, (error) => {
            if (error.response.status === 404) {
                embed.setTitle("Profile command: error");
                embed.setDescription(`This person does not have a profile.`);
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                      embeds: [embed]
                    }
                }})
            } else {     
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                      embeds: [serverErrorEmbed]
                    }
                }})
            }
        });
    }
  }
}
