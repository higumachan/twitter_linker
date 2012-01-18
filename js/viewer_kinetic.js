var debug = true;

function myalert(str) {
	if (debug == true){
		alert(str);
	}
}


window.onload = function () {
	var icon_size = 40;
	var width = window.innerWidth * 2;
	var height = window.innerHeight * 2;
	var stage = new Kinetic.Stage("canvassample", width, height);
	var lines = new Kinetic.Shape(function () {
	}, 'background');
	var image = new Image();
	var icon_base = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=";
	var users = [];
	var r = 200;
	var color_list = ["red", "blue", "green"];
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
	users.push(add_user("pinkroot", width / 2, height / 2, "root", -1));
	//image.src = icon_base + "pinkroot";
	
	function check_click_user(users, x, y)
	{
		for (var i = 0; i < users.length; i++){			
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
			click_event_user(users[check_click_user(users, pos.x, pos.y)]);
		});
		kimage.on("dblclick", function() {
			pos = stage.getMousePos();
			index = check_click_user(users, pos.x, pos.y);
			location.href = "https://twitter.com/#!/" + users[index].name;
		});
		kimage.on("mouseover", function() {
			pos = stage.getMousePos();
			index = check_click_user(users, pos.x, pos.y);
			comment(users[index], pos.x, pos.y);
			stage.drawShapes();
		});
		kimage.on("mouseout", function() {
			comment_area.hide();
		});
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
			ago_x = user.x;
			ago_y = user.y;
			user["x"] = users[i]["x"] + (Math.cos((2 * Math.PI / count) * id) * r * 2.5);
			user["y"] = users[i]["y"] + (Math.sin((2 * Math.PI / count) * id) * r * 2.5);
			
			user.kimage.move(user.x - ago_x, user.y - ago_y);
			stage.drawShapes();
		}
		add_users(user);
	}
	
	function add_users(user)
	{
		//jsonデータを拾ってくる
		var x = user["x"];
		var y = user["y"];

		$.getJSON("/cgi-bin/linker.py", {"username": user.name}, function(json){
			count = json.users.length;
			userlist = json.users;
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
				
				var nx = x + (Math.cos((2 * Math.PI / count) * i) * r);
				var ny = y + (Math.sin((2 * Math.PI / count) * i) * r);
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
		context.stroke();
	}, 100);

	
};

