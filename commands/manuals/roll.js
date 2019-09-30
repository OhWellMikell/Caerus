exports.run = async (Discord, bot, config, message, args) => {

	// Deleting Command
	message.delete(2000).catch(O_o=>{});

	// Local Variables
	let dice     = args[0];

	if(!dice) dice = "d20";
	let numbers  = dice.trim().split("d");
	let quantity = numbers[0];
	let sides    = numbers[1];
	let num      = 0;
	let sum      = 0;
	let str      = "";


	// Error Traps
	if(numbers[0] == ""){
		numbers[0] = "1";
		quantity = numbers[0];
	}

	if(isNaN(quantity) || isNaN(sides) || quantity <= 0 || sides <= 0) return message.channel.send(`Rolling **${quantity}** dice with **${sides}** sides doesn't make any sense.`).then(sentMessage => {sentMessage.delete(5000);});
	if((quantity % 1) != 0 || (sides % 1) != 0) return message.channel.send("Will you quit it with the decimals?").then(sentMessage => {sentMessage.delete(5000);});
	if(quantity > 12) return message.channel.send("Limit is a max of 12 dice at a time, anything more is overkill").then(sentMessage => {sentMessage.delete(3000);});
	if((sides % 2) != 0) return message.channel.send("Dice typically dont have odd sides, choose a d4,6,8,10,12,20 or 100");
	if(sides == 14 | sides == 16 | sides == 18 ) return message.channel.send("A d20 set does not use that die.");
	if(sides > 20 && sides < 100) return message.channel.send("A d20 set does not use that die.");
	if(sides > 100) return message.channel.send("A d20 set does not use that die.");

	if(sides == 100){
		for(var i = 0; i < quantity; i++){
			num = Math.round(Math.floor((Math.random() * sides) + 1)/10)*10;
			str += (`${num} `);
			sum += num;
			if(i < quantity - 1) str += "+ ";
		}
	}else{
		for(var i = 0; i < quantity; i++){
			num = Math.floor(Math.random() * sides) + 1;
			str += (`${num} `);
			sum += num;
			console.log(num);
			if(i < quantity - 1) str += "+ ";
		}
		console.log(sum);
	}

	if(quantity == 1) message.channel.send(`${message.author} rolled a *${quantity}d${sides}* and got: **${str}**`);
	else message.channel.send(`${message.author} rolled a *${quantity}d${sides}* and got: ${str}		[**${sum}**]`);
	// Error Patches
}

exports.help = {
	name: "Dice Roll",
	description: "Rolls a virtual die or set of dice and reports the result in-chat.",
	use: "/roll\n/roll <# of die>d[# of sides]",
	examples: "/roll\n/roll d6\n/roll 4d20",
	permissions: ["Everyone"]
}
