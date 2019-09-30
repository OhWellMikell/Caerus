// Clearing path Entry
console.clear();
console.log(`\n  [Starting ${process.title}]`);

// Libraries
console.log(`\n   ...Loading Libraries`.padEnd(32, `.`));
const Discord = require(getLibrary(`discord.js`));
const fs      = require(getLibrary(`fs`));
const db      = require(getLibrary(`quick.db`));

// Global Variables
const bot     = new Discord.Client({ disableEveryone: true });
bot.commands  = new Discord.Collection();
bot.failures  = new Discord.Collection();
bot.shortcuts = new Discord.Collection();

// JSON Files
console.log(`\n   ...Loading JSON Files`.padEnd(32, `.`));
const config = require(loadFile(`./files/config.json`));

// Loading Command Files
getCommands(`./commands/manuals/`, `js`, `Command`);
getCommands(`./commands/autos/`, `js`, `Auto Run`);

// When a message is sent
bot.on(`message`, async message => {

	// Local Variables
	let prefix = config.prefix;
	let sender = message.author;
	let chanel = message.channel;
	let args   = message.content.slice(prefix.length).trim().split(` `);
	args = args.filter(filtered => filtered != ``);
	let cmd    = args.shift();
	if(cmd) cmd.toLowerCase().trim();

	// Ignore List
	if(sender.bot) return;
	if(chanel.type === `dm` && cmd != `help` || chanel.type === `group` && cmd != `help`){
		return message.channel.send(`Unless you're using \`/help <command>\`, ${bot.user.username} ignores pm's.\n_Try talking to them in a server they exist in!_`);
	}

	// No Prefix Automatics
	// autoRun(`xpfile.js`, message, args);
	autoRun(`notify.js`, message, args);
	message.channel.fetchMessage(message.id);

	// No Prefix Ignore
	if(message.content.indexOf(config.prefix) != 0) return;

	// Commands Handler

	let shortfile = bot.shortcuts.keys();
	let curval    = shortfile.next().value;

	// Look for argument in the shortcut list of each command, redefine the argument as the root.
	bot.shortcuts.forEach(shortcuts =>{
		shortcuts = bot.shortcuts.get(curval);
		if(shortcuts.list.includes(`${cmd}`)){
			cmd = shortcuts.root;
		}
		curval = shortfile.next().value;

	});

	// Executing Commands
	if(bot.commands.has(`${cmd}.js`)){
		try{
			let commandFile = require(`./commands/manuals/${cmd}.js`);
			commandFile.run(Discord, bot, config, message, args);
			if(commandFile.help){
				if(commandFile.help.name) console.log(`  (>>) ${sender.username} used the ${commandFile.help.name} command.`);
				else console.log(`  (>>) ${sender.username} used the \`${cmd}\` command.`);
			}else console.log(`  (>>) ${sender.username} used the \`${cmd}\` command.`);
		} catch(e){
			return console.log(`\n  (--) ${sender.username} tried to use the \`${cmd}\` command but ${bot.user.username} ${e.message}\n`);
		}
	}else if(bot.failures.has(`${cmd}.js`)){
		message.channel.send(`Sorry <@${sender.id}>, normally **/${cmd}** is a working command. But it didn't load properly when I logged on. Ask <@${config.ownerID}> to look into it.`);
		return console.log(`\n  (!!) ${sender.username} tried to use the \`${cmd}\` command but there was an issue when it was first being loaded. Check the load status\n`);
	}else return;

});

/*
// When a member joins the server
// bot.on(`guildMemberAdd`, async member => {});

// When a member leaves the server
// bot.on(`guildMemberRemove`, async member => {});

// When a channel is created
// bot.on(`channelCreate`, async channel => {});

// When a channel is deleted
// bot.on(`channelDelete`, async channel=> {});
*/

bot.on(`typingStart`, async (channel, user) => {

	// Ignore DM's and Group Chats
	if(channel.type === `dm` || channel.type === `group`){
		return;
	}

	// Autorun Server Setup
	autoRun(`serversetup.js`, channel);

	let campaigns = channel.guild.channels.find(channel => channel.name === `📚 Campaigns`);

	// If Channel is a campaign and User is a Guild Member
	if(channel.parentID == campaigns.id && channel.guild.members.find(member => member.id === user.id)){

		// Local Variables
		const seshFiles = new db.table(`CampaignFiles`);

		// Run Notification Checkup
		autoRun(`notify.js`, channel, user);

		// If Member doesn't have a Character Sheet make one
		if(seshFiles.has(`${channel.id}.${user.id}`) == false){

			console.log(`  (>>) The channel "${channel.name}" doesn't have a character sheet for ${user.username} on file, adding character sheet now.`);
			autoRun(`charactersetup.js`, channel, user)

		}

	}

	return;
});

