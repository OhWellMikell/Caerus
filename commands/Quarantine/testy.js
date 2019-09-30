// Libraries
const db = require("quick.db");

exports.run = async (Discord, bot, config, message, args) => {
//In this instance, "message" is actually the channel "typing start" was detected

	// Database Variables
	const guildFile = new db.table(`GuildInfo`);
	const guildId   = `${message.guild.id}`;

	// Local Variables
	let guild = message.guild;

	let category = await guild.createChannel("Category Channel", `category`, [{
		id: guild.id,
		denied: ["READ_MESSAGES", "SEND_MESSAGES", "VIEW_CHANNEL"]
	}]);

	let channel  = await guild.createChannel("The Channel", `text`);
	let parented = await channel.setParent(category);
	parented.lockPermissions();

	return;
}

exports.help = {
	name: "Test Code"
}
