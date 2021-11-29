/*
	This module is made to make regex matching easier and so there is less code copy pasted everywhere
	This module will be mostly used for auto embeds, but it can be used elsewhere, just import it and you're good to go
	
	- Written on 2021-08-20 by Exerra
*/

/**
 *
 * @param {RegExp} regex - Regex to validate message with
 * @param message - Message to use regex against
 * @returns {boolean}
 */
const matchRegex = (regex, message) => {
    return (message.match(regex) ? true : false) ;
}

exports.matchRegex = matchRegex