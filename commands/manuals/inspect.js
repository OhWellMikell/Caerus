exports.run = async (Discord, bot, config, message, args) => {

	// Local Variables
	let ichannel   = await message.guild.channels.find(channel => channel.name === `reports`);
	let editsembed = new Discord.RichEmbed()
	editsembed
	.setFooter(`${message.createdAt}`);

	let inspected  = args[0];
	let edits      = ``;

	// Deleting Command
	message.delete().catch(console.error);

	// Error Traps
	if(!message.member.hasPermission(`ADMINISTRATOR`)) return;
	if(!inspected || inspected == `` || isNaN(inspected)) return message.reply(`\nNo.`);

	message.channel.fetchMessage(`${inspected}`)
	.then(fetched => {
		if(fetched.hasOwnProperty(`_edits`)){
			if(fetched.edits.length > 0){
				for(let i = 0; i < fetched.edits.length; i++){
					edits += `${i + 1}. ${fetched.edits[fetched.edits.length - (i + 1)]}\n\n`;
				}
				editsembed.addField(`**Edits Found** :mag:`, `\`\`\`${edits}\`\`\``);
				editsembed.setAuthor(`${fetched.author.username}'s Message Inspection`, fetched.author.avatarURL)
				ichannel.send(editsembed);
			}
			else console.log(`  No edits found.`);
		}else console.log(`  No edits property found.`);
	})
	.catch(console.error)

	return;
}

exports.help = {
	name: `Inspect`,
	description: `Inspects a specified message for edits`,
	use: `/inspect [message ID]`,
	examples: `/inspect 623616185962856448`,
	permissions: [`Administrator`],
	shortcuts: {
		root: `inspect`,
		list: [`i`]
	}
}
