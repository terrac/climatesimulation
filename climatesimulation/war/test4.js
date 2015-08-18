//world.broadphase = new CANNON.SAPBroadphase();
//world.broadphase = new CANNON.GridBroadphase();

setInterval(function() {
	demo.settings.stepFrequency = 120
}, 1)
setInterval(function() {
	demo.settings.stepFrequency = 160
}, 1)


var useLight = true;
mPerLight = 30
lightMass = .00001

randomAllOver = function(shape) {
	currentBody.position.set(Math.random() * 5, Math.random() * 6 - 3, Math
			.random() * 6 - 3);
}
randomNone = function() {
}

gravity = function() {

	// Get the vector pointing from the moon to the planet center
	var moon_to_planet = new CANNON.Vec3();
	this.position.negate(moon_to_planet);

	// Get distance from planet to moon
	var distance = moon_to_planet.norm();

	// Now apply force on moon
	// Fore is pointing in the moon-planet direction
	moon_to_planet.normalize();
	moon_to_planet.mult(15000 / Math.pow(distance, 2), this.force);

}

types = {}
function addType(type, obj) {
	types[type] = obj
}

function useType(args) {
	var obj = new CANNON.Body({
		mass : args.mass
	});
	obj.addShape(args.shape);
	if (args.gravity === undefined || args.gravity)
		obj.preStep = gravity
	obj.allowSleep = true;
	obj.sleepSpeedLimit = args.sleepSpeed;// Body will feel sleepy if speed<1
	// (speed == norm of velocity)
	obj.sleepTimeLimit = args.sleepTimeLimit; // Body falls asleep after 1s of
	// sleepiness
	world.add(obj);
	if (args.visibility)
		demo.addVisual(obj, new THREE.MeshLambertMaterial({
			color : args.color,
			transparent : (args.opacity !== undefined),
			opacity : args.opacity
		}));
	currentBody = obj;
}
layers = []
function addLayer(obj) {
	layers.push(obj);
}
layerRun = function(args, amount) {
	if (amount == -1) {
		setTimeout(this.layerRun.bind(this, args, 0), args.start);
		return;
	}
	amount++;
	useType(types[args.type])
	args.random(args.params)
	if (amount < args.amount)
		setTimeout(this.layerRun.bind(this, args, amount), args.timeBetween)

}
function useLayer() {
	for (idx in layers) {
		layerRun(layers[idx], -1);

	}

}

var atmosphereShape = new CANNON.Sphere(1);
var smallShape = new CANNON.Sphere(0.4);
var lightShape = new CANNON.Sphere(0.05);
var planetShape = new CANNON.Sphere(1.5);
var particleShape = new CANNON.Particle();

