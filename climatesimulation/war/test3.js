



gravity =function(){

    // Get the vector pointing from the moon to the planet center
    var moon_to_planet = new CANNON.Vec3();
    this.position.negate(moon_to_planet);

    // Get distance from planet to moon
    var distance = moon_to_planet.norm();

    // Now apply force on moon
    // Fore is pointing in the moon-planet direction
    moon_to_planet.normalize();
    moon_to_planet.mult(1500/Math.pow(distance,2),this.force);
    updateHeat(this);
}



//1 do some more testing 
// a lots of small ground
// b visibility and speed
//
//1 very high levels of friction only a few materials

types = {}
function addType(type,visibility,color,shape,mass,sleepSpeed,SleepTimeLimit){
	types[type] = arguments
}

function useType(args){
	var obj = new CANNON.Body({ mass: args.mass });
	obj.addShape(args.shape);	
    moon.preStep = gravity    
    moon.allowSleep = true;
    obj.sleepSpeedLimit = args.sleepSpeed;// Body will feel sleepy if speed<1 (speed == norm of velocity)
    obj.sleepTimeLimit = args.sleepTimeLimit; // Body falls asleep after 1s of sleepiness
  	world.add(moon);
  	if(args.visibility)
  		demo.addVisual(moon,new THREE.MeshLambertMaterial( { color: args.color } ));
  	currentBody = moon;
}
layers = []
function addLayer(intervalAfter,type,position,amount,random,params){
	layers.push(arguments);
}
function useLayer(){
	for(idx in layers){
		args = layers[idx]
		amount = 0;
		setTimeout(function(){
		    useType(types[type])
		    randomFuncs[args.random](args.params)
			if(amount < args.amount)
				setTimeout(this,args.timeBetween)
			amount++;	
			
	   },args.intervalAfter);
	}
	
}
var randomFuncs = {}
randomFuncs.randomAllOver= function(shape){
	currentBody.position.set(Math.random() * 5,Math.random() * 6-3,Math.random() * 6-3);
}


var atmosphereShape = new CANNON.Sphere(1);
var heatShape = new CANNON.Sphere(0.1);
var lightShape = new CANNON.Sphere(0.05);
var planetShape = new CANNON.Sphere(1.5);
var particleShape = new CANNON.Particle();
addType("planet",false,null,planetShape,5,.1,0)
addType("dirt",true,0x49311C,particleShape,1,.1,1)
addType("greenery",true,0x00FF00,particleShape,1,.1,1)
addType("ocean",true,0x0000FF,particleShape,1,.1,3)
addType("atmosphere",false,null,atmosphereShape,.1,.1,3)
addType("clouds",true,0xFFFFFF,particleShape,1,.1,3)


var center = [0,0,0];
addLayer("planet",0,center,1)
addLayer("dirt",30,center,30,randomAllOver,{"shape":3});
addLayer("greenery",200,center,30,randomAllOver,{"shape":3});
addLayer("ocean",600,center,90,randomAllOver,{"shape":3});
addLayer("atmosphere",2000,center,30,randomAllOver,{"shape":3});
addLayer("clouds",3000,center,20,randomAllOver,{"shape":3});

//1 initial layer planet
//2 second layer dirt
//3 third layer vegetation
//4 fourth layer ocean  (basically all randomly positioned outside of earth to fall down)
//  dirt/vegetation falls asleep instantly at a relatively high speed
//  ocean falls asleep quickly
//5 conductivity, if set a method is added which based on that number on a collide distributes heat
//  based on it and the opposing conductivity
//6 reflectivity, chance of light bouncing off or becoming heat, (the filter determines light going through )  
//  
//1 layers
//2 restrictions
//
//1 add




function addObject(type,visibility,color,shape,position,mass,colorFilter,conductivity,reflectivity,sleepSpeed,sleepTimeLimit){
	var climate = {}
	climate.heat = 1;
	climate.conductivity = conductivity
	
	var obj = new CANNON.Body({ mass: mass });
	obj.addShape(shape);
	
	moon.colorFilter = Math.random() > .7 ? greenFilter : blueFilter;	
  	
  	
  	moon.addEventListener("collide",heatDistribute);
  	//moon.velocity.set(0,0,8);
    //moon.velocity.set(2,0,0);
    //moon.linearDamping = 0.0;
    moon.preStep = gravity
    
    moon.allowSleep = true;
     
    
    obj.sleepSpeedLimit = sleepSpeed;// Body will feel sleepy if speed<1 (speed == norm of velocity)
    obj.sleepTimeLimit = sleepTimeLimit; // Body falls asleep after 1s of sleepiness
  	world.add(moon);
  	if(visibility)
  		demo.addVisual(moon,new THREE.MeshLambertMaterial( { color: color } ));
}

//a conductivity
//b visibility (on/off)
//c filter group (view-source:http://schteppe.github.io/cannon.js/demos/collisionFilter.html)
//d density (ie mass) probably wont be that useful
//e layer (create equally all around in different layers)
//f light (chance of changing to heat)
//g colors
//h reflectivity  
//i change in color based on heat
//j axial tilt
//k sleepiness
//l size






