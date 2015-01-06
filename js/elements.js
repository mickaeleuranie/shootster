var Elements = {

	init: function(elt, settings) {
		if (settings != undefined) {
			for (key in settings) {
				elt[key] = settings[key];
			}
		}
	},

	update: function(elt, options) {
		// console.log(elt.entities);
		var toRemove = {};
		// for (var i = 0; i < elt.entities.length; i++) {
		for (key in elt.entities) {
			if (
				options != undefined
				&& options.isOutOfScreen != undefined
				&& options.isOutOfScreen == true
				&& Elements.isOutOfScreen(elt.entities[key])
			) {
				toRemove[elt.entities[key].id] = true;
			}
			if (
				options != undefined
				&& options.toDelete != undefined
				&& options.toDelete == true
				&& Elements.toDelete(elt.entities[key])
			) {
				toRemove[elt.entities[key].id] = true;
			}
			if (elt.entities[key].health <= 0) {
				toRemove[elt.entities[key].id] = true;

				// generate bonuses
				elt.entities[key].generateBonus();
			}
			elt.entities[key].update();
		}
		for (key in toRemove) {
			delete elt.entities[key];
		}
	},

	render: function(elt) {

	},

	autoFire: function(elt) {
		this.fire(elt);
		this.secondaryFire(elt);
	},

	fire: function(elt) {
		// set elt weapon last shot to now
		for (weapon in elt.weapons.primary) {
			var period = elt.weapons.primary.basic.period;
			if (elt.bonuses.weapons != undefined && elt.bonuses.weapons.primary != undefined && elt.bonuses.weapons.primary[weapon] != undefined && elt.bonuses.weapons.primary[weapon].period != undefined) {
				period += elt.bonuses.weapons.primary[weapon].period;
			}
			if ((Game.Functions.microtime(true) - elt.weapons.primary[weapon]['lastShot']) * 1000 > period) {
				missile = Missiles.createOne();
				settings = Weapons['get' + weapon.charAt(0).toUpperCase() + weapon.substring(1).toLowerCase() + 'Settings'](elt, 'player');
				// change missile settings according to bonuses
				if (elt.bonuses.weapons != undefined && elt.bonuses.weapons.primary != undefined && elt.bonuses.weapons.primary[weapon] != undefined && elt.bonuses.weapons.primary[weapon].speed != undefined) {
					settings.speed.x += elt.bonuses.weapons.primary[weapon].speed.x;
					settings.speed.y += elt.bonuses.weapons.primary[weapon].speed.y;
				}
				if (elt.bonuses.weapons != undefined && elt.bonuses.weapons.primary != undefined && elt.bonuses.weapons.primary[weapon] != undefined && elt.bonuses.weapons.primary[weapon].period != undefined) {
					settings.period += elt.bonuses.weapons.primary[weapon].period;
				}
				// missile.init(settings);
				elt.init(missile, settings);
				elt.weapons.primary[weapon]['lastShot'] = Game.Functions.microtime(true);
			}
		}
	},

	secondaryFire: function(elt) {
		for (weapon in elt.weapons.secondary) {
			var period = elt.weapons.secondary.basic.period;
			if (elt.bonuses.weapons != undefined && elt.bonuses.weapons.secondary != undefined && elt.bonuses.weapons.secondary[weapon] != undefined && elt.bonuses.weapons.secondary[weapon].period != undefined) {
				period += elt.bonuses.weapons.secondary[weapon].period;
			}
			if ((Game.Functions.microtime(true) - elt.weapons.secondary[weapon]['lastShot']) * 1000 > period) {
				missile = Missiles.createOne();
				settings = Weapons['get' + weapon.charAt(0).toUpperCase() + weapon.substring(1).toLowerCase() + 'SecondarySettings'](elt, 'player');
				// change missile settings according to bonuses
				if (elt.bonuses.weapons != undefined && elt.bonuses.weapons.secondary != undefined && elt.bonuses.weapons.secondary[weapon] != undefined && elt.bonuses.weapons.secondary[weapon].speed != undefined) {
					settings.speed.x += elt.bonuses.weapons.secondary[weapon].speed.x;
					settings.speed.y += elt.bonuses.weapons.secondary[weapon].speed.y;
				}
				if (elt.bonuses.weapons != undefined && elt.bonuses.weapons.secondary != undefined && elt.bonuses.weapons.secondary[weapon] != undefined && elt.bonuses.weapons.secondary[weapon].period != undefined) {
					settings.period += elt.bonuses.weapons.secondary[weapon].period;
				}
				// missile.init(settings);
				elt.init(missile, settings);
				elt.weapons.secondary[weapon]['lastShot'] = Game.Functions.microtime(true);
			}
		}
	},

	isOutOfScreen: function(elt) {
		if (
			(elt.position.y + elt.size.height) < 0
			|| elt.position.y > Game.HEIGHT
			|| (elt.position.x + elt.size.width) < 0
			|| elt.position.x > Game.Width
		) {
			return true;
		}
		return false;
	}
};