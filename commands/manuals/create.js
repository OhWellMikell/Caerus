// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(5000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;
	if(!message.member.roles.find(role => role.name === `Campaign Leader`)){
		return message.channel.send(`*Only Campaign Leaders can make campaigns.*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(args == ``){
		return message.channel.send(`*Making a campaign consumes a campaign leaders profile save slot.\nYou have to specify which save slot to use.\n\`/help create\` for info\nTo look at your save slots type \`/myfile\`*`).then(sentMessage => {
			sentMessage.delete(30000);});
	}

	// Local Variables
	const leadFiles  = new db.table(`LeadershipFiles`);
	const campFiles  = new db.table(`CampaignFiles`);
	let user = message.member.id;
	let slot1 = leadFiles.get(`${user}.slot1_name`);
	let slot2 = leadFiles.get(`${user}.slot2_name`);
	let choice = args.pop();
	let name = args.join(` `).replace(/\s+/gi,` `).trim();

	// Error Traps
	if(/[^a-zA-Z\d\s-:]+/gi.test(name)){
			return message.channel.send(`*Sorry, alphanumeric names only. Hyphens (-) being the exception.*`).then(sentMessage => {
				sentMessage.delete(8000);});
	}
	if(name.toLowerCase() == `null`){
		return message.channel.send(`*You cannot name your campaign 'null'*`).then(sentMessage => {
		sentMessage.delete(8000);
		});
	}
	if(message.guild.roles.find(role => role.name.toLowerCase() == name.toLowerCase())){
		return message.channel.send(`*You cannot name your campaign ${name} cause a role with the same name exists*`).then(sentMessage => {
		sentMessage.delete(8000);
		});
	}
	if(message.guild.channels.find(channel => channel.name.toLowerCase() == name.toLowerCase())){
		return message.channel.send(`*You cannot name your campaign ${name} cause a channel with the same name exists*`).then(sentMessage => {
		sentMessage.delete(8000);
		});
	}
	if(name.toLowerCase() == `null`){
		return message.channel.send(`*You cannot name your campaign 'null'*`).then(sentMessage => {
		sentMessage.delete(8000);
		});
	}
	if(choice != `1` && choice != `2`){
		return message.channel.send(`*That is not a valid save slot. Choose a save slot* ` + `\`1\` *or* \`2\`.`).then(sentMessage => {
			sentMessage.delete(8000);
		});
	}
	if(choice == `1` && slot1 != `null`){
		return message.channel.send(`*That is not a valid save slot. The campaign \`${slot1}\` currently uses this slot.\nTo delete a campaign, use* ` + `\`/delete\``).then(sentMessage => {
			sentMessage.delete(10000);});
	}
	if(choice == `2` && slot2 != `null`){
		return message.channel.send(`*That is not a valid save slot. The campaign \`${slot2}\` currently uses this slot.\nTo delete a campaign, use*` + `\`/delete\``).then(sentMessage => {
			sentMessage.delete(10000);});
	}
	if(name.length > 22){
		return message.channel.send(`*Sorry, that name is too long for naming a channel*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}

	try{
		let voice       = await message.guild.channels.find(channel => channel.name === `📣 Voice Channels`);
		let campaigns   = await message.guild.channels.find(channel => channel.name === `📚 Campaigns`);
		let createtext  = await message.guild.createChannel(`${name}`, `text`, [{
			id: message.guild.id,
			denied: [`VIEW_CHANNEL`]
		}]);
		let createvoice = await message.guild.createChannel(`${name}`, `voice`, [{
			id: message.guild.id,
			denied: [`VIEW_CHANNEL`]
		}]);
		let createhost  = await message.guild.createRole({
			name: `${name} Host`
		});
		let createplay  = await message.guild.createRole({
			name: `${name} Player`
		});

		message.member.addRole(createhost);
		createvoice.setParent(voice);
		createtext.setParent(campaigns);

		createvoice.overwritePermissions(createhost, {
			VIEW_CHANNEL: true,
			READ_MESSAGES: true,
			SEND_MESSAGES: true
		});
		createvoice.overwritePermissions(createplay, {
			VIEW_CHANNEL: true,
			READ_MESSAGES: true,
			SEND_MESSAGES: true
		});
		createtext.overwritePermissions(createhost, {
			VIEW_CHANNEL: true,
			READ_MESSAGES: true,
			SEND_MESSAGES: true
		});
		createtext.overwritePermissions(createplay, {
			VIEW_CHANNEL: true,
			READ_MESSAGES: true,
			SEND_MESSAGES: true
		});

		leadFiles.set(`${user}.slot${choice}_name`,`${name}`);
		campFiles.set(`${createtext.id}.name`, `${name}`);
		campFiles.set(`${createtext.id}.stlyeselection`, `vanilla`);
		message.channel.send(`\`${name}\` has been created and saved to save slot \`${choice}\`. A voice and text channel for your players has been added.`).then(sentMessage => {
			sentMessage.delete(15000);});

	}catch(e){
		console.log(e);
	}

	return;
}

exports.help = {
	name: `Campaign Create`,
	description: `If possesing the role \`Campaign Leader\`, this will create a campaign to a save slot of your choosing`,
	use: `/create [campaign name] [slot #]`,
	examples: `/create Crypt of The Neverlight 1\n/create Dungeon of Divinity 2`,
	permissions: [`Campaign Leader`]
}
