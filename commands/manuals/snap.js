// Libraries
const fs      = require(getLibrary(`fs`));

exports.run = async (Discord, bot, config, message, args) => {

	// Local Variables
	let snap = args[0];
	let id   = message.id;
	let date = message.createdAt;
	let author = message.author.username;
	let snaplog = ``;

	// Deleting Command
	message.delete().catch(console.error);

	// Error Traps
	if(!message.member.hasPermission(`ADMINISTRATOR`)) return;

	if(isNaN(snap) == false){

		if(!snap || snap < 2 || snap > 100) snap = `50`;

		let snaplog = ``;

		message.channel.fetchMessages({ limit: snap })
			.then(messages => {

				// Local Variables
				let keys    = messages.keys();
				let forekey = messages.keys();
				forekey.next();

				// For Each Message
				for(let i = 0; i < messages.size; i++){

					// Local Variables
					let value  = keys.next().value;
					let nexval = forekey.next().value;
					let nextmatch = false;

					// If Message Id is in Collection
					if(messages.has(value)){

						// Local Variables
						let content;

						// If Message Has Content
						if(messages.get(value).hasOwnProperty(`content`)){
							let regex = /\n/gm;
							content   = `${messages.get(value).content}`;
							content   = content.replace(regex, `\n   `);
						}else{
							content = `Missing Content...`;
						}

						// If Message Has Author
						if(messages.get(value).hasOwnProperty(`author`)){

							if(messages.has(nexval)){
								if(messages.get(nexval).hasOwnProperty(`author`)){
									if(messages.get(value).author.id == messages.get(nexval).author.id) nextmatch = true;
									else nextmatch = false;
								}else{
									nextmatch = false;
								}
							}else{
								nextmatch = false;
							}

							if(nextmatch == true)  snaplog += `  ${messages.get(value).author.username}: ${content}\n#`
							if(nextmatch == false) snaplog += `  ${messages.get(value).author.username}: ${content}\n#  <${messages.get(value).author.id}>\n#\n#`;


						}else{
							snaplog += `  ???: ${content}\n#  <UNKNOWN USER ID>\n#\n#`;
						}

					}else{
						snaplog += `\n#  >>> Ghost Message....Spooky << \n#`;
					}

				}

				let splitter = 	`\n  ${author} Snapped ${snap} from the Chat on ${date}.\n  Here are the messages.` + snaplog.split(`\n#`).reverse().join(`\n`) +
												`\n\n  > Ground Zero. <`;

				fs.writeFile(`./files/reports/${author}_${id}.txt`, splitter, (err) => {
					if (err) throw err;
					console.log(`  (ii) Snap log has been saved!`);
					message.channel.bulkDelete(messages).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
				});

			});

	}
	else{
		let snapped = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!snapped) return message.channel.send(`${args.join(` `)} is not in the guild or is not targetable.`);

		let fetched = await message.channel.fetchMessages();
		let filtered = await fetched.filter(msg => msg.author.id == snapped.id);

		// Local Variables
		let keys    = filtered.keys();
		let forekey = filtered.keys();
		forekey.next();

		// For Each Message
		for(let i = 0; i < filtered.size; i++){

			// Local Variables
			let value  = keys.next().value;
			let nexval = forekey.next().value;
			let nextmatch = false;

			// If Message Id is in Collection
			if(filtered.has(value)){

				// Local Variables
				let content;

				// If Message Has Content
				if(filtered.get(value).hasOwnProperty(`content`)){
					let regex = /\n/gm;
					content   = `${filtered.get(value).content}`;
					content   = content.replace(regex, `\n   `);
				}else{
					content = `Missing Content...`;
				}

				// If Message Has Author
				if(filtered.get(value).hasOwnProperty(`author`)){

					if(filtered.has(nexval)){
						if(filtered.get(nexval).hasOwnProperty(`author`)){
							if(filtered.get(value).author.id == filtered.get(nexval).author.id) nextmatch = true;
							else nextmatch = false;
						}else{
							nextmatch = false;
						}
					}else{
						nextmatch = false;
					}

					if(nextmatch == true)  snaplog += `  ${filtered.get(value).author.username}: ${content}\n#`
					if(nextmatch == false) snaplog += `  ${filtered.get(value).author.username}: ${content}\n#  <${filtered.get(value).author.id}>\n#\n#`;


				}else{
					snaplog += `  ???: ${content}\n#  <UNKNOWN USER ID>\n#\n#`;
				}

			}else{
				snaplog += `\n#  >>> Ghost Message....Spooky << \n#`;
			}

		}

		let splitter = 	`\n  ${author} Snapped ${snapped.user.username} on ${date}.\n  Here are the messages.` + snaplog.split(`\n#`).reverse().join(`\n`) +
										`\n\n  > Ground Zero. <`;

		fs.writeFile(`./files/reports/${author}_${id}.txt`, splitter, (err) => {
			if (err) throw err;
			console.log(`  (ii) Snap log has been saved!`);
			message.channel.bulkDelete(filtered).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

		});

	}

	return;
}

exports.help = {
	name: `Snap`,
	description: `Deletes a specified number of messages, or a specified person's messages`,
	use: `/snap [# of messages / person]`,
	examples: `/snap 25\n/snap @Caerus`,
	permissions: [`Administrator`],
	shortcuts: {
		root: `snap`,
		list: [`purge`]
	}
}

function getLibrary(modname){
	try{
		return modname;
	}catch(e){
		console.log(`      (!!) Issue: ` + e.message);
		console.log(`      (!!) Because the module '${modname}' is necessary to run ${process.title}, ${process.title} will now end instead.`);
		return process.exit();
	}

}
