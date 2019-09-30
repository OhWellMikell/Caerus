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
	let confirm     = false;

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

	if(demrole == `clubroom leader`){
		message.reply(`\nYou are about to demote **${demoted.user.username}** from **Clubroom Leader**\n_Are you sure you want to do this?_  **(Yes/No)**`);
	}
	if(demrole == `campaign leader`){
		message.reply(`\nYou are about to demote **${demoted.user.username}** from **Campaign Leader**\nThis will remove all campaigns and their save file\n_Are you sure you want to do this?_  **(Yes/No)**`);
	}

	// Assignment
	if(demrole == `campaign leader`) demrole = message.guild.roles.find(role => role.name === `Campaign Leader`);
	if(demrole == `clubroom leader`) demrole = message.guild.roles.find(role => role.name === `Clubroom Leader`);

	const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000, maxMatches: 2 });

	collector.on(`collect`, response => {
		if(response.content.toLowerCase() == `yes` || response.content.toLowerCase() == `y`){
			console.log(`Collected yes.`);
			confirm = true;
    }else if(response.content.toLowerCase() == `no` || response.content.toLowerCase() == `n`){
			console.log(`Collected yes.`);
      return response.channel.send(`*Action aborted*`);
    }
	});

	if(confirm == true){
		// Rich Embed
		let demembed = new Discord.RichEmbed()
		.setTitle(`Demotion.. :skull_crossbones:`)
		.addField(`**${message.author.username} Demoted:**`, `${demoted}, stripping the role ${demrole}`)
		.setThumbnail(demoted.user.avatarURL)
		.setFooter(`${message.createdAt}`)
		.setColor(`DARKER_GREY`);

		// Demoting
		demoted.removeRole(demrole);
		if(demrole.name == `Campaign Leader`){
			let user    = demoted.id;
			let name1   = leadFiles.get(`${user}.slot1_name`).replace(/\s+/gi,` `).trim();
			let name2   = leadFiles.get(`${user}.slot2_name`).replace(/\s+/gi,` `).trim();
			let deletetext  = null;
			let deletevoice = null;
			let deletehost  = null;
			let deleteplay  = null;

			try{
				deletetext  = await message.guild.channels.find(channel => {
					if(channel.type == `text`){
						return channel.name == `${name1}`.toLowerCase().replace(/\s+/gi,`-`);
					}
				});
				deletevoice = await message.guild.channels.find(channel => {
					if(channel.type == `voice`){
						return channel.name == `${name1}`
					}
				});
				deletehost  = await message.guild.roles.find(role => role.name === `${name1} Host`);
				deleteplay  = await message.guild.roles.find(role => role.name === `${name1} Player`);

				if(deletetext)  deletetext.delete();
				if(deletevoice) deletevoice.delete();
				if(deletehost)  deletehost.delete();
				if(deleteplay)  deleteplay.delete();

				message.channel.send(`\`${name1}\` has been deleted.`).then(sentMessage => {
					sentMessage.delete(15000);});

			}catch(e){
				console.log(e);
			}

			try{
				deletetext  = await message.guild.channels.find(channel => {
					if(channel.type == `text`){
						return channel.name == `${name2}`.toLowerCase().replace(/\s+/gi,`-`);
					}
				});
				deletevoice = await message.guild.channels.find(channel => {
					if(channel.type == `voice`){
						return channel.name == `${name2}`
					}
				});
				deletehost  = await message.guild.roles.find(role => role.name === `${name2} Host`);
				deleteplay  = await message.guild.roles.find(role => role.name === `${name2} Player`);

				if(deletetext)  deletetext.delete();
				if(deletevoice) deletevoice.delete();
				if(deletehost)  deletehost.delete();
				if(deleteplay)  deleteplay.delete();

				message.channel.send(`\`${name2}\` has been deleted.`).then(sentMessage => {
					sentMessage.delete(15000);});

			}catch(e){
				console.log(e);
			}

			leadFiles.delete(`${user}`);

			// Sending to Reports Channel and Local Channel
			dchannel.send(demembed);
			message.channel.send(demembed).then(sentMessage => {
				sentMessage.delete(20000);});
		}
	}

	return;
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
