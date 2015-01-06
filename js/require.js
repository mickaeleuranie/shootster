function include(fileName){
	document.write("<script type='text/javascript' src='./js/"+fileName+".js'></script>" );
}

var files = [
	'game',
	'ships',
	'enemies',
	'missiles',
	'weapons',
	'levels',
	'bonuses',
	'moves',
	'elements',
	// levels
	'levels/level1'
];
for (var i = 0; i < files.length; i++) {
	include(files[i]);
}