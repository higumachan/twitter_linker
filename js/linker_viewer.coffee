
color_list =["red", "orange", "green", "blue", "purple"];
icon_size = 40

class UserObjects extends PhysicalObjects
	constructor: () ->
		super();
		@width = 820;
		@height = 500;
		@stage = new Kinetic.Stage("center_area", @width, @height);
		self = this;
		close_down = -> self.mouse_down();
		close_move = -> self.mouse_move();
		close_up = -> self.mouse_up();
		@stage.on("mousedown", close_down);
		@stage.on("mousemove", close_move);
		@stage.on("mouseup", close_up);
		@lines = new Kinetic.Shape(-> 
			"test"
		"background");
		@stage.add(@lines);
	update: () ->
		super();
		@stage.drawShapes();
		@draw_lines();
	find_object: (icon) ->
		for object in @objects
			if (icon == object.icon)
				return (object);
	
	draw_lines: () ->
		context = @lines.getContext();
		context.lineWidth = 4;
		for object in @objects
			for child in object.childs
				context.beginPath();
				context.strokeStyle = "red";
				context.moveTo(object.pos.x + icon_size / 2, object.pos.y + icon_size / 2);
				context.lineTo(child.pos.x + icon_size / 2, child.pos.y + icon_size / 2);
				context.stroke();
	is_duplicate: (name) ->
		for object in @objects
			if (object.name == name)
				return (true);
		return (false);
	is_on_mouse_object: (pos) ->
		for object in @objects
			if (object.pos.x <= pos.x and object.pos.x + icon_size >= pos.x and object.pos .y <= pos.y and object.pos.y + icon_size >= pos.y)
				return (true);
		return (false);
	mouse_down: () ->
		pos = @stage.getMousePos();
		if (@is_on_mouse_object(pos) == true)
			return (0);
		if (stage_drag_state.flag == false)
			stage_drag_state.set(pos);
	mouse_move: () ->
		pos = @stage.getMousePos();
		if (stage_drag_state.flag == true)
			for object in @objects
				v = new Vector(pos.x, pos.y);
				v.sub(stage_drag_state.ago_pos);
				#v.rev();
				object.dest.add(v);
			stage_drag_state.update(new Vector( pos.x, pos.y));
	mouse_up: () ->
		stage_drag_state.unset();


class UserObject extends PhysicalObject
	constructor: (pos, dest, name, parent) ->
		super(pos, dest);
		@start_pos = new Vector(pos.x, pos.y);
		@name = name;
		@parent = parent;
		@childs = [];
		@init();
	update: () ->
		super();
		@icon.x += @velocity.x;
		@icon.y += @velocity.y;
		if (@is_moving())
			@icon.draggable(false);
		else
			@icon.draggable(true);
		

	draw: () ->
		alert("test");

	click: () ->
		v = drag_state.get_drag_vector();
		x = @pos.x;
		y = @pos.y;
		if (v.size() < 3)
			self = this;
			$.getJSON("/cgi-bin/linker.py", {"username": @name}, (json) ->
				users = json.users;
				random_radian = Math.random() * 2 * Math.PI;
				count = json.users.length;
				r = 100;
				for user,i in users
					if (userobjects.is_duplicate(user) == false)
						nx = x + (Math.cos((2 * Math.PI / count) * i + random_radian) * r);
						ny = y + (Math.sin((2 * Math.PI / count) * i + random_radian) * r);
						v = new Vector(nx, ny);
						s = new Vector(self.pos.x, self.pos.y);
						add = new UserObject(s, v, user, self);
						self.childs.push(add);
						userobjects.append(add);
			)
	dbclick: () ->
		window.open("https://twitter.com/#!/" + @name);
		
	mouseover: () ->
		console.log(@name);

	mouseout: () ->
		console.log(@name);
	dragstart: () ->
		if (drag_state.flag == false)
			drag_state.set(userobjects.stage.getMousePos());
			@icon.moveToTop();
	dragend: () ->
		@pos.x = (@start_pos.x + @icon.x);
		@pos.y = (@start_pos.y + @icon.y);
		@dest.x = (@start_pos.x + @icon.x);
		@dest.y = (@start_pos.y + @icon.y);
		#@icon.x = (@pos.x - @start_pos.x);
		#@icon.y = (@pos.y - @start_pos.y);
		drag_state.unset();
		console.log(@icon.x, @icon.y);
	mousemove: () ->
		if (drag_state.flag == true)
			pos = userobjects.stage.getMousePos();
			vec = new Vector(pos.x, pos.y);
			vec.sub(drag_state.ago_pos);
			@dragger_move(vec);
			drag_state.update(new Vector(pos.x, pos.y));
	
	dragger_move: (vector) ->
		@pos.add(vector);
		@dest.add(vector);
		for child in @childs
			child.move(vector);
	
	move: (vector) ->
		@dest.add(vector);
		for child in @childs
			child.move(vector);
		
	init: () ->
		image = new Image();
		image.onerror = =>
			this.src =  "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=pinkroot";
		image.src =   "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=" + @name;
		@icon = new Kinetic.Image(
			image: image
			x: @pos.x;
			y: @pos.y;
			width: 40;
			height: 40;
		)
		self = this;
		close_click = -> self.click();
		close_dbclick = -> self.dbclick();
		close_mouseover = -> self.mouseover();
		close_mouseout = -> self.mouseout();
		close_dragstart = -> self.dragstart();
		close_dragend = -> self.dragend();
		close_mousemove = -> self.mousemove();
		@icon.on("click", close_click);
		@icon.on("dblclick", close_dbclick);
		@icon.on("mouserober", close_mouseover);
		@icon.on("mouseout", close_mouseout);
		@icon.on("dragstart", close_dragstart);
		@icon.on("dragend", close_dragend);
		@icon.on("mousemove", close_mousemove);
		@icon.draggable(true);
		userobjects.stage.add(@icon);



class DragState
	constructor: () ->
		@flag = false;
	set: (pos) ->
		@start_pos = new Vector(pos.x, pos.y);
		@flag = true;
		@ago_pos = new Vector(pos.x, pos.y);
	update: (pos) ->
		@ago_pos = pos;
	unset: () ->
		@flag = false;
	get_drag_vector: () ->
		result = new Vector(@start_pos.x, @start_pos.y);
		result.sub(@ago_pos);
		return (result);

drag_state = new DragState();
stage_drag_state = new DragState();
userobjects = 0;
window.onload = -> 
	userobjects = new UserObjects();
	start_pos = new Vector(userobjects.width / 2, userobjects.height / 2);
	root_user = new UserObject(start_pos, new Vector(start_pos.x, start_pos.y), "pinkroot", "root");
	userobjects.append(root_user);
	
	self_update = userobjects;
	close_update = -> self_update.update();
	setInterval(close_update, 100);
	
