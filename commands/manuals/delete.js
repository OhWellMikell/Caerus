// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(5000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;
	if(!message.member.roles.find(role => role.name === `Campaign Leader`)){
		return message.channel.send(`*Only Campaign Leaders can delete campaigns.*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(args == ``){
		return message.channel.send(`*You have to specify which save slot to use.\n\`/help delete\` for info\nTo look at your save slots type \`/myfile\`*`).then(sentMessage => {
			sentMessage.delete(30000);});
	}

	// Local Variables
	const leadFiles  = new db.table(`LeadershipFiles`);
	const campFiles  = new db.table(`CampaignFiles`);
	let user = message.member.id;
	let slot1 = leadFiles.get(`${user}.slot1_name`);
	let slot2 = leadFiles.get(`${user}.slot2_name`);
	let choice = args[0];
	let name = null;

	// Error Traps
	if(choice != `1` && choice != `2`){
		return message.channel.send(`*That is not a valid save slot. Choose slot*` + `\`1\` *or* \`2\`.`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(choice == `1` && slot1 == `null`){
		return message.channel.send(`*There is nothing to delete, this save slot is already empty.*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(choice == `2` && slot2 == `null`){
		return message.channel.send(`*There is nothing to delete, this save slot is already empty.*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}

	if(choice == `1` && slot1 != `null`){
		name = slot1.replace(/\s+/gi,` `).trim();
	}
	if(choice == `2` && slot2 != `null`){
		name = slot2.replace(/\s+/gi,` `).trim();
	}

	let deletetext  = await message.guild.channels.find(channel => {
		if(channel.type == `text`){
			return channel.name == `${name}`.toLowerCase().replace(/\s+/gi,`-`);
		}
	});
	let deletevoice = await message.guild.channels.find(channel => {
		if(channel.type == `voice`){
			return channel.name == `${name}`
		}
	});
	let deletehost  = await message.guild.roles.find(role => role.name === `${name} Host`);
	let deleteplay  = await message.guild.roles.find(role => role.name === `${name} Player`);

	let response  = false;
	let i         = 0;
	let collector = undefined;

	try{

		// Question Prompt
		message.reply(`\nYou are about to delete "**${name}**"\n_Are you sure you want to do this?_  **(Yes/No)**`);

		// Question Collector
		collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

		// Collector Events
		collector.on(`collect`, message => {

			// Message Iterator
			i += 1;

			// Question Choices
			if(message.content.toLowerCase() == `yes` || message.content.toLowerCase() == `y` || message.content.toLowerCase() == `${config.prefix}yes` || message.content.toLowerCase() == `${config.prefix}y`){

				// Delete response
				message.delete().catch(console.error);

				// Delete Campaigns & Roles
				if(deletetext)  deletetext.delete();
				if(deletevoice) deletevoice.delete();
				if(deletehost)  deletehost.delete();
				if(deleteplay)  deleteplay.delete();

				// Set the save file back to `null`
				leadFiles.set(`${user}.slot${choice}_name` , `null`);
				campFiles.delete(`${deletetext.id}`);

				// Set repsonse status true
				response = true;

				// Send deletion notification to chat
				message.channel.send(`\`${name}\` has been deleted.`).then(sentMessage => {
					sentMessage.delete(15000);});

			}else if (message.content.toLowerCase() == `no` || message.content.toLowerCase() == `n` || message.content.toLowerCase() == `${config.prefix}no` || message.content.toLowerCase() == `${config.prefix}n`){

				// Delete response
				message.delete().catch(console.error);

				// Set response status true
				response = true;

				// Send abortion notification to the chat
				message.reply(`| *Action Ended.*`);

			}

			// Iterator Stops Collector
			if(i >= 3) collector.stop();

		});
		collector.on(`end`, () => {

			// Abortion Status
			if(response == false && i == 0) message.reply(`| *Question Terminated: Question Timed out*`)
			else if(response == false && i >= 2) message.reply(`| *Question Terminated: Too many unrecognized answers*`)

		});

	}catch(e){
		console.log(e);
	}

	return;
}

exports.help = {
	name: `Campaign Delete`,
	description: `If possesing the role \`Campaign Leader\`, this will delete a campaign from a save slot of your choosing`,
	use: `/delete [slot #]`,
	examples: `/delete 1\n/delete 2`,
	permissions: [`Campaign Leader`],
	shortcuts: {
		root: `delete`,
		list: [`del`]
	}
}
