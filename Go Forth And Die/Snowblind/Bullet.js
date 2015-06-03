var bullet = function(x,y,moveRight)
{
	this.sprite = new Sprite(bullet.png);
	this.sprite.buildAnimation(1,1,32,32,-1,[0]);
	this.sprite.setAnimationOffset(0,0,0);
	this.sprite.setLoop(0,false);
	
	this.positon = new Vector2();
	this.positon.set(x,y);
	
	this.velocity = new Vector2();
	
	this.moveRight = moveRight;
	if(this.moveRight == true)
		this.velocity.set(MAXDX *2,0);
	else
		this.velocity.set(-MAXDX *2,0);
}
bullet.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	this.positon.x = Math.floor(this.positon.x + (dt * this.velocity.x));
}
bullet.prototype.draw = function()
{
	var screenX = this.positon.x - worldOffsetX;
	this.sprite.draw(context, screenX, this.positon.y);
}