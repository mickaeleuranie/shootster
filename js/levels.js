var Levels = {
	active: 1,
	levelSelected: null,
	startLevel: function(level) {
		var level = new Level(level);
		this.levelSelected = level;
		level.init();
		level.launch();
	},

	update: function() {
		this.levelSelected.update();
	},

	render: function() {

	}
};

var Level = function(level) {
	this.level = level;
	// this.map =
	this.variation = 'top-left';

	this.init = function() {
	};

	this.launch = function() {

		// create ship
		if (Game.playerCount == 1) {
			Game.setOnePLayer();
		};

		// Enemies.Waves.createOne({
		// 	type: 'basic',
		// 	variation: 'top-left',
		// 	count: 3,
		// });

		// create one enemy
		// Enemies.generate();

		// create ship
		// Ships.createOne();

		// TODO generate map

		// TODO generate level's enemies
		// Enemies.update();
		// console.log(Enemies.entities);
	};

	this.launchWave = function(variation) {
		Enemies.Waves.create([{
			type: 'basic',
			variation: variation,
			count: 3,
		}]);
	};

	this.update = function() {
		// create one enemy
		Enemies.generate();

		// if (Enemies.entities.length == 0) {

		// 	Enemies.Waves.create([{
		// 		type: 'basic',
		// 		variation: this.variation,
		// 		count: 3
		// 	}]);

		// 	switch(this.variation) {
		// 		case 'top-left' :
		// 			this.variation = 'top-right';
		// 			break;
		// 		case 'top-right' :
		// 			this.variation = 'top-left';
		// 			break;
		// 		default :
		// 			break;
		// 	}

			// launch multiple waves
			// Enemies.Waves.create([{
			// 	type: 'basic',
			// 	variation: 'top-left',
			// 	count: 3,
			// },{
			// 	type: 'basic',
			// 	variation: 'top-right',
			// 	count: 3,
			// }]);

		// }
	}
}