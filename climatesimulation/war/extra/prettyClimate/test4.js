//world.broadphase = new CANNON.SAPBroadphase();
//world.broadphase = new CANNON.GridBroadphase();

function hideHeat(){
	for(idx in basicBodies){
		var vis=getVisual(basicBodies[idx])
		vis.material= basicBodies[idx].originalMaterial
	}
}

freqCount = 1
var intervFreq= setInterval(function() {
	demo.settings.stepFrequency = freqCount * 60
	freqCount++;
	if(freqCount > 2){
		clearInterval(intervFreq);
	}
}, 100)

function distributeHeatF(e) {
	
	var b1=e.contact.bi;
	var b2 = e.contact.bj;
	if(!b1||!b2||!b1.cli||!b2.cli||b1.cli.heat === undefined||b2.cli.heat === undefined)
		return;
	
	
	var newHeat = (b1.cli.heat + b2.cli.heat) * .5
	b1.cli.heat = newHeat;
	b2.cli.heat = newHeat;
	
	var vis = demo.getVisual(b1);
	var vis2 = demo.getVisual(b2);
	
	if(showHeat){
		var colorFilter = 0x030000;
		vis.material.color.setHex(0x110000+Math.floor(newHeat)*colorFilter)	
		vis2.material.color.setHex(0x110000+Math.floor(newHeat)*colorFilter)	

	}
	

}


var useLight = true;
var showHeat = true;
var distributeheat = false
mPerLight = 90
lightMass = .00001

randomAllOver = function(par,body) {
	currentBody.position.set(Math.random() * par * 2 - par, Math.random() * par * 2 - par, Math
			.random() * par * 2 - par);
}
randomPoles = function(shape) {
	currentBody.position.set(Math.random() * shape * 2 - shape, Math.random()> .5? 5: -5, Math
			.random() * shape * 2 - shape);
	
}

picturePosition = function(color,range) {
	var img = $('#earth')[0];
	var canvas = $('#earthCanvas')[0];
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	
	for(a = 0; a < width; a++){
		for(b = 0; b < height; b++){
			var pixelData = canvas.getContext('2d').getImageData(a, b, 1, 1).data;
		}
	}
	x = sin((v + .5) * 3.14)
	y = sin((u - .5) * 3.14)
	z = sin((u - .5) * 3.14)
}

randomNone = function() {
}


gravityBasic = function() {

	// Get the vector pointing from the moon to the planet center
	var moon_to_planet = new CANNON.Vec3();
	this.position.negate(moon_to_planet);

	// Get distance from planet to moon
	var distance = moon_to_planet.norm();

	// Now apply force on moon
	// Fore is pointing in the moon-planet direction
	moon_to_planet.normalize();
	moon_to_planet.mult(1500 / Math.pow(distance, 2), this.force);

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
	//moon_to_planet.mult(1500 / Math.pow(distance, 2), this.force);
	moon_to_planet.mult(1000, this.force);

}

gravityHeavy = function() {

	// Get the vector pointing from the moon to the planet center
	var moon_to_planet = new CANNON.Vec3();
	this.position.negate(moon_to_planet);

	// Get distance from planet to moon
	var distance = moon_to_planet.norm();

	// Now apply force on moon
	// Fore is pointing in the moon-planet direction
	moon_to_planet.normalize();
	//moon_to_planet.mult(1500 / Math.pow(distance, 2), this.force);
	moon_to_planet.mult(10, this.force);

}

types = {}
function addType(type, obj) {
	types[type] = obj
}

basicBodies = []
function useType(args) {
	var obj = new CANNON.Body({
		mass : args.mass
		
	});
	if(args.collisionFilterGroup)
		obj.collisionFilterGroup=args.collisionFilterGroup;
	if(args.collisionFilterMask)
		obj.collisionFilterMask=args.collisionFilterMask;
	if(args.cli)
		obj.cli = args.cli;
	
	basicBodies.push(obj);
		
	
	
	obj.addShape(args.shape);
	if (args.gravity === undefined)
		obj.preStep = gravity
	else
		obj.preStep = args.gravity
	obj.allowSleep = true;
	obj.sleepSpeedLimit = args.sleepSpeed;// Body will feel sleepy if speed<1
	// (speed == norm of velocity)
	obj.sleepTimeLimit = args.sleepTimeLimit; // Body falls asleep after 1s of
	// sleepiness
	world.add(obj);
	if(args.opacity === undefined)
		args.opacity = 1
	if (args.visibility)
		demo.addVisual(obj, new THREE.MeshLambertMaterial({
			color : args.color,
			transparent : (args.opacity !== undefined),
			opacity : args.opacity
		}));
	obj.cli = {}
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
	args.random(this.currentBody,args.params)
	if (amount < args.amount)
		setTimeout(this.layerRun.bind(this, args, amount), args.timeBetween)

}
function useLayer() {
	for (idx in layers) {
		layerRun(layers[idx], -1);

	}

}