// When client is ready
bot.on(`ready`, async() => {
	console.log(`\n  (i) ` + bot.commands.size + `/` + (bot.commands.size + bot.failures.size) + ` Command(s) successfully loaded.`)
	console.log(`\n  `.padEnd(126, `=`));
	console.log(`\n   ...Connecting to Discord`.padEnd(32, `.`));
	console.log(`  (i) ${bot.user.username} is online!`);
	console.log(`\n   ...Server Events`.padEnd(32, `.`));
	bot.user.setActivity(`you take a chance`, { type: `WATCHING` });
});
// Discord Rejection Handling
bot.on(`error`, (e) => {
	console.log(`\n   ...Client Error`.padEnd(32, `.`));
	console.error(`  ` + e.method);
});
bot.on(`warn`,  (e) => {
	console.log(`\n   ...Client Warning`.padEnd(32, `.`));
	console.warn(e);
});

// Discord Login Client
bot.login(config.token);

// Node Unhandled Rejection Handling
process.on(`unhandledRejection`, (reason, p) => {
	console.log(`\n   ...Unhandled Rejection`.padEnd(32, `.`));
  console.log(`  (!) Unhandled Rejection at:\n\n  `, p, `Reason:`, reason);

});

// ==================================================== Custom Functions =============================================================== //
// ===================================================================================================================================== //

function autoRun(filename, message, args){
	if(args === undefined){
		args = null
	}
	if(bot.commands.has(filename)){
		try{
			let commandFile = require(`./commands/autos/${filename}`);
			commandFile.run(Discord, bot, config, message, args);
		} catch(e){
				return console.log(`\n  (!!) ${bot.user.username} tried to employ the \`${filename}\` command but ${e.message.toLowerCase()}\n`);
		}
	}else if(bot.failures.has(filename)){
		return console.log(`\n  (!!) ${bot.user.username} tried to employ the \`${filename}\` command but there was an issue when it was first being loaded. Check the load status.\n`);
	}else{
		return console.log(`\n  (!!) ${filename} was not a command found in the command folders.\n`);
	}

}
function getLibrary(modname){
	try{
		console.log(`  (+) ` + modname.padEnd(18, ` `) + `LOADED.`);
		return modname;
	}catch(e){
		console.log(`  (!) ` + modname.padEnd(18, ` `) + `FAILED.`);
		console.log(`      (!!) Issue: ` + e.message);
		console.log(`      (!!) Because the module '${modname}' is necessary to run ${process.title}, ${process.title} will now end instead.`);
		return process.exit();
	}

}
function loadFile(dir){
	let name = dir.split(`/`).pop();
	if(name == undefined) name = `undefined`
	if(!fs.existsSync(dir)){
		console.log(`  (!) ` + name.padEnd(18, ` `) + `FAILED.`);
		console.log(`      (!!) There was an issue retrieving the '${name}' file. It was expected to be in [${dir}]`);
		console.log(`           Because this file is necessary to run ${process.title}, ${process.title} will now end instead.`);
		return process.exit();
	}else{
		console.log(`  (+) ` + name.padEnd(18, ` `) + `LOADED.`);
		return dir;
	}

}

// getCommands(`./commands/manuals/`, `js`, `Command`);
function getCommands(dir, filetype, name){
	if(filetype == undefined || filetype == ``) filetype = `js`;
	if(name == undefined || name == ``) name = filetype;
	loadDirectory(`${dir}`)
		.then(files => {
			console.log(`\n   ...Loading ${name} Files`.padEnd(32, `.`));
			let dirfiles = files.filter(filename => filename.split(`.`).pop() === filetype);
			if(dirfiles.length <= 0) return console.log(`  (!) Could not find any .${filetype} files inside of [${dir}]..`);
			dirfiles.forEach(file => {
				let props = require(`${dir}${file}`);
				let shortcut = ``;
				if(props.run){
					if(props.help.shortcuts){
						if(props.help.shortcuts.root){
							if(props.help.shortcuts.list){
								shortcut = ` (i) *contains shortcuts*`;
								bot.shortcuts.set(file, props.help.shortcuts);
							}
						}
					}
					console.log(`  (+) ` + file.padEnd(18, ` `) + `LOADED.` + `${shortcut}`);
					bot.commands.set(file, props);
					if(props.help){
						if(!props.help.name) console.log(`      (ii) ${file} has no name defined in exports.help.name`);
					}else console.log(`      (ii) ${file} is missing exports.help`);

				}else{
					console.log(`  (!) ` + file.padEnd(18, ` `) + `FAILED.`);
					console.log(`      (!!) ${file} is missing exports.run`);
					bot.failures.set(file, props);
					if(props.help){
						if(props.help.name) return console.log(` `);
						else return console.log(`      (ii) ${file} has no name defined in exports.help.name\n`);
					}else return console.log(`      (ii) ${file} is missing exports.help\n`);
				}
				// console.log(` `);
			});
		})
		.catch(err => {
			return console.error(`  (!) ${process.title} encountered a ${err.name} when reading ${dir} in the File System Function:\n  (!)`, err);
		});

	function loadDirectory(dir){
			return new Promise((resolve,reject) => {
				return fs.readdir(dir, (err,files) => {
					if(err) reject(err);
					if(files) resolve(files);
				});
			});

	}

}
