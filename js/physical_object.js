(function(){
  var PhysicalObject, PhysicalObjects, Vector;
  Vector = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
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
    this.x *= (1.0 / k);
    return this.y *= (1.0 / k);
  };

  PhysicalObjects = function() {
    this.objects = [];
    return this;
  };
  PhysicalObjects.prototype.update = function() {
    var _a, _b, _c, _d, object;
    _a = []; _c = this.objects;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      object = _c[_b];
      _a.push(object.update());
    }
    return _a;
  };
  PhysicalObjects.prototype.draw = function() {
    var _a, _b, _c, _d, object;
    _a = []; _c = this.objects;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      object = _c[_b];
      _a.push(object.draw());
    }
    return _a;
  };
  PhysicalObjects.prototype.append = function(physical_object) {
    return this.objects.push(physical_object);
  };

  PhysicalObject = function(pos, dest) {
    this.pos = pos;
    this.dest = dest;
    this.speed = 0.01;
    this.velocity = new Vector(0, 0);
    return this;
  };
  PhysicalObject.prototype.set_dist_pos = function(pos) {
    this.dest = pos;
    return this.dest;
  };
  PhysicalObject.prototype.update = function() {
    this.acceralated();
    this.pos.add(this.velocity);
    console.log(this.pos);
    return console.log(this.dest);
  };
  PhysicalObject.prototype.acceralated = function() {
    var accel;
    accel = new Vector((this.dest.x - this.pos.x) * this.speed, (this.dest.y - this.pos.y) * this.speed);
    return this.velocity.add(accel);
  };
  PhysicalObject.prototype.draw = function() {
    return alert("override please");
  };
  PhysicalObject.prototype.print = function() {
    return console.log("#{@pos.x}, #{@pos.y}");
  };

})();
