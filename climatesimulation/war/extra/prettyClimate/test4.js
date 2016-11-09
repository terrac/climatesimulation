//world.broadphase = new CANNON.SAPBroadphase();
//world.broadphase = new CANNON.GridBroadphase();
var currentURI = URI(location);
function urlOverride(param,defaultVal){
	var val=currentURI.query(true)[param]
	if(val) return val;
	return defaultVal;
}
var lSize = urlOverride("lSize",.24)
var hInc = urlOverride("hInc",30)

function logEvent(message){
	$("#cliConsole").append("<span>"+message+"<br></span>")	
	$($("#cliConsole").children().toArray().reverse().slice(10)).remove();
}

function hideHeat() {
	for (idx in demo.bodies) {
		var vis = demo.getVisual(demo.bodies[idx])
		if (demo.bodies[idx].originalColor)
			vis.material.color = jQuery.extend({}, demo.bodies[idx].originalColor)
	}

}

freqCount = 1
var intervFreq = setInterval(function() {
	demo.settings.stepFrequency = freqCount * 60
	freqCount++;
	if (freqCount > 2) {
		clearInterval(intervFreq);
	}
}, 100)

function distributeHeatF(e) {

	var b1 = e.contact.bi;
	var b2 = e.contact.bj;
	if (!b1 || !b2 || !b1.cli || !b2.cli || b1.cli.heat === undefined || b2.cli.heat === undefined)
		return;


	var newHeat = (b1.cli.heat + b2.cli.heat) * .5
	b1.cli.heat = newHeat;
	b2.cli.heat = newHeat;

	var vis = demo.getVisual(b1);
	var vis2 = demo.getVisual(b2);
	updateHeat(vis, newHeat, showHeat);
	updateHeat(vis2, newHeat, showHeat);



}

function updateHeat(vis, newHeat, showHeatP) {
	if (showHeatP) {
		vis.material.color.setHex(0x110000 + Math.floor(newHeat) * 0x030000)
	}
}
var useLight = true;
var showHeat = true;
var showEmissions = true;
var distributeheat = false
mPerLight = 90
lightMass = .00001






var emissionsContactCount = 0;
var typeLists = {}



randomAllOver = function(par, body) {
	body.position.set(Math.random() * par * 2 - par, Math.random() * par * 2 - par, Math
		.random() * par * 2 - par);
}
randomPoles = function(shape) {
	currentBody.position.set(Math.random() * shape * 2 - shape, Math.random() > .5 ? 5 : -5, Math
		.random() * shape * 2 - shape);

}

picturePosition = function(color, range) {
	var img = $('#earth')[0];
	var canvas = $('#earthCanvas')[0];
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

	for (a = 0; a < width; a++) {
		for (b = 0; b < height; b++) {
			var pixelData = canvas.getContext('2d').getImageData(a, b, 1, 1).data;
		}
	}
	x = sin((v + .5) * 3.14)
	y = sin((u - .5) * 3.14)
	z = sin((u - .5) * 3.14)
}

randomNone = function() {}


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
		mass: args.mass

	});
	if (args.collisionFilterGroup)
		obj.collisionFilterGroup = args.collisionFilterGroup;
	if (args.collisionFilterMask)
		obj.collisionFilterMask = args.collisionFilterMask;
	if (args.cli)
		obj.cli = args.cli;

	basicBodies.push(obj);



	obj.addShape(args.shape);
	if (args.gravity === undefined)
		obj.preStep = gravity
	else
		obj.preStep = args.gravity
	obj.allowSleep = true;
	obj.sleepSpeedLimit = args.sleepSpeed; // Body will feel sleepy if speed<1
	// (speed == norm of velocity)
	obj.sleepTimeLimit = args.sleepTimeLimit; // Body falls asleep after 1s of
	// sleepiness
	world.add(obj);

	if (args.opacity === undefined)
		args.opacity = 1
	if (args.visibility)
		demo.addVisual(obj, new THREE.MeshLambertMaterial({
			color: args.color,
			transparent: (args.opacity !== undefined),
			opacity: args.opacity
		}));
	if (!args.cli)
		args.cli = {}
	obj.cli = args.cli
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
	typeLists[args.type].push(currentBody)
	args.random(args.params, currentBody)
	if (amount < args.amount)
		setTimeout(this.layerRun.bind(this, args, amount), args.timeBetween)

}

