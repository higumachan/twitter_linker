class Vector
	constructor:(x, y) ->
		@x = x;
		@y = y;
	rev: () ->
		@x = -@x;
		@y = -@y;

	add: (v) ->
		@x += v.x;
		@y += v.y;
	sub: (v) ->
		@x -= v.x;
		@y -= v.y;
	mul: (k) ->
		@x *= k;
		@y *= k;
	div: (k) ->
		@x *= (1.0 / k);
		@y *= (1.0 / k);
	size: () ->
		return (Math.sqrt(@x * @x + @y * @y));
	scale: () ->
		@div(@size());
	


class PhysicalObjects
	constructor: () ->
		@objects = [];
	update: () ->
		for object in @objects
			object.update();
	
	draw: () ->
		for object in @objects
			object.draw();
	
	append: (physical_object) ->
		@objects.push(physical_object);

class PhysicalObject
	constructor: (pos, dest) -> 
		@pos = pos;
		@dest = dest;
		@speed = 0.06;
		@velocity = new Vector(0, 0);

	set_dist_pos: (pos) ->
		@dest = pos;
	
	update: () ->
		@acceralated();
		@pos.x += @velocity.x;
		@pos.y += @velocity.y;
	
	acceralated: () ->
		@velocity.x += (@dest.x - @pos.x) * @speed;
		@velocity.y += (@dest.y - @pos.y) * @speed;
		floor_friction = new Vector(@velocity.x, @velocity.y);
		floor_friction.rev();
		floor_friction.mul(0.09);
		@velocity.add(floor_friction);
	
	draw: () ->
		alert("override please");

	is_moving: () ->
		dist = new Vector(@pos.x, @pos.y);
		dist.sub(@dest);
		return (dist.size() > 15);
	print: () ->
		console.log("#{@pos.x}, #{@pos.y}");
	
