// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(5000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;
	if(!message.member.roles.find(role => role.name === `Campaign Leader`)){
		return message.channel.send(`*Only Campaign Leaders can remove players*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(args == ``){
		return message.channel.send(`*You have to specify who you want to remove. And from campaign 1 or campaign 2.*`).then(sentMessage => {
			sentMessage.delete(30000);});
	}

	// Local Variables
	const campFiles = new db.table(`CampaignFiles`);
	const leadFiles  = new db.table(`LeadershipFiles`);
	let user    = message.member.id;
	let slot1   = leadFiles.get(`${user}.slot1_name`);
	let slot2   = leadFiles.get(`${user}.slot2_name`);
	let removed = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	let choice  = args.pop();

	// Error Traps
	if(slot1 == `null` && slot2 == `null`){
		return message.channel.send(`*You're currently not hosting any campaigns. There aren't any players that you host.\n\`/help remove\``).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(removed.id == config.botID){
			return message.channel.send(`I never joined your campaign. So you can't really remove me...   :/`).then(sentMessage => {
			sentMessage.delete(6000);});
	}
	if(removed.bot){
		return message.channel.send(`*Bots cant join campaigns anyway. Remove human members only..*`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(choice != `1` && choice != `2`){
		return message.channel.send(`*That is not a valid campaign. Choose a campaign in slot*` + `\`1\` *or* \`2\`.`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(choice == `1` && slot1 == `null`){
		return message.channel.send(`*That save slot is empty. You can only remove players from a campaign that is present*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(choice == `2` && slot2 == `null`){
		return message.channel.send(`*That save slot is empty. You can only remove players form a campaign that is present*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}

	try{

		let name        = leadFiles.get(`${user}.slot${choice}_name`);
		let playrole    = await message.guild.roles.find(role => role.name === `${name} Player`);
		let playtext    = await message.guild.channels.find(channel => {
			if(channel.type == `text`){
				return channel.name == `${name}`.toLowerCase().replace(/\s+/gi,`-`);
			}
		});

		if(!removed.roles.find(role => role  === playrole)){
			return message.channel.send(`*This person is not a player of the campaign \`${name}\` to begin with.*`).then(sentMessage => {
				sentMessage.delete(8000);});
		}

		removed.removeRole(playrole);
		campFiles.delete(`${playtext.id}.${removed.id}`)
		message.channel.send(`${removed} has been removed from the campaign \`${name}\`.`).then(sentMessage => {
			sentMessage.delete(15000);});

	}catch(e){
		console.log(e);
	}

	return;
}

exports.help = {
	name: `Player Remove`,
	description: `If possesing the role \`Campaign Leader\`, this will remove a player from a campaign specified by the slot`,
	use: `/remove [@member] [slot #]`,
	examples: `/remove @Caerus#5361 1`,
	permissions: [`Campaign Leader`],
	shortcuts: {
		root: `remove`,
		list: [`rem`]
	}
}
