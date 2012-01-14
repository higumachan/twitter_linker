var debug = true;

function myalert(str) {
	if (debug == true){
		alert(str);
	}
}


window.onload = function () {
	var icon_size = 40;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var stage = new Kinetic.Stage("canvassample", width, height);
	var image = new Image();
	var icon_base = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=";
	var users = [];
	var r = 200;
	var comment_area = new Kinetic.Shape(function(){
			var context = this.getContext();
			context.beginPath();
			context.fillStyle = "black";
			context.fillRect(5, 5, 100, 30);
			context.font = "12pt Calibri";
			context.fillStyle = "white";
			context.textBaseline = "top";
			context.fillText(comment_area.text, 10, 10);
		});
		comment_area.text = "";
		comment_area.hide();
		stage.add(comment_area);
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
		
		kimage.on("mousedown", function() {
			pos = stage.getMousePos();
			click_event_user(users[check_click_user(users, pos.x, pos.y)]);
		});
		kimage.on("mouseover", function() {
			pos = stage.getMousePos();
			index = check_click_user(users, pos.x, pos.y);
			comment(users[index], pos.x, pos.y);
			
		});
		kimage.on("mouseout", function() {
			comment_area.hide();
		});
		stage.add(kimage);
		user.kimage = kimage;

		return (user);
	}

	function comment(user, x, y)
	{
		comment_area.x = x;
		comment_area.y = y;
		comment_area.text = user.name;
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
	}, 100);

	
};