addType("planet", {
	"gravity" : false,
	"visibility" : true,
	"color" : 0x49311C,
	"shape" : planetShape,
	"mass" : 0,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("dirt", {
	"gravity" : true,
	"visibility" : true,
	"color" : 0x49311C,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("greenery", {
	"gravity" : true,
	"visibility" : true,
	"color" : 0x00FF00,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("ocean", {
	"gravity" : true,
	"visibility" : true,
	"color" : 0x0000FF,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("atmosphere", {
	"gravity" : true,
	"visibility" : true,
	"color" : 0xFFFFFF,
	"opacity" : .1,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("clouds", {
	"gravity" : true,
	"visibility" : true,
	"color" : 0xFFFFFF,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})
// addType("greenery",gravity, true, 0x00FF00, particleShape, 1, .1, 1)
// addType("ocean",gravity, true, 0x0000FF, particleShape, 1, .1, 3)
// addType("atmosphere",gravity, false, null, atmosphereShape, .1, .1, 3)
// addType("clouds",gravity, true, 0xFFFFFF, particleShape, 1, .1, 3)

addLayer({
	"type" : "planet",
	"start" : 0,
	"timeBetween" : 0,
	"amount" : 1,
	"random" : randomNone,
})
addLayer({
	"type" : "dirt",
	"start" : 30,
	"timeBetween" : 30,
	"amount" : 10,
	"random" : randomAllOver,
	"params" : {
		"shape" : 3
	}
})

addLayer({
	"type" : "greenery",
	"start" : 200,
	"timeBetween" : 30,
	"amount" : 30,
	"random" : randomAllOver,
	"params" : {
		"shape" : 3
	}
})

addLayer({
	"type" : "ocean",
	"start" : 600,
	"timeBetween" : 30,
	"amount" : 50,
	"random" : randomAllOver,
	"params" : {
		"shape" : 3
	}
})
addLayer({
	"type" : "atmosphere",
	"start" : 2000,
	"timeBetween" : 30,
	"amount" : 600,
	"random" : randomAllOver,
	"params" : {
		"shape" : 5
	}
})

addLayer({
	"type" : "clouds",
	"start" : 10000,
	"timeBetween" : 30,
	"amount" : 10,
	"random" : randomAllOver,
	"params" : {
		"shape" : 3
	}
})
var demo = new CANNON.Demo();

demo.addScene("Moon", function() {
	world = demo.getWorld();
	// world.broadphase = new CANNON.SAPBroadphase();
	world.solver.iterations = 1;
	world.allowSleep = true;
	// world.allowSleep = false;

	var lightBaseShape = new CANNON.Sphere(0.5);
	var lightBase = new CANNON.Body({
		mass : 5
	});
	lightBase.addShape(lightBaseShape);

	lightBase.position.set(6, 0, 0);
	lightBase.velocity.set(0, 0, 8);
	// lightBase.velocity.set(0,0,4);
	lightBase.linearDamping = 0.0;
	lightBase.preStep = gravity
	world.add(lightBase);
	demo.addVisual(lightBase, new THREE.MeshLambertMaterial({
		color : "0xFFFF00"
	}));
	useLayer();
	bodies = []
	toRemove = []

	interval = setInterval(function() {
		if (!useLight)
			return;
		var moon = new CANNON.Body({
			mass : lightMass
		});
		moon.addShape(new CANNON.Particle());
		// moon.addShape(lightShape);

		// moon.position.set(Math.random() * 30,Math.random() *
		// 10-4,Math.random() * 10-4);
		// moon.position.set(Math.random() * 30,Math.random() *
		// 8-4,Math.random() * 8-4);
		// moon.position.set(Math.random() * 30,Math.random() *
		// 6-3,Math.random() * 6-3);
		// moon.position.set(Math.random() *
		// 15+lightBase.position.x,Math.random() *
		// 6-3+lightBase.position.y,Math.random() * 4-2+lightBase.position.z);
		moon.position.set(Math.random() + lightBase.position.x, Math.random()
				+ lightBase.position.y, Math.random() + lightBase.position.z);
		// moon.velocity.set(0,0,8);
		// moon.velocity.set(-8,0,0);

		// moon.linearDamping = 0.0;

		world.add(moon);

		demo.addVisual(moon, new THREE.MeshLambertMaterial({
			color : 0xffff00
		}));
		bodies.push(moon)

		var moon_to_planet = new CANNON.Vec3();
		moon.position.negate(moon_to_planet);
		var distance = moon_to_planet.norm();
		moon_to_planet.normalize();
		moon_to_planet.mult(80, moon.velocity);

		if (bodies.length > 100) {
			var b = bodies.shift();
			demo.removeVisual(b);
			world.remove(b);
		}

		moon.addEventListener("collide", function(e) {

			if (Math.random() < .5) {
				var body
				if (e.contact.bi.heatDistribute)
					body = e.contact.bi
				else
					body = e.body
				toRemove.push(this);
				body.heat += 20
				// updateHeat(body);
			}

		});
		for (b in toRemove) {
			var pos = toRemove[b].position;
			demo.removeVisual(toRemove[b]);
			world.remove(toRemove[b]);

		}
		toRemove.length = 0;

	}, mPerLight);

	hDA = []

});

demo.start();
