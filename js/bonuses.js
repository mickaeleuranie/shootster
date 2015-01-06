var Bonuses = {
	entities: {},
	dropped: {},
	used: {},

	speed: 5,

	createOne: function(elt, type, settings) {
		var bonus = new Bonus(type);
		var settings = this['get' + type.charAt(0).toUpperCase() + type.substring(1).toLowerCase() + 'Settings'](elt, settings);
		bonus.init(settings);
		this.entities[bonus.id] = bonus;
		return bonus;
	},

	get: function(id) {
		if (this.entities.id != undefined) {
			return this.entities.id;
		}
		return false;
	},

	update: function() {
		var toRemove = {};
		for (key in this.entities) {
			if (Elements.isOutOfScreen(this.entities[key])) {
				toRemove[this.entities[key].id] = true;
			}
			this.entities[key].update();
		}
		for (key in toRemove) {
			delete this.entities[key];
		}
	},

	render: function() {
		for (key in this.entities) {
			this.entities[key].render();
		}
	},

	getHealthSettings: function(elt, settings) {
		var size= {
			width: 15,
			height: 7
		};
		var settings = {
			name: 'Clou',
			type: 'health',
			size: size,
			position: {
				x: (elt.position.x + (elt.size.width / 2) - (size.width / 2)),
				y: elt.position.y
			},
			speed: {
				x: 0,
				y: 1
			}
		};
		return settings;
	},

	/**
	 * Reset player's weapons
	 *
	 * @param string id Player's identifier
	 */
	resetWeapons: function(id) {
		ship = Ships.get(id);
		ship.weapons = Ships.weapons;
		// primary
		ship.weapons.primary.basic = Weapons.getBasicSettings('player');
		if (ship.bonuses.weapons == undefined) { ship.bonuses['weapons'] = {}; }
		if (ship.bonuses.weapons.primary == undefined) { ship.bonuses.weapons['primary'] = {}; }
		if (ship.bonuses.weapons.primary.basic == undefined) { ship.bonuses.weapons.primary['basic'] = {}; }
		if (ship.bonuses.weapons.primary.basic.speed == undefined) { ship.bonuses.weapons.primary.basic['speed'] = {x: null, y: null}; }
		ship.bonuses.weapons.primary.basic.speed.x = 0
		ship.bonuses.weapons.primary.basic.speed.y = 0
		// secondary
		ship.weapons.secondary.basic = Weapons.getBasicSecondarySettings('player');
		if (ship.bonuses.weapons == undefined) { ship.bonuses['weapons'] = {}; }
		if (ship.bonuses.weapons.secondary == undefined) { ship.bonuses.weapons['secondary'] = {}; }
		if (ship.bonuses.weapons.secondary.basic == undefined) { ship.bonuses.weapons.secondary['basic'] = {}; }
		if (ship.bonuses.weapons.secondary.basic.speed == undefined) { ship.bonuses.weapons.secondary.basic['speed'] = {x: null, y: null}; }
		ship.bonuses.weapons.secondary.basic.speed.x = 0
		ship.bonuses.weapons.secondary.basic.speed.y = 0
	},

	/**
	 * Speed up weapons period
	 */
	decreasePeriod: function(id, weapon) {
		ship = Ships.get(id);
		if (ship.bonuses.weapons == undefined) { ship.bonuses['weapons'] = {}; }
		if (ship.bonuses.weapons.primary == undefined) { ship.bonuses.weapons['primary'] = {}; }
		if (ship.bonuses.weapons.primary[weapon] == undefined) { ship.bonuses.weapons.primary[weapon] = {}; }
		if (ship.bonuses.weapons.primary[weapon].period == undefined) { ship.bonuses.weapons.primary[weapon]['period'] = 0 }
		ship.bonuses.weapons.primary[weapon].period -= 20;
	},

	/**
	 * Reset player's speed
	 *
	 * @param string id Player's identifier
	 */
	resetSpeed: function(id) {
		elt.speed = Ships.speed;
	},

	setSpeed: function(speed) {

	}
};

Bonuses.IncreaseSpeed = {
	speed: {
		x: 0,
		y: 5
	},

	level: 1,

	getBonus: function() {
		this.speed.x = 0;
		this.speed.y += this.level * this.y
	}
};

var Bonus = function() {
	this.id = 'bonus' + (Game.Functions.microtime(true));
	this.type = '';
	this.name = '';
	this.settings = null;
	this.position = {
		x: 0,
		y: 0
	};
	this.speed = {
		x: 0,
		y: 5
	};
	this.size = {
		width: 5,
		height: 5
	}

	this.init = function(settings) {
		if (settings.name != undefined) { this.name = settings.name; }
		if (settings.type != undefined) { this.type = settings.type; }
		if (settings.position != undefined) { this.position = settings.position; }
		if (settings.size != undefined) { this.size = settings.size; }
		if (settings.speed != undefined) { this.speed = settings.speed; }
	};

	this.update = function() {
		this.position.y += this.speed.y;
	};

	this.render = function() {
		Game.Draw.rect(this.position.x, this.position.y, this.size.width, this.size.height, '#000');
	}
};