redFilter = 0x030000;
greenFilter = 0x000300;
blueFilter = 0x000003;

function updateHeat(body){
	if(body.heat === undefined) return;
	colorFilter = body.colorFilter;
	demo.visuals[demo.bodies.indexOf(body)].children[0].material.color.setHex(0x110000+Math.floor(body.heat)*colorFilter)	
}




		testLight = false;
		//testLight = true;
		
		var mass = 5;
		var lightMass = .00001;
		mPerLight = 30
		mPerAtmosphere = 20
		totalAtmosphere = 200//5 // 200
		mPerHeat = 30
		totalHeat = 70
		var atmosphereShape = new CANNON.Sphere(0.5);
		var heatShape = new CANNON.Sphere(0.1);
        var lightShape = new CANNON.Sphere(0.05);
        var planetShape = new CANNON.Sphere(1.5);
        
		if(testLight){
			mPerLight = 1000
			mPerAtmosphere = 1000
		}

		// Use the preStep callback to apply the gravity force on the moon.
          // This callback is evoked each timestep.
        toRemove = []

        

        
        

        



        
		emissions =function(){
            updateHeat(this);
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
          world.solver.iterations = 1;
          world.allowSleep = true;
           
          
          var lightBaseShape = new CANNON.Sphere(0.5);
          var lightBase = new CANNON.Body({ mass: mass });
          lightBase.addShape(lightBaseShape);

          lightBase.position.set(6,0,0);
          lightBase.velocity.set(0,0,8);
          //lightBase.velocity.set(0,0,4);
          lightBase.linearDamping = 0.0;
          lightBase.preStep = gravity
          world.add(lightBase);
          demo.addVisual(lightBase);
          
          var planet = new CANNON.Body({ mass: 0 });
          planet.heat = 5;
          planet.heatDistribute = true;
          planet.addShape(planetShape);

          

		//for(a = 0 ; a < atmosphere ; a++){
        	
        //}
        currentAtmosphere = 0;
        
        heatDistribute = function(e){
            if(!e.contact.bi.heatDistribute||!e.body.heatDistribute){
            	return;
            }
      		var newHeat = (e.contact.bi.heat + e.body.heat) / 2;
      		e.contact.bi.heat = newHeat;
      		e.body.heat = newHeat;
        }
        
        heatDistributeEmissions = function(e){
            if(!e.contact.bi.heatDistribute||!e.body.heatDistribute){
            	return;
            }
      		var newHeat = (e.contact.bi.heat + e.body.heat) *.5;
      		e.contact.bi.heat = newHeat;
      		e.body.heat = newHeat;
        }
        
        
        atmosphereA = [];
        planet.addEventListener("collide",heatDistribute);
        interval = setInterval(function(){
        	currentAtmosphere++;
        	if(totalAtmosphere < currentAtmosphere){
        		return;
        	}
        	var moon = new CANNON.Body({ mass: mass });
        	moon.colorFilter = Math.random() > .7 ? greenFilter : blueFilter;
        	
        	moon.heat = 1;
        	moon.heatDistribute = true;
          	moon.addShape(atmosphereShape);
          	//moon.position.set(Math.random() * 30,Math.random() * 10-4,Math.random() * 10-4);
          	//moon.position.set(Math.random() * 30,Math.random() * 8-4,Math.random() * 8-4);
          	moon.position.set(Math.random() * 5,Math.random() * 6-3,Math.random() * 6-3);
          	
          	
          	moon.addEventListener("collide",heatDistribute);
          	//moon.velocity.set(0,0,8);
	        //moon.velocity.set(2,0,0);
	        //moon.linearDamping = 0.0;
	        moon.preStep = gravity
	        
	        moon.allowSleep = true;
            moon.sleepSpeedLimit = 0.1; 
            moon.sleepTimeLimit = 1;
	      	world.add(moon);
          	demo.addVisual(moon,new THREE.MeshLambertMaterial( { color: 0x777777 } ));
          	atmosphereA.push(moon);
        },mPerAtmosphere);
          
          // We add the objects to the world to simulate them
          
          world.add(planet);

          // And we add them to the demo to make them visible
          
          demo.addVisual(planet,new THREE.MeshLambertMaterial( { color: 0x777777 } ));
          
          
                  var bodies = [];
        var i = 0;
        interval = setInterval(function(){
        	var moon = new CANNON.Body({ mass: lightMass });
        	moon.addShape(new CANNON.Particle());
          	//moon.addShape(lightShape);
          	
          	//moon.position.set(Math.random() * 30,Math.random() * 10-4,Math.random() * 10-4);
          	//moon.position.set(Math.random() * 30,Math.random() * 8-4,Math.random() * 8-4);
          	//moon.position.set(Math.random() * 30,Math.random() * 6-3,Math.random() * 6-3);
        	//moon.position.set(Math.random() * 15+lightBase.position.x,Math.random() * 6-3+lightBase.position.y,Math.random() * 4-2+lightBase.position.z);
        	moon.position.set(Math.random() +lightBase.position.x,Math.random() +lightBase.position.y,Math.random() +lightBase.position.z);
          	//moon.velocity.set(0,0,8);
	        //moon.velocity.set(-8,0,0);
	        
	        //moon.linearDamping = 0.0;
	        
            

            
	      	world.add(moon);
	      	
          	demo.addVisual(moon,new THREE.MeshLambertMaterial( { color: 0xffff00 } ));
          	bodies.push(moon)
          	
          	var moon_to_planet = new CANNON.Vec3();
            moon.position.negate(moon_to_planet);
            var distance = moon_to_planet.norm();
            moon_to_planet.normalize();
            moon_to_planet.mult(1500/Math.pow(distance,2),moon.velocity);
            
          	if(bodies.length>100){
                var b = bodies.shift();
                demo.removeVisual(b);
                world.remove(b);
            }
          	
            moon.addEventListener("collide",function(e){
            	
        		if(Math.random() < .5){
        			var body
        			if(e.contact.bi.heatDistribute)
                    	body = e.contact.bi
                	else
                		body = e.body		
            		toRemove.push(this);
            		body.heat += 20
            		updateHeat(body);
            	}            	
                
            	
//                console.log("The sphere just collided with the ground!");
//                console.log("Collided with body:",e.body);
//                console.log("Contact between bodies:",e.contact);
            });
            for(b in toRemove){
                var pos = toRemove[b].position;
            	demo.removeVisual(toRemove[b]);
                world.remove(toRemove[b]);
                
            }
            toRemove.length = 0;

        },mPerLight);
        
        hDA = []
        setTimeout(function(){
        	
        	 var moon = new CANNON.Body({ mass: lightMass });
        	moon.heat = 1;
        	moon.heatDistribute = true;
          	moon.addShape(heatShape);
          	//moon.position.set(Math.random() * 30,Math.random() * 10-4,Math.random() * 10-4);
          	//moon.position.set(Math.random() * 30,Math.random() * 8-4,Math.random() * 8-4);
          	moon.position.set(Math.random() * 6 -3 ,Math.random() * 6-3,Math.random() * 6-3);
          	
          	moon.colorFilter = redFilter;
          	moon.addEventListener("collide",heatDistributeEmissions);
          	//moon.velocity.set(0,0,8);
	        //moon.velocity.set(1,0,0);
	        //moon.linearDamping = 0.0;
          	moon.preStep = emissions;
	      	world.add(moon);
	      	
          	demo.addVisual(moon,new THREE.MeshLambertMaterial( { color: 0x000000 } ));
          	hDA.push(moon)
          	if(hDA.length > totalHeat){          		
          		var b = hDA.shift();
                demo.removeVisual(b);
                world.remove(b);
          	}
          	setTimeout(this,mPerHeat)
        },mPerHeat);



        });

      demo.start();
      
      var data = {
    		    labels: [""],
    		    datasets: [
    		        {
    		            label: "My First dataset",
    		            fillColor: "rgba(220,220,220,0.5)",
    		            strokeColor: "rgba(220,220,220,0.8)",
    		            highlightFill: "rgba(220,220,220,0.75)",
    		            highlightStroke: "rgba(220,220,220,1)",
    		            data: [0]
    		        }
    		        ,
    		        {
    		            label: "My Second dataset",
    		            fillColor: "rgba(151,187,205,0.5)",
    		            strokeColor: "rgba(151,187,205,0.8)",
    		            highlightFill: "rgba(151,187,205,0.75)",
    		            highlightStroke: "rgba(151,187,205,1)",
    		            data: [0]
    		        }
    		    ]
    		};
    		var ctx = document.getElementById("myChart").getContext("2d");
    		var myBarChart = new Chart(ctx).Bar(data, {});
      differenceA = []
      interval = setInterval(function(){
    	dataPos = {}  
      	for(a in atmosphereA){
      		var ypos =atmosphereA[a].position.y;
      		ypos = Math.round(ypos);
      		if(dataPos[ypos] === undefined)
      			dataPos[ypos] = []
      		dataPos[ypos].push(atmosphereA[a].heat)
      	}
      	dataAvg = {}
      	for(a in dataPos){
      		var avg = 0;
      		for(b in dataPos[a]){
      			avg+=dataPos[a][b]
      		}
      		avg = avg/dataPos[a].length
      		dataAvg[a]= avg
      	}
      	var lowestAmount = 9999999;
      	var highestAmount = 0;
      	for(a in dataAvg){
      		var b = dataAvg[a];
      		if(b > highestAmount)
      			highestAmount = b
      		if(b < lowestAmount)
      			lowestAmount = b
      			
      	}
      	mPerHeat += 30
    	myBarChart.addData([highestAmount,highestAmount - lowestAmount],mPerHeat)
    	// Would update the first dataset's value of 'March' to be 50
    	//myBarChart.update();
     	
     },10 * 1000);      