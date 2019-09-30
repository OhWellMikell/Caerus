const fs      = require(getLibrary(`fs`));

exports.run = async (Discord, bot, config, message, args) => {

	// Local Variables
	let cmd  = args.join(` `).trim();
	let user = message.member;
	let helpembed = null;

	// Ignore Lists
	if(!bot.commands.has(`${cmd}.js`) && !bot.failures.has(`${cmd}.js`) && cmd){
		return message.channel.send(`*\`/${cmd}\` is not a command that I use...\nType /help <a command you want to know about>*`).then(m => {
			m.delete(8000);
		});
	}
	if(bot.failures.has(`${cmd}.js`)){
		message.channel.send(`Sorry <@${message.author.id}>, normally **/${cmd}** is a working command. But it didn't load properly when I logged on. I'll notify <@${config.ownerID}> to look into it.`);
		return console.log(`\n  (!!) ${message.author.username} asked about the \`/${cmd}\` command but there was an issue when it was first being loaded. Check the load status\n`);
	}

	if(bot.commands.has(`${cmd}.js`)){

		// Local Variables
		let commandFile = await require(`./${cmd}.js`);

		// Error Traps
		if(!commandFile.help) return message.channel.send(`Sorry <@${message.author.id}>, there's no documentation on how this command is used. I'll notify <@${config.ownerID}> to write it.`);

		let alias = commandFile.help.name;
		let desc  = commandFile.help.description;
		let use   = commandFile.help.use;
		let examp = commandFile.help.examples;
		let short = `No Shortcuts`;

		if(commandFile.help.shortcuts){
			if(commandFile.help.shortcuts.list){
				short = `/` + commandFile.help.shortcuts.list.join(`, /`);

			}

		}

		if(!alias) alias = `No Defined Name`;
		if(!desc)  desc  = `No Description`;
		if(!use)   use   = `No Describes Uses.`;
		if(!examp) examp = `No Examples`;


		helpembed = new Discord.RichEmbed()
		.setTitle(`**${alias}**`)
		.addField(`Description:`, `${desc}`)
		.addField(`Usage:`, `${use}\u200b`, true)
		.addField(`Examples:`, `${examp}\u200b`, true)
		.addField(`Shortcuts:`, `${short}`)
		.setColor([133, 56, 96])
		.setFooter(`** Key: <Optional Entry> , [Mandatory Entry] **`)

		if(message.channel != message.author.dmChannel){
			message.channel.send(helpembed).then(m => {m.delete(60000);});
		}
		message.author.send(helpembed);

	}

	if(!cmd){

		if(message.channel.type === `dm` || message.channel.type === `group`){
			return message.channel.send(`**/help** is useful for looking at what commands you can use in the server,\nbut I can't check your credentials unless you type the command in the server that we're in.\n\nOn the upside, if you want to look up a specific command using **/help <command>**, I can tell you that info anywhere- even here.`)
		}

		loadDirectory(`./commands/manuals/`)
			.then(files => {
				let dirfiles = files.filter(filename => filename.split(`.`).pop() === `js`);
				if(dirfiles.length <= 0) return console.log(`  (!) Could not find any .js files inside of [./commands/manuals/]..`);

				let admin   = ``;
				let clubldr = ``;
				let campldr = ``;
				let player  = ``;
				let every   = ``;

				dirfiles.forEach(file => {
					let props   = require(`./${file}`);
					let perms   = props.help.permissions;

					if(perms == undefined) return;

					if(user.hasPermission(`ADMINISTRATOR`) && perms.includes(`Administrator`)){
						admin += `**` + `/${file}`.split(`.`).shift() + `**\n`;
					}

					if(user.roles.find(role => role.name === `Clubroom Leader`) && perms.includes(`Clubroom Leader`)){
						clubldr += `/${file}`.split(`.`).shift() + `\n`;
					}

					if(user.roles.find(role => role.name === `Campaign Leader`) && perms.includes(`Campaign Leader`)){
						campldr += `/${file}`.split(`.`).shift() + `\n`;
					}

					if(user.roles.find(role => role.name === `Player`) && perms.includes(`Player`)){
						player += `/${file}`.split(`.`).shift() + `\n`;
					}

					if(perms.includes(`Everyone`)){
						every += `/${file}`.split(`.`).shift() + `\n`;
					}

				});

				helpembed = new Discord.RichEmbed()
				.setTitle(`**Available Commands** :dividers:`)
				if(admin != ``) helpembed.addField(`**Admin**`, `*Because you are an admin, you can use* :\n${admin}\u200b`)
				if(clubldr != ``) helpembed.addField(`**Club Leader**`, `*Because you are a Clubroom Leader, you can use*:\n${clubldr}`)
				if(campldr != ``) helpembed.addField(`**Campaign Leader**`, `*Because you are a Campaign Leader, you can use*:\n${campldr}`)
				if(player != ``) helpembed.addField(`**Campaign Player**`, `*Because you are a player of a campaign, you can use*:\n${player}`)
				if(every != ``)  helpembed.addField(`**Member**`, `*Because you are a member of the server, you can use*:\n${every}`)
				helpembed.setColor([133, 56, 96])
				helpembed.setFooter(`If you have questions, type \`/help <command>\` to see more about what that command does.`)

				message.author.send(helpembed);

			})
			.catch(err => {
				return console.error(`  (!) ${bot.user.username} encountered a ${err.name} when reading ./ the File System Function:\n  (!)`, err);
			});

		/* function loadDirectory(dir){
				return new Promise((resolve,reject) => {
					return fs.readdir(dir, (err,files) => {
						if(err) reject(err);
						if(files) resolve(files);
					});
				});
		}
*/
	}

}

exports.help = {
	name: `Help`,
	description: `Gives you the commands you may use, or alternatively- information about a specific command.`,
	use: `/help <command>`,
	examples: `/help\n/help help\n/help roll`,
	permissions: [`Everyone`]
}

function loadDirectory(dir){
		return new Promise((resolve,reject) => {
			return fs.readdir(dir, (err,files) => {
				if(err) reject(err);
				if(files) resolve(files);
			});
		});
}
function getLibrary(modname){
	try{
		return modname;
	}catch(e){
		console.log(`      (!!) Issue: ` + e.message);
		return;
	}
}
