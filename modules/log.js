/*
	This module was made to standardize logging and effortlessy bring console logging *and* sending logs to API easier
  If a developer does not have API access (either hasn't yet been assigned a user&pass or is an unafilliated entity) then it does not send to the API.
	
	- Written on 2021-09-05 by Exerra
*/

const axios = require('axios')
const { throwError } = require('./throwError')
require('dotenv').config()

/**
 * 
 * @param {string} message Message to console log
 * @param {string} type Type of message (info, error)
 * @param {boolean} serveronly Wether the log should only be sent to the API
 * @returns A better logging system
 */
const log = (message, type, serveronly = false) => {

	if (message == undefined) return throwError('Parameter "message" in log() is missing.', "paramMissing")

	if (process.env.APIACCESS === "true") {
		if (type !== undefined) {
			axios(`${process.env.API_SERVER}/karen/logs/`, {
				"method": "POST",
        "url": `${process.env.API_SERVER}/karen/logs/`,
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
          "content": message,
          "type": type
        }
			})
		}
		
	}

	if (!serveronly) console.log(message)
}

exports.log = log