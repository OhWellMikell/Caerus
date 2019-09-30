// Libraries
const db = require("quick.db");

exports.run = async (Discord, bot, config, message, args) => {
//In this instance, "message" is actually the channel "typing start" was detected

	// Database Variables
	const guildFile = new db.table(`GuildInfo`);
	const guildId   = `${message.guild.id}`;

	// Local Variables
	let guild     = message.guild;
	let master    = message.guild.roles.find(role => role.name === "Campaign Leader");
	let leader    = message.guild.roles.find(role => role.name === "Clubroom Leader");
	let player    = message.guild.roles.find(role => role.name === "Player");

	let voice     = message.guild.channels.find(channel => channel.name === "📣 Voice Channels");
	let vdefault  = message.guild.channels.find(channel => channel.name === "General");

	let admin     = message.guild.channels.find(channel => channel.name === "📋 Administration");
	let reports   = message.guild.channels.find(channel => channel.name === "reports");
	let incidents = message.guild.channels.find(channel => channel.name === "incidents");
	let goodbyes  = message.guild.channels.find(channel => channel.name === "goodbyes");

	let lobby     = message.guild.channels.find(channel => channel.name === "🎉 Lobby");
	let welcome   = message.guild.channels.find(channel => channel.name === "welcome");
	let general   = message.guild.channels.find(channel => channel.name === "general");

	let campaigns = message.guild.channels.find(channel => channel.name === "🎲 Campaigns");

	// Check for guild database file, if non-existent create it.
	if(guildFile.has(`${guildId}`) == false){
		guildFile.set(`${guildId}`, {name: `${guild.name}`, members: guild.members.size, campsize: 8});
	};

	guildFile.set(`${guildId}` + ".members", guild.members.size);

	// Check for roles, if not existent, create them.
	if(!leader){
		try{
			leader = await message.guild.createRole({
				name: "Clubroom Leader",
				color: "#ea590b",
				permissions: ["MANAGE_MESSAGES","MUTE_MEMBERS","DEAFEN_MEMBERS"]
			});
		}catch(e){
			console.log(e);
		}
	};
	if(!master){
		try{
			master = await message.guild.createRole({
				name: "Campaign Leader",
				color: "#e8a130",
				permissions: ["MUTE_MEMBERS","DEAFEN_MEMBERS"]
			});
		}catch(e){
			console.log(e);
		}
	};
	if(!player){
		console.log("Echo");
		try{
			player = await message.guild.createRole({
				name: "Player",
				color: "#e2a646",
			});
		}catch(e){
			console.log(e);
		}
	};

	// Testing
	let memberids = message.guild.members.keys();
	let curval = memberids.next().value;
	let member = null

	message.guild.members.forEach(key =>{
		member = message.guild.members.get(curval);
		if(member.hasPermission("ADMINISTRATOR") && member.user.bot == false){
			member.addRole(leader);
		};
		curval = memberids.next().value;
	});

	// Check for Category, then appropriate Channels, then move them to position.
	if(voice && voice.type == `category`){
		if(vdefault && vdefault.type == `voice`){
			vdefault.setParent(voice);
		}
		else{
			guild.createChannel("General",`voice`).then(channel => {
				channel.setParent(voice);
			});
		};
	}
	else{
		guild.createChannel("📣 Voice Channels",`category`).then(category => {
			voice = category;
			if(vdefault && vdefault.type == `voice`){
				vdefault.setParent(voice);
			}
			else{
				guild.createChannel("General",`voice`).then(channel => {
					channel.setParent(voice);
				});
			};
		});
	};

	if(!campaigns || campaigns.type != `category`){
		guild.createChannel("🎲 Campaigns",`category`).then(category => {
			campaigns = category;
		});
	};

	if(lobby && lobby.type == `category`){
		if(welcome && welcome.type == `text`){
			welcome.setParent(lobby);
		}
		else{
			guild.createChannel("welcome",`text`).then(channel => {
				channel.setParent(lobby);
			});
		};
		if(general && general.type == `text`){
			general.setParent(lobby);
		}
		else{
			guild.createChannel("general",`text`).then(channel => {
				channel.setParent(lobby);
			});
		};
	}
	else{
		guild.createChannel("🎉 Lobby",`category`).then(category => {
			lobby = category;
			if(welcome && welcome.type == `text`){
				welcome.setParent(lobby);
			}
			else{
				guild.createChannel("welcome",`text`).then(channel => {
					channel.setParent(lobby);
				});
			};
			if(general && general.type == `text`){
				general.setParent(lobby);
			}
			else{
				guild.createChannel("general",`text`).then(channel => {
					channel.setParent(lobby);
				});
			};
		});

	};

	if(admin && admin.type == `category`){
		if(reports && reports.type == `text`){
			reports.setParent(admin);
		}
		else{
			guild.createChannel("reports",`text`).then(channel => {
				channel.setParent(admin);
			});
		};
		if(incidents && incidents.type == `text`){
			incidents.setParent(admin);
		}
		else{
			guild.createChannel("incidents",`text`).then(channel => {
				channel.setParent(admin);
			});
		};
		if(goodbyes && goodbyes.type == `text`){
			goodbyes.setParent(admin);
		}
		else{
			guild.createChannel("goodbyes",`text`).then(channel => {
				channel.setParent(admin);
			});
		};
	}
	else{
		guild.createChannel("📋 Administration",`category`, [{
			id: guild.id,
			denied: ["READ_MESSAGES"]
		}]).then(category => {
			admin = category;
			if(reports && reports.type == `text`){
				reports.setParent(admin);
			}
			else{
				guild.createChannel("reports",`text`).then(channel => {
					channel.setParent(admin);
				});
			};
			if(incidents && incidents.type == `text`){
				incidents.setParent(admin);
			}
			else{
				guild.createChannel("incidents",`text`).then(channel => {
					channel.setParent(admin);
				});
			};
			if(goodbyes && goodbyes.type == `text`){
				goodbyes.setParent(admin);
			}
			else{
				guild.createChannel("goodbyes",`text`).then(channel => {
					channel.setParent(admin);
				});
			};
		});
	};


	return;
}

exports.help = {
	name: "Server Setup"
}
