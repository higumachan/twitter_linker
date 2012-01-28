var debug = true;

function myalert(str) {
	if (debug == true){
		alert(str);
	}
}

function GetUserName() {
	var query = window.location.search.substring(1);
	var pos = query.indexOf('=');

	return (query.substring(pos + 1));
}

window.onload = function () {
	var icon_size = 40;
	var width = 820;
	var height = 500;
	//var width = window.innerWidth / 100 * 80;
	//var height = window.innerHeight / 100 * 80;
	var size = 40;
	var stage = new Kinetic.Stage("center_area", width, height);
	var lines = new Kinetic.Shape(function () {}, "background");
	var base_x = 0;
	var base_y = 0;
	var drag_ago_pos;
	var drag_start_pos;
	var drag_start_user;
	var stage_drag_start;
	var stage_drag_flag = false;
	var drag_start_flag = false;
	var image = new Image();
	var icon_base = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=";
	var users = [];
	var r = 120;
	var color_list = ["red", "orange", "green", "blue", "purple"];;
	var comment_area = new Kinetic.Shape(function(){
			var context = this.getContext();
			context.beginPath();
			context.fillStyle = "black";
			context.fillRect(5, 5, 200, 400);
			context.font = "14pt Calibri";
			context.fillStyle = "white";
			context.textBaseline = "top";
			context.fillText(comment_area.text, 10, 10);
			context.fillText(comment_area.text, 10, 25);
		});
		comment_area.text = "";
		comment_area.hide();
		stage.on("mousedown", function () {
			var pos = stage.getMousePos();
			for (var i = 0; i < users.length; i++){
				if (users[i].x <= pos.x && users[i].x + icon_size >= pos.x && 
				users[i].y <= pos.y && users[i].y + icon_size >= pos.y){
					return (0);
				}
			}
			stage_drag_start = pos;
			stage_drag_flag = true;
		});
		
		stage.on("mouseup", function () {
			var pos = stage.getMousePos();
			if (!stage_drag_flag){
				return (0);
			}
			stage_drag_flag = false;
			diff_x = pos.x - stage_drag_start.x;
			diff_y = pos.y - stage_drag_start.y;

			users_add_pos(users, diff_x, diff_y);
		});
		stage.on("mousemove", function () {
			var pos = stage.getMousePos();
			if (!stage_drag_flag){
				return (0);
			}
			diff_x = pos.x - stage_drag_start.x;
			diff_y = pos.y - stage_drag_start.y;
			stage_drag_start = pos;

			users_add_pos(users, diff_x, diff_y);
		});

		stage.add(comment_area);
		stage.add(lines);
	/*
	image.onload = function() {
		var kimage = new Kinetic.Image({
			image: image,
			x: width / 2,
			y: height / 2,
			width: icon_size,
			height: icon_size,
		});
		stage.add(kimage);
	};*/
	var username = GetUserName();
	alert(username);
	users.push(add_user(username, width / 2, height / 2, "root", -1));
	//image.src = icon_base + "pinkroot";
	
	function users_add_pos(users, x, y) {
		for (var i = 0; i < users.length; i++){
			users[i].x += x;
			users[i].y += y;
			users[i].kimage.x += x;
			users[i].kimage.y += y;
		}
	}


	function check_click_user(users, x, y)
	{
		
		for (var i = users.length - 1; i >= 0; i--){
			var uxs = users[i]["x"];
			var uys = users[i]["y"];
			var uxe = uxs + icon_size;
			var uye = uys + icon_size;

			if (x >= uxs && x <= uxe && y >= uys && y <= uye){
				return (i);
			}
		}

		return (-1);
	}
	function add_user(name, x, y, parent_, child_id){
		user = {
			name: name,
			x: x,
			y: y,
			kimage: 1,
			"parent":parent_,
			icon: new Image(),
			"child_count": -1,
			"childs": [],
			child_id: child_id,
			line_color: 0,
		};
		
		user.icon.onerror = function() {
			//画像が見つからなかった場合
			this.src = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=pinkroot";
		};
		try {
			user.icon.src = icon_base + user.name;
		}
		catch(e){
			alert(e);
		}
		
		kimage = new Kinetic.Image({
			image: user.icon,
			x: user.x,
			y: user.y,
			width: icon_size,
			height: icon_size,
		});
		
		kimage.on("click", function() {
			pos = stage.getMousePos();
			user = users[check_click_user(users, pos.x, pos.y)];
			if (((drag_start_pos.x - user.kimage.x) * (drag_start_pos.x - user.kimage.x)) + ((drag_start_pos.y - user.kimage.y) * (drag_start_pos.y - user.kimage.y)) < 2){
				click_event_user(user);
			}
		});
		kimage.on("dblclick", function() {
			pos = stage.getMousePos();
			index = check_click_user(users, pos.x, pos.y);
			window.open("https://twitter.com/#!/" + users[index].name)
			//location.href = "https://twitter.com/#!/" + users[index].name;
		});
		kimage.on("mouseover", function() {
			pos = stage.getMousePos();
			index = check_click_user(users, pos.x, pos.y);
			//comment(users[index], pos.x, pos.y);
		});
		kimage.on("mouseout", function() {
			//comment_area.hide();
		});
		kimage.on("dragstart", function () {
			drag_start_pos = {x:0, y:0};
			drag_start_user = check_click_user(users, pos.x, pos.y);
			drag_start_pos.x = users[drag_start_user].kimage.x;
			drag_start_pos.y = users[drag_start_user].kimage.y;
			drag_ago_pos = {x:0, y:0};
			drag_ago_pos.x = drag_start_pos.x;
			drag_ago_pos.y = drag_start_pos.y;
			drag_start_flag = true;
		});
		kimage.on("dragend", function () {
			drag_start_flag = false;
			user = users[drag_start_user];
			_user_move(user, user.kimage.x - drag_ago_pos.x, user.kimage.y - drag_ago_pos.y);
		});
		kimage.on("mousemove", function () {
			if (drag_start_flag == true){
				user = users[drag_start_user];
				_user_move(user, user.kimage.x - drag_ago_pos.x, user.kimage.y - drag_ago_pos.y);
				drag_ago_pos.x = user.kimage.x;
				drag_ago_pos.y = user.kimage.y;
			}
		});
		kimage.draggable(true);
		stage.add(kimage);
		user.kimage = kimage;
		var p;
		if (parent_ != "root"){
			var i;
			for (i = 0; i < users.length; i++){
				if (users[i].name == parent_){
					break;
				}
			}
			p = users[i];
			var context = lines.getContext();
			var ux = user.x + icon_size / 2;
			var uy = user.y + icon_size / 2;
			var px = p.x + icon_size / 2;
			var py = p.y + icon_size / 2;
			context.moveTo(ux,uy);
			context.lineTo(px,py);
			context.stroke();
			user.line_color = (p.line_color + 1) % color_list.length
		}
		return (user);
	}
	
	function _user_move(user, x, y){
		user.x += x;
		user.y += y;
		for (var i = 0;i < user.childs.length; i++){
			user_move(user.childs[i], x, y);
		}
	}

	function user_move(user, x, y){
		user.x += x;
		user.y += y;
		user.kimage.x += x;
		user.kimage.y += y;
		for (var i = 0;i <  user.childs.length; i++){
			user_move(user.childs[i], x, y);
		}
	}

	function comment(user, x, y)
	{
		comment_area.x = x;
		comment_area.y = y;
		comment_area.text = "name:" + user.name;
		comment_area.show();
		comment_area.moveToTop();
		stage.drawShapes();
	}

	function click_event_user(user){
		var i = 0;

		if (user["parent"] != "root"){

			for (i = 0; i < users.length; i++){
				if (users[i].name == user["parent"]){
					break;
				}
			}
			
			id = user["child_id"];
			count = users[i].child_count;
			/*ago_x = user.x;
			ago_y = user.y;
			user["x"] = users[i]["x"] + (Math.cos((2 * Math.PI / count) * id) * r * 2.5);
			user["y"] = users[i]["y"] + (Math.sin((2 * Math.PI / count) * id) * r * 2.5);*/
			
			/*user.kimage.move(user.x - ago_x, user.y - ago_y);*/
		}
		add_users(user);
		//users_add_pos(users, width / 2 - user.x, height / 2 - user.y);
	}
	
	function add_users(user)
	{
		//jsonデータを拾ってくる
	//	var x = user["x"];
	//	var y = user["y"];

		$.getJSON("/cgi-bin/linker.py", {"username": user.name}, function(json){
			var x = user.x;
			var y = user.y;
			count = json.users.length;
			userlist = json.users;
			random_radian = Math.random() * 2 * Math.PI;
			for (var i = 0; i < count; i++){
				var j = 0;
				for (j = 0; j < users.length; j++){
					if (userlist[i]  == users[j]["name"]){
						break;
					}
				}
				if (j != users.length){
					continue;
				}
				var nx = x + (Math.cos((2 * Math.PI / count) * i + random_radian) * r);
				var ny = y + (Math.sin((2 * Math.PI / count) * i + random_radian) * r);
				users.push(add_user(json.users[i], nx, ny, user.name, i));
	
				user["childs"].push(users[users.length  - 1]);
				user["child_count"] = count;
			}
		});
		
		return (0);
	}
	setInterval(function () {
		stage.drawShapes();
		var context = lines.getContext();
		context.lineWidth = 4;
		for (var i = 0; i < users.length; i++){
			for (var j = 0; j < users[i].childs.length; j++){
				child = users[i].childs[j];
				context.beginPath();
				context.strokeStyle = color_list[users[i].line_color];
				context.moveTo(users[i].x + icon_size / 2, users[i].y + icon_size / 2);
				context.lineTo(child.x + icon_size / 2, child.y + icon_size / 2);
				context.stroke();
			}
		}
		/*
		context.beginPath();
		context.moveTo(0, size);
		context.lineTo(width, size);
		context.stroke();
		context.beginPath();
		context.moveTo(0, height - size);
		context.lineTo(width, height - size);
		context.stroke();
		context.beginPath();
		context.moveTo(size, 0);
		context.lineTo(size, height);
		context.stroke();
		context.beginPath();
		context.moveTo(width - size, 0);
		context.lineTo(width - size, height);
		context.stroke();
		*/
	}, 100);
	
	/*
	setInterval(function () {
		if (drag_start_flag == true){
			return (0);
		}
		pos = stage.getMousePos();
		diff_x = 0;
		diff_y = 0;
		if (pos.x > width - size){
			base_x -= 10;
			diff_x = -10;
		}
		else if (pos.x < size){
			base_x += 10;
			diff_x = 10;
		}
		if (pos.y > height - size){
			base_y -= 10;
			diff_y = -10;
		}
		else if (pos.y < size){
			base_y += 10;
			diff_y = 10;
		}
		users_add_pos(users, diff_x, diff_y);
	}, 100);
	*/
};

