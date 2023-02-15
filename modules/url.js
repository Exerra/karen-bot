/*
	This module provides various URL related functions

	- Written by Exerra at 2022-02-06
*/

const axios = require("axios");
const isURL = (str) => {
	let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
	if (!regex.test(str)) return false
	try {
		new URL(str)
		return true
	} catch (e) {
		return false
	}
}

const getDomain = (str) => {
	if (!isURL(str)) return false
	return new URL(str).hostname
}

const isScam = async (url) => {
	let data = await axios.get(`https://exerra-phishing-check.p.rapidapi.com/`, {
		params: {
			url: url
		},
		headers: {
			"X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
			"X-RapidAPI-Host": "exerra-phishing-check.p.rapidapi.com"
		}
	})

	return data.data.data.isScam
}

exports.isURL = isURL
exports.getDomain = getDomain
exports.isScam = isScam