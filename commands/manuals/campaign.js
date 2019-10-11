// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete().catch(console.error);

	// Database variables
	const campFiles  = new db.table(`CampaignFiles`);
	const campname   = campFiles.get(`${message.channel.id}.name`);

	// Local variables
	let keyword  = args.shift();
	let campaign = message.channel.id;
	if(keyword) keyword = keyword.toLowerCase();

	// Ignore List
	if(message.channel.parent.name != `📚 Campaigns`){
		return message.channel.send(`*This only works on channels under the campaigns category.*`).then(sentMessage => {
			sentMessage.delete(8000);

		});
	}
	if(!message.member.roles.find(role => role.name === `Campaign Leader`)){
		return message.channel.send(`*Only Campaign Leaders can edit campaigns.*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}
	if(!message.member.roles.find(role => role.name === `${campname} Host`)){
		return message.channel.send(`*Only the host of ${campname} can edit this campaign*`).then(sentMessage => {
			sentMessage.delete(8000);});
	}

	// If There Is No Keyword
	if(!keyword){
		return;
	}

	// If The Keyword is Help
	if(keyword == `style`){

		let name = args.join(` `).toLowerCase().trim();
		try{
			require(`../../files/races/${name}.json`);
			// require(`../../files/classes/${name}.json`);

			campFiles.set(`${campaign}.styleselection`, `${name}`);
			let spell = name.toLowerCase().split(``);
			spell = spell[0].toUpperCase().toString() + spell.slice(1).join(``);
			return message.channel.send(`\`${spell}\` has been chosen as the campaign style for \`${campname}\`.\nIf you are unfamiliar with this campaign style ask your DM about it.`);
		}catch(e){
			message.channel.send(`The \`${name}\` file for an alternative campaign style does not exist.`).then(sentMessage => {
				sentMessage.delete(15000);});
		}

	}

	return;
}

exports.help = {
	name: `Campaign Editor`,
	description: `If possesing the role \`Campaign Leader\`, this will modify the nature of the campaign you're in.`,
	use: `/campaign <keyword>`,
	examples: `/campaign racefile`,
	permissions: [`Campaign Leader`],
	shortcuts: {
		root: `campaign`,
		list: [`camp`, `cp`]
	}
}