function useLayer() {
	for (idx in layers) {
		typeLists[layers[idx].type] = []

		layerRun(layers[idx], -1);

	}

}

var atmosphereShape = new CANNON.Sphere(.4);
var atmosphereLargeShape = new CANNON.Sphere(1.6);
var smallShape = new CANNON.Sphere(0.2);
var smallerShape = new CANNON.Sphere(0.15);
var lightShape = new CANNON.Sphere(0.05);
var planetShape = new CANNON.Sphere(2.8);
var particleShape = new CANNON.Particle();

addType("planet", {
	"gravity": null,
	"visibility": true,
	"color": 0x0d0d29,
	"shape": planetShape,
	"mass": 0,
	"sleepSpeed": .1,
	"sleepTimeLimit": 1,
	"collisionFilterGroup": 1
})

addType("dirt", {
	"gravity": gravityHeavy,
	"visibility": true,
	"color": 0x49311C,
	"shape": smallShape,
	"mass": 5,
	"sleepSpeed": .1,
	"sleepTimeLimit": 1
})

addType("greenery", {
	"gravity": gravityHeavy,
	"visibility": true,
	"color": 0x00FF00,
	"shape": smallShape,
	"mass": 5,
	"sleepSpeed": .1,
	"sleepTimeLimit": 1
})

addType("ocean", {
	"gravity": gravityHeavy,
	"visibility": true,
	"color": 0x0000FF,
	"shape": smallerShape,
	"mass": 5,
	"sleepSpeed": .1,
	"sleepTimeLimit": 4
})

addType("atmosphere", {
	"gravity": gravity,
	"visibility": true,
	"color": 0xFFFFFF,
	"opacity": .01,
	"shape": atmosphereShape,
	"mass": 1,
	"sleepSpeed": .1,
	"sleepTimeLimit": 1
})

addType("atmosphereLarge", {
	"gravity": gravityHeavy,
	"visibility": true,
	"color": 0xFFFFFF,
	"opacity": .2, //.01
	"shape": atmosphereLargeShape,
	"mass": 1,
	"sleepSpeed": .1,
	"sleepTimeLimit": 1,
	"collisionFilterGroup": 16,
	"collisionFilterMask": 1 | 16,
	"cli": {
		"heat": 1,
		"type": "atmosphere"
	}

})

addType("clouds", {
		"gravity": gravity,
		"visibility": true,
		"color": 0xFFFFFF,
		"shape": smallShape,
		"mass": 5,
		"sleepSpeed": .1,
		"sleepTimeLimit": 1
	})
	// addType("greenery",gravity, true, 0x00FF00, particleShape, 1, .1, 1)
	// addType("ocean",gravity, true, 0x0000FF, particleShape, 1, .1, 3)
	// addType("atmosphere",gravity, false, null, atmosphereShape, .1, .1, 3)
	// addType("clouds",gravity, true, 0xFFFFFF, particleShape, 1, .1, 3)

