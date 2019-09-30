// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message) => {

	// Ignore List
	if(!message.content) return;
	if(message.content.indexOf(config.prefix) == 0) return;

	// Local Variables
	const xpFiles = new db.table(`ExpFiles`);
	const user    = `${message.author.id}${message.guild.id}`;
	let   name    = `${message.author.username}`;

	// Check to see if user  is in the database
	if(!xpFiles.has(`${user}`)){
		xpFiles.set(`${user}`, { name: `${name}`, prestige: 0, level: 0, xp: 0, });
	}

	// XP Files
	let curxp  = xpFiles.get(`${user}.xp`);
	let curlvl = xpFiles.get(`${user}.level`);
	let curprs = xpFiles.get(`${user}.prestige`);
	let golxp  = Math.floor(290 + (-270/(1 + Math.pow(((1.5 * curlvl)/46),2))));
	let xpAdd  = Math.floor(.5 + (message.content.length / 2) / Math.sqrt(message.content.length));
	let lvlupembed;

	// Add xp to users xp field
	xpFiles.add(`${user}.xp`, xpAdd);

	// Update current xp
	curxp = xpFiles.get(`${user}.xp`);

	// If the new xp is now more than or equal to 100xp
	if(curxp >= 100){
		xpFiles.add(`${user}.prestige`, 1);
		xpFiles.set(`${user}.level`, 0);
		xpFiles.set(`${user}.xp`, 0);
		curxp  = xpFiles.get(`${user}.xp`);
		curlvl = xpFiles.get(`${user}.level`);
		curprs = xpFiles.get(`${user}.prestige`);
		golxp  = Math.floor(290 + (-270/(1 + Math.pow(((1.5 * curlvl)/46),2))));

		lvlupembed = new Discord.RichEmbed()
		.setTitle(`Prestige! :military_medal:`)
		.setThumbnail(message.author.avatarURL)
		.setColor(15033241)
		.setDescription(`${message.author} just prestiged!`)

		if(curprs > 0) lvlupembed.addField(`**Prestige**`, `**${xpFiles.get(`${user}.prestige`)}**`)

		lvlupembed.addField(`**Level**`, `**${xpFiles.get(`${user}.level`)}**`, true)
		lvlupembed.addField(`**Exp**`, `${xpFiles.get(`${user}.xp`)}/${golxp}`, true)

		message.channel.send(lvlupembed).then(m => {m.delete(10000);});
	}

	// If the new xp is now more than or equal to the goal run this
	if(curxp >= golxp){
		xpFiles.add(`${user}.level`, 1);
		xpFiles.set(`${user}.xp`, 0);
		curxp  = xpFiles.get(`${user}.xp`);
		curlvl = xpFiles.get(`${user}.level`);
		curprs = xpFiles.get(`${user}.prestige`);
		golxp  = Math.floor(290 + (-270/(1 + Math.pow(((1.5 * curlvl)/46),2))));

		lvlupembed = new Discord.RichEmbed()
		.setTitle(`Level Up! :star2:`)
		.setThumbnail(message.author.avatarURL)
		.setColor(15033241)
		.setDescription(`${message.author} just leveled up!`)

		if(curprs > 0) lvlupembed.addField(`**Prestige**`, `**${xpFiles.get(`${user}.prestige`)}**`)

		lvlupembed.addField(`**Level**`, `**${xpFiles.get(`${user}.level`)}**`, true)
		lvlupembed.addField(`**Exp**`, `${xpFiles.get(`${user}.xp`)}/${golxp}`, true)

		message.channel.send(lvlupembed).then(m => {m.delete(10000);});
	}

}

exports.help = {
	name: `XP Filer`
}
