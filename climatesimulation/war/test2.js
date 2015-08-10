		testLight = false;
		//testLight = true;
		
		var mass = 5;
		var lightMass = 1;
		mPerLight = 30
		mPerAtmosphere = 100
		totalAtmosphere = 200
		var atmosphereShape = new CANNON.Sphere(0.5);
        var lightShape = new CANNON.Sphere(0.05);
        var planetShape = new CANNON.Sphere(1.5);
        
		if(testLight){
			mPerLight = 1000
			mPerAtmosphere = 1000
		}

		// Use the preStep callback to apply the gravity force on the moon.
          // This callback is evoked each timestep.
        toRemove = []
   		lightToHeat =function(){
			
            if(Math.abs(this.velocity.y - this.lastYVelocity) > .5){
            	if(Math.random() < .5){
            		toRemove.push(this);
            	} else {
            		this.lastYVelocity = this.velocity.y
            	}            	
            	
            }

        }
        
   		testPost =function(){
			
            var a = 1;

        }
          
		gravity =function(){

            // Get the vector pointing from the moon to the planet center
            var moon_to_planet = new CANNON.Vec3();
            this.position.negate(moon_to_planet);

            // Get distance from planet to moon
            var distance = moon_to_planet.norm();

            // Now apply force on moon
            // Fore is pointing in the moon-planet direction
            moon_to_planet.normalize();
            moon_to_planet.mult(800/Math.pow(distance,2),this.force);

        }
        
        redMat = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
        yellowMat = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
      /**
       * A demo showing how to use the preStep callback to add a force to a body.
       * This will act like a force field.
       */

      var demo = new CANNON.Demo();

      demo.addScene("Moon",function(){
          world = demo.getWorld();

          
          
          
          var planet = new CANNON.Body({ mass: 0 });
          planet.addShape(planetShape);

          

		//for(a = 0 ; a < atmosphere ; a++){
        	
        //}
        currentAtmosphere = 0;  
        interval = setInterval(function(){
        	currentAtmosphere++;
        	if(totalAtmosphere < currentAtmosphere){
        		return;
        	}
        	var moon = new CANNON.Body({ mass: mass });
          	moon.addShape(atmosphereShape);
          	//moon.position.set(Math.random() * 30,Math.random() * 10-4,Math.random() * 10-4);
          	//moon.position.set(Math.random() * 30,Math.random() * 8-4,Math.random() * 8-4);
          	moon.position.set(Math.random() * -5,Math.random() * 6-3,Math.random() * 6-3);
          	//moon.velocity.set(0,0,8);
	        //moon.velocity.set(1,0,0);
	        //moon.linearDamping = 0.0;
	        moon.preStep = gravity
	      	world.add(moon);
          	demo.addVisual(moon);
        },mPerAtmosphere);
          
          // We add the objects to the world to simulate them
          
          world.add(planet);

          // And we add them to the demo to make them visible
          
          demo.addVisual(planet);
          
          
                  var bodies = [];
        var i = 0;
        interval = setInterval(function(){
        	var moon = new CANNON.Body({ mass: lightMass });
        	        	
          	moon.addShape(lightShape);
          	
          	//moon.position.set(Math.random() * 30,Math.random() * 10-4,Math.random() * 10-4);
          	//moon.position.set(Math.random() * 30,Math.random() * 8-4,Math.random() * 8-4);
          	moon.position.set(Math.random() * 30,Math.random() * 6-3,Math.random() * 6-3);
          	//moon.velocity.set(0,0,8);
	        moon.velocity.set(-8,0,0);
	        moon.lastYVelocity = 0;
	        //moon.linearDamping = 0.0;
	        //moon.preStep = lightToHeat
	        moon.postStep = testPost
	      	world.add(moon);
	      	
          	demo.addVisual(moon,yellowMat);
          	bodies.push(moon)
          	
          	if(bodies.length>100){
                var b = bodies.shift();
                demo.removeVisual(b);
                world.remove(b);
            }
          	
            moon.addEventListener("collide",function(e){
            	
        		if(Math.random() < .5){
            		toRemove.push(this);
            		e.contact.heat += 1
            	}            	
                
            	
//                console.log("The sphere just collided with the ground!");
//                console.log("Collided with body:",e.body);
//                console.log("Contact between bodies:",e.contact);
            });
            for(b in toRemove){
                var pos = toRemove[b].position;
            	demo.removeVisual(toRemove[b]);
                world.remove(toRemove[b]);
                
//                var heat = new CANNON.Body({ mass: mass });
//	          	heat.addShape(lightShape);
//	          	heat.position=pos;
//		        
//		      	world.add(heat);
//	          	demo.addVisual(heat,redMat);
            }
            toRemove.length = 0;

        },mPerLight);
        
        });

      demo.start();