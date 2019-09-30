// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(5000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;
	if(!message.member.roles.find(role => role.name === `Campaign Leader`)){
		return message.channel.send(`*Only Campaign Leaders can add players*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(args == ``){
		return message.channel.send(`*You have to specify who you want to add. And whether to campaign 1 or campaign 2.*`).then(sentMessage => {
			sentMessage.delete(30000);});
	}

	// Local Variables
	const leadFiles  = new db.table(`LeadershipFiles`);
	let user = message.member.id;
	let slot1 = leadFiles.get(`${user}.slot1_name`);
	let slot2 = leadFiles.get(`${user}.slot2_name`);
	let added = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	let choice = args.pop();

	// Error Traps
	if(slot1 == null && slot2 == null){
		return message.channel.send(`*You're currently not hosting any campaigns. You'll have to create one first*.\n\`/help create\``).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(added.id == config.botID){
			return message.channel.send(`I'll have to politely decline your offer..  :/`).then(sentMessage => {
			sentMessage.delete(6000);});
	}
	if(added.bot){
		return message.channel.send(`Add human members only..`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(choice != `1` && choice != `2`){
		return message.channel.send(`*That is not a valid campaign. Choose a campaign in slot* ` + `\`1\` *or* \`2\`.`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(choice == `1` && slot1 == null){
		return message.channel.send(`*That save slot is empty. You can only add players where a campaign is present*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(choice == `2` && slot2 == null){
		return message.channel.send(`*That save slot is empty. You can only add players where a campaign is present*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}

	try{

		let name        = leadFiles.get(`${user}.slot${choice}_name`);
		let playrole    = await message.guild.roles.find(role => role.name === `${name} Player`);
		let playerrole  = await message.guild.roles.find(role => role.name === `Player`);

		if(added.roles.find(role => role  === playrole)){
			return message.channel.send(`*This person is already a player of the campaign* \`${name}\`.`).then(sentMessage => {
				sentMessage.delete(8000);});
		}

		added.addRole(playrole)
		added.addRole(playerrole);
		message.channel.send(`${added} has been added to the campaign \`${name}\`. Have fun!`).then(sentMessage => {
			sentMessage.delete(15000);});

	}catch(e){
		console.log(e);
	}

	return;
}

exports.help = {
	name: `Player Add`,
	description: `If possesing the role \`Campaign Leader\`, this will add a player to a campaign specified by the slot`,
	use: `/add [@member] [slot #]`,
	examples: `/add @Caerus#5361 1`,
	permissions: [`Campaign Leader`]
}
