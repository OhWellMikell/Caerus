// Libraries
const db = require("quick.db");

// Database
const cpFiles = new db.table(`CampaignFiles`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(1000).catch(O_o=>{});

	// Return if not a channel under the campaign category
	if(!message.channel.parent.name.includes("Campaign")){
		return message.channel.send(`This only works on channels under the campaign category.`).then(sentMessage => {
			sentMessage.delete(8000);});

	}

	// Local Variables
	const cfileID   = `${message.author.id}|${message.channel.id}`;
	let username    = message.author.username;
	let channel     = message.channel.name;
	let slots       = new Array();

	// Check to see if user  is in the database
	if(!cpFiles.has(`${cfileID}`)){
		console.log(`${message.author.username} does not exist in the "${channel}" campaign database, filing new account...`);
		cpFiles.set(`${cfileID}`,
			{campaign: `${channel}`,
			username: `${username}`,
			charaname: null,
			alignment: null,
			race: null,
			size: null,
			speed: null,
			rsaved: false,
			class: null,
			csaved: false,
			draft: null,
			dsaved: false,
			armclass: 0,
			str: 0,
			strbonus: 0,
			dex: 0,
			dexbonus: 0,
			con: 0,
			conbonus: 0,
			int: 0,
			intbonus: 0,
			wis: 0,
			wisbonus: 0,
			cha: 0,
			chabonus: 0,
			prfbonus: 0,
			languages: [],
			cantrips: [],
			spells: [],
			traits: [],
			size: null
		});

		console.log(cpFiles.get(`${cfileID}`));
		return message.channel.send(`Campaign account for "${channel}" created!`).then(sentMessage => {sentMessage.delete(5000);});

	}else if (cpFiles.has(`${cfileID}`)){
		return message.channel.send(`You already have an account registered for ${channel}.`).then(sentMessage => {sentMessage.delete(5000);});

	}

}

exports.help = {
	name: "Create Campaign Account"
}
