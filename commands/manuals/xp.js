// Libraries
const db = require("quick.db");

exports.run = async (Discord, bot, config, message, args) => {

	// Local Variables
	const xpFiles = new db.table(`ExpFiles`);
	const user    = `${message.author.id}${message.guild.id}`;
	let   name    = `${message.author.username}`;

	// Check to see if user  is in the database
	if(!xpFiles.has(`${user}`)){
		xpFiles.set(`${user}`, {name: `${name}`, prestige: 0, level: 0, xp: 0,});
	}

	// XP Files
	let curxp  = xpFiles.get(`${user}.xp`);
	let curlvl = xpFiles.get(`${user}.level`);
	let curprs = xpFiles.get(`${user}.prestige`);
	let golxp  = Math.floor(290 + (-270/(1 + Math.pow(((1.5 * curlvl)/46),2))));
	let xpAdd  = Math.floor(.5 + (message.content.length / 2) / Math.sqrt(message.content.length));

	let lvlupembed = new Discord.RichEmbed()
	.setTitle(`**${name}**`)
	.setThumbnail(message.author.avatarURL)
	.setColor(15033241)
	.setDescription(`Current XP Status..`)

	if(curprs > 0) lvlupembed.addField("**Prestige**", `**${xpFiles.get(`${user}.prestige`)}**`)

	lvlupembed.addField("**Level**", `**${xpFiles.get(`${user}.level`)}**`, true)
	lvlupembed.addField("**Exp**", `${xpFiles.get(`${user}.xp`)}/${golxp}`, true)

	message.channel.send(lvlupembed).then(m => {m.delete(10000);});
}

exports.help = {
	name: "XP Status",
	description: "Reports your current experience level, prestige, and current xp in-chat.\nLittle experience is awarded to short sentences, while lots of experience are awarded to long ones.",
	use: "/xp",
	examples: "/xp",
	permissions: ["Everyone"]
}
