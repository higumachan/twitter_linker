(function(){
  var PhysicalObject, PhysicalObjects, Vector, _a, add, i, physical_objects, vectors;
  Vector = function() {  };
  Vector.prototype.construnctor = function(x, y) {
    this.x = x;
    this.y = y;
    return this.y;
  };
  Vector.prototype.construnctor = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this.y;
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

  PhysicalObjects = function() {  };
  PhysicalObjects.prototype.construnctor = function() {
    this.objects = [];
    return this.objects;
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

  PhysicalObject = function() {  };
  PhysicalObject.prototype.construnctor = function(pos) {
    this.pos = pos;
    return this.pos;
  };
  PhysicalObject.prototype.construnctor = function(pos, dest) {
    this.pos = pos;
    this.dest = dest;
    return this.dest;
  };
  PhysicalObject.prototype.set_dist_pos = function(pos) {
    this.dest = pos;
    return this.dest;
  };
  PhysicalObject.prototype.update = function() {
    acceralated();
    this.pos.add(this.velocity);
    return print();
  };
  PhysicalObject.prototype.acceralated = function() {
    var accel;
    accel = new Vector((this.dest.x - this.pos.y) * this.speed, (this.dest.y - this.pos.y) * this.speed);
    return this.velocity.add(accel);
  };
  PhysicalObject.prototype.draw = function() {
    return alert("override please");
  };
  PhysicalObject.prototype.print = function() {
    return console.log("#{@pos.x}, #{@pos.y}");
  };

  physical_objects = new PhysicalObjects();
  for (i = 1; i <= 5; i += 1) {
    vectors = [
      (function() {
        _a = [];
        for (i = 1; i <= 2; i += 1) {
          _a.push(new Vector(Math.random(), Math.random()));
        }
        return _a;
      })()
    ];
    add = new PhysicalObject(vectors[0], vectors[1]);
    physical_objects.append(add);
  }
  setTimeout(physical_objects.update, 1000);
})();
