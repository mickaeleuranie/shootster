var Ships = {

	entities: {},
	speed: 5,
	weapons: {
		primary: {
			basic: null
		},
		secondary: {
			basic: null
		}
	},

	createOne: function() {
		var ship = new Ship();
		this.entities[ship.id] = ship;
		return ship;
	},

	get: function(id) {
		if (this.entities[id ]!= undefined) {
			return this.entities[id];
		}
		return false;
	},

	update: function() {
		// for (var i = 0; i < this.entities.length; i++) {
		for (key in this.entities) {
			// this.entities[key].collide();
			this.entities[key].update();
		}
	},

	render: function() {
		// for (var i = 0; i < this.entities.length; i++) {
		for (key in this.entities) {
			this.entities[key].render();
		}
	}
};

var Ship = function() {
	this.id = 'player' + (Object.keys(Ships.entities).length + 1);
	this.size = {
		width: 30,
		height: 60
	};
	this.position = {
		x: (Game.WIDTH / 2) - (this.size.width / 2),
		y: Game.HEIGHT - this.size.height
	};
	this.speed = Ships.speed;
	this.weapons = Ships.weapons;
	this.missiles = [];
	this.bonuses = {};
	this.health = 100;	// TODO change this value wih bonuses / level

	this.init = function(settings) {
		// if (settings != undefined && settings.position != undefined) { this.position = settings.position; }

		// set basic shot date
		this.weapons.primary.basic = Weapons.getBasicSettings('player');
		// set basic
		this.weapons.secondary.basic = Weapons.getBasicSecondarySettings('player');
	};

	this.move = function(direction) {
		// if (this['checkMove' + direction.charAt(0).toUpperCase() + direction.substring(1).toLowerCase()]()) {
			this['go' + direction.charAt(0).toUpperCase() + direction.substring(1).toLowerCase()]();
		// }
	};

	this.fire = function() {
		// set this weapon last shot to now
		for (weapon in this.weapons.primary) {
			var period = this.weapons.primary.basic.period;
			if (this.bonuses.weapons != undefined && this.bonuses.weapons.primary != undefined && this.bonuses.weapons.primary[weapon] != undefined && this.bonuses.weapons.primary[weapon].period != undefined) {
				period += this.bonuses.weapons.primary[weapon].period;
			}
			if ((Game.Functions.microtime(true) - this.weapons.primary[weapon]['lastShot']) * 1000 > period) {
				missile = Missiles.createOne();
				settings = Weapons['get' + weapon.charAt(0).toUpperCase() + weapon.substring(1).toLowerCase() + 'Settings'](this, 'player');
				// change missile settings according to bonuses
				if (this.bonuses.weapons != undefined && this.bonuses.weapons.primary != undefined && this.bonuses.weapons.primary[weapon] != undefined && this.bonuses.weapons.primary[weapon].speed != undefined) {
					settings.speed.x += this.bonuses.weapons.primary[weapon].speed.x;
					settings.speed.y += this.bonuses.weapons.primary[weapon].speed.y;
				}
				if (this.bonuses.weapons != undefined && this.bonuses.weapons.primary != undefined && this.bonuses.weapons.primary[weapon] != undefined && this.bonuses.weapons.primary[weapon].period != undefined) {
					settings.period += this.bonuses.weapons.primary[weapon].period;
				}
				// missile.init(settings);
				Elements.init(missile, settings);
				this.weapons.primary[weapon]['lastShot'] = Game.Functions.microtime(true);
			}
		}
	};

	this.autoFire = function() {
		this.fire();
		this.secondaryFire();
	};

	this.secondaryFire = function() {
		for (weapon in this.weapons.secondary) {
			var period = this.weapons.secondary.basic.period;
			if (this.bonuses.weapons != undefined && this.bonuses.weapons.secondary != undefined && this.bonuses.weapons.secondary[weapon] != undefined && this.bonuses.weapons.secondary[weapon].period != undefined) {
				period += this.bonuses.weapons.secondary[weapon].period;
			}
			if ((Game.Functions.microtime(true) - this.weapons.secondary[weapon]['lastShot']) * 1000 > period) {
				missile = Missiles.createOne();
				settings = Weapons['get' + weapon.charAt(0).toUpperCase() + weapon.substring(1).toLowerCase() + 'SecondarySettings'](this, 'player');
				// change missile settings according to bonuses
				if (this.bonuses.weapons != undefined && this.bonuses.weapons.secondary != undefined && this.bonuses.weapons.secondary[weapon] != undefined && this.bonuses.weapons.secondary[weapon].speed != undefined) {
					settings.speed.x += this.bonuses.weapons.secondary[weapon].speed.x;
					settings.speed.y += this.bonuses.weapons.secondary[weapon].speed.y;
				}
				if (this.bonuses.weapons != undefined && this.bonuses.weapons.secondary != undefined && this.bonuses.weapons.secondary[weapon] != undefined && this.bonuses.weapons.secondary[weapon].period != undefined) {
					settings.period += this.bonuses.weapons.secondary[weapon].period;
				}
				// missile.init(settings);
				Elements.init(missile, settings);
				this.weapons.secondary[weapon]['lastShot'] = Game.Functions.microtime(true);
			}
		}
	};

	this.goLeft = function() {
		if (this.position.x - this.speed <= 0) {
			this.position.x = 0;
		} else {
			this.position.x -= this.speed;
		}
	};

	this.goRight = function() {
		if (this.position.x + this.size.width + this.speed >= Game.WIDTH) {
			this.position.x = Game.WIDTH - this.size.width;
		} else {
			this.position.x += this.speed;
		}
	};

	this.goUp = function() {
		if (this.position.y - this.speed < 0) {
			this.position.y = 0;
		} else {
			this.position.y -= this.speed;
		}
	};

	this.goDown = function() {
		if (this.position.y + this.size.height + this.speed >= Game.HEIGHT) {
			this.position.y = Game.HEIGHT - this.size.height;
		} else {
			this.position.y += this.speed;
		}
	};

	this.move = function() {
		// keyboard
		if (Key.isDown(Key.UP)) {
			this.goUp();
		}
		if (Key.isDown(Key.LEFT)) {
			this.goLeft();
		}
		if (Key.isDown(Key.DOWN)) {
			this.goDown();
		}
		if (Key.isDown(Key.RIGHT)) {
			this.goRight();
		}

		// move (mouse & touch)
		if (Move._position != undefined) {
			if (this.position.x + Move._distance.x >= 0 && this.position.x + Move._distance.x + this.size.width <= Game.WIDTH) {
				this.position.x += Move._distance.x;
			}
			if (this.position.y + Move._distance.y >= 0 && this.position.y + Move._distance.y + this.size.height <= Game.HEIGHT) {
				this.position.y += Move._distance.y;
			}

			// touch
			// if (this.position.x + Touch._distance.x >= 0 && this.position.x + Touch._distance.x + this.size.width <= Game.WIDTH) {
			// 	this.position.x += Touch._distance.x;
			// }
			// if (this.position.y + Touch._distance.y >= 0 && this.position.y + Touch._distance.y + this.size.height <= Game.HEIGHT) {
			// 	this.position.y += Touch._distance.y;
			// }
		}
	};

	this.update = function() {
		// handle move
		this.move();
		// handle fire
		this.autoFire();
		// Elements.autoFire(this);
		// collide
		this.collide();
	};

	this.render = function() {
		Game.Draw.rect(this.position.x, this.position.y, this.size.width, this.size.height, '#ccc');
	};

	this.collide = function() {
		// check enemies
		for(key in Enemies.entities) {
			if ((this.position.x + this.size.width) >= Enemies.entities[key].position.x
				&& this.position.x <= (Enemies.entities[key].position.x + Enemies.entities[key].size.width)
				&& Enemies.entities[key].position.y >= this.position.y
				&& Enemies.entities[key].position.y <= (this.position.y + this.size.height)
				// TODO get the right calcul for y coord
				// && this.position.y >= Enemies.entities[key].position.y && this.position.y <= (Enemies.entities[key].position.y + Enemies.entities[key].size.height)
			) {
				// this.hit(Enemies.entities[key].hit);
				// delete Enemies.entities[Enemies.entities[key].id];
				console.log('Enemy !');
			}
		}
		// check bonuses
		for(key in Bonuses.entities) {
			if ((this.position.x + this.size.width) >= Bonuses.entities[key].position.x
				&& this.position.x <= (Bonuses.entities[key].position.x + Bonuses.entities[key].size.width)
				&& Bonuses.entities[key].position.y >= this.position.y
				&& Bonuses.entities[key].position.y <= (this.position.y + this.size.height)
			) {
				// Bonuses.entities[key].hit(this));
				// delete Bonuses.entities[Bonuses.entities[key].id];
				console.log('Bonus !');
			}
		}
	};
};