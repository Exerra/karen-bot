/*
	This module is used for API and Prod checks

	- Written on 2021-11-29 by Exerra
*/

const checkIfAPIAccess = () => {
    return (process.env.APIACCESS == "true")
}

const checkIfProd = () => {
    return (process.env.VALIDATION == undefined && process.env.APIACCESS == "true")
}

exports.checkIfAPIAccess = checkIfAPIAccess
exports.checkIfProd = checkIfProd