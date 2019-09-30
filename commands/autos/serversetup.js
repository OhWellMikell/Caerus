// Libraries
const db = require(`quick.db`);

exports.run = async (Discord, bot, config, message) => {
// In this instance, `message` is actually the channel `typing start` has detected

	// Database Variables
	const guildFile = new db.table(`GuildInfo`);
	const guildId   = `${message.guild.id}`;

	// Local Variables
	let guild     = message.guild;
	let master    = message.guild.roles.find(role => role.name === `Campaign Leader`);
	let leader    = message.guild.roles.find(role => role.name === `Clubroom Leader`);
	let player    = message.guild.roles.find(role => role.name === `Player`);

	let voice     = message.guild.channels.find(channel => channel.name === `📣 Voice Channels`);
	let vdefault  = message.guild.channels.find(channel => channel.name === `General`);

	let admin     = message.guild.channels.find(channel => channel.name === `📋 Administration`);
	let reports   = message.guild.channels.find(channel => channel.name === `reports`);
	let incidents = message.guild.channels.find(channel => channel.name === `incidents`);
	let goodbyes  = message.guild.channels.find(channel => channel.name === `goodbyes`);

	let lobby     = message.guild.channels.find(channel => channel.name === `🎉 Lobby`);
	let welcome   = message.guild.channels.find(channel => channel.name === `welcome`);
	let general   = message.guild.channels.find(channel => channel.name === `general`);

	let campaigns = message.guild.channels.find(channel => channel.name === `📚 Campaigns`);

	// Check for guild database file, if non-existent create it.
	if(guildFile.has(`${guildId}`) == false){
		guildFile.set(`${guildId}`, { name: `${guild.name}`, members: guild.members.size, campsize: 8 });
	}

	guildFile.set(`${guildId}` + `.members`, guild.members.size);

	// Check for roles, if not existent, create them.
	if(!leader){
		try{
			leader = await message.guild.createRole({
				name: `Clubroom Leader`,
				color: `#ea590b`,
				permissions: [`MANAGE_MESSAGES`, `MUTE_MEMBERS`, `DEAFEN_MEMBERS`]
			});
		}catch(e){
			console.log(e);
		}
	}
	if(!master){
		try{
			master = await message.guild.createRole({
				name: `Campaign Leader`,
				color: `#e8a130`,
				permissions: [`MUTE_MEMBERS`,`DEAFEN_MEMBERS`]
			});
		}catch(e){
			console.log(e);
		}
	}
	if(!player){
		console.log(`Echo`);
		try{
			player = await message.guild.createRole({
				name: `Player`,
				color: `#e2a646`,
			});
		}catch(e){
			console.log(e);
		}
	}

	leader.setHoist(true);
	master.setHoist(true);


	let memberids = message.guild.members.keys();
	let curval = memberids.next().value;

	// Look for administrators in the member list, give them the `Leader` role.
	message.guild.members.forEach(member =>{
		member = message.guild.members.get(curval);
		if(member.hasPermission(`ADMINISTRATOR`) && member.user.bot == false){
			member.addRole(leader);
		}
		curval = memberids.next().value;
	});

	if(!voice || voice.type != `category`){
		try{
			voice = await message.guild.createChannel(`📣 Voice Channels`, `category`);
		}catch(e){
			console.log(e);
		}
	}

	if(!vdefault || vdefault.type != `voice`){
		try{
			vdefault = await message.guild.createChannel(`General`, `voice`);
		}catch(e){
			console.log(e);
		}
	}
	let vdefaultparent  = await vdefault.setParent(voice);
	vdefaultparent.lockPermissions();

	if(!campaigns || campaigns.type != `category`){
		try{
			campaigns = await message.guild.createChannel(`📚 Campaigns`, `category`);
		}catch(e){
			console.log(e);
		}
	}

	if(!lobby || lobby.type != `category`){
		try{
			lobby = await message.guild.createChannel(`🎉 Lobby`, `category`);
		}catch(e){
			console.log(e);
		}
	}

	if(!welcome || welcome.type != `text`){
		try{
			welcome = await message.guild.createChannel(`welcome`, `text`);
		}catch(e){
			console.log(e);
		}
	}
	let welcomeparent   = await welcome.setParent(lobby);
	welcomeparent.lockPermissions();

	if(!general || general.type != `text`){
		try{
			general = await message.guild.createChannel(`general`, `text`);
		}catch(e){
			console.log(e);
		}
	}
	let generalparent   = await general.setParent(lobby);
	generalparent.lockPermissions();

	if(!admin || admin.type != `category`){
		try{
			admin = await message.guild.createChannel(`📋 Administration`, `category`,[{
				id: guild.id,
				denied: [`READ_MESSAGES`, `SEND_MESSAGES`, `VIEW_CHANNEL`]
			}]);
		}catch(e){
			console.log(e);
		}
	}

	admin.overwritePermissions(leader, {
		READ_MESSAGES: true,
		VIEW_CHANNEL: true,
		SEND_MESSAGES: true
	});

	if(!reports || reports.type != `text` ){
		try{
			reports = await message.guild.createChannel(`reports`, `text`);
		}catch(e){
			console.log(e);
		}
	}
	let reportsparent   = await reports.setParent(admin);
	reportsparent.lockPermissions();

	if(!incidents || incidents.type != `text`){
		try{
			incidents = await message.guild.createChannel(`incidents`, `text`);
		}catch(e){
			console.log(e);
		}
	}
	let incidentsparent = await incidents.setParent(admin);
	incidentsparent.lockPermissions();

	if(!goodbyes || goodbyes.type != `text`){
		try{
			goodbyes = await message.guild.createChannel(`goodbyes`, `text`);
		}catch(e){
			console.log(e);
		}
	}
	let goodbyesparent  = await goodbyes.setParent(admin);
	goodbyesparent.lockPermissions();

	return;
}

exports.help = {
	name: `Server Setup`
}
