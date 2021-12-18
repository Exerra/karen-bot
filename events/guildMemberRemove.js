const axios = require('axios')
require('dotenv').config()
const app = require("../bot.js");
const {updateStats} = require("../modules/updateStats");
const {checkIfAPIAccess, checkIfProd} = require("../modules/apiAccess");

module.exports = async (client, member) => {

    if (checkIfProd()) {
        updateStats(client)
    }

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
        // If success, return
        return
    }, (error) => {
        // If error (which means person doesn't have a profile), create one
        const profile = {
            description: "I am someone who got their profile auto generated by a bot because I left",
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
                "id": member.id
            }
        })
    });

    const ignoreError = () => { return true }

    if (settingsmap.get(member.guild.id).welcomeEnabled == false) return;
    const channel = member.guild.channels.cache.find(ch => ch.id == settingsmap.get(member.guild.id).welcomeChannel);
    channel.send(`${member} just got fired wooo lets goo`);
    member.send('yay you finally got fired').catch(() => ignoreError())
}