// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(4000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;
	if(!message.member.roles.find(role => role.name === `Clubroom Leader`)){
		return message.channel.send(`*Only a Clubroom Leader can designate leaders.*`).then(sentMessage => {
			sentMessage.delete(6000);});
	}

	// Local Variables
	const leadFiles = new db.table(`LeadershipFiles`);
	let promoted    = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	let promrole    = args.join(` `).slice(22).toLowerCase().trim();
	if(promrole == `club`) promrole = `clubroom leader`;
	if(promrole == `camp`) promrole = `campaign leader`;
	let pchannel    = await message.guild.channels.find(channel => channel.name === `reports`);

	// Error Traps
	if(!promoted){
		return message.channel.send(`Couldn't find user..`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(promoted.id == config.botID){
		return message.channel.send(`I'll have to politely decline your offer..  :/`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(promoted.bot){
		return message.channel.send(`Promote human members only..`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(!pchannel){
		message.channel.send(`There was an issue logging this to the reports channel.`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(promrole != `campaign leader` && promrole != `clubroom leader`){
		if(!promrole) promrole = `campaign leader`
		else{
			return message.channel.send(`*That is not a role for promotion.*`).then(sentMessage => {
			sentMessage.delete(6000);});
		}
	}
	if(promoted.roles.find(role => role.name.toLowerCase() === promrole)){
		return message.channel.send(`*This person already has the ${promrole} role.*`).then(sentMessage => {
			sentMessage.delete(6000);});
	}

	// Assignment
	if(promrole == `campaign leader`) promrole = message.guild.roles.find(role => role.name === `Campaign Leader`);
	if(promrole == `clubroom leader`) promrole = message.guild.roles.find(role => role.name === `Clubroom Leader`);

	// Rich Embed
	let promembed = new Discord.RichEmbed()
	.setTitle(`Promotion! :confetti_ball:`)
	.addField(`**${message.author.username} Promoted:**`, `${promoted} to ${promrole}`)
	.setThumbnail(promoted.user.avatarURL)
	.setFooter(`${message.createdAt}`)
	.setColor(promrole.color);

	// Promoting
	promoted.addRole(promrole);
	let user = promoted.id;
	let name = promoted.user.username;
	leadFiles.set(`${user}`, {
		name: `${name}`,
		slot1_name: `null`,
		slot1_color: `null`,
		slot2_name: `null`,
		slot2_color: `null`
	});

	// Sending to Reports Channel and Local Channel
	pchannel.send(promembed);
	message.channel.send(promembed).then(sentMessage => {
		sentMessage.delete(20000);});

	return;
}

exports.help = {
	name: `Promotion`,
	description: `Promotes a member to the status of \`Campaign Leader\`.`,
	use: `/promote [@member]`,
	examples: `/promote @Caerus#5361`,
	permissions: [`Clubroom Leader`],
	shortcuts: {
		root: `promote`,
		list: [`pmote`,`pm`]
	}
}
