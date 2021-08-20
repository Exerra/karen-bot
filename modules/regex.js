/*
	This module is made to make regex matching easier and so there is less code copy pasted everywhere
	This module will be mostly used for auto embeds, but it can be used elsewhere, just import it and you're good to go
	- Exerra
*/

const matchRegex = (regex, message) => {
	let regexs = regex
    return (message.match(regexs)) ? true : false ;
}

exports.matchRegex = matchRegex