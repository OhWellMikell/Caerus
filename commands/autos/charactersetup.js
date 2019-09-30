// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Database Variables
	const campFiles = new db.table(`CampaignFiles`);

	// Local Variables
	let channel  = message;
	let user     = args;
	let campaign = channel.id;
	let player   = user.id;

	campFiles.set(`${campaign}.${player}`,
		{
				name: `${user.username}`,
				character: `blank`,
				alignment: `blank`,
				race: `blank`,
				size: `blank`,
				speed: `blank`,
				class: `blank`,
				level: 1,
				armor_class: 0,
				strength: [0, 0, 0],
				dexterity: [0, 0, 0],
				constitution: [0, 0, 0],
				intelligence: [0, 0, 0],
				wisdom: [0, 0, 0],
				charisma: [0, 0, 0],
				strength_bonus: 0,
				dexterity_bonus: 0,
				constitution_bonus: 0,
				intelligence_bonus: 0,
				wisdom_bonus: 0,
				charisma_bonus: 0,
				proficiency_bonus: 0,
				proficiencies: [],
				languages: [],
				cantrips: [],
				spells: [],
				traits: [],
				features: [],
				equipment: [],
				choices: false,
				scores: [],
				scoressaved: false,
				scoreslocked: false,
				rolls: 2
			}
		);

	return;
}

exports.help = {
	name: `Character Sheet Setup`
}
