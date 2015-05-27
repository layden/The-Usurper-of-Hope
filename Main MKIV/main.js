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

var STATE_INTRO = 0;	

var STATE_GAME = 1;

var STATE_END = 2;

var STATE_DEFEAT = 3;

var STATE_INFO = 4;

var gameState = STATE_INTRO;

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;



var fps = 0;
var fpsCount = 0;
var fpsTime = 0;


var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";


var keyboard = new Keyboard();

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var yetis = [];

var LAYER_COUNT = 4;

var LAYER_BACKGROUND = 0

var LAYER_HAZARD = 1

var LAYER_EXIT = 2

var LAYER_FLOOR = 3

var LAYER_OBJECT_YETI = 4;
var LAYER_OBJECT_TRIGGERS = 5;

var introTimer = 5;

var infoTimer = 7;

var defeatTimer = 3600;

var Heart = document.createElement("img");
Heart.src = "heart.png"

var Snow = document.createElement("img");
Snow.src = "Snow.png";

var Defeat = document.createElement("img");
Defeat.src = "Death.png"

var Info = document.createElement("img");
Info.src = "text.png"

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var x = 10;
var y = 10;

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

var MAXDX = METER * 7;

var MAXDY = METER * 20;

var FRCTION = MAXDX * 6;

var ACCEL = MAXDX * 2;

var JUMP = METER * 1500;

var GRAVITY = METER * 9.8 * 6;

var score = 0;

var lives = 3;

var musicBackgroud;

var sfxFire;

var player = new Player();

function runIntro(deltaTime)
{
	introTimer -= deltaTime;
	if(introTimer <= 0)
	{
		gameState = STATE_INFO;
		return;
	}
	
	context.drawImage(Snow, x, y);
	
}

function runInfo(deltaTime)
{
	infoTimer -= deltaTime;
	if(infoTimer <= 0)
	{
		gameState = STATE_GAME;
		return;
	}
	context.drawImage(Info, x, y)
}

function runGame(deltaTime)
{
	
		
	player.update(deltaTime);
	
	
 drawMap();
	
	player.draw();
	
	Yeti.draw();
	
	for(var i=0; i<yetis.length; i++)
	{
		yetis[i].update(deltaTime);
	}
	
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
		
		context.fillStyle = "red";
		context.font="32px motorhead";
		var scoreText = "Score: " + score;
		context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
		
		for(var i=0; i<lives; i++)
		{
			context.drawImage(Heart, 10 + ((Heart.width+2)*i), 10);
		}

	context.fillStyle = "#f00";
	context.font="14px motorhead";
	context.fillText("FPS: " + fps,  15, 740);
	
	defeatTimer -= deltaTime;
	if(defeatTimer <=0)
	{
		gameState = STATE_DEFEAT;
		return;
	}
}

function runEnd(deltaTime)
{
	
}

function runDefeat(deltaTime)
{
	
	context.drawImage(Defeat, x, y);
	
}

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
	
	  idx = 0;
  for(var y = 0; y < Boots1.layers[LAYER_OBJECT_YETI].height; y++) {
	  for(var x = 0; x < Boots1.layers[LAYER_OBJECT_YETI].width; x++){
		  if(Boots1.layers[LAYER_OBJECT_YETI].data[idx] != 0) {
			  var px = tileToPixel(x);
			  var py = tileToPixel(y);
			  var e = new Yeti(px,py);
			  yetis.push(e);
		  }
		  idx++;
	  }
  }
	
	musicBackgroud = new Howl (
	{
		urls: ["Snowblind.ogg"],
		loop: true,
		buffer: true,
		volume: 0.5
	});
	musicBackgroud.play();
	
	sfxFire = new Howl(
	{
		urls:["dethbleep.ogg"],
		buffer: true,
		volume: 1,
		onend: function(){
			isSfxPlaying = false;
		}
	});
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
var worldOffsetX =0;
function drawMap()
{
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	
	var tileX = pixelToTile(player.position.x);
	
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	
	startX = tileX - Math.floor(maxTiles / 2);
	
	if(startX < -1)
	{
		startX = 0;
		offsetX = 0;
	}
	if(startX > MAP.tw - maxTiles)
	{
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}
	worldOffsetX = startX * TILE + offsetX;
	
for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ )
{
for( var y = 0; y < Boots1.layers[layerIdx].height; y++ )
{
var idx = y * Boots1.layers[layerIdx].width + startX;
for( var x = startX; x < startX + maxTiles; x++ )
{
if( Boots1.layers[layerIdx].data[idx] != 0 )
{

var tileIndex = Boots1.layers[layerIdx].data[idx] - 1;
var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
(TILESET_TILE + TILESET_SPACING);
var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) *
(TILESET_TILE + TILESET_SPACING);
context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
}
idx++;
}
}
}
}

function run()
{
	


	
	context.fillStyle = "#F0F8FF";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_INTRO:
		runIntro(deltaTime);
		break;
		case STATE_GAME:
		runGame(deltaTime);
		break;
		case STATE_END:
		runEnd(deltaTime);
		break;
		case STATE_DEFEAT:
		runDefeat(deltaTime);
		break;
		case STATE_INFO:
		runInfo(deltaTime);
		break;
	}

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
