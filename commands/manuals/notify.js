// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message) => {

	// Deleting Command
	message.delete().catch(console.error);

	// Database variables
	const campFiles  = new db.table(`CampaignFiles`);
	const campname   = campFiles.get(`${message.channel.id}.name`);
	let   fileselect = campFiles.get(`${message.channel.id}.styleselection`);

	// Defualting to vanilla selection if nothing can be found
	if(!fileselect){
		fileselect = `vanilla`;
	}

	// Files
	const choicefile   = require(`../../files/choices/${fileselect}.json`);

	// Ignore List
	if(message.channel.parent.name != `📚 Campaigns`) return;															// Return if not in the campaign category
	if(!message.member.roles.find(role => role.name === `Player`)) return;								// Return if not a player
	if(!message.member.roles.find(role => role.name === `${campname} Player`)) return;		// Return if not a campaign player of the channel
	if(!campFiles.get(`${message.channel.id}.${message.author.id}`)) return;							// Return if not on database
	if(campFiles.get(`${message.channel.id}.${message.author.id}.choices`) == false){
		return message.reply(`\n>>> There are currently no notifications.`).then(sentMessage => {
			sentMessage.delete(6000);
		})
	}

	// Local Variables
	let campaign  = message.channel.id;
	let player    = message.author.id;
	let clas      = campFiles.get(`${campaign}.${player}.class`).toLowerCase();
	let race      = campFiles.get(`${campaign}.${player}.race`).toLowerCase();
	let traits    = campFiles.get(`${campaign}.${player}.traits`);
	let features  = campFiles.get(`${campaign}.${player}.features`);

	// Rich Embed
	let notifyembed = new Discord.RichEmbed()
	.setThumbnail(message.member.user.avatarURL)
	.setTitle(`**Player Choices**`)
	.setDescription(`${message.member}, Because of your race or class you now have player choices to decide upon.` +
		` These can be things such as an additional language, your starting spells, or skills you're proficient in. More details are below.`)
	.setColor(config.darkmagenta)

	if(clas != undefined && clas != `blank`){

		if(features){

			// Check If the Player's Class is on File
			if(`${clas}` in choicefile){

				// For every Feature on Profile
				for(let i = 0; i < features.length; i++){

					// Local Variables
					let tag = features[i].toLowerCase().trim();

					// Check If the specific Choice Tag was found under the Class
					if(`${tag}` in choicefile[`${clas}`]){

						// Check If Choice Tag has Type and Option Properties
						if(`options` in choicefile[`${clas}`][`${tag}`] && `type` in choicefile[`${clas}`][`${tag}`]){

							// Local Variables
							let options = `\n\n**These are your options:**`;

							// Modify The String For A List Of Options
							for(let j = 0; j < choicefile[`${clas}`][`${tag}`][`options`].length; j++){
								options += `\n ` + `${choicefile[`${clas}`][`${tag}`].options[j]}`;

							}

							notifyembed.addField(`**${features[i].trim()}**`, choicefile[`${clas}`][`${tag}`].prompt + `${options}\n\u200b`);

						}else{
							console.log(`  (ii) [${clas}][${tag}] does not have an options and/or type property.`);
							continue;
						}

					}else{
						console.log(`  (ii) ${tag} is not a property in the ${clas} object.`);
						continue;
					}

				}

			}else console.log(`  (ii) The class ${clas} is not on file`);

		}

	}
	if(race != undefined && race != `blank`){

		if(traits){

			// Check If the Player's Class is on File
			if(`${race}` in choicefile){

				// For every Feature on Profile
				for(let i = 0; i < features.length; i++){

					// Local Variables
					let tag = traits[i].toLowerCase().trim();

					// Check If the specific Choice Tag was found under the Class
					if(`${tag}` in choicefile[`${race}`]){

						// Check If Choice Tag has Type and Option Properties
						if(`options` in choicefile[`${race}`][`${tag}`] && `type` in choicefile[`${race}`][`${tag}`]){

							// Local Variables
							let options = `\n\n**These are your options:**`;

							// Modify The String For A List Of Options
							for(let j = 0; j < choicefile[`${race}`][`${tag}`][`options`].length; j++){
								options += `\n ` + `${choicefile[`${race}`][`${tag}`].options[j]}`;

							}

							notifyembed.addField(`**${traits[i].trim()}**`, choicefile[`${race}`][`${tag}`].prompt + `${options}\n\u200b`);

						}else{
							console.log(`  (ii) [${race}][${tag}] does not have an options and/or type property.`);
							continue;
						}

					}else{
						console.log(`  (ii) ${tag} is not a property in the ${race} object.`);
						continue;
					}

				}

			}else console.log(`  (ii) The race ${race} is not on file`);

		}

	}

	// Send Rich Embed
	message.channel.send(notifyembed);

	return;
}

exports.help = {
	name: `Player Notifications`,
	description: `If possesing the role \`Player\`, this will display every notification relevant to the player and their chracter sheet.`,
	use: `/notify`,
	examples: `/notify`,
	permissions: [`Player`],
	shortcuts: {
		root: `notify`,
		list: [`nt`]
	}
}
