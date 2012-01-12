onload = function() {

	var canvas = document.getElementById('canvassample');
	/* 2Dコンテキスト */
	var ctx = canvas.getContext('2d');
	var icon_size_x = 40;
	var icon_size_y = 40;
	var r = 200;
	var ide = 0;
	var rate = 2;
	var icon_base = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=";
	var json;
	
	var wh = window.innerHeight;
	var pinkroot = {
		"username": "pinkroot",
		"x": window.innerWidth * rate / 2,
		"y": window.innerHeight * rate / 2,
		"icon": new Image(),
		"parent": "root",
		"child_count": -1,
		"child_id": -1,
	};
	pinkroot["icon"].src = icon_base + "pinkroot";
	var users = [pinkroot, ];
	
	canvas.width = window.innerWidth * rate;
	canvas.height = window.innerHeight * rate;

	setInterval(draw_users(users, ctx), 1000);

	function draw_users(users, ctx)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(var i = 0; i < users.length; i++){
			//テスト用
			var x = users[i]["x"];
			var y = users[i]["y"];
			ctx.drawImage(users[i].icon, x, y);
		}
	}

	function check_click_user(users, x, y)
	{
		for (var i = 0; i < users.length; i++){
			var uxs = users[i]["x"];
			var uys = users[i]["y"];
			var uxe = uxs + icon_size_x;
			var uye = uys + icon_size_y;

			if (x >= uxs && x <= uxe && y >= uys && y <= uye){
				return (i);
			}
		}

		return (-1);
	}

	function click_event_user(user)
	{
		var i = 0;

		if (user["parent"] != "root"){

			for (i = 0; i < users.length; i++){
				if (users[i]["username"] == user["parent"]){
					break;
				}
			}
			
			count = users[i]["child_count"];
			id = user["child_id"];
		
			alert(id);
			alert(i);
			alert(count);
		
			user["x"] = users[i]["x"] + (Math.cos((2 * Math.PI / count) * id) * r * 2.5);
			user["y"] = users[i]["y"] + (Math.sin((2 * Math.PI / count) * id) * r * 2.5);
		}
		add_users(user);
		draw_users(users, ctx);
	}

	function add_users(user)
	{
		//jsonデータを拾ってくる
		

		x = user["x"];
		y = user["y"];

		$.getJSON("/cgi-bin/linker.py", {"username": user["username"]}, function(json){
			count = json.users.length;
			userlist = json.users;
			for (var i = 0; i < count; i++){
				var new_user = {
					"username": json.users[i],
					"x": 0,
					"y": 0,
					"icon": new Image(),
					"parent": user["username"],
					"child_count": -1,
					"child_id": i,
				}
			user["child_count"] = count;
			new_user["icon"].src = icon_base + json.users[i];

			var nx = x + (Math.cos((2 * Math.PI / count) * i) * r);
			var ny = y + (Math.sin((2 * Math.PI / count) * i) * r);

			new_user["x"] = nx;
			new_user["y"] = ny;

			users.push(new_user);
			}
		});
		
		return (0);
	}



	canvas.addEventListener('click', function(event){
		click_x = event.pageX * rate; //　X座標を返す
		click_y = event.pageY * rate; //　Y座標を返す

		alert(click_x + "," + click_y);
		alert(users[0]["x"] + "," + users[0]["y"]);
		index = check_click_user(users, click_x, click_y);  //この関数がクリックしたインデックを返す
		alert(index);
		if (index != -1){
			click_user = users[index];
			click_event_user(click_user);
		}
	},false);

}
