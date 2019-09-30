exports.run = async (Discord, bot, config, message) => {
	if(message.author.id == config.ownerID){
		return message.reply(`No, no. I owe my thanks to you, sir.`);
	}
	return message.reply(`You're welcome, ${message.author.username}! It's my pleasure to help.`);
}

exports.help = {
	name: `Thanks!`,
	description: `I say thank you. For whoever shows their appreciation.`,
	use: `/thanks`,
	examples: `/thanks`,
	permissions: [`Everyone`],
	shortcuts: {
		root: `thanks`,
		list: [`thx`,`thank you`,`thank`,`tank`,`ty`, `tyvm`, `tysm`]
	}
}
