exports.run = async (Discord, bot, config, message) => {

	// Ignoring commands without prefix
	if(message.content.indexOf(config.prefix) != 0) return;

	// Deleting Command
	message.delete().catch(console.error);

	// variables
	let namelength    = Math.floor((Math.random() * 6) + 3);
	let name          = ``;
	let flp5          = [`j`, `a`];
	let flp4          = [`j`, `a`, `m`, `e`, `c`];
	let flp3          = [`j`, `a`, `m`, `e`, `c`, `t`, `l`, `k`];
	let flp2          = [`j`, `a`, `m`, `e`, `c`, `t`, `l`, `k`, `r`, `n`, `h`, `b`];
	let flp1          = [`a`, `e`, `i`, `o`, `u`, `b`, `c`, `d`, `f`, `g`, `h`, `j`, `k`, `l`, `m`, `n`, `p`, `q`, `r`, `s`, `t`, `v`, `x`, `y`, `z`]
	let vowels        = [`a`, `e`, `i`, `o`, `u`];
	let consonants    = [`b`, `c`, `d`, `f`, `g`, `h`, `j`, `k`, `l`, `m`, `n`, `p`, `q`, `r`, `s`, `t`, `v`, `x`, `y`, `z`];

	let percentile100 = [`e`];
	let percentile72  = [`e`];
	let percentile64  = [`t`, `e`];
	let percentile56  = [`e`, `in`, `er`, `ll`];
	let percentile48  = [`a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `he`, `in`, `er`, `an`, `ll`];
	let percentile40  = [`a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `he`, `in`, `er`, `an`, `re`, `nd`, `ll`, `ss`];
	let percentile32  = [`d`, `l`, `a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `he`, `in`, `er`, `an`, `re`, `nd`, `at`, `on`, `nt`, `ha`, `es`, `st`, `en`, `ed`, `to`, `it`, `ou`, `ll`, `ss`, `ee`];
	let percentile24  = [`d`, `l`, `a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `th`, `he`, `in`, `er`, `an`, `re`, `nd`, `at`, `on`, `nt`, `ha`, `es`, `st`, `en`, `ed`, `to`, `it`, `ou`, `ll`, `ss`, `ee`];
	let percentile16  = [`c`, `f`, `g`, `m`, `p`, `u`, `w`, `y`, `d`, `l`, `a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `th`, `he`, `in`, `er`, `an`, `re`, `nd`, `at`, `on`, `nt`, `ha`, `es`, `st`, `en`, `ed`, `to`, `it`, `ou`, `ea`, `hi`, `is`, `or`, `ti`, `as`, `te`, `ll`, `ss`, `ee`, `oo`];
	let percentile8   = [`b`, `k`, `v`, `c`, `f`, `g`, `m`, `p`, `u`, `w`, `y`, `d`, `l`, `a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `th`, `he`, `in`, `er`, `an`, `re`, `nd`, `at`, `on`, `nt`, `ha`, `es`, `st`, `en`, `ed`, `to`, `it`, `ou`, `ea`, `hi`, `is`, `or`, `ti`, `as`, `te`, `et`, `ng`, `of`, `ll`, `ss`, `ee`, `oo`];
	let percentile2   = [`j`, `x`, `q`, `z`, `b`, `k`, `v`, `c`, `f`, `g`, `m`, `p`, `u`, `w`, `y`, `d`, `l`, `a`, `h`, `i`, `n`, `o`, `r`, `s`, `t`, `e`, `th`, `he`, `in`, `er`, `an`, `re`, `nd`, `at`, `on`, `nt`, `ha`, `es`, `st`, `en`, `ed`, `to`, `it`, `ou`, `ea`, `hi`, `is`, `or`, `ti`, `as`, `te`, `et`, `ng`, `of`, `al`, `de`, `se`, `le`, `sa`, `si`, `ar`, `ve`, `ra`, `ld`, `ur`, `ll`, `ss`, `ee`, `oo`];

	let randomizer = [];
	let randompick = Math.random();

	if(randompick < .40){
		randomizer = flp1;
	}else if(randompick < .58){
		randomizer = flp2;
	}else if(randompick < .70){
		randomizer = flp3;
	}else if(randompick < .83){
		randomizer = flp4;
	}else{
		randomizer = flp5;
	}

	name += randomizer[Math.floor(Math.random() * randomizer.length)];

	// Console.log(`The generated length for this name is ${namelength}`);
	for(var i = name.length; i < namelength; i = name.length){

		let lastcharacter = name.split(``).pop();
		randompick        = Math.random();

		if(randompick < .02){
			randomizer = percentile2;
		}else if(randompick < .11){
			randomizer = percentile8;
		}else if(randompick < .18){
			randomizer = percentile16;
		}else if(randompick < .25){
			randomizer = percentile24;
		}else if(randompick < .50){
			randomizer = percentile32;
		}else if(randompick < .58){
			randomizer = percentile40;
		}else if(randompick < .66){
			randomizer = percentile48;
		}else if(randompick < .74){
			randomizer = percentile56;
		}else if(randompick < .82){
			randomizer = percentile64;
		}else if(randompick < .90){
			randomizer = percentile72;
		}else{
			randomizer = percentile100;
		}

		let character = randomizer[Math.floor(Math.random() * randomizer.length)];

		// If the name ends in a consonant and the next character is a vowel
		if(vowels.indexOf(lastcharacter) == -1 && vowels.indexOf(character.charAt(0)) > -1){
			name += character;
		}

		// If the name ends in a vowel and the next character is a consonant
		if(vowels.indexOf(lastcharacter) > -1 && consonants.indexOf(character.charAt(0)) > -1){
			name += character;
		}

	}

	name = name.toUpperCase().charAt(0) + name.slice(1).toLowerCase();

	message.reply(`Auto-Generated: _${name}_`);
}

exports.help = {
	name: `Random Name Generator`,
	description: `Generates a randomly generated name using letter frequency statistics. Repors result in-chat`,
	use: `/name`,
	examples: `/name`,
	permissions: [`Player`]
}
