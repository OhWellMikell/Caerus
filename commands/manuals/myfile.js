// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message) => {

	// Deleting Command
	message.delete(4000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;

	// Local Variables
	const leadFiles  = new db.table(`LeadershipFiles`);
	let campaigners = message.member.roles.find(role => role.name === `Campaign Leader`)

	if(campaigners){

		// Rich Embed
		let user = message.member.id;
		let slot1 = leadFiles.get(`${user}.slot1_name`);
		let slot2 = leadFiles.get(`${user}.slot2_name`);
		if(slot1 == `null`) slot1 = `Empty`;
		if(slot2 == `null`) slot2 = `Empty`;

		let cfileembed = new Discord.RichEmbed()
		.setTitle(`Campaign Leader File`)
		.addField(`Hosted Campaigns`, `**Slot 1:** *${slot1}*\n**Slot 2:** *${slot2}*`)
		.setThumbnail(message.member.user.avatarURL)
		.setColor(campaigners.color)

		message.channel.send(cfileembed).then(m => {m.delete(60000);});

	}

	return;
}

exports.help = {
	name: `Campaign Profile`,
	description: `If possesing the role \`Campaign Leader\`, this will show the campaign save slots you own and whatever campaign might be saved to them.`,
	use: `/myfile`,
	examples: `/myfile`,
	permissions: [`Campaign Leader`],
	shortcuts: {
		root: `myfile`,
		list: [`mf`,`mfile`, `file`]
	}
}
