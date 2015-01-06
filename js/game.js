
// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(e){
	return window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
})();

var Game = {

	// initial values
	NAME: 'SHOOTSTER',
	WIDTH: 300,
	HEIGHT: 480,
	RATIO: null,
	currentWidth: null,
	currentHeight: null,
	canvas: null,
	ctx: null,
	userAgent: null,
	android: null,
	ios: null,
	ie: null,
	// initial scale according to initial values
	scale: 1,
	// canvas' position
	offset: {top: 0, left: 0},
	hole: {x: 0, y: 0},
	// game status
	status: null,
	// game's statuses
	statuses: {
		HOME: 'home',
		WAITING: 'waiting',
		RUNNING: 'running',
		PAUSED: 'paused',
		END: 'end'
	},

	// set initial values for first start and game reset
	setInitialValues: function() {
		this.RATIO = null;
		this.currentWidth = null;
		this.currentHeight = null;
		this.canvas = null;
		this.ctx = null;
		this.userAgent = null;
		this.android = null;
		this.ios = null;
		this.scale = 1;
		this.offset = {top: 0, left: 0};

		// the proportion of width to height
		this.RATIO = this.WIDTH / this.HEIGHT;

		// these will change when the screen is resized
		this.currentWidth = this.WIDTH;
		this.currentHeight = this.HEIGHT;

		// this is our canvas element
		this.canvas = document.getElementsByTagName('canvas')[0];

		// setting this is important
		// otherwise the browser will
		// default to 320 x 200
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

		// set water height
		this.waterHeight = this.HEIGHT;

		// the canvas context enables us to
		// interact with the canvas api
		this.ctx = this.canvas.getContext('2d');

		// we need to sniff out Android and IOS
		// so that we can hide the address bar in our resize function
		this.userAgent = navigator.userAgent.toLowerCase();
		this.android = this.userAgent.indexOf('android') > -1 ? true : false;
		this.ios = ( this.userAgent.indexOf('iphone') > -1 || this.userAgent.indexOf('ipad') > -1 ) ? true : false;

		// to know if we use IE
		this.ie = document.all;

		// game's variables
		this.playerCount = 1;

		// set initial status
		// TODO display start menu
		// this.status = this.statuses.HOME;
		this.status = this.statuses.RUNNING;

		if (this.ie) {
			this.setEventsIE();
		} else {
			this.setEvents();
		}
	},

	setEventsIE: function() {
		// listen for clicks
		this.canvas.attachEvent('onclick', function(e) {
			// Game.touchEvents(e);
			e.preventDefault();
		});

		// listen for keyboard
		window.attachEvent('onkeyup', function (e){
			Key.onKeyup(e);
		});
		window.attachEvent('onkeydown', function (e){
			Key.onKeydown(e);
		});

		// listen for touches
		this.canvas.attachEvent('ontouchstart', function(e) {
			e.preventDefault();
			Move.setPosition(e.changedTouches[0]);
		});

		this.canvas.attachEvent('ontouchmove', function(e) {
			// Game.touchEvents(e);
			e.preventDefault();
			Move.setDistance(e.changedTouches[0]);
			Move.setPosition(e.changedTouches[0]);
		});

		this.canvas.attachEvent('ontouchend', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		});

		this.canvas.attachEvent('ontouchleave', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		});

		this.canvas.attachEvent('ontouchcancel', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		});

		this.canvas.attachEvent('onmousemove', function(e) {
			// as above
			e.preventDefault();
			Move.handleMove(e);
		});

		this.canvas.attachEvent('onmousemoveout', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		});
	},

	setEvents: function() {
		// listen for clicks
		this.canvas.addEventListener('click', function(e) {
			// Game.touchEvents(e);
			console.log(e);
			e.preventDefault();
		}, false);

		// listen for keyboard
		window.addEventListener('keyup', function (e){
			e.preventDefault();
			Key.onKeyup(e);
		}, false);
		window.addEventListener('keydown', function (e){
			e.preventDefault();
			Key.onKeydown(e);
		}, false);

		// listen for touches
		this.canvas.addEventListener('touchstart', function(e) {
			e.preventDefault();
			Move.setPosition(e.changedTouches[0]);
		}, false);

		this.canvas.addEventListener('touchmove', function(e) {
			// Game.touchEvents(e);
			e.preventDefault();
			Move.setDistance(e.changedTouches[0]);
			Move.setPosition(e.changedTouches[0]);
		}, false);

		this.canvas.addEventListener('touchend', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		}, false);

		this.canvas.addEventListener('touchleave', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		}, false);

		this.canvas.addEventListener('touchcancel', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		}, false);

		this.canvas.addEventListener('mousemove', function(e) {
			// as above
			e.preventDefault();
			Move.handleMove(e);
		}, false);

		this.canvas.addEventListener('mouseout', function(e) {
			// as above
			e.preventDefault();
			Move.resetPoint();
		}, false);
	},

	touchEvents: function(e){
		e.preventDefault();
		// since i like to test with a mouse, but still have it work with touch devices.
		if (e.targetTouches == undefined) {
			return;
		}
		e = e.targetTouches[0];
		// change cursor position if event on canvas
		if (e.x >= Game.canvas.offsetLeft && e.x <= Game.canvas.offsetLeft + Game.currentWidth) {
			this.hole.x = (e.x - Game.canvas.offsetLeft);
			this.hole.y = e.y;
			console.log(e.x);
			console.log(e.x - Game.canvas.offsetLeft);
		}
			// console.log(e);
			// console.log(this.hole);
	},

	setOnePLayer: function() {
		var ship = Ships.createOne();
		ship.init();
	},

	init: function() {

		// reinitialize values
		Game.setInitialValues();

		// resize canvas
		Game.resize();

		// fist level
		Levels.startLevel(1);

		// game loop
		Game.loop();

	},

	resize: function() {

		Game.currentHeight = window.innerHeight;
		Game.waterHeightInitial = Game.currentHeight;

		// resize the width in proportion
		// to the new height
		Game.currentWidth = Game.currentHeight * Game.RATIO;

		// GAME will create some extra space on the page,
		// allowing us to scroll past the address bar, thus hiding it
		if(Game.android || Game.ios) {
			document.body.style.height = (window.innerHeight + 50) + 'px';
		}

		// set the canvas style width and height
		// note : our canvas is still 320 x 480,
		// but we're essentially scaling it with CSS
		Game.canvas.style.width = Game.currentWidth + 'px';
		Game.scale = Game.currentWidth / Game.WIDTH;
		Game.offset.top = Game.canvas.offsetTop;
		// TODO FIX left offset at first resize
		Game.offset.left = Game.canvas.offsetLeft;

		// we use a timeout here because some mobile browsers
		// don't fire if there is not a short delay
		window.setTimeout(function() {
			window.scrollTo(0, 1);
		}, 1);
	},

	update: function() {
		Ships.update();
		Enemies.update();
		Enemies.Waves.update();
		Missiles.update();
		Bonuses.update();
		Levels.update();
	},

	render: function() {
		// clear canvas
		Game.Draw.clear();
		// TODO
		// if in game reder level background
		// else render menu
		Game.Draw.rect(0, 0, Game.WIDTH, Game.HEIGHT, "#fff");
		// render all ships
		Ships.render();
		// render enemies
		Enemies.render();
		// render missiles
		Missiles.render();
		// render bonuses
		Bonuses.render();
		// levels
		Levels.render();
		// TODO
	},

	loop: function() {
		requestAnimFrame(Game.loop);
		if (Game.status == Game.statuses.RUNNING) {
			Game.update();
			Game.render();
		}
		// start menu
		// else if (Game.status == Game.statuses.HOME) {
		// 	Menus.display(Game.status);
		// }
	}

};

