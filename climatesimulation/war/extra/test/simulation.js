//world.broadphase = new CANNON.SAPBroadphase();
//world.broadphase = new CANNON.GridBroadphase();
function runSimulation(demo){

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
	}, 1)//100
	
	setInterval(function() {
		distributeHeat = true;
		for(idx in basicBodies){
	
	//		basicBodies[idx].addEventListener("collide", function(e) {
	//			if(!distributeHeat)
	//				return;
	//			var b1=e.contact.bi;
	//			var b2 = e.contact.bj;
	//			if(b1 === undefined||b2 === undefined||b1.cli === undefined || b2.cli === undefined)
	//				return;
	//			
	//			
	//			var newHeat = (b1.cli.heat + b2.cli.heat) * .5
	//			b1.cli.heat = newHeat;
	//			b2.cli.heat = newHeat;
	//			
	//			var vis = demo.getVisual(b1);
	//			var vis2 = demo.getVisual(b2);
	//			
	//			if(showHeat){
	//				var colorFilter = 0x030000;
	//				vis.material.color.setHex(0x110000+Math.floor(b1.heat)*colorFilter)	
	//				vis2.material.color.setHex(0x110000+Math.floor(b2.heat)*colorFilter)	
	//
	//			}
	//			
	//
	//		});
	
		}
	}, 30000)
	
	
	var useLight = true;
	var showHeat = true;
	var distributeheat = false
	mPerLight = 90
	lightMass = .00001
	
	randomAllOver = function(shape) {
		currentBody.position.set(Math.random() * shape * 2 - shape, Math.random() * shape * 2 - shape, Math
				.random() * shape * 2 - shape);
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
		moon_to_planet.mult(1, this.force);
	
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
		moon_to_planet.mult(5000, this.force);
		//console.log(this.gameType)
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
		args.random.apply(this,args.params)
		if (amount < args.amount)
			setTimeout(this.layerRun.bind(this, args, amount), args.timeBetween)
	
	}
	function useLayer() {
		for (idx in layers) {
			layerRun(layers[idx], -1);
	
		}
	
	}
	
	var atmosphereShape = new CANNON.Sphere(.4);
	var atmosphereLargeShape = new CANNON.Sphere(1.6);
	var smallShape = new CANNON.Sphere(0.2);
	var smallerShape = new CANNON.Sphere(0.15);
	var lightShape = new CANNON.Sphere(0.05);
	var planetShape = new CANNON.Sphere(2.7);
	var particleShape = new CANNON.Particle();
	
	addType("planet", {
		"gravity" : null,
		"visibility" : true,
		"color" : 0x49311C,
		"shape" : planetShape,
		"mass" : 0,
		"sleepSpeed" : .1,
		"sleepTimeLimit" : 1
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
		"gravity" : gravity,
		"visibility" : true,
		"color" : 0xFFFFFF,
		"opacity" : .01,
		"shape" : atmosphereLargeShape,
		"mass" : 1,
		"sleepSpeed" : .1,
		"sleepTimeLimit" : 1
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
	
	
	
	
	function runWorld() {
		world = demo.getWorld();
		// world.broadphase = new CANNON.SAPBroadphase();
		world.solver.iterations = 1;
		world.allowSleep = true;
		// world.allowSleep = false;
	
		var lightBaseShape = new CANNON.Sphere(0.5);
		var lightBase = new CANNON.Body({
			collisionFilterGroup:  1,
			collisionFilterMask:  2,
			mass : 5
		});
		lightBase.addShape(lightBaseShape);
	
		lightBase.position.set(6, 0, 0);
		lightBase.velocity.set(0, 0, 8);
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
			moon_to_planet.mult(80, moon.velocity);
	
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
	
	}
	runWorld();
	
	function addAsteroids() {
		world = demo.getWorld();
		// world.broadphase = new CANNON.SAPBroadphase();
		world.solver.iterations = 1;
		world.allowSleep = true;
		// world.allowSleep = false;
	
		var asteroidBaseShape = new CANNON.Sphere(0.1);
		var asteroidLimit = 30;
		var aBodies = []
		interval = setInterval(function() {
			if(asteroidLimit < aBodies.length){
				return;
			}
			var asteroidBase = new CANNON.Body({
				mass : 5
			});
			asteroidBase.addShape(asteroidBaseShape);
		
			asteroidBase.position.set(6, 0, 0);
			asteroidBase.velocity.set(0, 0, 8);
			// asteroidBase.velocity.set(0,0,4);
			asteroidBase.linearDamping = 0.0;
			asteroidBase.preStep = gravityBasic
			world.add(asteroidBase);
			aBodies.add(asteroidBase);
			demo.addVisual(asteroidBase, new THREE.MeshLambertMaterial({
				color : 0xFFFF00
			}));
			
			moon.addEventListener("collide", function(e) {
				//if one of the bodies is part of the earth
				//do an explanation and 
				if(!contactHas(e,"earth")){
					return;									
				} 
				aBodies.remove(contactGet(e,"asteroid"));
				//send blurb (ie have another colored map, those colors map to explanations)
				
				
			});	
		}, 100);
	
		hDA = []
	
	}
	
}	