var atmosphereShape = new CANNON.Sphere(.4);
var atmosphereLargeShape = new CANNON.Particle(1.6);
var smallShape = new CANNON.Sphere(0.2);
var smallerShape = new CANNON.Sphere(0.15);
var lightShape = new CANNON.Sphere(0.05);
var planetShape = new CANNON.Sphere(2.8);
var particleShape = new CANNON.Particle();

addType("planet", {
	"gravity" : null,
	"visibility" : true,
	"color" : 0x0d0d29,
	"shape" : planetShape,
	"mass" : 0,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1,
	"collisionFilterGroup":  1
})

addType("dirt", {
	"gravity" : gravityHeavy,
	"visibility" : true,
	"color" : 0x49311C,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("greenery", {
	"gravity" : gravityHeavy,
	"visibility" : true,
	"color" : 0x00FF00,
	"shape" : smallShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("ocean", {
	"gravity" : gravityHeavy,
	"visibility" : true,
	"color" : 0x0000FF,
	"shape" : smallerShape,
	"mass" : 5,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 4
})

addType("atmosphere", {
	"gravity" : gravity,
	"visibility" : true,
	"color" : 0xFFFFFF,
	"opacity" : .01,
	"shape" : atmosphereShape,
	"mass" : 1,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1
})

addType("atmosphereLarge", {
	"gravity" : gravityHeavy,
	"visibility" : true,
	"color" : 0xFFFFFF,
	"opacity" : .01,
	"shape" : atmosphereLargeShape,
	"mass" : 1,
	"sleepSpeed" : .1,
	"sleepTimeLimit" : 1,
	"collisionFilterGroup":  16,
	"collisionFilterMask":  1|16,
	"cli" : {
		"heat" : 1
	}
	
})

addType("clouds", {
	"gravity" : gravity,
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
	"type" : "atmosphereLarge",
	"start" : 6000,
	"timeBetween" : 30,
	"amount" : 30,//90
	"random" : randomAllOver,
	"params" : [14]
})

// addLayer({
// 	"type" : "clouds",
// 	"start" : 3000,
// 	"timeBetween" : 30,
// 	"amount" : 10,
// 	"random" : randomPoles,
// 	"params" : [3]
// })
var demo = new CANNON.Demo();

demo.addScene("Moon", function() {
	world = demo.getWorld();
	// world.broadphase = new CANNON.SAPBroadphase();
	world.solver.iterations = 1;
	world.allowSleep = true;
	// world.allowSleep = false;

	var lightBaseShape = new CANNON.Sphere(0.5);
	var lightBase = new CANNON.Body({
		collisionFilterGroup:  1,
		collisionFilterMask:  1,
		mass : 5
	});
	lightBase.addShape(lightBaseShape);

	lightBase.position.set(0, 6, 0);
	lightBase.velocity.set(8, 0, 0);
	// lightBase.velocity.set(0,0,4);
	lightBase.linearDamping = 0.0;
	lightBase.preStep = gravityBasic
	world.add(lightBase);
	demo.addVisual(lightBase, new THREE.MeshLambertMaterial({
		color : 0xFFFF00
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
		moon_to_planet.mult(20, moon.velocity);

		if (bodies.length > 20) {
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
				
				if(body.cli&&body.cli.heat){
					toRemove.push(this);
					body.cli.heat += 20
				}
					
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


	var intervalE = setInterval(function() {
		var bCur = new CANNON.Body({
			mass : .001
		});
		bCur.addShape(new CANNON.Particle());
		randomAllOver(5,bCur);
		world.add(bCur);

		demo.addVisual(bCur, new THREE.MeshLambertMaterial({
			color : 0x00ff00
		}));
		bodies.push(bCur)

		var moon_to_planet = new CANNON.Vec3();
		bCur.position.negate(moon_to_planet);
		var distance = moon_to_planet.norm();
		moon_to_planet.normalize();
		moon_to_planet.mult(20, moon.velocity);

		if (bodies.length > 20) {
			var b = bodies.shift();
			demo.removeVisual(b);
			world.remove(b);
		}

		bCur.addEventListener("collide", function(e) {
            var emiss = $("emissionsAmount").val()
			if (Math.random() < emiss) {
				var body
				if (e.contact.bi.cli.heat)
					body = e.contact.bi
				else
					body = e.body
				
				if(body.cli&&body.cli.heat){
					toRemove.push(this);
					body.cli.heat -=10
				}
					
				// updateHeat(body);
			}

		});
		for (b in toRemove) {
			var pos = toRemove[b].position;
			demo.removeVisual(toRemove[b]);
			world.remove(toRemove[b]);

		}
		toRemove.length = 0;

	}, 100);


	hDA = []
	
	
	demo.dataFolder.domElement.innerHTML = "<span id=showClimateData></span><input type=text id=emissionsAmount>"

});

demo.start();

var oceanBodies = [];
var oceanMeshes = [];
function runEarth(height, width) {
		var pData = []
		radius = 3
		for (var c = 0; c < intermediate.length; c++) {
			var a = intermediate[c][0];
			var b = intermediate[c][1];
			var colors = intermediate[c][2];

			;

			theta = a * Math.PI * 2 / width
			phi = b * Math.PI / height


			//x = Math.cos(a) * Math.cos(b) * radius;
			//y = Math.cos(a) * Math.sin(b) * radius;
			//z = Math.sin(a) * radius;
			if (colors[0] < 15 && colors[0] < 15 && colors[2] > 40) {
				radius = 3.4
			}
			else {
				radius = 3;
			}
			x = Math.cos(theta) * Math.sin(phi) * radius;
			y = Math.sin(theta) * Math.sin(phi) * radius;
			z = Math.cos(phi) * radius;


			pData.push([x, y, z, colors])
		}



		function addShapeFinalize(p, x, y, z, color) {
			p.gameType = "earthPoint"
			p.position.set(x, y, z);
			var colorD = 0x010000 * color[0] + 0x000100 * color[1] + 0x000001 * color[2]
			p.linearDamping = .8;
			world.add(p);
			demo.addVisual(p, new THREE.MeshLambertMaterial({
				color: colorD
			}));


		}


		var landCount = 0;
		var oceanCount = 0;
		var landShape = new CANNON.Sphere(0.24);
		var oceanShape = new CANNON.Sphere(0.225);
		
		var interval = setInterval(function() {
			for (var a = 0; a < 5; a++) {

				if (oceanCount >= pData.length) {
					clearInterval(interval)
					return;
				}

				var cD = pData[oceanCount];
				oceanCount++;
				//wierd
				if (oceanCount < 30)
					continue;

				var ocean = cD[3][0] < 15 && cD[3][0] < 15 && cD[3][2] > 40;
				if (!ocean)
					return;
				//ocean
				var p = new CANNON.Body({
					mass: 50,
					shape: oceanShape,
					collisionFilterGroup: 1,
					collisionFilterMask: 1 | 16
				});
				p.preStep = gravity

				addShapeFinalize(p, cD[0], cD[1], cD[2], cD[3]);
				oceanBodies.push(p);
				oceanMeshes.push(demo.getVisual(p));
				p.cli = {}
				p.cli.heat = 1;
			}

		}, 20);

		var lInterval = setInterval(function() {
			for (var a = 0; a < 100; a++) {
				if (landCount >= pData.length) {
					clearInterval(lInterval)
					return;
				}

				var cD = pData[landCount];
				landCount++;
				var ocean = cD[3][0] < 15 && cD[3][0] < 15 && cD[3][2] > 40;
				if (ocean)
					return;



				var p = new CANNON.Body({
					mass: 0,
					shape: landShape,
					collisionFilterGroup: 1,
					collisionFilterMask: 1 | 16
				});

				addShapeFinalize(p, cD[0], cD[1], cD[2], cD[3]);
			}
		}, 0);

		setInterval(function() {
			for (var idx in oceanBodies) {

				oceanBodies[idx].addEventListener("collide", distributeHeatF);
				
			}
		}, 1000)

	}