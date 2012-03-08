physical_objects = new PhysicalObjects();

for i in [1..5]
	vector1 = new Vector(Math.random(), Math.random());
	vector2 = new Vector(Math.random(), Math.random());
	add = new PhysicalObject(vector1, vector2);
	physical_objects.append(add);

#setTimeout(physical_objects.update, 1000);
for i in [1..20]
	physical_objects.update();
	console.log("\n");


