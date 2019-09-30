exports.run = async (Discord, bot, config, message) => {
	if(message.author.id == config.ownerID){
		return message.reply(`Hello sir!`);
	}
	return message.reply(`Hey there!`);
}

exports.help = {
	name: `Hello?`,
	description: `I say hello. Handy for checking if i'm active on the server`,
	use: `/hello`,
	examples: `/hello`,
	permissions: [`Everyone`],
	shortcuts: {
		root: `hello`,
		list: [`hi`,`henlo`,`hey`,`sup`,`yo`]
	}
}