addLayer({
	"type": "planet",
	"start": 0,
	"timeBetween": 0,
	"amount": 1,
	"random": randomNone,
})
addLayer({
	"type": "atmosphereLarge",
	"start": 6000,
	"timeBetween": 30,
	"amount": 30, //90
	"random": randomAllOver,
	"params": [14]
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
		collisionFilterGroup: 1,
		collisionFilterMask: 1,
		mass: 5
	});
	lightBase.addShape(lightBaseShape);

	lightBase.position.set(0, 6, 0);
	lightBase.velocity.set(8, 0, 0);
	// lightBase.velocity.set(0,0,4);
	lightBase.linearDamping = 0.0;
	lightBase.preStep = gravityBasic
	world.add(lightBase);
	demo.addVisual(lightBase, new THREE.MeshLambertMaterial({
		color: 0xFFFF00
	}));
	useLayer();
	bodies = []
	toRemove = []

	interval = setInterval(function() {
		if (!useLight)
			return;
		var moon = new CANNON.Body({
			mass: lightMass
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
		moon.position.set(Math.random() + lightBase.position.x, Math.random() + lightBase.position.y, Math.random() + lightBase.position.z);
		// moon.velocity.set(0,0,8);
		// moon.velocity.set(-8,0,0);

		// moon.linearDamping = 0.0;

		world.add(moon);

		demo.addVisual(moon, new THREE.MeshLambertMaterial({
			color: 0xffff00
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

				if (body.cli && body.cli.heat) {
					toRemove.push(this);
					body.cli.heat += 20

				}


			}

		});
		for (b in toRemove) {
			var pos = toRemove[b].position;
			demo.removeVisual(toRemove[b]);
			world.remove(toRemove[b]);

		}
		toRemove.length = 0;

	}, mPerLight);

	var lastFlashVis = null;
	var lastFlashColor = null;

	function doEmissions() {
		//randomAllOver(1,bCur);
		setTimeout(doEmissions, $("#emissionsAmount").val() || 100);
		try {
			if (lastFlashVis) {
				lastFlashVis.material.color.g = lastFlashColor;
			}
			rBody = oceanBodies[Math.floor(Math.random() * oceanBodies.length)];
			rBody.velocity.x += Math.random() -.5
			rBody.cli.heat = rBody.cli.heat / 2;
			emissionsContactCount++;
			$("#emissionsPerSec")[0].innerHTML = emissionsContactCount;
			if (!showEmissions) return;
			lastFlashVis = demo.getVisual(rBody);
			lastFlashColor = lastFlashVis.material.color.g;
			lastFlashVis.material.color.g += .3
		}
		catch (e) {

		}


	}
	var intervalE = setTimeout(doEmissions, 100);


	hDA = []


	$("#cliUI").detach("*").appendTo($(demo.dataFolder.domElement))
	
	
	$("#showHeatB").click(function() {
		showHeat = $(this).val() == "showHeat"
		if (!showHeat) {
			$(this).val("showHeat")
			hideHeat();
		}
		else {
			$(this).val("dontshowheat")


		}

	});


	$("#showEmissionsB").click(function() {
		showEmissions = $(this).val() == "showEmissions"
		if (!showEmissions) {
			$(this).val("showEmissions")
		}
		else {
			$(this).val("dontshowemissions")

		}

	});

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
	var landShape = new CANNON.Sphere(lSize);
	var oceanShape = new CANNON.Sphere(0.225);

	var interval = setInterval(function() {
		for (var a = 0; a < 5; a++) {

			if (oceanCount >= pData.length) {
				clearInterval(interval)
				logEvent("Finished basic earth")
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
			p.cli.type = "ocean"
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
		var cTL = typeLists["atmosphereLarge"]
		for (var idx in cTL) {
			cTL[idx].addEventListener("collide", distributeHeatF);
		}
	}, 10000)


	function doAtmosphereTurbulence() {
		//randomAllOver(1,bCur);
		setTimeout(doAtmosphereTurbulence, $("#atmosphereTurbulenceAmount").val() || 100);
		
		var cTL = typeLists["atmosphereLarge"]
		var rBody = cTL[Math.floor(Math.random() * cTL.length)];
		if(rBody)
			rBody.velocity.x += Math.random() -.5
		


	}
	setTimeout(doAtmosphereTurbulence, 100);
	
	function doFarenheightUpdate() {
		var farenheightRatio = $("#farenheightRatio").val();
		var oAmount = 0;
		var oHeat = 0;
		var cTL = typeLists["atmosphereLarge"]
		for(var idx in oceanBodies){
			var rBod = oceanBodies[idx];
			oHeat +=rBod.cli.heat;
			oAmount++;
			
		}
		var aAmount = 0;
		var aHeat = 0;
		for(var idx in cTL){
			var rBod = cTL[idx];
			aHeat +=rBod.cli.heat;
			aAmount++;
			
		}
		
		var oAvg = oHeat* farenheightRatio/oAmount;
		var aAvg = aHeat * farenheightRatio/aAmount;
		oAvg = Math.round(oAvg)
		aAvg = Math.round(aAvg)
		$("#avgTemp")[0].innerHTML = ((oAvg + aAvg)/2)
		
		var eAmount = $("#emissionsAmount").val();
		eAmount = eAmount / 5.0;
		$("#carbonAmount").text(eAmount)
		logEvent("The average ocean temperature is: "+oAvg);
		logEvent("The average air temperature is: "+aAvg);
		logEvent("The average temperature is: "+(oAvg + aAvg)/2);
	}
	setInterval(doFarenheightUpdate, 20000);
	
}