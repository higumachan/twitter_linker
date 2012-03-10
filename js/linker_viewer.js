(function() {
  var DragState, PhysicalObject, PhysicalObjects, UserObject, UserObjects, Vector, color_list, drag_state, icon_size, stage_drag_state, userobjects,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Vector = (function() {

    function Vector(x, y) {
      this.x = x;
      this.y = y;
    }

    Vector.prototype.rev = function() {
      this.x = -this.x;
      return this.y = -this.y;
    };

    Vector.prototype.add = function(v) {
      this.x += v.x;
      return this.y += v.y;
    };

    Vector.prototype.sub = function(v) {
      this.x -= v.x;
      return this.y -= v.y;
    };

    Vector.prototype.mul = function(k) {
      this.x *= k;
      return this.y *= k;
    };

    Vector.prototype.div = function(k) {
      this.x *= 1.0 / k;
      return this.y *= 1.0 / k;
    };

    Vector.prototype.size = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector.prototype.scale = function() {
      return this.div(this.size());
    };

    return Vector;

  })();

  PhysicalObjects = (function() {

    function PhysicalObjects() {
      this.objects = [];
    }

    PhysicalObjects.prototype.update = function() {
      var object, _i, _len, _ref, _results;
      _ref = this.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        _results.push(object.update());
      }
      return _results;
    };

    PhysicalObjects.prototype.draw = function() {
      var object, _i, _len, _ref, _results;
      _ref = this.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        _results.push(object.draw());
      }
      return _results;
    };

    PhysicalObjects.prototype.append = function(physical_object) {
      return this.objects.push(physical_object);
    };

    return PhysicalObjects;

  })();

  PhysicalObject = (function() {

    function PhysicalObject(pos, dest) {
      this.pos = pos;
      this.dest = dest;
      this.speed = 0.01;
      this.velocity = new Vector(0, 0);
    }

    PhysicalObject.prototype.set_dist_pos = function(pos) {
      return this.dest = pos;
    };

    PhysicalObject.prototype.update = function() {
      this.acceralated();
      this.pos.x += this.velocity.x;
      return this.pos.y += this.velocity.y;
    };

    PhysicalObject.prototype.acceralated = function() {
      var floor_friction;
      this.velocity.x += (this.dest.x - this.pos.x) * this.speed;
      this.velocity.y += (this.dest.y - this.pos.y) * this.speed;
      floor_friction = new Vector(this.velocity.x, this.velocity.y);
      floor_friction.rev();
      floor_friction.mul(0.07);
      return this.velocity.add(floor_friction);
    };

    PhysicalObject.prototype.draw = function() {
      return alert("override please");
    };

    PhysicalObject.prototype.is_moving = function() {
      var dist;
      dist = new Vector(this.pos.x, this.pos.y);
      dist.sub(this.dest);
      return dist.size() > 15;
    };

    PhysicalObject.prototype.print = function() {
      return console.log("" + this.pos.x + ", " + this.pos.y);
    };

    return PhysicalObject;

  })();

  color_list = ["red", "orange", "green", "blue", "purple"];

  icon_size = 40;

  UserObjects = (function(_super) {

    __extends(UserObjects, _super);

    function UserObjects() {
      var close_down, close_move, close_up, self;
      UserObjects.__super__.constructor.call(this);
      this.width = 820;
      this.height = 500;
      this.stage = new Kinetic.Stage("center_area", this.width, this.height);
      self = this;
      close_down = function() {
        return self.mouse_down();
      };
      close_move = function() {
        return self.mouse_move();
      };
      close_up = function() {
        return self.mouse_up();
      };
      this.stage.on("mousedown", close_down);
      this.stage.on("mousemove", close_move);
      this.stage.on("mouseup", close_up);
      this.lines = new Kinetic.Shape(function() {
        return "test";
      }, "background");
      this.stage.add(this.lines);
    }

    UserObjects.prototype.update = function() {
      UserObjects.__super__.update.call(this);
      this.stage.drawShapes();
      return this.draw_lines();
    };

    UserObjects.prototype.find_object = function(icon) {
      var object, _i, _len, _ref;
      _ref = this.objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        if (icon === object.icon) return object;
      }
    };

    UserObjects.prototype.draw_lines = function() {
      var child, context, object, _i, _len, _ref, _results;
      context = this.lines.getContext();
      context.lineWidth = 4;
      _ref = this.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        _results.push((function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = object.childs;
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            child = _ref2[_j];
            context.beginPath();
            context.strokeStyle = "red";
            context.moveTo(object.pos.x + icon_size / 2, object.pos.y + icon_size / 2);
            context.lineTo(child.pos.x + icon_size / 2, child.pos.y + icon_size / 2);
            _results2.push(context.stroke());
          }
          return _results2;
        })());
      }
      return _results;
    };

    UserObjects.prototype.is_duplicate = function(name) {
      var object, _i, _len, _ref;
      _ref = this.objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        if (object.name === name) return true;
      }
      return false;
    };

    UserObjects.prototype.is_on_mouse_object = function(pos) {
      var object, _i, _len, _ref;
      _ref = this.objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        if (object.pos.x <= pos.x && object.pos.x + icon_size >= pos.x && object.pos.y <= pos.y && object.pos.y + icon_size >= pos.y) {
          return true;
        }
      }
      return false;
    };

    UserObjects.prototype.mouse_down = function() {
      var pos;
      pos = this.stage.getMousePos();
      if (this.is_on_mouse_object(pos) === true) return 0.;
      if (stage_drag_state.flag === false) return stage_drag_state.set(pos);
    };

    UserObjects.prototype.mouse_move = function() {
      var object, pos, v, _i, _len, _ref;
      pos = this.stage.getMousePos();
      if (stage_drag_state.flag === true) {
        _ref = this.objects;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          object = _ref[_i];
          v = new Vector(pos.x, pos.y);
          v.sub(stage_drag_state.ago_pos);
          object.dest.add(v);
        }
        return stage_drag_state.update(new Vector(pos.x, pos.y));
      }
    };

    UserObjects.prototype.mouse_up = function() {
      return stage_drag_state.unset();
    };

    return UserObjects;

  })(PhysicalObjects);

  UserObject = (function(_super) {

    __extends(UserObject, _super);

    function UserObject(pos, dest, name, parent) {
      UserObject.__super__.constructor.call(this, pos, dest);
      this.start_pos = new Vector(pos.x, pos.y);
      this.name = name;
      this.parent = parent;
      this.childs = [];
      this.init();
    }

    UserObject.prototype.update = function() {
      UserObject.__super__.update.call(this);
      this.icon.x += this.velocity.x;
      this.icon.y += this.velocity.y;
      if (this.is_moving()) {
        return this.icon.draggable(false);
      } else {
        return this.icon.draggable(true);
      }
    };

    UserObject.prototype.draw = function() {
      return alert("test");
    };

    UserObject.prototype.click = function() {
      var self, v, x, y;
      v = drag_state.get_drag_vector();
      x = this.pos.x;
      y = this.pos.y;
      if (v.size() < 3) {
        self = this;
        return $.getJSON("/cgi-bin/linker.py", {
          "username": this.name
        }, function(json) {
          var add, count, i, nx, ny, r, random_radian, s, user, users, _len, _results;
          users = json.users;
          random_radian = Math.random() * 2 * Math.PI;
          count = json.users.length;
          r = 100;
          _results = [];
          for (i = 0, _len = users.length; i < _len; i++) {
            user = users[i];
            if (userobjects.is_duplicate(user) === false) {
              nx = x + (Math.cos((2 * Math.PI / count) * i + random_radian) * r);
              ny = y + (Math.sin((2 * Math.PI / count) * i + random_radian) * r);
              v = new Vector(nx, ny);
              s = new Vector(self.pos.x, self.pos.y);
              add = new UserObject(s, v, user, self);
              self.childs.push(add);
              _results.push(userobjects.append(add));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      }
    };

    UserObject.prototype.dbclick = function() {
      return window.open("https://twitter.com/#!/" + this.name);
    };

    UserObject.prototype.mouseover = function() {
      return console.log(this.name);
    };

    UserObject.prototype.mouseout = function() {
      return console.log(this.name);
    };

    UserObject.prototype.dragstart = function() {
      if (drag_state.flag === false) {
        drag_state.set(userobjects.stage.getMousePos());
        return this.icon.moveToTop();
      }
    };

    UserObject.prototype.dragend = function() {
      this.pos.x = this.start_pos.x + this.icon.x;
      this.pos.y = this.start_pos.y + this.icon.y;
      this.dest.x = this.start_pos.x + this.icon.x;
      this.dest.y = this.start_pos.y + this.icon.y;
      drag_state.unset();
      return console.log(this.icon.x, this.icon.y);
    };

    UserObject.prototype.mousemove = function() {
      var pos, vec;
      if (drag_state.flag === true) {
        pos = userobjects.stage.getMousePos();
        vec = new Vector(pos.x, pos.y);
        vec.sub(drag_state.ago_pos);
        this.dragger_move(vec);
        return drag_state.update(new Vector(pos.x, pos.y));
      }
    };

    UserObject.prototype.dragger_move = function(vector) {
      var child, _i, _len, _ref, _results;
      this.pos.add(vector);
      this.dest.add(vector);
      _ref = this.childs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.move(vector));
      }
      return _results;
    };

    UserObject.prototype.move = function(vector) {
      var child, _i, _len, _ref, _results;
      this.dest.add(vector);
      _ref = this.childs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.move(vector));
      }
      return _results;
    };

    UserObject.prototype.init = function() {
      var close_click, close_dbclick, close_dragend, close_dragstart, close_mousemove, close_mouseout, close_mouseover, image, self,
        _this = this;
      image = new Image();
      image.onerror = function() {
        return _this.src = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=pinkroot";
      };
      image.src = "https://api.twitter.com/1/users/profile_image?size=normal&screen_name=" + this.name;
      this.icon = new Kinetic.Image({
        image: image,
        x: this.pos.x,
        y: this.pos.y,
        width: 40,
        height: 40
      });
      self = this;
      close_click = function() {
        return self.click();
      };
      close_dbclick = function() {
        return self.dbclick();
      };
      close_mouseover = function() {
        return self.mouseover();
      };
      close_mouseout = function() {
        return self.mouseout();
      };
      close_dragstart = function() {
        return self.dragstart();
      };
      close_dragend = function() {
        return self.dragend();
      };
      close_mousemove = function() {
        return self.mousemove();
      };
      this.icon.on("click", close_click);
      this.icon.on("dblclick", close_dbclick);
      this.icon.on("mouserober", close_mouseover);
      this.icon.on("mouseout", close_mouseout);
      this.icon.on("dragstart", close_dragstart);
      this.icon.on("dragend", close_dragend);
      this.icon.on("mousemove", close_mousemove);
      this.icon.draggable(true);
      return userobjects.stage.add(this.icon);
    };

    return UserObject;

  })(PhysicalObject);

  DragState = (function() {

    function DragState() {
      this.flag = false;
    }

    DragState.prototype.set = function(pos) {
      this.start_pos = new Vector(pos.x, pos.y);
      this.flag = true;
      return this.ago_pos = new Vector(pos.x, pos.y);
    };

    DragState.prototype.update = function(pos) {
      return this.ago_pos = pos;
    };

    DragState.prototype.unset = function() {
      return this.flag = false;
    };

    DragState.prototype.get_drag_vector = function() {
      var result;
      result = new Vector(this.start_pos.x, this.start_pos.y);
      result.sub(this.ago_pos);
      return result;
    };

    return DragState;

  })();

  drag_state = new DragState();

  stage_drag_state = new DragState();

  userobjects = 0;

  window.onload = function() {
    var close_update, root_user, self_update, start_pos;
    userobjects = new UserObjects();
    start_pos = new Vector(userobjects.width / 2, userobjects.height / 2);
    root_user = new UserObject(start_pos, new Vector(start_pos.x, start_pos.y), "pinkroot", "root");
    userobjects.append(root_user);
    self_update = userobjects;
    close_update = function() {
      return self_update.update();
    };
    return setInterval(close_update, 100);
  };

}).call(this);
