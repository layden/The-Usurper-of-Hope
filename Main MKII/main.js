var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();


function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();


	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	

	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}



var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;



var fps = 0;
var fpsCount = 0;
var fpsTime = 0;


var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var player = new Player();

var keyboard = new Keyboard();

var bad = new Bad();

var LAYER_COUNT = 5;

var LAYER_BACKGROUND = 0

var LAYER_HAZARD = 1

var LAYER_END = 2

var LAYER_FLOOR = 3

var LAYER_LADDER = 4

var MAP = {tw:200,th:50};

var TILE = 35;

var TILESET_TILE = TILE * 2;

var TILESET_PADDING = 2;

var TILESET_SPACING = 2;

var TILESET_COUNT_X = 14;

var TILESET_COUNT_Y = 14; 

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var cells = [];

var METER = TILE;

var GRAVITY = METER * 9.8 * 6;

var MAXDX = METER * 10;

var MAXDY = METER * 2;

var FRCTION = MAXDX * 6;

var JUMP = METER * 1500;


function initialize(){
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++){
		cells[layerIdx] = [];
		var idx = 0;
		for (var y = 0; y < Boots1.layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for(var x = 0; x < Boots1.layers[layerIdx].width; x++) {
			if(Boots1.layers[layerIdx].data[idx] != 0) {
				
				cells[layerIdx][y][x] = 1;
				cells[layerIdx][y-1][x] = 1;
				cells[layerIdx][y-1][x+1] = 1;
				cells[layerIdx][y][x+1] = 1;
			}
			else if(cells[layerIdx][y][x] !=1){
				cells[layerIdx][y][x] = 0;
			}
			idx++;
			}
		}
	}
}

function cellAtPixelCoord(layer, x,y)
{
	if(x<0 || x>SCREEN_WIDTH || y<0)
		return 1;
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer,p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx<0 || tx>MAP.tw || ty<0)
		return 1;
	if(ty>=MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

function drawMap()
{
	for(var layerIdx=0;layerIdx<LAYER_COUNT;layerIdx++)
	{
		var idx=0;
		for( var y=0;y<Boots1.layers[layerIdx].height;y++)
		{
			for( var x=0;x<Boots1.layers[layerIdx].width;x++)
			{
				if(Boots1.layers[layerIdx].data[idx]!=0)
				{
					var tileIndex = Boots1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex%TILESET_COUNT_X)*(TILESET_TILE+TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_Y))*(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset,sx,sy,TILESET_TILE,TILESET_TILE,x*TILE,(y-1)*TILE,TILESET_TILE,TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

function run()
{
	


	
	context.fillStyle = "#000000";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	player.draw();
	
    //bad.update(deltaTime);
	//bad.draw();
	
	drawMap();

	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		

	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}


initialize();


(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
