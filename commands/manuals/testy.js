exports.run = async (Discord, bot, config, message, args) => {

	let sentence = args.join(` `);
	if(sentence == `` || !sentence) return;

	message.channel.send(sentence);
}

exports.help = {
	name: `Test Code`
}
