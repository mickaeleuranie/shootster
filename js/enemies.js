/**
 * TODOs
 * Add ground/sky ennemies (tank > background, ship > foreground for example)
 */
var Enemies = {

	entities: {},
	speed: {
		x: 1,
		y: 1
	},
	direction: {
		x: 1,
		y: 1
	},
	weapons: {
		basic: null
	},
	localisation: 'sky',
	// lastGeneration: Game.Functions.microtime(true),
	lastGeneration: 0,
	timeBeforeNextEnemy: 0,
	lastVariation: 'top-left',

	generate: function() {
		// if ((Game.Functions.microtime(true) - this.lastGeneration) * 1000 > 1000) {
		this.timeBeforeNextEnemy -= 10;
		if (this.timeBeforeNextEnemy < 0) {
			var variation = '';
			if (this.lastVariation == 'top-left') {
				variation = 'top-right';
				this.lastVariation = 'top-right';
			} else {
				variation = 'top-left';
				this.lastVariation = 'top-left';
			}
			enemy = this.createOne('basic', {
				variation: variation
			});
			this.timeBeforeNextEnemy = (Math.random() * 2000);
			this.lastGeneration = Game.Functions.microtime(true);
		}

	},

	createOne: function(type, options) {
		var enemy = new Enemy();
		settings = this['get' + type.charAt(0).toUpperCase() + type.substring(1).toLowerCase() + 'Settings'](options);
		// enemy.init(settings);
		Elements.init(enemy, settings);
		// set optionnals values
		if (options != undefined) {
			Elements.init(enemy, options);
		}
		this.entities[enemy.id] = enemy;
		return enemy;
	},

	getBasicSettings: function(options) {
		var settings = {
			size: {
				width: 20,
				height: 20
			},
			place: 'air', // air or ground
			type: 'basic',
			weapons: {primary: 'basic'},
			health: '300',
			shield: 20	// in purcent, 100% = invincible
		}
		if (options != undefined && options.variation != undefined) {
			switch (options.variation) {
				case 'top-right':
					settings['position'] = {
						x: parseInt(Game.WIDTH / 3) * 2 - (settings.size.width / 2),
						y: 0
					}
					break;
				case 'top-left':
				default:
					settings['position'] = {
						x: parseInt(Game.WIDTH / 3) - (settings.size.width / 2),
						y: 0
					}
					break;
			}
		} else {
			settings['position'] = {
				x: parseInt(Game.WIDTH / 3) - (settings.size.width / 2),
				y: 0
			}
		}
		return settings;
	},

	get: function(id) {
		if (this.entities[id ]!= undefined) {
			return this.entities[id];
		}
		return false;
	},

	update: function() {
		// this.generate();
		var toRemove = {};
		// for (var i = 0; i < this.entities.length; i++) {
		for (key in this.entities) {
			if (Elements.isOutOfScreen(this.entities[key])) {
				toRemove[this.entities[key].id] = true;
			}
			if (this.entities[key].health <= 0) {
				toRemove[this.entities[key].id] = true;

				// generate bonuses
				this.entities[key].generateBonus();
			}
			this.entities[key].update();
		}
		for (key in toRemove) {
			delete this.entities[key];
		}

		// update waves
		Enemies.Waves.update();
	},

	render: function() {
		// for (var i = 0; i < this.entities.length; i++) {
		for (key in this.entities) {
			this.entities[key].render();
		}
	}
};

var Enemy = function() {
	this.id = 'enemy' + (Game.Functions.microtime(true));
	this.size = {
		width: 20,
		height: 20
	};
	this.position = {
		x: (Game.WIDTH / 2) - (this.size.width / 2),
		y: 0
	};
	this.speed = Enemies.speed;
	this.direction = Enemies.direction;
	this.weapons = Enemies.weapons;
	this.missiles = [];
	this.bonuses = {};
	this.type = null;
	this.path = null;
	this.health = null;
	this.shield = 0;
	this.place = null;
	this.variation = null;

	// manage group
	this.group = null;

	// this.init = function(settings) {
	// 	if (this.position != undefined && settings.position != undefined) { this.position.x = settings.position.x; }
	// 	if (settings.type != undefined) { this.type = settings.type; }
	// 	if (settings.health != undefined) { this.health = settings.health; }
	// 	if (settings.shield != undefined) { this.shield = settings.shield; }
	// 	if (settings.place != undefined) { this.place = settings.place; }
	// };

	this.move = function (type) {
		if (type == undefined) {
			this.position.y += this.speed.y;
		} else {
			var move = new Moves(this);
			move[type](this.variation);
		}
	};

	this.update = function() {
		this.move(this.type);
		// Elements.autoFire(this);
		// this.fire();
	};

	this.render = function() {
		Game.Draw.rect(this.position.x, this.position.y, this.size.width, this.size.height, '#ccc');
	};

	this.hit = function(missile) {
		if (this.shield != 0) {
			// var damage = missile.damage * (1 - (this.shield / 100));
			var damage = missile.damage - (missile.damage * ( this.shield / 100 ));
		} else {
			var damage = missile.damage;
		}
		this.health -= damage;
	};

	this.generateBonus = function() {
		var bonus = Bonuses.createOne(this, 'health');
	}
};

Enemies.Waves = {
	entities: {},

	// idée : créer des piles de vagues d'enemies à générer
	// dépiler pour les générer automatiquement
	// -> génération immédiate de chaque vague
	// -> mais génération avec délais entre chaque enemis d'une vague

	createOne: function(settings) {
		var wave = new Enemies.Wave();
		wave.init(settings);
		this.entities[wave.id] = wave;
		wave.update();
		return wave;
	},
	create: function(waves) {
		console.log(waves);
		for (var i = 0; i < waves.length; i++) {
			this.createOne(waves[i]);
		}
	},

	getBasicSettings: function() {
		var move = new Moves(this);
		return {
			type: 'basic',
			move: move['basic'](this),
		}
	},

	update: function() {
		// Elements.update(this);
		var toRemove = {};
		// for (var i = 0; i < this.entities.length; i++) {
		for (key in this.entities) {
			if (this.entities[key].toDelete == true) {
				toRemove[this.entities[key].id] = true;
			}
			this.entities[key].update();
		}
		for (key in toRemove) {
			delete this.entities[key];
		}
	}
};

Enemies.Wave = function() {
	this.id = 'enemiesWave' + (Game.Functions.microtime(true));
	this.lastGeneration = Game.Functions.microtime(true);
	this.stack = {};
	this.count = null;
	this.generated = 0;
	this.variation = null;
	this.type = null;
	this.toDelete = false;

	this.init = function(settings) {
		console.log(settings);
		this.lastGeneration = Game.Functions.microtime(true);
		Elements.init(this, settings);
	}

	this.update = function() {
		// console.log(this.lastGeneration+'-'+Game.Functions.microtime(true)+'-'+((Game.Functions.microtime(true) - this.lastGeneration) * 1000 > 1000));
		if (
			(Game.Functions.microtime(true) - this.lastGeneration) * 1000 > 1000
			&& this.generated < this.count
		) {
			enemy = Enemies.createOne(this.type, {variation: this.variation});
			this.generated += 1;
			this.lastGeneration = Game.Functions.microtime(true);
		}
		if (this.generated >= this.count) {
			this.toDelete = true;
		}
	}
};