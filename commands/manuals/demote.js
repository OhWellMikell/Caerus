// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(4000).catch(console.error);

	// Ignore List
	if(message.content.indexOf(config.prefix) != 0) return;
	if(!message.member.roles.find(role => role.name === `Clubroom Leader`)){
		return message.channel.send(`*Only a Clubroom Leader can demote leaders.*`).then(sentMessage => {
			sentMessage.delete(6000);});
	}

	// Local Variables
	const leadFiles = new db.table(`LeadershipFiles`);
	let demoted     = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	let demrole     = args.join(` `).slice(22).toLowerCase().trim();
	let dchannel    = await message.guild.channels.find(channel => channel.name === `reports`);
	if(demrole == `club`) demrole = `clubroom leader`;
	if(demrole == `camp`) demrole = `campaign leader`;

	// Error Traps
	if(!demoted){
		return message.channel.send(`Couldn't find user..`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(demoted.id == config.botID){
		return message.channel.send(`I was never a campaign leader, you can't demote me..  :/`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(demoted.bot){
		return message.channel.send(`*Bots cant be leaders anyway. Demote human members only..*`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(!dchannel){
		message.channel.send(`There was an issue logging this to the reports channel.`).then(sentMessage => {
		sentMessage.delete(6000);});
	}
	if(demrole != `campaign leader` && demrole != `clubroom leader`){
		if(!demrole) demrole = `clubroom leader`
		else{
			return message.channel.send(`*That is not a role. To demote someone from*`).then(sentMessage => {
			sentMessage.delete(6000);});
		}
	}
	if(!demoted.roles.find(role => role.name.toLowerCase() === demrole)){
		return message.channel.send(`*This person doesn't have the ${demrole} role to begin with.*`).then(sentMessage => {
			sentMessage.delete(6000);});
	}

	// Assignment
	if(demrole == `campaign leader`) demrole = message.guild.roles.find(role => role.name === `Campaign Leader`);
	if(demrole == `clubroom leader`) demrole = message.guild.roles.find(role => role.name === `Clubroom Leader`);

	// Rich Embed
	let demembed = new Discord.RichEmbed()
	.setTitle(`Demotion.. :skull_crossbones:`)
	.addField(`**${message.author.username} Demoted:**`, `${demoted}, stripping the role ${demrole}`)
	.setThumbnail(demoted.user.avatarURL)
	.setFooter(`${message.createdAt}`)
	.setColor(`DARKER_GREY`);

	let response   = false;
	let i         = 0;
	let collector = undefined;

	// Demoting
	if(demrole.name == `Clubroom Leader`){

		try{

			// Question Prompt
			message.reply(`\nYou are about to demote **${demoted.user.username}** from **${demrole.name}**\n_Are you sure you want to do this?_  **(Yes/No)**`);

			// Question Collector
			collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000, maxMatch: 2 });

			// Collector Events
			collector.on(`collect`, message => {

				// Message Iterator
				i += 1;

				// Question Choices
				if(message.content.toLowerCase() == `yes` || message.content.toLowerCase() == `y` || message.content.toLowerCase() == `${config.prefix}yes` || message.content.toLowerCase() == `${config.prefix}y`){

					// Remove Role
					demoted.removeRole(demrole);

					// Set response status true
					response = true;

					// Sending to Reports Channel and Local Channel
					dchannel.send(demembed);
					message.channel.send(demembed).then(sentMessage => {
						sentMessage.delete(15000);});

				}else if (message.content.toLowerCase() == `no` || message.content.toLowerCase() == `n` || message.content.toLowerCase() == `${config.prefix}no` || message.content.toLowerCase() == `${config.prefix}n`){

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
	if(demrole.name == `Campaign Leader`){

		let user    = demoted.id;
		let name1   = leadFiles.get(`${user}.slot1_name`).replace(/\s+/gi,` `).trim();
		let name2   = leadFiles.get(`${user}.slot2_name`).replace(/\s+/gi,` `).trim();
		let deletetext1  = await message.guild.channels.find(channel => {
			if(channel.type == `text`){
				return channel.name == `${name1}`.toLowerCase().replace(/\s+/gi,`-`);
			}
		});
		let deletevoice1 = await message.guild.channels.find(channel => {
			if(channel.type == `voice`){
				return channel.name == `${name1}`
			}
		});
		let deletehost1  = await message.guild.roles.find(role => role.name === `${name1} Host`);
		let deleteplay1  = await message.guild.roles.find(role => role.name === `${name1} Player`);
		let deletetext2  = await message.guild.channels.find(channel => {
			if(channel.type == `text`){
				return channel.name == `${name2}`.toLowerCase().replace(/\s+/gi,`-`);
			}
		});
		let deletevoice2 = await message.guild.channels.find(channel => {
			if(channel.type == `voice`){
				return channel.name == `${name2}`
			}
		});
		let deletehost2  = await message.guild.roles.find(role => role.name === `${name2} Host`);
		let deleteplay2  = await message.guild.roles.find(role => role.name === `${name2} Player`);

		try{

			// Question Prompt
			message.reply(`\nYou are about to demote **${demoted.user.username}** from **${demrole.name}**. This will delete all their campaigns and save file information.\n*Are you sure you want to do this?*  **(Yes/No)**`);

			// Question Collector
			const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

			// Collector Events
			collector.on(`collect`, message => {

				// Message Iterator
				i += 1;

				// Question Choices
				if(message.content.toLowerCase() == `yes` || message.content.toLowerCase() == `y` || message.content.toLowerCase() == `${config.prefix}yes` || message.content.toLowerCase() == `${config.prefix}y`){

					// Remove Role
					demoted.removeRole(demrole);

					// Delete All Campaigns & Roles
					if(deletetext1)  deletetext1.delete();
					if(deletevoice1) deletevoice1.delete();
					if(deletehost1)  deletehost1.delete();
					if(deleteplay1)  deleteplay1.delete();

					if(deletetext2)  deletetext2.delete();
					if(deletevoice2) deletevoice2.delete();
					if(deletehost2)  deletehost2.delete();
					if(deleteplay2)  deleteplay2.delete();

					// Remove the save file
					leadFiles.delete(`${user}`);

					// Set response status true
					response = true;

					// Sending to Reports Channel and Local Channel
					dchannel.send(demembed);
					message.channel.send(demembed).then(sentMessage => {
						sentMessage.delete(15000);});

				}else if (message.content.toLowerCase() == `no` || message.content.toLowerCase() == `n` || message.content.toLowerCase() == `${config.prefix}no` || message.content.toLowerCase() == `${config.prefix}n`){

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

}

exports.help = {
	name: `Demotion`,
	description: `Demotes a member, stripping them the title of \`Clubroom Leader\` or \`Campaign Leader\`.`,
	use: `/demote [@member] <role>`,
	examples: `/demote @Caerus#5361\n/demote @Caerus#5361 Club\n/demote @Caerus#5361 Camp/demote @Caerus#5361 Clubroom Leader\n/demote @Caerus#5361 Campaign Leader`,
	permissions: [`Clubroom Leader`],
	shortcuts: {
		root: `demote`,
		list: [`dmote`,`dm`]
	}
}
