/*
    Created by Exerra on 31/01/2022
*/

module.exports = async (client, msg) => {
	if (!settingsmap.get(msg.guild.id).modLogSettingsBool.messageDeleted) return

	console.log(msg.cleanContent)

	//const deletedMsgEmbed
}