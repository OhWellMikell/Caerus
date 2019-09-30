// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete().catch(console.error);

	// Database variables
	const campFiles  = new db.table(`CampaignFiles`);
	const campname   = campFiles.get(`${message.channel.id}.name`);
	let   fileselect = campFiles.get(`${message.channel.id}.styleselection`)

	// Defualting to vanilla selection if nothing can be found
	if(!fileselect){
		fileselect = `vanilla`;
	}

	// Files
	const racefile   = require(`../../files/races/${fileselect}.json`);
	const clasfile   = require(`../../files/classes/${fileselect}.json`);
	const alignfile  = require(`../../files/alignments/${fileselect}.json`);
	const choicefile   = require(`../../files/choices/${fileselect}.json`);


	// Local variables
	let keyword  = args.shift();
	let campaign = message.channel.id;
	let player   = message.author.id;
	if(keyword) keyword = keyword.toLowerCase();

	// Ignore List
	if(message.channel.parent.name != `📚 Campaigns`){
		return message.channel.send(`*This only works on channels under the campaigns category.*`).then(sentMessage => {
			sentMessage.delete(8000);

		});

	}
	if(!message.member.roles.find(role => role.name === `Player`)){
		return message.channel.send(`*Only \`Players\` can use character sheets*`).then(sentMessage => {
			sentMessage.delete(6000);

		});

	}
	if(!message.member.roles.find(role => role.name === `${campname} Player`)){
		return message.channel.send(`*Only \`${campname} Players\` can make character sheets here*`).then(sentMessage => {
			sentMessage.delete(6000);

		});

	}

	// If There Is No Keyword, Post Profile
	if(!keyword){

		// Local variables
		let name         = campFiles.get(`${campaign}.${player}.name`);
		let character    = campFiles.get(`${campaign}.${player}.character`);
		let alignment    = campFiles.get(`${campaign}.${player}.alignment`);
		let race         = campFiles.get(`${campaign}.${player}.race`);
		let level        = campFiles.get(`${campaign}.${player}.level`);
		let clas         = campFiles.get(`${campaign}.${player}.class`);

		let strength     = campFiles.get(`${campaign}.${player}.strength`);
		let dexterity    = campFiles.get(`${campaign}.${player}.dexterity`);
		let constitution = campFiles.get(`${campaign}.${player}.constitution`);
		let intelligence = campFiles.get(`${campaign}.${player}.intelligence`);
		let wisdom       = campFiles.get(`${campaign}.${player}.wisdom`);
		let charisma     = campFiles.get(`${campaign}.${player}.charisma`);

		let strength_bonus     = campFiles.get(`${campaign}.${player}.strength_bonus`);
		let dexterity_bonus    = campFiles.get(`${campaign}.${player}.dexterity_bonus`);
		let constitution_bonus = campFiles.get(`${campaign}.${player}.constitution_bonus`);
		let intelligence_bonus = campFiles.get(`${campaign}.${player}.intelligence_bonus`);
		let wisdom_bonus       = campFiles.get(`${campaign}.${player}.wisdom_bonus`);
		let charisma_bonus     = campFiles.get(`${campaign}.${player}.charisma_bonus`);
		let proficiency_bonus  = campFiles.get(`${campaign}.${player}.proficiency_bonus`);

		let languages = campFiles.get(`${campaign}.${player}.languages`);
		let features  = campFiles.get(`${campaign}.${player}.features`);
		let equipment = campFiles.get(`${campaign}.${player}.equipment`);
		let traits    = campFiles.get(`${campaign}.${player}.traits`);
		let cantrips  = campFiles.get(`${campaign}.${player}.cantrips`);
		let spells    = campFiles.get(`${campaign}.${player}.spells`);

		if(languages == undefined || languages.length <= 0) languages = `None`
		if(features == undefined || features.length <= 0)   features  = `None`
		if(equipment == undefined || equipment.length <= 0) equipment = `None`
		if(traits == undefined || traits.length <= 0)       traits    = `None`
		if(cantrips == undefined || cantrips.length <= 0)   cantrips  = `None`
		if(spells == undefined || spells.length <= 0)       spells    = `None`

		// Rich Embed
		let profileembed = new Discord.RichEmbed()
		.setAuthor(`${name}'s  Character Sheet`, message.member.user.avatarURL)
		.addField(`Character`, `${character}`, true)
		.addField(`Race`, `${race}`, true)
		.addField(`Alignment`, `${alignment}`, true)
		.addField(`\u200b\nLevel & Class`, `Lvl. ${level} ${clas}\n\u200b`, true)
		.addField(`Ability Scores`,
			`\`\`\`yaml\nSTR: ${strength}   ${strength_bonus}\u0009INT: ${intelligence}   ${intelligence_bonus}\nDEX: ${dexterity}   ${dexterity_bonus}\u0009WIS: ${wisdom}   ${wisdom_bonus}\nCON: ${constitution}   ${constitution_bonus}\u0009CHA: ${charisma}   ${charisma_bonus}\`\`\`\`\`\`yaml\nPROFICIENCY: ${proficiency_bonus}\`\`\``)
		.addField(`\u200b\nLanguages`, `${languages}`)
		.addField(`Traits`, `${traits}`)
		.addField(`Features`, `${features}`)
		.addField(`Equipment`, `${equipment}`)
		.addField(`Cantrips`, `${cantrips}`, true)
		.addField(`Spells`, `${spells}`, true)
		.setColor(config.darkmagenta)

		// Send Embed
		message.channel.send(profileembed);

		return;
	}

	// If The Keyword is Help
	if(keyword == `help`){

		// Rich Embed
		let helpembed = new Discord.RichEmbed()
		.setTitle(`How does the  **/sheet**  command work?`)
		.setDescription(`**/sheet** is used to write down the characteristics of your role-play character onto a character sheet.` +
			` It holds most of the key information used in a campaign.` +
			` To fill in a character sheet, you use keywords that will enter that info respectively.\n\n` +
			`For example, **/sheet name Adae Riventhall** will fill the character name section with the name "Adae Riventhall".\n\n` +
			`**As a bonus tip:**\n *You can abbreviate /sheet as **/cs** or **/s***\n`)
		.addField(`**Keywords**`, `*Below are the keywords used to enter information.*\nName\nRace\nAlignment\nClass\n\u200b`)
		.addField(`***Uhhh..***`, `If you dont understand how to use a keyword use the word with nothing after it.\nLike this: **/sheet "keyword"**.` +
			`\nA description will appear to help you.`)
		.setColor(config.darkmagenta)

		// Send Embed
		message.channel.send(helpembed);

		return;
	}

	if(keyword == `keyword` || keyword == `"keyword"`){
		message.channel.send(`> No, Silly. Choose a keyword from the *keyword*  list.`);
		return;

	}

	// If the Keyword is Name
	if(keyword == `name` || keyword == `n` || keyword == `character`){

		// Local variables
		let name = args.join(` `);

		// If There is no Argument after Name
		if(name == ``){

			// Rich Embed
			let nameembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet name** keyword`)
			.setDescription(`The \`/sheet name\` keyword is how you set your campaign character's name.` +
				`\nDeciding your name is a fine detail to giving flair to your character.`)
			.addField(`How to Use`, ` Simply type the name you want after the keywords \`/sheet name\`.\n` +
				`Don't go crazy though, as it follows normal naming conventions: you can't name your character P%ois^$*dena@Aol.com, for example.\n\u200b`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(nameembed);

			return;
		}

		// If the name is not alphanumeric
		if(/[^a-zA-Z\d\s-']+/gi.test(name)){
				return message.channel.send(`*Sorry, alphanumeric names only. Hyphens (-) and apostrophes (') being the exception.*`).then(sentMessage => {
					sentMessage.delete(8000);});
		}

		// Sending Name change Status to the Chat
		message.channel.send(`${message.member}, Your character name has been set to **${name}**`).then(sentMessage => {
			sentMessage.delete(15000);});

		// Setting the Name
		campFiles.set(`${campaign}.${player}.character`, `${name}`);


		return;
	}

	// If the Keyword is Alignment
	if(keyword == `alignment` || keyword == `align`){

		// Local Variables
		let alignment = args.join(` `).toLowerCase()

		// If There is no Argument after Alignment
		if(!alignment || alignment == ``){

			// Obtaining List of Races
			let alignlist  = Object.keys(alignfile);

			// Pretty Printing List of Races (Each Race Capitalized)
			for(let i = 0; i < alignlist.length; i++){
				let spell = alignlist[i].toLowerCase().split(``);
				alignlist[i] = spell[0].toUpperCase().toString() + spell.slice(1).join(``);
			}

			// Placing the array of races in an embed list
			let embedlist = alignlist.join(`\n`);

			// Rich Embed
			let alignembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet alignment** keyword`)
			.setDescription(`The \`/sheet alignment\` keyword is how you set your campaign character's alignment.` +
			`\nDeciding your alignment is a fine detail to giving flair to your character. Below are the alignments you can choose from..\n`)
			.addField(`Alignment`, `${embedlist}\n\u200b`)
			.addField(`How to Use`, ` Simply type the alignment you want after the keywords \`/sheet alignment\`.\n\u200b`)
			.addField(`But wait...`, `\nIf you don't know much about the alignment and want to learn more about it type \`/whatis <alignment>\`.` +
			`\nFor example, \`/whatis ${alignlist[0]}\` will show you information about the ${alignlist[0]}. (in development)`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(alignembed);

			return;
		}

		// If the Argument matches a Race Name
		if(alignfile[alignment]){

			// Setting the Alignment
			campFiles.set(`${campaign}.${player}.alignment`, alignfile[alignment].name);
			message.channel.send(`${message.member}, you have chosen \`${alignment}\` as your alignment.`).then(sentMessage => {
				sentMessage.delete(15000);});

		}
		else{
			message.channel.send(`There is no \`${alignment}\` alignment to select. As a reminder, this campaign uses \`${fileselect}\` alignments.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	// If the Keyword is Race
	if(keyword == `race` || keyword == `r`){

		// Local Variables
		let race = args.join(` `).toLowerCase()

		// If There is no Argument after Race
		if(!race || race == ``){

			// Obtaining List of Races
			let racelist  = Object.keys(racefile);

			// Pretty Printing List of Races (Each Race Capitalized)
			for(let i = 0; i < racelist.length; i++){
				let spell = racelist[i].toLowerCase().split(``);
				racelist[i] = spell[0].toUpperCase().toString() + spell.slice(1).join(``);
			}

			// Placing the array of races in an embed list
			let embedlist = racelist.join(`\n`);

			// Rich Embed
			let raceembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet race** keyword`)
			.setDescription(`The \`/sheet race\` keyword is how you set your campaign character's race.` +
			`\nDeciding your race is the first main step to creating your character. Below are the races you can choose from..\n`)
			.addField(`Races`, `${embedlist}\n\u200b`)
			.addField(`How to Use`, ` Simply type the race you want after the keywords \`/sheet race\`.\n\u200b`)
			.addField(`But wait...`, `\nIf you don't know much about the race and want to learn more about it type \`/whatis <name of race>\`.` +
			`\nFor example, \`/whatis ${racelist[0]}\` will show you information and traits about the ${racelist[0]} race. (in development)`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(raceembed);

			return;
		}

		// Error Trap: Catching naming convention of races mentioned without a hyphen and adding a hyphen
		if(race == `half elf`) race = `half-elf`
		if(race == `half orc`) race = `half-orc`

		// If the Argument matches a Race Name
		if(racefile[race]){

			// Setting the Race Name, Speed, and Size
			campFiles.set(`${campaign}.${player}.race`, racefile[race].name);
			campFiles.set(`${campaign}.${player}.speed`, racefile[race].speed);
			campFiles.set(`${campaign}.${player}.size`, racefile[race].size);

			// Resetting the scorebonuses
			campFiles.set(`${campaign}.${player}.constitution`, 0);
			campFiles.set(`${campaign}.${player}.strength`, 0);
			campFiles.set(`${campaign}.${player}.dexterity`, 0);
			campFiles.set(`${campaign}.${player}.wisdom`, 0);
			campFiles.set(`${campaign}.${player}.intelligence`, 0);
			campFiles.set(`${campaign}.${player}.charisma`, 0);

			// Resetting any previous traits slotted
			campFiles.set(`${campaign}.${player}.traits`, [] );

			// Resetting any previous languages slotted
			campFiles.set(`${campaign}.${player}.cantrips`, [] );

			// Resetting any previous languages slotted
			campFiles.set(`${campaign}.${player}.languages`, [] );

			// For each scorebonus, parse it for the corresponding ability type and score
			for(let i = 0; i < racefile[race].scorebonus.length; i++){

				// Local Variables
				let type = racefile[race].scorebonus[i].split(`+`).shift();
				let bonus = Number(racefile[race].scorebonus[i].split(`+`).pop());

				// Set corresponding ability bonus
				campFiles.set(`${campaign}.${player}.${type}`, bonus);

			}

			// For each element in the traits array push the value into the traits field
			if(racefile[race].traits != undefined){
				for(let i = 0; i < racefile[race].traits.length; i++){
					campFiles.push(`${campaign}.${player}.traits`, ` ` + racefile[race].traits[i]);
				}
			}

			// For each element in the cantrips array push the value into the cantrips field
			if(racefile[race].cantrips != undefined){
				for(let i = 0; i < racefile[race].cantrips.length; i++){
					campFiles.push(`${campaign}.${player}.cantrips`, ` ` + racefile[race].cantrips[i]);
				}
			}

			// For each element in the languages array push the value into the languages field
			for(let i = 0; i < racefile[race].languages.length; i++){
				campFiles.push(`${campaign}.${player}.languages`, ` ` + racefile[race].languages[i]);
			}

			campFiles.set(`${campaign}.${player}.size`, racefile[race].size);   // Set size
			campFiles.set(`${campaign}.${player}.speed`, racefile[race].speed); // Set speed
			campFiles.set(`${campaign}.${player}.race`, racefile[race].name);   // Set name

			// Sending Name change Status to the Chat
			message.channel.send(`${message.member}, Your character race has been set to \`${race}\``).then(sentMessage => {
				sentMessage.delete(15000);});

		}
		else{
			message.channel.send(`There is no \`${race}\` race to select. As a reminder, this campaign uses \`${fileselect}\` races.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	// If the Keyword is Race
	if(keyword == `class` || keyword == `c`){

		// Local Variables
		let clas = args.join(` `).toLowerCase()

		// If There is no Argument after Class
		if(!clas || clas == ``){

			// Obtaining List of Races
			let claslist  = Object.keys(clasfile);

			// Pretty Printing List of Classes (Each Class Capitalized)
			for(let i = 0; i < claslist.length; i++){
				let spell = claslist[i].toLowerCase().split(``);
				claslist[i] = spell[0].toUpperCase().toString() + spell.slice(1).join(``);
			}

			// Placing the array of classes in an embed list
			let embedlist = claslist.join(`\n`);

			// Rich Embed
			let clasembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet class** keyword`)
			.setDescription(`The \`/sheet class\` keyword is how you set your campaign character's class.` +
			`\nDeciding your class is the most integral step to creating your character.` +
			` It defines the profession, the nature, the lifestyle of your character. Below are the classes you can choose from..\n`)
			.addField(`Classes`, `${embedlist}\n\u200b`)
			.addField(`How to Use`, ` Simply type the class you want after the keywords \`/sheet class\`.\n\u200b`)
			.addField(`But wait...`, `\nIf you don't know much about the class and want to learn more about it type \`/whatis <name of class>\`.` +
			`\nFor example, \`/whatis ${claslist[0]}\` will show you information and traits about the ${claslist[0]} class. (in development)`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(clasembed);

			return;
		}

		// If the Argument matches a Class Name
		if(clasfile[clas]){

			// Setting the Class Name
			campFiles.set(`${campaign}.${player}.class`, clasfile[clas].name);

			// Resetting any previous proficiencies slotted
			campFiles.set(`${campaign}.${player}.proficiencies`, [] );

			// Resetting any previous features slotted
			campFiles.set(`${campaign}.${player}.features`, [] );

			// Resetting any previous equipment slotted
			campFiles.set(`${campaign}.${player}.equipment`, [] );

			// For each proficiency described in the class push it into the proficiency slot
			for(let i = 0; i < clasfile[clas].proficiency.length; i++){
				campFiles.push(`${campaign}.${player}.proficiencies`, ` ` + clasfile[clas].proficiency[i]);

			}

			// For each feature described in the class push it into the feature slot
			for(let i = 0; i < clasfile[clas].features.length; i++){
				campFiles.push(`${campaign}.${player}.features`, ` ` + clasfile[clas].features[i]);

			}

			// For every equipment described in the class push it into the equipment slot
			for(let i = 0; i < clasfile[clas].equipment.length; i++){
				campFiles.push(`${campaign}.${player}.equipment`, ` ` + clasfile[clas].equipment[i]);

			}

			// Sending Class change Status to the Chat
			message.channel.send(`${message.member}, Your character class has been set to \`${clas}\``).then(sentMessage => {
				sentMessage.delete(15000);});

		}
		else{
			message.channel.send(`There is no \`${clas}\` class to select. As a reminder, this campaign uses \`${fileselect}\` classes.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	// If the Keyword is Choice
	if(keyword == `choice`){

		// Local variables
		let selection = args.join(` `).toLowerCase().trim();
		let clas      = campFiles.get(`${campaign}.${player}.class`).toLowerCase().trim();
		let race      = campFiles.get(`${campaign}.${player}.race`).toLowerCase().trim();
		let traits    = campFiles.get(`${campaign}.${player}.traits`);
		let features  = campFiles.get(`${campaign}.${player}.features`);

		// Boolean Variables
		let claschoice = false;
		let racechoice = false;

		// If There Are Traits On The Profile..
		if(traits){

			// Check Traits To See If There Are Choice Tags
			for(let i = 0; i < traits.length; i++){

				// Current Tag To Lower Case
				let tag = traits[i].toLowerCase().trim();

				// Error Traps
				if(!choicefile[race]) break;					// End The Iterator If The Race Isn't On File
				if(!choicefile[race][tag]) continue;	// Skip The Iterator If The Tag Isn't On File

				// If The Race Has The Specified Choice Tag, Set Race Choice to True And Break
				if(choicefile[race][tag]){
					racechoice = true;
					break;
				}

			}

		}

		// If There Are Features On The Profile..
		if(features){

			// Check Features To See If There Are Choice Tags
			for(let i = 0; i < features.length; i++){

				// Current Tag To Lower Case
				let tag = features[i].toLowerCase().trim();

				// Error Traps
				if(!choicefile[clas]) break;					// End The Iterator If The Class Isn't On File
				if(!choicefile[clas][tag]) continue;	// Skip The Iterator If The Tag Isn't On File

				// If The Class Has The Specified Choice Tag, Set Class Choice to True And Break
				if(choicefile[clas][tag]){
					claschoice = true;
					break;
				}

			}

		}

		// Ignore If There Were No Choice Tags
		if(claschoice == false && racechoice == false) return message.channel.send(`> There are no choices that you need to make.`);

		// If There is no Argument after Name
		if(selection == `` || !selection) return message.channel.send(`> Please specify a choice from your list of options.`);

		// If There Are Choice Tags In Features
		if(claschoice == true){

			// For Every Feature in Features...
			for(let i = 0; i < features.length; i++){

				// Current Tag To Lower Case
				let tag = features[i].toLowerCase().trim();
				let match = false;

				if(typeof choicefile[`${clas}`] === undefined){
					console.log(`  (!!) ${clas} is not a class inside the choice file.`);
					continue;
				} else{
					console.log(`  (ii) ${clas} is a class inside the choice file. Searching tag..`);
				}

				if(typeof choicefile[`${clas}`][`${tag}`] === undefined){
					console.log(`  (!!) ${tag} is not a property in the ${clas} object.`);
					continue;
				} else{
					console.log(`  (ii) ${tag} is a property in the ${clas} object. Verifying type and options..`);
				}

				if(typeof choicefile[`${clas}`][`${tag}`][`type`] === undefined || typeof choicefile[`${clas}`][`${tag}`][`options`] === undefined){
					console.log(`  (!!) ${tag} has no type or options property inside ${clas} object`);
					continue;
				} else{
					console.log(`  (ii) ${tag} has type and options property inside ${clas} object`)
				}

				for(let j = 0; j < choicefile[`${clas}`][`${tag}`][`options`].length; j++){
					if(choicefile[`${clas}`][`${tag}`].options[j].toLowerCase().trim() == selection){
						console.log(`${selection} is a match`);
						match = true;
					}

				}

				if(match == true) break;

			}

		}

		return;
	}

	return;
}

exports.help = {
	name: `Character Sheet`,
	description: `If possesing the role \`Player\`, this will help define the character sheet for the campaign your in.`,
	use: `/sheet <keyword>`,
	examples: `/sheet\n/sheet help`,
	permissions: [`Player`],
	shortcuts: {
		root: `sheet`,
		list: [`s`, `cs`]
	}
}
