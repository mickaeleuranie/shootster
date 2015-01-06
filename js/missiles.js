var Missiles = {

	entities: [],

	/**
	 * Create new missile
	 *
	 * @param integer shipId Ship identifier
	 * @param Object position Missile initial position
	 * @param Object direction Missile direction
	 */
	createOne: function() {
		var missile = new Missile();
		// missile.init(shipId, position, direction);
		// console.log(missile);
		// console.log(this.entities);
		Missiles.entities.push(missile);
		return missile;
	},

	update: function() {
		var toRemove = [];
		// console.log(this.entities.length);
		for (var i = 0; i < this.entities.length; i++) {
			if (Elements.isOutOfScreen(this.entities[i]) || this.entities[i].collide()) {
				toRemove.push(i);
			}
			this.entities[i].update();
		};
		// TODO search why toRemove remain to 1 missile
		for (var j = 0; j < toRemove.length; j++) {
			this.entities.splice(toRemove[j], 1);
		}
	},

	render: function() {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	}
};

var Missile = function() {
	this.id = 'missile' + (Game.Functions.microtime(true));
	this.speed = {
		x: 0,
		y: 5
	};
	this.size = {
		width: 5,
		height: 5
	};
	this.position = {
		x: 0,
		y: 0
	};
	this.target = null;	// player or ennemies
	this.toRemove = false;
	this.damage = 0;
	this.place = null;

	// this.init = function(settings) {
	// 	if (settings != undefined && settings.position != undefined) {this.position = settings.position;}
	// 	if (settings != undefined && settings.size != undefined) {this.size = settings.size;}
	// 	if (settings != undefined && settings.speed != undefined) {this.speed = settings.speed;}
	// 	if (settings != undefined && settings.target != undefined) {this.target = settings.target;}
	// 	if (settings != undefined && settings.size != undefined) {this.size = settings.size;}
	// 	if (settings != undefined && settings.damage != undefined) {this.damage = settings.damage;}
	// 	if (settings != undefined && settings.place != undefined) {this.place = settings.place;}
	// };

	this.update = function() {
		this.position.x += this.speed.x;
		this.position.y += this.speed.y;
	};

	this.render = function() {
		// render missiles
		Game.Draw.rect(this.position.x, this.position.y, this.size.width, this.size.height, '#000');
	};

	this.collide = function() {
		if (this.target == 'enemies') {
			for(key in Enemies.entities) {
				if ((this.position.x + this.size.width) >= Enemies.entities[key].position.x
					&& this.position.x <= (Enemies.entities[key].position.x + Enemies.entities[key].size.width)
					// TODO get the right calcul for y coord
					&& this.position.y >= Enemies.entities[key].position.y
					&& this.position.y <= (Enemies.entities[key].position.y + Enemies.entities[key].size.height)
					// check air or ground
					&& this.place === Enemies.entities[key].place
				) {
					console.log(this.place+'-'+Enemies.entities[key].place);
					Enemies.entities[key].hit(this);
					// delete Enemies.entities[Enemies.entities[key].id];
					return true;
				}
			}
		}
		return false;
	};

};