Game.Draw = {

	clear: function() {
		Game.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
	},

	rect: function(x, y, w, h, col) {
		Game.ctx.fillStyle = col;
		Game.ctx.fillRect(x, y, w, h);
	},

	circle: function(x, y, r, col) {
		Game.ctx.fillStyle = col;
		Game.ctx.beginPath();
		Game.ctx.arc(x + 5, y + 5, r, 0, Math.PI * 2, true);
		Game.ctx.closePath();
		Game.ctx.fill();
	},

	text: function(string, x, y, size, col) {
		Game.ctx.font = 'bold '+size+'px Monospace';
		Game.ctx.fillStyle = col;
		Game.ctx.fillText(string, x, y);
	}

};

Game.Input = {
	x: 0,
	y: 0,
	tapped: false,

	set: function(data) {

		this.x = (data.pageX - Game.offset.left) / Game.scale;
		this.y = (data.pageY - Game.offset.top) / Game.scale;
		this.tapped = true;

		// Game.Draw.circle(this.x, this.y, 10, 'red');
	}
};

Game.Functions = {
	microtime: function (get_as_float) {
		// From: http://phpjs.org/functions
		// +  original by: Paulo Freitas
		// *   example 1: timeStamp = microtime(true);
		// *   example 1: timeStamp > 1000000000 && timeStamp < 2000000000
		// *   returns 1: true
		var now = new Date().getTime() / 1000;
		var s = parseInt(now, 10);

		return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
	}
}

// handle move (mouse & touch)
var Move = {
	_position: null,
	_distance: {
		x: 0,
		y: 0
	},

	handleMove: function(e) {
		if (this._position == null) {
			this.setPosition(e);
		} else {
			this.setDistance(e);
			this.setPosition(e);
		}
	},

	setPosition: function(e) {
		this._position = {
			x: parseInt((e.clientX - Game.offset.left) / Game.scale),
			y: parseInt((e.clientY - Game.offset.top) / Game.scale)
		}
	},

	resetPoint: function() {
		this._position = null;

		this._distance = {
			x: 0,
			y: 0
		}
	},

	setDistance: function(e) {
		this._distance = {
			x: parseInt((e.clientX - Game.offset.left) / Game.scale) - this._position.x,
			y: parseInt((e.clientY - Game.offset.top) / Game.scale) - this._position.y
		}
	}
}

// handle touch
var Touch = {
	_position: {
		x: 0,
		y: 0
	},
	_distance: {
		x: 0,
		y: 0
	},

	setPosition: function(e) {
		this._position = {
			x: e.clientX,
			y: e.clientY
		}
	},

	resetPoint: function() {
		this._position = {
			x: 0,
			y: 0
		};

		this._distance = {
			x: 0,
			y: 0
		}
	},

	setDistance: function(e) {
		this._distance = {
			x: parseInt(e.clientX) - this._position.x,
			y: parseInt(e.clientY) - this._position.y
		}
	}
}

var Key = {
	_active: {},
	// store executed key (to avoid continuous use by keeping pushing button)
	_executed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	SPACE: 32,

	isDown: function(keyCode) {
		return this._active[keyCode];
	},

	isExecuted: function(keyCode) {
		return this._executed[keyCode];
	},

	onKeydown: function(event) {
		this._active[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._active[event.keyCode];
		if (this._executed[event.keyCode] != undefined) {
			delete this._executed[event.keyCode];
		}
	},

	onExecution: function(keyCode) {
		this._executed[keyCode] = true;
	}
};

window.addEventListener('load', Game.init, false);
window.addEventListener('resize', Game.resize, false);