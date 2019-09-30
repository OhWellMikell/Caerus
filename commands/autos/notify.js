// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Local Variables
	let channel = message
	let guild   = message.guild
	let parent  = await guild.channels.find(search =>  search.id === message.parentID);
	let user    = await guild.members.find(search =>  search.id === args.id);

	// Database Variables
	const campFiles  = new db.table(`CampaignFiles`);
	const campname   = campFiles.get(`${channel.id}.name`);
	let   fileselect = campFiles.get(`${channel.id}.styleselection`);

	// Defualting to vanilla selection if nothing can be found
	if(!fileselect){
		fileselect = `vanilla`;
	}

	// Files
	const choicefile   = require(`../../files/choices/${fileselect}.json`);

	// Ignore List
	if(!parent || parent == undefined || parent == null) return
	if(parent.name != `📚 Campaigns`) return;																		// Return if not in the campaign category
	if(!user.roles.find(role => role.name === `Player`)) return;								// Return if not a player
	if(!user.roles.find(role => role.name === `${campname} Player`)) return;		// Return if not a campaign player of the channel
	if(!campFiles.get(`${channel.id}.${user.id}`)) return;											// Return if not on database

	// Local Variables
	let campaign  = channel.id;
	let player    = user.id;
	let clas      = campFiles.get(`${campaign}.${player}.class`).toLowerCase();
	let race      = campFiles.get(`${campaign}.${player}.race`).toLowerCase();
	let traits    = campFiles.get(`${campaign}.${player}.traits`);
	let features  = campFiles.get(`${campaign}.${player}.features`);

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

						// Mark that a Choice Tag Exists
						campFiles.set(`${campaign}.${player}.choices`, true);
						return;

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

						// Mark that a Choice Tag Exists
						campFiles.set(`${campaign}.${player}.choices`, true);
						return;

					}else{
						console.log(`  (ii) ${tag} is not a property in the ${race} object.`);
						continue;
					}

				}

			}else console.log(`  (ii) The race ${race} is not on file`);

		}

	}

	// If no choice tags were found, set choice state to false
	campFiles.set(`${campaign}.${player}.choices`, false);

	return;
}

exports.help = {
	name: `Profile Notifications`
}
