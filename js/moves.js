var Moves = function(enemy) {
	this.enemy = enemy;
	// start at 1/3
	// go down to half height
	// then go left
	this.basic = function(variation) {
		if (variation == undefined) {
			variation = 'top-left';
		}

		switch(variation) {
			case 'top-right' :
			// console.log(this.enemy.speed);
				if (this.enemy.position.y <= Game.HEIGHT / 2
					&& this.enemy.direction.y == 1
				) {
					this.enemy.position.y += this.enemy.speed.y;
				} else if (this.enemy.position.y > Game.HEIGHT / 2) {
					this.enemy.position.x += this.enemy.speed.x;
				} else if (this.enemy.position.y > Game.HEIGHT / 2
					&& this.enemy.direction.y == -1
				) {
					this.enemy.direction.y = -1
				}
				break;
			case 'top-left' :
			default:
				if (this.enemy.position.y <= Game.HEIGHT / 2 && this.enemy.direction.y == 1) {
					this.enemy.position.y += this.enemy.speed.y;
				} else if (this.enemy.position.y > Game.HEIGHT / 2) {
					this.enemy.position.x -= this.enemy.speed.x;
				} else if (this.enemy.position.y > Game.HEIGHT / 2 && this.enemy.direction.y == -1 ) {
					this.enemy.direction.y = -1
				}
				break;
		}
	}
}