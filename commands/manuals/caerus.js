exports.run = async (Discord, bot, config, message, args) => {

	// Ignore List
	if(message.author.id != config.ownerID){
		message.delete().catch(console.error);
		return message.channel.send(`Only ${config.ownerName} can give system directives.`).then(sentMessage => {sentMessage.delete(10000);});
	}

	// Local Variables
	const keyword = args[0];

	if(keyword == `logout` || keyword == `l`){
		// Local Variables
		let hours = Math.floor(bot.uptime / 3600000);
		let minutes = Math.floor((bot.uptime % 3600000) / 60000);
		let string = `Logged out after `;

		// Message Delete
		message.delete(7500).catch(console.error);

		// Notification Message
		message.channel.send(`As you wish, sir. Disconnecting from the server in 8 seconds.`).then(sentMessage => {sentMessage.delete(7000);});

		// Time Sentence Structuring
		if(hours <= 0 && minutes <= 1) string += `a few seconds`
		else if(hours <= 0 && minutes > 1) string += `${minutes} minutes`
		else if(hours == 1 && minutes <= 1) string += `an hour`
		else if(hours == 1 && minutes > 1) string += `an hour and ${minutes} minutes`
		else if(hours > 1 && minutes <= 1) string += `${hours} hours`
		else if(hours > 1 && minutes > 1) string += `${hours} hours and ${minutes} minutes`

		// Timed Goodbye and Timed Logout
		bot.setTimeout(function timedGoodbye(){
			message.channel.send(`_Logging Out..._`).then(sentMessage => {sentMessage.delete(3500);});}, 3000);
		bot.setTimeout(function timedLogout(){
			bot.destroy();
			console.log(`  (ii) ${config.botname} has been told to log out. Ending program..`)
			console.log(`  (ii) ${string} of runtime.`)
			process.exit();}, 8000);

	}

	if(keyword == `time` || keyword == `t`){
		message.delete(500).catch(console.error);
		let hours = Math.floor(bot.uptime / 3600000);
		let minutes = Math.floor((bot.uptime % 3600000) / 60000);
		let string = `I've been on for `;
		if(hours <= 0 && minutes <= 1) string += `a few seconds`
		else if(hours <= 0 && minutes > 1) string += `${minutes} minutes`
		else if(hours == 1 && minutes <= 1) string += `an hour`
		else if(hours == 1 && minutes > 1) string += `an hour and ${minutes} minutes`
		else if(hours > 1 && minutes <= 1) string += `${hours} hours`
		else if(hours > 1 && minutes > 1) string += `${hours} hours and ${minutes} minutes`

		message.channel.send(string).then(sentMessage => {
			sentMessage.delete(5000);
		});
	}

	return;
}

exports.help = {
	name: `Caerus' System Directive`,
	description: `Overides Caerus, the Discord Client with direct commands. Only the creator is able to use this.`,
	use: `*Classified*`,
	examples: `*None*`,
	permissions: undefined,
	shortcuts: {
		root: `caerus`,
		list: [`c`,`/`]
	}
}
