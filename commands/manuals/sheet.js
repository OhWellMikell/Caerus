// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete().catch(console.error);

	// Database Variables
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
	const choicefile = require(`../../files/choices/${fileselect}.json`);
	// let   pic        = require(`../../pictures/Gifs/ricknmorty.gif`);


	// Local Variables
	let keyword  = args.shift();
	if(keyword) keyword = keyword.toLowerCase().trim();
	let campaign = message.channel.id;
	let player   = message.author.id;

	// Ignore List
	if(message.channel.parent.name != `📚 Campaigns`){
		return message.channel.send(`*This only works on channels under the campaigns category.*`).then(sentMessage => {
			sentMessage.delete(8000);

		});

	}
	if(!message.member.roles.find(role => role.name === `Player`)){
		return message.channel.send(`*Only **Players** can use character sheets.*`).then(sentMessage => {
			sentMessage.delete(6000);

		});

	}
	if(!message.member.roles.find(role => role.name === `${campname} Player`)){
		return message.channel.send(`*Only **${campname} Players** can make character sheets here.*`).then(sentMessage => {
			sentMessage.delete(6000);

		});

	}

	// Updating Sheet Calculations
	let add = (a,b) => a + b;
	campFiles.set(`${campaign}.${player}.strength_bonus`, Math.floor((campFiles.get(`${campaign}.${player}.strength`).reduce(add) - 10) / 2));
	campFiles.set(`${campaign}.${player}.dexterity_bonus`, Math.floor((campFiles.get(`${campaign}.${player}.dexterity`).reduce(add) - 10) / 2));
	campFiles.set(`${campaign}.${player}.constitution_bonus`, Math.floor((campFiles.get(`${campaign}.${player}.constitution`).reduce(add) - 10) / 2));
	campFiles.set(`${campaign}.${player}.intelligence_bonus`, Math.floor((campFiles.get(`${campaign}.${player}.intelligence`).reduce(add) - 10) / 2));
	campFiles.set(`${campaign}.${player}.wisdom_bonus`, Math.floor((campFiles.get(`${campaign}.${player}.wisdom`).reduce(add) - 10) / 2));
	campFiles.set(`${campaign}.${player}.charisma_bonus`, Math.floor((campFiles.get(`${campaign}.${player}.charisma`).reduce(add) - 10) / 2));

	// If There Is No Keyword, Post Profile
	if(!keyword){

		// Local Variables
		let name         = campFiles.get(`${campaign}.${player}.name`);
		let character    = campFiles.get(`${campaign}.${player}.character`);
		let alignment    = campFiles.get(`${campaign}.${player}.alignment`);
		let race         = campFiles.get(`${campaign}.${player}.race`);
		let level        = campFiles.get(`${campaign}.${player}.level`);
		let clas         = campFiles.get(`${campaign}.${player}.class`);

		let strength     = campFiles.get(`${campaign}.${player}.strength`).reduce(add).toString().padEnd(4, ` `);
		let dexterity    = campFiles.get(`${campaign}.${player}.dexterity`).reduce(add).toString().padEnd(4, ` `);
		let constitution = campFiles.get(`${campaign}.${player}.constitution`).reduce(add).toString().padEnd(4, ` `);
		let intelligence = campFiles.get(`${campaign}.${player}.intelligence`).reduce(add).toString().padEnd(4, ` `);
		let wisdom       = campFiles.get(`${campaign}.${player}.wisdom`).reduce(add).toString().padEnd(4, ` `);
		let charisma     = campFiles.get(`${campaign}.${player}.charisma`).reduce(add).toString().padEnd(4, ` `);

		let strength_bonus     = campFiles.get(`${campaign}.${player}.strength_bonus`);
		let dexterity_bonus    = campFiles.get(`${campaign}.${player}.dexterity_bonus`);
		let constitution_bonus = campFiles.get(`${campaign}.${player}.constitution_bonus`);
		let intelligence_bonus = campFiles.get(`${campaign}.${player}.intelligence_bonus`);
		let wisdom_bonus       = campFiles.get(`${campaign}.${player}.wisdom_bonus`);
		let charisma_bonus     = campFiles.get(`${campaign}.${player}.charisma_bonus`);
		let proficiency_bonus  = campFiles.get(`${campaign}.${player}.proficiency_bonus`);

		if(strength_bonus >= 0) strength_bonus = `+${strength_bonus}`;
		if(dexterity_bonus >= 0) dexterity_bonus = `+${dexterity_bonus}`;
		if(constitution_bonus >= 0) constitution_bonus = `+${constitution_bonus}`;
		if(intelligence_bonus >= 0) intelligence_bonus = `+${intelligence_bonus}`;
		if(wisdom_bonus >= 0) wisdom_bonus = `+${wisdom_bonus}`;
		if(charisma_bonus >= 0) charisma_bonus = `+${charisma_bonus}`;

		let languages   = campFiles.get(`${campaign}.${player}.languages`);
		let traits      = campFiles.get(`${campaign}.${player}.traits`);
		let features    = campFiles.get(`${campaign}.${player}.features`);
		let equipment   = campFiles.get(`${campaign}.${player}.equipment`);
		let proficiency = campFiles.get(`${campaign}.${player}.proficiencies`);
		let cantrips    = campFiles.get(`${campaign}.${player}.cantrips`);
		let spells      = campFiles.get(`${campaign}.${player}.spells`);
		let scores      = ``;

		if(campFiles.get(`${campaign}.${player}.scoressaved`) == true){
			scores = `\`[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}]\``;
		}
		if(campFiles.get(`${campaign}.${player}.scoressaved`) == true && campFiles.get(`${campaign}.${player}.scores`).length < 1){
			scores = ``;
		}

		if(languages == undefined || languages.length <= 0){
			languages = `None`;
		}else{
			for(let i = 0; i < languages.length; i++){
				languages[i] = ` ${languages[i]}`;
			}
		}
		if(features == undefined || features.length <= 0){
			features = `None`;
		}else{
			for(let i = 0; i < features.length; i++){
				features[i] = ` ${features[i]}`;
			}
		}
		if(equipment == undefined || equipment.length <= 0){
			equipment = `None`;
		}else{
			for(let i = 0; i < equipment.length; i++){
				equipment[i] = ` ${equipment[i]}`;
			}
		}
		if(proficiency == undefined || proficiency.length <= 0){
			proficiency = `None`;
		}else{
			for(let i = 0; i < proficiency.length; i++){
				proficiency[i] = ` ${proficiency[i]}`;

			}
		}
		if(traits == undefined || traits.length <= 0){
			traits = `None`;
		}else{
			for(let i = 0; i < traits.length; i++){
				traits[i] = ` ${traits[i]}`;
			}
		}
		if(cantrips == undefined || cantrips.length <= 0){
			cantrips = `None`;
		}else{
			for(let i = 0; i < cantrips.length; i++){
				cantrips[i] = ` ${cantrips[i]}`;
			}
		}
		if(spells == undefined || spells.length <= 0){
			spells = `None`;
		}else{
			for(let i = 0; i < spells.length; i++){
				spells[i] = ` ${spells[i]}`;
			}
		}

		// Rich Embed
		let profileembed = new Discord.RichEmbed()

		if(campFiles.get(`${campaign}.${player}.choices`) == true){
			profileembed.addField(`**Choices**`, `\`\`\`yaml\nYou Have Player Choices, Use ${config.prefix}notify to see them!\n\`\`\`\u200b\n`);
		}

		profileembed
		.setAuthor(`${name}'s  Character Sheet`, message.member.user.avatarURL)
		.addField(`Character`, `${character}\u200b\n`, true)
		.addField(`Race`, `${race}\u200b\n`, true)
		.addField(`Alignment`, `${alignment}\u200b\n`, true)
		.addField(`Level & Class`, `Lvl. ${level} ${clas}\n\u200b`, true)
		.addField(`Ability Scores   ${scores}`,
			`\`\`\`yaml\nSTR: ${strength}${strength_bonus}\u0009INT: ${intelligence}${intelligence_bonus}\nDEX: ${dexterity}${dexterity_bonus}\u0009WIS: ${wisdom}${wisdom_bonus}\nCON: ${constitution}${constitution_bonus}\u0009CHA: ${charisma}${charisma_bonus}\`\`\`\`\`\`yaml\nPROFICIENCY: ${proficiency_bonus}\`\`\`\u200b\n`)
		.addField(`Languages`, `${languages}`)
		.addField(`Traits`, `${traits}`)
		.addField(`Features`, `${features}`)
		.addField(`Equipment`, `${equipment}`)
		.addField(`Proficiencies`, `${proficiency}`)
		.addField(`Cantrips`, `${cantrips}\n\u200b`, true)
		.addField(`Spells`, `${spells}\n\u200b`, true)
		.setFooter(`Use /sheet help to learn how to fill your character sheet out...`)
		.setColor(config.darkmagenta)

		// Send Embed
		message.channel.send(profileembed);

		return;
	}

	// If The Keyword is Help
	if(keyword == `help`){

		let commandlist = [	`Name`, `Race`, `Alignment`, `Class`, `Scores`];

		// Rich Embed
		let helpembed = new Discord.RichEmbed()
		.setTitle(`How does the  **/sheet**  command work?`)
		.setDescription(`**/sheet** is used to write down the characteristics of your role-play character onto a character sheet.` +
			` It holds most of the key information used in a campaign.` +
			` To fill in a character sheet, you use keywords that will enter that info respectively.\n\n` +
			`For example, **/sheet name** ***Adae Riventhall***  will fill the character name section with the name "Adae Riventhall".\n\n` +
			`**As a bonus tip:**\n *You can abbreviate /sheet as **/cs** or **/s.***\n\u200b`)
		.addField(`**Keywords**`, `*Below are the keywords used to enter information.*${commandlist.join(`\n`)}\n\u200b`)
		.addField(`***Uhhh..***`, `If you dont understand how to use a keyword use the word with nothing after it.\nLike this: **/sheet** ***keyword***.` +
			`\nA description will appear to help you.`)
		.setColor(config.darkmagenta)

		// Send Embed
		message.channel.send(helpembed);

		return;
	}

	// If the Keyword is Keyword
	if(keyword == `keyword` || keyword == `"keyword"`){
		message.channel.send(`> No, Silly. Choose a keyword from the *keywords*  list.`);
		return;

	}

	// If the Keyword is Name
	if(keyword == `name` || keyword == `character`){

		// Local Variables
		let name = args.join(` `);

		// If There is no Argument after Name
		if(!name || name == ``){

			// Rich Embed
			let nameembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet name** keyword`)
			.setDescription(`The **/sheet name** keyword is how you set your campaign character's name.` +
				`\nDeciding your name is a fine detail to giving flair to your character.`)
			.addField(`How to Use`, ` Simply type the name you want after the keywords **/sheet name**.\n` +
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

		// Setting the Name
		campFiles.set(`${campaign}.${player}.character`, `${name}`);

		// Sending Name change Status to the Chat
		message.reply(`\n>>> Your character name has been set to **${name}**.`).then(sentMessage => {
			sentMessage.delete(15000);});

		return;
	}

	// If the Keyword is Alignment
	if(keyword == `alignment` || keyword == `align`){

		// Local Variables
		let alignment = args.join(` `).toLowerCase().trim();

		// If There is no Argument after Alignment
		if(!alignment || alignment == ``){

			// Obtaining List of Alignments
			let alignlist  = Object.keys(alignfile);

			// Pretty Printing List of Alignments (Each Alignment Capitalized)
			for(let i = 0; i < alignlist.length; i++){
				let spell = alignlist[i].toLowerCase().split(``);
				alignlist[i] = spell[0].toUpperCase().toString() + spell.slice(1).join(``);
			}

			// Placing the Alignments in an Embed List
			let embedlist = alignlist.join(`\n`);

			// Rich Embed
			let alignembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet alignment** keyword`)
			.setDescription(`The **/sheet alignment** keyword is how you set your campaign character's alignment.` +
			`\nDeciding your alignment is a fine detail to giving flair to your character. Below are the alignments you can choose from..\n`)
			.addField(`Alignment`, `${embedlist}\n\u200b`)
			.addField(`How to Use`, ` Simply type the alignment you want after the keywords **/sheet alignment**.\n\u200b`)
			.addField(`But wait...`, `\nIf you don't know much about the alignment and want to learn more about it type **/whatis <alignment>**.` +
			`\nFor example, **/whatis** ***${alignlist[0]}***  will show you information about the ${alignlist[0]}. (in development)`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(alignembed);

			return;
		}

		// If the Argument matches a Race Name
		if(alignment in alignfile){

			// Setting the Alignment
			campFiles.set(`${campaign}.${player}.alignment`, alignfile[`${alignment}`].name);
			message.reply(`\n>>> You have chosen **${alignfile[`${alignment}`].name}** as your alignment.`).then(sentMessage => {
				sentMessage.delete(15000);});

		}
		else{
			message.reply(`\n>>> There is no **${alignment}** alignment to select. As a reminder, this campaign uses **${fileselect}** alignments.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	// If the Keyword is Race
	if(keyword == `race`){

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

			// Placing the campFiles.get(`${campaign}.${player}.strength`)ay of races in an embed list
			let embedlist = racelist.join(`\n`);

			// Rich Embed
			let raceembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet race** keyword`)
			.setDescription(`The **/sheet race** keyword is how you set your campaign character's race.` +
			`\nDeciding your race is the first main step to creating your character. Below are the races you can choose from..\n`)
			.addField(`Races`, `${embedlist}\n\u200b`)
			.addField(`How to Use`, ` Simply type the race you want after the keywords **/sheet race**.\n\u200b`)
			.addField(`But wait...`, `\nIf you don't know much about the race and want to learn more about it type **/whatis <name of race>**.` +
			`\nFor example, **/whatis ${racelist[0]}** will show you information and traits about the ${racelist[0]} race. (in development)`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(raceembed);

			return;
		}

		// Error Trap: Catching naming convention of races mentioned without a hyphen and adding a hyphen
		if(race == `half elf`) race = `half-elf`
		if(race == `half orc`) race = `half-orc`

		// If the Argument matches a Race Name
		if(`${race}` in racefile){

			// Setting the Race Name, Speed, and Size
			campFiles.set(`${campaign}.${player}.race`, racefile[`${race}`].name);
			campFiles.set(`${campaign}.${player}.speed`, racefile[`${race}`].speed);
			campFiles.set(`${campaign}.${player}.size`, racefile[`${race}`].size);

			// Resetting the scorebonuses
			campFiles.set(`${campaign}.${player}.constitution[1]`, 0);
			campFiles.set(`${campaign}.${player}.strength[1]`, 0);
			campFiles.set(`${campaign}.${player}.dexterity[1]`, 0);
			campFiles.set(`${campaign}.${player}.wisdom[1]`, 0);
			campFiles.set(`${campaign}.${player}.intelligence[1]`, 0);
			campFiles.set(`${campaign}.${player}.charisma[1]`, 0);

			// Resetting any previous traits slotted
			campFiles.set(`${campaign}.${player}.traits`, [] );

			// Resetting any previous languages slotted
			campFiles.set(`${campaign}.${player}.cantrips`, [] );

			// Resetting any previous languages slotted
			campFiles.set(`${campaign}.${player}.languages`, [] );

			// For each scorebonus, parse it for the corresponding ability type and score
			for(let i = 0; i < racefile[`${race}`].scorebonus.length; i++){

				// Local Variables
				let type = racefile[`${race}`].scorebonus[i].split(`+`).shift();
				let bonus = Number(racefile[`${race}`].scorebonus[i].split(`+`).pop());

				// Set corresponding ability bonus
				campFiles.set(`${campaign}.${player}.${type}[1]`, bonus);

			}

			// For each element in the traits campFiles.get(`${campaign}.${player}.strength`)ay push the value into the traits field
			if(racefile[`${race}`].traits != undefined){
				for(let i = 0; i < racefile[`${race}`].traits.length; i++){
					campFiles.push(`${campaign}.${player}.traits`, racefile[`${race}`].traits[i]);
				}
			}

			// For each element in the cantrips campFiles.get(`${campaign}.${player}.strength`)ay push the value into the cantrips field
			if(racefile[`${race}`].cantrips != undefined){
				for(let i = 0; i < racefile[`${race}`].cantrips.length; i++){
					campFiles.push(`${campaign}.${player}.cantrips`, racefile[`${race}`].cantrips[i]);
				}
			}

			// For each element in the languages campFiles.get(`${campaign}.${player}.strength`)ay push the value into the languages field
			for(let i = 0; i < racefile[`${race}`].languages.length; i++){
				campFiles.push(`${campaign}.${player}.languages`, racefile[`${race}`].languages[i]);
			}

			campFiles.set(`${campaign}.${player}.size`, racefile[`${race}`].size);   // Set size
			campFiles.set(`${campaign}.${player}.speed`, racefile[`${race}`].speed); // Set speed
			campFiles.set(`${campaign}.${player}.race`, racefile[`${race}`].name);   // Set name

			// Sending Name change Status to the Chat
			message.channel.send(`${message.member}, Your character race has been set to **${race}**.`).then(sentMessage => {
				sentMessage.delete(15000);});

		}
		else{
			message.channel.send(`There is no **${race}** race to select. As a reminder, this campaign uses **${fileselect}** races.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	// If the Keyword is Race
	if(keyword == `class`){

		// Local Variables
		let clas = args.join(` `).toLowerCase().trim()

		// If There is no Argument after Class
		if(!clas || clas == ``){

			// Obtaining List of Races
			let claslist  = Object.keys(clasfile);

			// Pretty Printing List of Classes (Each Class Capitalized)
			for(let i = 0; i < claslist.length; i++){
				let spell = claslist[i].toLowerCase().split(``);
				claslist[i] = spell[0].toUpperCase().toString() + spell.slice(1).join(``);
			}

			// Placing the campFiles.get(`${campaign}.${player}.strength`)ay of classes in an embed list
			let embedlist = claslist.join(`\n`);

			// Rich Embed
			let clasembed = new Discord.RichEmbed()
			.setTitle(`The **/sheet class** keyword`)
			.setDescription(`The **/sheet class** keyword is how you set your campaign character's class.` +
			`\nDeciding your class is the most integral step to creating your character.` +
			` It defines the profession, the nature, the lifestyle of your character. Below are the classes you can choose from..\n`)
			.addField(`Classes`, `${embedlist}\n\u200b`)
			.addField(`How to Use`, ` Simply type the class you want after the keywords **/sheet class**.\n\u200b`)
			.addField(`But wait...`, `\nIf you don't know much about the class and want to learn more about it type **/whatis <name of class>**.` +
			`\nFor example, **/whatis ${claslist[0]}** will show you information and traits about the ${claslist[0]} class. (in development)`)
			.setColor(config.darkmagenta)

			// Send Embed
			message.channel.send(clasembed);

			return;
		}

		// If the Argument matches a Class Name
		if(`${clas}` in clasfile){

			// Setting the Class Name
			campFiles.set(`${campaign}.${player}.class`, clasfile[`${clas}`].name);

			// Resetting any previous proficiencies slotted
			campFiles.set(`${campaign}.${player}.proficiencies`, [] );

			// Resetting any previous features slotted
			campFiles.set(`${campaign}.${player}.features`, [] );

			// Resetting any previous equipment slotted
			campFiles.set(`${campaign}.${player}.equipment`, [] );

			// For each proficiency described in the class push it into the proficiency slot
			for(let i = 0; i < clasfile[`${clas}`][`proficiency`].length; i++){
				campFiles.push(`${campaign}.${player}.proficiencies`, clasfile[`${clas}`].proficiency[i]);
			}

			// For each feature described in the class push it into the feature slot
			for(let i = 0; i < clasfile[`${clas}`][`features`].length; i++){
				campFiles.push(`${campaign}.${player}.features`, clasfile[`${clas}`].features[i]);

			}

			// For every equipment described in the class push it into the equipment slot
			for(let i = 0; i < clasfile[`${clas}`][`equipment`].length; i++){
				campFiles.push(`${campaign}.${player}.equipment`, clasfile[`${clas}`].equipment[i]);

			}

			// Sending Class change Status to the Chat
			message.channel.send(`${message.member}, Your character class has been set to **${clas}**.`).then(sentMessage => {
				sentMessage.delete(15000);});

		}
		else{
			message.channel.send(`There is no **${clas}** class to select. As a reminder, this campaign uses **${fileselect}** classes.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	// If the Keyword is Scores
	if(keyword == `scores`){

		let commandlist =	[	`**/sheet** ***roll***........*Rolls your ability scores*`,
												`**/sheet** ***save***........*Saves your ability scores*`,
												`**/sheet** ***<score> <ability>***........*Assigns the designated score to the designated ability*`,
												`**/sheet** ***reset***........*Removes any assigned score and returns them to the roster*`,
												`**/sheet** ***lock***........*After assigning all ability scores, locks in the scors permanently*`];

		// Rich Embed
		let scoresembed = new Discord.RichEmbed()
		.setTitle(`Assigning Ability Scores`)
		.setDescription(`The following are keyword commands so that you may assign ability scores to your character.` +
		` Rolling your ability scores and assigning them is a crucial detail and arguably the most important step to building your character.` +
		` It defines what they excel in, and possibly- what they absolutely suck at.\n`)
		.addField(`**Keyword Commands**`, `\n${commandlist.join(`\n`)}\n\u200b`)
		.setColor(config.darkmagenta)

		// Send Embed
		message.channel.send(scoresembed);

		return;
	}

	// If the Keyword is Roll
	if(keyword == `roll`){

		// Local variables
		let rolls  = new Array(3);
		let scores = new Array(5);
		let sum    = (accu, curVal) => accu + curVal;
		let num    = 0;
		let result = 0;
		let string = ``;

		// Error Traps
		if(campFiles.get(`${campaign}.${player}.scoressaved`) == true){
			return message.reply(`\n>>> You saved your ability scores already.`);
		}
		if(campFiles.get(`${campaign}.${player}.rolls`) <= 0){
			return message.reply(`\n>>> You maxed out your retries on rolling ability scores.`);
		}

		// For six times...
		for(let i = 0; i < 6; i++){

			// For four times...
			for(let j = 0; j < 4; j++){

				// Generate a number between 1-6
				num = Math.floor(Math.random() * 6) + 1;
				rolls[j] = num;

			}

			// Add the numbers and subtract the lowest
			result = rolls.reduce(sum) - Math.min(...rolls);

			// Make the i'th cell for scores the line of numbers
			scores[i] = result;
			string += `${rolls.join(`, `).padEnd(14, ` `)}${result}\n`;

			// On the 6th iteration, check to see if the average total is higher than ten
			if(i == 5){
				if(Math.floor(scores.reduce(sum)/scores.length) <= 9){
					return message.reply(`\n>>> Yikes.\nYou rolled commoner stats.` +
					`\nCommoner stats don't count.\nRoll again.\n\nBad Batch:\n\`\`\`yaml\n${scores.join(`, `)}\`\`\``)
				}
			}
		}

		// Update the amount of times the player rolled,and set their result as their current scores.
		campFiles.subtract(`${campaign}.${player}.rolls`, 1);
		campFiles.set(`${campaign}.${player}.scores`, scores);

		// Prompt the player their results
		message.reply(`\n>>> You rolled these numbers:\`\`\`css\n${string}\`\`\`\nGiving you:\n\`\`\`yaml\n${scores.join(`, `)}\`\`\``)

		// Prompt the player depending on their remaining rolls wether or not they'd like to save or roll again.
		if(campFiles.get(`${campaign}.${player}.rolls`) > 0){
			return message.reply(`\n>>> Don't like your numbers?\nYou can choose to sacrifice this set and try` +
			` ${campFiles.get(`${campaign}.${player}.rolls`)} more time(s). Be careful though, as there are no take-backsies.` +
			`\nIf you *do* like your numbers however, be sure to type **/sheet** ***save*** so that you can move on and assign the numbers.`);
		}
		if(campFiles.get(`${campaign}.${player}.rolls`) <= 0){
			return message.reply(`\n>>> You have run out of retries, the set you have rolled is now what you get!` +
				` Type **/sheet** ***save*** to be able to move on and assign the numbers.` +
				`\nOr....avoid the inevitable, abandon the character sheet and never look back again.\n\n:runner::skin-tone-3:`);
		}

		return;
	}

	// If the Keyword is Save
	if(keyword == `save`){

		// If player scores is not blank then set scoressaved to true
		if(campFiles.get(`${campaign}.${player}.scores`) == undefined || campFiles.get(`${campaign}.${player}.scores`).length < 6){
			return message.reply(`\n>>> You dont have a set of ability scores to save.`);
		}else{
			campFiles.set(`${campaign}.${player}.scoressaved`, true);
			return message.reply(`\n>>> Your ability scores have been saved.`)
		}

	}

	// If the Keyword is a Number
	if(isNaN(keyword) == false){

		// Local Variables
		let stat = args.shift();
		if(stat) stat.toLowerCase().trim();

		// Error Traps
		if(campFiles.get(`${campaign}.${player}.scores`) == undefined && campFiles.get(`${campaign}.${player}.scoressaved`) == false || campFiles.get(`${campaign}.${player}.scores`).length <= 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == false){
			return message.reply(`\n>>> You didn't roll any ability scores. Roll a set with **/sheet** ***roll***`);

		}else if(campFiles.get(`${campaign}.${player}.scores`).length > 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == false){
			return message.reply(`\n>>> You didn't save your ability scores. Save the set with **/sheet** ***save***`);

		}else if(campFiles.get(`${campaign}.${player}.scores`) == undefined && campFiles.get(`${campaign}.${player}.scoressaved`) == true || campFiles.get(`${campaign}.${player}.scores`).length <= 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == true){
			return message.reply(`\n>>> You have assigned all your ability scores.` +
				`\nIf you'd like to re-arrange them you can return them to your hand with **/sheet** ***reset***.` +
				`\nIf you like where they are and would like to save them. Type **/sheet** ***lock***.`);

		}else if(!stat || stat == ``){
			return message.reply(`\n>>> You didn't specify which ability you're selecting for the score.` +
			` Choose the ability with **/sheet** ***[score] [ability]***\n` +
			` For example, **/sheet** ***12 dex***`);
		}

		// If the Number specified is in the list of scores
		if(campFiles.get(`${campaign}.${player}.scores`).includes(Number(keyword))){

			// Local variables
			let strength     = [`str`,`strength`];
			let dexterity    = [`dex`,`dexterity`];
			let constitution = [`con`,`constitution`];
			let intelligence = [`int`,`intelligence`];
			let wisdom       = [`wis`,`wisdom`];
			let charisma     = [`cha`,`charisma`];
			let index_num;
			let update;
			let str = [` `];

			// Check which stat has been specified. Assign the keyword as the stat.
			if(strength.includes(stat)){

				// Check if there isnt already a number occupying the stat.
				if(campFiles.get(`${campaign}.${player}.strength[0]`) > 0){
					return message.reply(`\n>>> There is already a score placed in strength.` +
						` You can call back your scores with **/sheet** ***reset***.`);

				}

				// Check for the index of the number, update the player profile and splice out the roll.
				index_num = campFiles.get(`${campaign}.${player}.scores`).findIndex(search => search == keyword);
				campFiles.set(`${campaign}.${player}.strength[0]`, Number(keyword));
				update = campFiles.get(`${campaign}.${player}.scores`);
				update.splice(index_num, 1);
				campFiles.set(`${campaign}.${player}.scores`, update);

				// Unassigned Abilities
				if( campFiles.get(`${campaign}.${player}.strength[0]`) <= 0) str.push(`STR`);
				if( campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0) str.push(`DEX`);
				if( campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0) str.push(`CON`);
				if( campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0) str.push(`INT`);
				if( campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0) str.push(`WIS`);
				if( campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0) str.push(`CHA`);

				// Prompt the player that the stat has been assigned
				message.channel.send(`\n>>> ${keyword} has been assigned to strength ${message.author}.` +
				`\n\`\`\`yaml\n[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}] (${keyword}) ==> strength` +
				`\n`.padEnd(40, `- `) +
				`\nUnassigned: ${str.join(`, `)}\`\`\``);

				// Prompt the player if they have assigned all of their scores
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){
							message.channel.send(`\n>>> You have now assigned all of your ability scores ${message.author}. If you are are satisfied with where they are assigned ` +
							`type **/sheet** ***lock***. Otherwise, type **/sheet** ***reset*** to call the scores back to your roster.`)
					}

				return;
			}else if(dexterity.includes(stat)){

				// Check if there isnt already a number occupying the stat.
				if(campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0){
					return message.reply(`\n>>> There is already a score placed in dexterity.` +
						` You can call back your scores with **/sheet** ***reset***.`);

				}

				// Check for the index of the number, update the player profile and splice out the roll.
				index_num = campFiles.get(`${campaign}.${player}.scores`).findIndex(search => search == keyword);
				campFiles.set(`${campaign}.${player}.dexterity[0]`, Number(keyword));
				update = campFiles.get(`${campaign}.${player}.scores`);
				update.splice(index_num, 1);
				campFiles.set(`${campaign}.${player}.scores`, update);

				// Unassigned Abilities
				if( campFiles.get(`${campaign}.${player}.strength[0]`) <= 0) str.push(`STR`);
				if( campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0) str.push(`DEX`);
				if( campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0) str.push(`CON`);
				if( campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0) str.push(`INT`);
				if( campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0) str.push(`WIS`);
				if( campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0) str.push(`CHA`);

				// Prompt the player the the stat has been assigned.
				message.channel.send(`\n>>> ${keyword} has been assigned to dexterity ${message.author}.` +
				`\n\`\`\`yaml\n[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}] (${keyword}) ==> dexterity` +
				`\n`.padEnd(40, `- `) +
				`\nUnassigned: ${str.join(`, `)}\`\`\``);

				// Prompt the player if they have assigned all of their scores
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){
							message.channel.send(`\n>>> You have now assigned all of your ability scores ${message.author}. If you are are satisfied with where they are assigned ` +
							`type **/sheet** ***lock***. Otherwise, type **/sheet** ***reset*** to call the scores back to your roster.`)
					}

				return;
			}else if(constitution.includes(stat)){

				// Check if there isnt already a number occupying the stat.
				if(campFiles.get(`${campaign}.${player}.constitution[0]`) > 0){
					return message.reply(`\n>>> There is already a score placed in ${stat}.` +
						` You can call back your scores with **/sheet** ***reset***.`);

				}

				// Check for the index of the number, update the player profile and splice out the roll.
				index_num = campFiles.get(`${campaign}.${player}.scores`).findIndex(search => search == keyword);
				campFiles.set(`${campaign}.${player}.constitution[0]`, Number(keyword));
				update = campFiles.get(`${campaign}.${player}.scores`);
				update.splice(index_num, 1);
				campFiles.set(`${campaign}.${player}.scores`, update);

				// Unassigned Abilities
				if( campFiles.get(`${campaign}.${player}.strength[0]`) <= 0) str.push(`STR`);
				if( campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0) str.push(`DEX`);
				if( campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0) str.push(`CON`);
				if( campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0) str.push(`INT`);
				if( campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0) str.push(`WIS`);
				if( campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0) str.push(`CHA`);

				// Prompt the player that the stat has been assigned
				message.channel.send(`\n>>> ${keyword} has been assigned to constitution ${message.author}.` +
				`\n\`\`\`yaml\n[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}] (${keyword}) ==> constitution` +
				`\n`.padEnd(40, `- `) +
				`\nUnassigned: ${str.join(`, `)}\`\`\``);

				// Prompt the player if they have assigned all of their scores
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){
							message.channel.send(`\n>>> You have now assigned all of your ability scores ${message.author}. If you are are satisfied with where they are assigned ` +
							`type **/sheet** ***lock***. Otherwise, type **/sheet** ***reset*** to call the scores back to your roster.`)
					}

				return;
			}else if(intelligence.includes(stat)){

				// Check if there isnt already a number occupying the stat.
				if(campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0){
					return message.reply(`\n>>> There is already a score placed in intelligence.` +
						` You can call back your scores with **/sheet** ***reset***.`);

				}

				// Check for the index of the number, update the player profile and splice out the roll.
				index_num = campFiles.get(`${campaign}.${player}.scores`).findIndex(search => search == keyword);
				campFiles.set(`${campaign}.${player}.intelligence[0]`, Number(keyword));
				update = campFiles.get(`${campaign}.${player}.scores`);
				update.splice(index_num, 1);
				campFiles.set(`${campaign}.${player}.scores`, update);

				// Unassigned Abilities
				if( campFiles.get(`${campaign}.${player}.strength[0]`) <= 0) str.push(`STR`);
				if( campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0) str.push(`DEX`);
				if( campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0) str.push(`CON`);
				if( campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0) str.push(`INT`);
				if( campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0) str.push(`WIS`);
				if( campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0) str.push(`CHA`);

				// Prompt the player that the stat has been assigned
				message.channel.send(`\n>>> ${keyword} has been assigned to intelligence ${message.author}.` +
				`\n\`\`\`yaml\n[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}] (${keyword}) ==> intelligence` +
				`\n`.padEnd(40, `- `) +
				`\nUnassigned: ${str.join(`, `)}\`\`\``);

				// Prompt the player if they have assigned all of their scores
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){
							message.channel.send(`\n>>> You have now assigned all of your ability scores ${message.author}. If you are are satisfied with where they are assigned ` +
							`type **/sheet** ***lock***. Otherwise, type **/sheet** ***reset*** to call the scores back to your roster.`)
					}

				return;
			}else if(wisdom.includes(stat)){

				// Check if there isnt already a number occupying the stat.
				if(campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0){
					return message.reply(`\n>>> There is already a score placed in wisdom.` +
						` You can call back your scores with **/sheet** ***reset***.`);

				}

				// Check for the index of the number, update the player profile and splice out the roll.
				index_num = campFiles.get(`${campaign}.${player}.scores`).findIndex(search => search == keyword);
				campFiles.set(`${campaign}.${player}.wisdom[0]`, Number(keyword));
				update = campFiles.get(`${campaign}.${player}.scores`);
				update.splice(index_num, 1);
				campFiles.set(`${campaign}.${player}.scores`, update);

				// Prompt the player that the stat has been assigned.
				message.channel.send(`\n>>> ${keyword} has been assigned to wisdom ${message.author}.` +
				`\n\`\`\`yaml\n[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}] (${keyword}) ==> wisdom` +
				`\n`.padEnd(40, `- `) +
				`\nUnassigned: ${str.join(`, `)}\`\`\``);

				// Unassigned Abilities
				if( campFiles.get(`${campaign}.${player}.strength[0]`) <= 0) str.push(`STR`);
				if( campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0) str.push(`DEX`);
				if( campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0) str.push(`CON`);
				if( campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0) str.push(`INT`);
				if( campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0) str.push(`WIS`);
				if( campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0) str.push(`CHA`);

				// Prompt the player if they have assigned all of their scores
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){
							message.channel.send(`\n>>> You have now assigned all of your ability scores ${message.author}. If you are are satisfied with where they are assigned ` +
							`type **/sheet** ***lock***. Otherwise, type **/sheet** ***reset*** to call the scores back to your roster.`)
					}

				return;
			}else if(charisma.includes(stat)){

				// Check if there isnt already a number occupying the stat.
				if(campFiles.get(`${campaign}.${player}.charisma[0]`) > 0){
					return message.reply(`\n>>> There is already a score placed in charisma.` +
						` You can call back your scores with **/sheet** ***reset***.`);

				}

				// Check for the index of the number, update the player profile and splice out the roll.
				index_num = campFiles.get(`${campaign}.${player}.scores`).findIndex(search => search == keyword);
				campFiles.set(`${campaign}.${player}.charisma[0]`, Number(keyword));
				update = campFiles.get(`${campaign}.${player}.scores`);
				update.splice(index_num, 1);
				campFiles.set(`${campaign}.${player}.scores`, update);

				// Unassigned Abilities
				if( campFiles.get(`${campaign}.${player}.strength[0]`) <= 0) str.push(`STR`);
				if( campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0) str.push(`DEX`);
				if( campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0) str.push(`CON`);
				if( campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0) str.push(`INT`);
				if( campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0) str.push(`WIS`);
				if( campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0) str.push(`CHA`);

				// Prompt the player that the stat has been assigned.
				message.channel.send(`\n>>> ${keyword} has been assigned to charisma ${message.author}.` +
				`\n\`\`\`yaml\n[${campFiles.get(`${campaign}.${player}.scores`).join(`, `)}] (${keyword}) ==> charisma` +
				`\n`.padEnd(40, `- `) +
				`\nUnassigned: ${str.join(`, `)}\`\`\``);

				// Prompt the player if they have assigned all of their scores
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){
							message.channel.send(`\n>>> You have now assigned all of your ability scores ${message.author}. If you are are satisfied with where they are assigned ` +
							`type **/sheet** ***lock***. Otherwise, type **/sheet** ***reset*** to call the scores back to your roster.`)
					}

				return;
			}else{

				// Prompt the player that the stat typed is not an ability for points to be placed in.
				return message.reply(`\n>>> ${stat} is not an ability to place your points in.`);
			}

		}else{
			return message.reply(`\n>>> ${keyword} is not one of your rolled scores.`);

		}

	}

	// If the Keyword is Lock
	if(keyword == `lock`){

		// Local Variables
		let command = args.shift();
		if(command) command.toLowerCase().trim();

		if(!command || command == ``){
			return message.reply(`\n>>> You must specify whether you'd like to lock your background or your ability scores.\n` +
				`Use **/sheet lock** ***background*** to lock your race and class.\n` +
				`Use **/sheet lock** ***scores*** to lock your ability scores.`);

		}

		if(command == `background`){

			// Error Traps
			if(campFiles.get(`${campaign}.${player}.race`) == `blank` && campFiles.get(`${campaign}.${player}.class`) == `blank`){
				return message.reply(`\n>>> You must select both a race and a class before locking in your background.`)
			}
			if(campFiles.get(`${campaign}.${player}.race`) in racefile == false || campFiles.get(`${campaign}.${player}.class`) in clasfile == false){
				return message.reply(`\n>>> Your race and class are not from the same style of campaign. The style is currently ${fileselect}.`)

			}

			// Locking Background
			campFiles.set(`${campaign}.${player}.backgroundlocked`, true);
			return message.reply(`\n>>> Your race and class have been saved and locked.`);

		}

		if(command == `scores`){

			// Error Traps
			if(campFiles.get(`${campaign}.${player}.scores`) == undefined && campFiles.get(`${campaign}.${player}.scoressaved`) == false || campFiles.get(`${campaign}.${player}.scores`).length <= 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == false){
				return message.reply(`\n>>> You didn't roll any ability scores. Roll a set with **/sheet** ***roll***`);

			}else if(campFiles.get(`${campaign}.${player}.scores`).length > 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == false){
				return message.reply(`\n>>> You didn't save your ability scores. Save the set with **/sheet** ***save***`);

			}else if(campFiles.get(`${campaign}.${player}.scores`).length > 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == true){
				return message.reply(`\n>>> You saved your ability scores. But you have to assign them to abilities. Assign them with **/sheet** ***[score] [ability]***`);

			}else if(campFiles.get(`${campaign}.${player}.scores`) == undefined && campFiles.get(`${campaign}.${player}.scoressaved`) == true || campFiles.get(`${campaign}.${player}.scores`).length <= 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == true){
				if(	campFiles.get(`${campaign}.${player}.strength[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.constitution[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0 &&
						campFiles.get(`${campaign}.${player}.charisma[0]`) > 0 ){

					// Local variables
					let k         = 0;
					let response  = false;
					let collector = undefined;

					// Deploy Question
					try{

						// Question Prompt
						message.reply(`\n>>> You are about to lock your ability scores, after this you cannot change or re-arrange your stats.\n_Are you sure you want to do this?_  **(Yes/No)**`);

						// Question Collector
						collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

						// Collector Events
						collector.on(`collect`, message => {

							// Message Iterator
							k += 1;

							// Question Choices
							if(config.yes.includes(`${message.content.toLowerCase().trim()}`) || config.yes.includes(`/${message.content.toLowerCase().trim()}`)){

								// Delete response
								message.delete().catch(console.error);

								// Set response status true and stop collector
								response = true;
								collector.stop();

								// Lock the scores and prompt the player that the stats have been locked in place.
								campFiles.set(`${campaign}.${player}.scoreslocked`, true);
								return message.reply(`\n>>> Ability scores are now locked in place.`);

							}else if (config.no.includes(`${message.content.toLowerCase().trim()}`) || config.no.includes(`/${message.content.toLowerCase().trim()}`)){

								// Delete response
								message.delete().catch(console.error);

								// Set response status true and stop collector
								response = true;
								collector.stop();

								// Send abortion notification to the chat
								message.reply(`\n>>> **Action Ended.**`);

							}

							// Iterator Stops Collector
							if(k >= 3) collector.stop();

						});

						collector.on(`end`, () => {

							// Abortion Status
							if(response == false && k == 0) message.reply(`\n>>> *Action Ended: Question Timed out.*`)
							else if(response == false && k >= 2) message.reply(`\n>>> *Action Ended: Too many unrecognized answers.*`)
							else return;

						});

					}catch(e){
						console.log(e);

					}
				}
			}
		}
	}

	// If the Keyword is Reset
	if(keyword == `reset`){

		// Local Variables
		let command = args.shift();
		if(command) command.toLowerCase().trim();

		let update = campFiles.get(`${campaign}.${player}.scores`);

		// If There is no Argument after Reset
		if(!command || command == ``){

			// Error Traps
			if(campFiles.get(`${campaign}.${player}.scores`) == undefined && campFiles.get(`${campaign}.${player}.scoressaved`) == false || campFiles.get(`${campaign}.${player}.scores`).length <= 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == false){
				return message.reply(`\n>>> You didn't roll any ability scores. Roll a set with **/sheet scores** ***now***`);

			}else if(campFiles.get(`${campaign}.${player}.scores`).length > 0 && campFiles.get(`${campaign}.${player}.scoressaved`) == false){
				return message.reply(`\n>>> You didn't save your ability scores. Save the set with **/sheet scores** ***save***`);

			}

			if(	campFiles.get(`${campaign}.${player}.strength[0]`) <= 0 &&
					campFiles.get(`${campaign}.${player}.dexterity[0]`) <= 0 &&
					campFiles.get(`${campaign}.${player}.constitution[0]`) <= 0 &&
					campFiles.get(`${campaign}.${player}.intelligence[0]`) <= 0 &&
					campFiles.get(`${campaign}.${player}.wisdom[0]`) <= 0 &&
					campFiles.get(`${campaign}.${player}.charisma[0]`) <= 0){
				return message.reply(`\n>>> None of your abilities have an ability score assigned to them. There's no need to reset.`);

			}

			// Resetting Ability Scores
			if(campFiles.get(`${campaign}.${player}.strength[0]`) > 0){
				update.push(campFiles.get(`${campaign}.${player}.strength[0]`));
				campFiles.set(`${campaign}.${player}.strength[0]`, 0);
			}
			if(campFiles.get(`${campaign}.${player}.dexterity[0]`) > 0){
				update.push(campFiles.get(`${campaign}.${player}.dexterity[0]`));
				campFiles.set(`${campaign}.${player}.dexterity[0]`, 0);
			}
			if(campFiles.get(`${campaign}.${player}.constitution[0]`) > 0){
				update.push(campFiles.get(`${campaign}.${player}.constitution[0]`));
				campFiles.set(`${campaign}.${player}.constitution[0]`, 0);
			}
			if(campFiles.get(`${campaign}.${player}.intelligence[0]`) > 0){
				update.push(campFiles.get(`${campaign}.${player}.intelligence[0]`));
				campFiles.set(`${campaign}.${player}.intelligence[0]`, 0);
			}
			if(campFiles.get(`${campaign}.${player}.wisdom[0]`) > 0){
				update.push(campFiles.get(`${campaign}.${player}.wisdom[0]`));
				campFiles.set(`${campaign}.${player}.wisdom[0]`, 0);
			}
			if(campFiles.get(`${campaign}.${player}.charisma[0]`) > 0){
				update.push(campFiles.get(`${campaign}.${player}.charisma[0]`));
				campFiles.set(`${campaign}.${player}.charisma[0]`, 0);
			}

			campFiles.set(`${campaign}.${player}.scores`, update);

			return message.reply(`\n>>> Ability scores have been returned to the roll the list.`);
		}
	}

	// If the Keyword is Choice
	if(keyword == `choice`){

		// Local Variables
		let selection   = args.join(` `).toLowerCase().trim();
		let clas        = campFiles.get(`${campaign}.${player}.class`).toLowerCase();
		// let race     = campFiles.get(`${campaign}.${player}.race`).toLowerCase().trim();
		// let traits   = campFiles.get(`${campaign}.${player}.traits`);
		let features    = campFiles.get(`${campaign}.${player}.features`);
		let proficiency = campFiles.get(`${campaign}.${player}.proficiencies`);

		// Boolean Variables
		let claschoice = false;
		let racechoice = false;

		// Check If There Are Features On The Profile..
		if(features != undefined && features.length > 0){

			// Local Variables
			let match = false;

			// Check If the Player's Class is on File
			if(`${clas}` in choicefile){

				// For every Feature on Profile
				for(let i = 0; i < features.length; i++){

					// Local Variables
					let tag = features[i].toLowerCase();

					// Error Trap: If the Selection matched a searched Option stop testing
					if(match == true) break;

					// Check If the specific Choice Tag was found under the Class
					if(`${tag}` in choicefile[`${clas}`]){

						// Mark that a Choice Tag Exists
						claschoice = true;
						console.log(`  (ii) ${tag} was a property inside of ${clas}.`);

						// Check If Choice Tag has Type and Option Properties
						if(`options` in choicefile[`${clas}`][`${tag}`] && `type` in choicefile[`${clas}`][`${tag}`]){

							console.log(`  (ii) ${tag} had a type and options property on file.`);

							// For every Option under the Choice Tag
							for(let j = 0; j < choicefile[`${clas}`][`${tag}`][`options`].length; j++){

								// Local Variables
								let option = choicefile[`${clas}`][`${tag}`].options[j].toLowerCase().trim()

								// Error Trap: If the Selection matched a searched Option stop testing
								if(match == true) break;

								// Check If the selection matched a specific Option
								if(selection == option){

									// Mark that the Selection matched
									match = true;
									console.log(`  (ii) Found ${option} under ${tag}.`);

									// If the Specified Option is a type of Equipment
									if(choicefile[`${clas}`][`${tag}`].type == `equipment`){

										let k         = 0;
										let response  = false;
										let collector = undefined;
										try{

											// Question Prompt
											message.reply(`\n>>> You are about to choose **${choicefile[`${clas}`][`${tag}`].options[j]}** as your equipment, consuming |_${features[i]}_ |.\n_Are you sure you want to do this?_  **(Yes/No)**`);

											// Question Collector
											collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

											// Collector Events
											collector.on(`collect`, message => {

												// Message Iterator
												k += 1;

												// Question Choices
												if(config.yes.includes(`${message.content.toLowerCase().trim()}`) || config.yes.includes(`/${message.content.toLowerCase().trim()}`)){

													// Delete response
													message.delete().catch(console.error);

													// Check If Option is in Multiples
													if(isNaN(choicefile[`${clas}`][`${tag}`].options[j].split(``).shift()) == false){
														for(let l = 0; l < Number(choicefile[`${clas}`][`${tag}`].options[j].split(``).shift()); l++){
															// Push Equipment Into Equipment Slot, Filter Out Tag, Update Features.
															let prettyprint = choicefile[`${clas}`][`${tag}`].options[j].split(``).slice(2).join(``);
															campFiles.push(`${campaign}.${player}.equipment`, `${prettyprint} ${l + 1}`);
														}

													}else{
														// Push Equipment Into Equipment Slot, Filter Out Tag, Update Features.
														campFiles.push(`${campaign}.${player}.equipment`, `${choicefile[`${clas}`][`${tag}`].options[j]}`);

													}

													features = features.filter(remainder => remainder != features[i]);
													campFiles.set(`${campaign}.${player}.features`, features);

													// Set response status true and restore match to false
													response = true;
													match    = false;

													// Send choice notification to chat
													message.reply(`\n>>> **${choicefile[`${clas}`][`${tag}`].options[j]}** has been chosen as your equipment.`)

												}else if (config.no.includes(`${message.content.toLowerCase().trim()}`) || config.no.includes(`/${message.content.toLowerCase().trim()}`)){

													// Delete response
													message.delete().catch(console.error);

													// Set response status true and restore match to false
													response = true;
													match    = false;

													// Send abortion notification to the chat
													message.reply(`\n>>> **Action Ended.**`);

												}

												// Iterator Stops Collector
												if(k >= 3) collector.stop();

											});

											collector.on(`end`, () => {

												// Abortion Status
												if(response == false && k == 0) message.reply(`\n>>> *Action Ended: Question Timed out.*`)
												else if(response == false && k >= 2) message.reply(`\n>>> *Action Ended: Too many unrecognized answers.*`)

											});

										}catch(e){
											console.log(e);
										}

									}

									// If the Specified Option is a type of Equipment
									if(choicefile[`${clas}`][`${tag}`].type == `skill`){

										let k         = 0;
										let response  = false;
										let collector = undefined;
										try{

											// Question Prompt
											message.reply(`\n>>> You are about to choose **${choicefile[`${clas}`][`${tag}`].options[j]}** as your skill of expertise, consuming |_${features[i]}_ |.\n_Are you sure you want to do this?_  **(Yes/No)**`);

											// Question Collector
											collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

											// Collector Events
											collector.on(`collect`, message => {

												// Message Iterator
												k += 1;

												// Question Choices
												if(config.yes.includes(`${message.content.toLowerCase().trim()}`) || config.yes.includes(`/${message.content.toLowerCase().trim()}`)){

													// Delete response
													message.delete().catch(console.error);

													// Check If Skill is already in Proficiency
													if(proficiency.includes(`${choicefile[`${clas}`][`${tag}`].options[j]}`)){
														// Reply that the skill has already been selected
														message.reply(`\n>>> You are already proficient in **${choicefile[`${clas}`][`${tag}`].options[j]}**.`);
													}else{
														// Push Equipment Into Equipment Slot, Filter Out Tag, Update Features.
														campFiles.push(`${campaign}.${player}.proficiencies`, `${choicefile[`${clas}`][`${tag}`].options[j]}`);
														features = features.filter(remainder => remainder != features[i]);
														campFiles.set(`${campaign}.${player}.features`, features);

														// Send choice notification to chat
														message.reply(`\n>>> **${choicefile[`${clas}`][`${tag}`].options[j]}** has been chosen as your skill of expertise.`);
													}

													// Set response status true and restore match to false
													response = true;
													match    = false;

												}else if (config.no.includes(`${message.content.toLowerCase().trim()}`) || config.no.includes(`/${message.content.toLowerCase().trim()}`)){

													// Delete response
													message.delete().catch(console.error);

													// Set response status true and restore match to false
													response = true;
													match    = false;

													// Send abortion notification to the chat
													message.reply(`\n>>> **Action Ended.**`);

												}

												// Iterator Stops Collector
												if(k >= 3) collector.stop();

											});

											collector.on(`end`, () => {

												// Abortion Status
												if(response == false && k == 0) message.reply(`\n>>> *Action Ended: Question Timed out.*`)
												else if(response == false && k >= 2) message.reply(`\n>>> *Action Ended: Too many unrecognized answers.*`)

											});

										}catch(e){
											console.log(e);
										}

									}

									break;

								}

							}

						}else{
							console.log(`  (ii) [${clas}][${tag}] does not have an options and/or type property.`);
							continue;
						}

					}else{
						console.log(`  (ii) ${tag} is not a property in the ${clas} object.`);
						continue;
					}

				}

			}else console.log(`  (ii) ${clas} is not on file.`);

		}

		// Ignore If There Were No Choice Tags
		if(claschoice == false && racechoice == false) return message.channel.send(`> There are no choices that you need to make.`);

		// If There is No Argument after Name
		if(selection == `` || !selection) return message.channel.send(`> Please specify a choice from your list of options.`);

		return;
	}

	// If the Keyword is Approve
	if(keyword == `approve`){
		// Some code here
	}

	return;
}

exports.help = {
	name: `Character Sheet`,
	description: `If possesing the role **Player**, this will help define the character sheet for the campaign your in.`,
	use: `/sheet <keyword>`,
	examples: `/sheet\n/sheet help`,
	permissions: [`Player`],
	shortcuts: {
		root: `sheet`,
		list: [`s`, `cs`]
	}
}
