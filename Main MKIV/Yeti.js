var LEFT = 0;
var RIGHT = 1;
	


var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
   //var ANIM_SHOOT_LEFT = 3;
   //var ANIM_CLIMB = 4;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
   //var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 6;

var Yeti = function(x, y) 
{
	this.sprite = new Sprite("Yeti.png");
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3, [0,1]);
	this.sprite.setAnimationOffset(0, -35, -40);
	
	this.position = new Vector2();
	this.position.set(x,y);
	
	this.velocity = new Vector2();
	
	this.moveRight = true;
	this.pause = 0;
};



Yeti.prototype.update = function(deltaTime)
{
this.sprite.update(deltaTime);

if(this.pause > 0)
{
	this.pause -= deltaTime;
}
else{
	var ddx = 0;
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE;
	var ny = (this.position.y)%TILE;
	var cell = cellAtTileCoord(LAYER_FLOOR, tx, ty);
	var cellright = cellAtTileCoord(LAYER_FLOOR, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_FLOOR,tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_FLOOR, tx + 1, ty + 1);
	
	if(this.moveRight)
	{
		if(celldiag && !cellright) {
			ddx = ddx + YETI_ACCEL;
		}
		else {
			this.velocity.x = 0;
			this.moveRight = false;
			this.pause = 0.5;
		}
	}
	
	if(!this.moveRight)
	{
		if(celldown && !cell) {
			ddx = ddx - ENEMY_ACCEL;
		}
		else {
			this.velocity.x = 0;
			this.moveRight = true;
			this.pause = 0.5;
		}
	}
	this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (dt * ddx),
	-ENEMY_MAXDX, ENEMY_MAXDX);
}
}



Yeti.prototype.draw = function()
{

this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);

	
}