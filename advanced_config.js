const config = {
	"self": "702896046480818218",
	"owner": "391878815263096833",
	"admins": ['166601149774954496', '334067823229796367', '474581812526710804'],
	//              floyd                    con                my alt
	permLevels: [
		// This is the lowest permission level, this is for non-roled users.
		{
			level: 0,
			name: 'User',
			check: () => true
		},
		// This is the guild owner
		{
			level: 1,
			name: 'Server Owner',
			check: msg => {
				return msg.channel.type == 'text' ? (msg.guild.ownerID == msg.author.id ? true : false) : false
			}
		},
		{
			level: 4,
			name: 'Admins',
			check: msg => msg.client.config.admins.includes(msg.author.id)
		},
		{
			level: 5,
			name: 'Owner',
			check: msg => msg.client.config.owner == msg.author.id
		},
		// ***undocumented***
		{
			level: 99,
			name: 'Self',
			check: msg => msg.client.config.self == msg.author.id
		}
	]
}

module.exports = config
