const checkIfAPIAccess = () => {
    return (process.env.VALIDATION == undefined && process.env.APIACCESS == "true")
}

exports.checkIfAPIAccess = checkIfAPIAccess()