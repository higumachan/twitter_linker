
color_list =["red", "orange", "green", "blue", "purple"];
color_count = color_list.length;
icon_size = 40

class UserObjects extends PhysicalObjects
	constructor: () ->
		super();
		@width = 1024;
		@height = 780;
		@stage = new Kinetic.Stage("linker_area", @width, @height);
		self = this;
		close_down = -> self.mouse_down();
		close_move = -> self.mouse_move();
		close_up = -> self.mouse_up();
		@stage.on("mousedown", close_down);
		@stage.on("mousemove", close_move);
		@stage.on("mouseup", close_up);
		@user_layer = new Kinetic.Layer();
		@line_layer = new Kinetic.Layer();
		@stage.add(@line_layer);
		@stage.add(@user_layer);
	update: () ->
		super();
		@stage.draw();
		@draw_lines();
	find_object: (icon) ->
		for object in @objects
			if (icon == object.icon)
				return (object);
	
	draw_lines: () ->
		context = @line_layer.getContext();
		context.lineWidth = 4;
		for object in @objects
			for child in object.childs
				context.beginPath();
				context.strokeStyle = color_list[object.depth % color_count];
				context.moveTo(object.pos.x + icon_size / 2, object.pos.y + icon_size / 2);
				context.lineTo(child.pos.x + icon_size / 2, child.pos.y + icon_size / 2);
				context.stroke();
			for link in object.links
				context.beginPath();
				context.strokeStyle = color_list[object.depth % color_count];
				context.moveTo(object.pos.x + icon_size / 2, object.pos.y + icon_size / 2);
				context.lineTo(link.pos.x + icon_size / 2, link.pos.y + icon_size / 2);
				context.stroke();
	is_duplicate: (name) ->
		for object in @objects
			if (object.name == name)
				return (true);
		return (false);

	get_duplicate: (name) ->
		for object in @objects
			if (object.name == name)
				return (object);
		return (false);
	is_on_mouse_object: (pos) ->
		for object in @objects
			if (object.pos.x <= pos.x and object.pos.x + icon_size >= pos.x and object.pos .y <= pos.y and object.pos.y + icon_size >= pos.y)
				return (true);
		return (false);
	mouse_down: () ->
		pos = @stage.getMousePosition();
		if (@is_on_mouse_object(pos) == true)
			return (0);
		if (stage_drag_state.flag == false)
			stage_drag_state.set(pos);
	mouse_move: () ->
		pos = @stage.getMousePosition();
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
	constructor: (pos, dest, name, parent, depth) ->
		super(pos, dest);
		@links = [];
		@start_pos = new Vector(pos.x, pos.y);
		@name = name;
		@parent = parent;
		@childs = [];
		@depth = depth;
		@init();
	update: () ->
		super();
		@icon.x += @velocity.x;
		@icon.y += @velocity.y;

	draw: () ->
		alert("test");

	click: () ->
		x = @dest.x;
		y = @dest.y;
		self = this;
		change_size = ->
			self.icon.setWidth(icon_size);
			self.icon.setHeight(icon_size);
			userobjects.stage.draw();
		$.getJSON("/cgi-bin/linker.py", {"username": @name}, (json) ->
			self.icon.setWidth(50);
			self.icon.setHeight(50);
			userobjects.stage.draw();
			setTimeout(change_size, 300);
			users = json.users;
			random_radian = Math.random() * 2 * Math.PI;
			count = json.users.length;
			r = 200;
			for user,i in users
				if (userobjects.is_duplicate(user) == false)
					nx = x + (Math.cos((2 * Math.PI / count) * i + random_radian) * r);
					ny = y + (Math.sin((2 * Math.PI / count) * i + random_radian) * r);
					v = new Vector(nx, ny);
					s = new Vector(self.dest.x, self.dest.y);
					add = new UserObject(s, v, user, self, self.depth + 1);
					console.log(add);
					self.childs.push(add);
					userobjects.append(add);
					#add.click();
				else
					self.links.push(userobjects.get_duplicate(user));
		)
	dbclick: () ->
		window.open("https://twitter.com/#!/" + @name);
		
	mouseover: () ->
		console.log(@name);

	mouseout: () ->
		console.log(@name);
	dragstart: () ->
		if (drag_state.flag == false)
			drag_state.set(userobjects.stage.getMousePosition());
			@icon.moveToTop();
	dragend: () ->
		drag_state.unset();
		console.log(@icon.x, @icon.y);
	dragmove: () ->
		if (drag_state.flag == true)
			@pos.x = @icon.x;
			@pos.y = @icon.y;
			@dest.x = @icon.x;
			@dest.y = @icon.y;
			pos = userobjects.stage.getMousePosition();
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
		image.onerror = ->
			@src =  "/img/notfound.jpg";
		try
			image.src =   "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=" + @name;
		catch e
			alert(e);
		@icon = new Kinetic.Image(
			image: image
			x: @pos.x;
			y: @pos.y;
			width: icon_size;
			height: icon_size;
		)
		self = this;
		close_click = -> self.click();
		close_dbclick = -> self.dbclick();
		close_mouseover = -> self.mouseover();
		close_mouseout = -> self.mouseout();
		close_dragstart = -> self.dragstart();
		close_dragend = -> self.dragend();
		close_dragmove = -> self.dragmove();
		@icon.on("click", close_click);
		@icon.on("dblclick", close_dbclick);
		@icon.on("mouserober", close_mouseover);
		@icon.on("mouseout", close_mouseout);
		@icon.on("dragstart", close_dragstart);
		@icon.on("dragend", close_dragend);
		@icon.on("dragmove", close_dragmove);
		@icon.draggable(true);
		userobjects.user_layer.add(@icon);



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
	root_user = new UserObject(start_pos, new Vector(start_pos.x, start_pos.y), "pinkroot", "root", 0);
	userobjects.append(root_user);
	
	self_update = userobjects;
	close_update = -> self_update.update();
	setInterval(close_update, 100);
	
