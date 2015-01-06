var Weapons = {

	entities: [],

	/**
	 * Create new weapon
	 *
	 * @param integer shipId Ship identifier
	 * @param Object position Missile initial position
	 * @param Object direction Missile direction
	 */
	createOne: function(settings) {
		var weapon = new Weapon();
		weapon.init(settings);
		// console.log(missile);
		// console.log(this.entities);
		Weapons.entities.push(weapon);
		return weapon;
	},

	update: function() {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].update();
		}
	},

	render: function() {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	},

	setWeapon: function(shortName) {
		this['set' + shortName.charAt(0).toUpperCase() + shortName.substring(1).toLowerCase()]();
	},

	setBasic: function() {
		// reset weapons
		this.entities = [];
		// set weapon
		settings = {
			name: 'Basic',
			shortName: 'basic',
			missilesCount: 1,
			period: 500,
			size: {
				width: 5,
				height: 15
			}
		};
		// add basic weapon
		this.createOne(settings);
	},

	/**
	 * Set basic weapon
	 *
	 * @param elt player | enemy
	 * @param for player | enemy
	 */
	getBasicSettings: function(elt, from) {
		var settings = {
			name: 'Basic',
			shortName: 'basic',
			missilesCount: 2,
			period: 200,
			lastShot: Game.Functions.microtime(true),
			size: {
				width: 5,
				height: 15
			},
			place: 'air'
		};
		if (from == 'player') {
			settings['speed'] = {
				x: 0,
				y: -10
			};
			settings['position'] = {
				x: (elt.position.x + (elt.size.width / 2)),
				y: elt.position.y - 10
			};
			settings['target'] = 'enemies';
			settings['damage'] = 100;
		} else {
			settings['speed'] = {
				x: 0,
				y: 6
			};
			settings['target'] = 'player';
			settings['damage'] = 20;
		}
		return settings;
	},

	/**
	 * Set basic weapon
	 *
	 * @param elt player | enemy
	 * @param for player | enemy
	 */
	getBasicSecondarySettings: function(elt, from) {
		var settings = {
			name: 'Basic',
			shortName: 'basic',
			missilesCount: 1,
			period: 500,
			lastShot: Game.Functions.microtime(true),
			size: {
				width: 7,
				height: 7
			},
			place: 'ground'
		};
		if (from == 'player') {
			settings['speed'] = {
				x: 0,
				y: -7
			};
			settings['position'] = {
				x: (elt.position.x + (elt.size.width / 2)),
				y: elt.position.y - 7
			};
			settings['target'] = 'enemies';
			settings['damage'] = 130;
		} else {
			settings['speed'] = {
				x: 0,
				y: 6
			};
			settings['target'] = 'player';
		}
		return settings;
	}
};

var Weapon = function() {
	this.id = (Weapon.entities.length + 1);
	this.name = null;
	this.shortName = null;
	// missiles count
	this.missilesCount = 0;
	// period between each shots (ms)
	this.period = 500;
	// last shot
	this.lastShot = 0;

	this.init = function(settings) {
		this.name = settings.name;
		this.shortName = settings.shortName;
		this.missilesCount = settings.missilesCount;
		this.period = settings.period;
	};

	this.shot = function() {
		for (var i = 0; i < this.missilesCount; i++) {
			missile = new Missiles.createOne(this.shortName);
			missile.init({
				x: (this.position.x + (this.size.width / 2)),
				y: this.position.y
			});
		}
	}
};