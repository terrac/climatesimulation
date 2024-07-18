var projector = new THREE.Projector();
function onMouseDown(e) {
    // Find mesh from a ray
    var entities = findNearestIntersectingObject(e.clientX, e.clientY, demo.camera, demo.visuals);
    
    if (entities) {
        var ret = "";
        var typeSet = new Set();
        for(eIdx in entities){
            var idx = demo.visuals.indexOf(entities[eIdx].object.parent);
            if (idx !== -1&&demo.bodies[idx].cli !== undefined&&!typeSet.has(demo.bodies[idx].cli.type)) {
                
			    var farenheightRatio = $("#farenheightRatio").val();
			    if(demo.bodies[idx].cli.heat)
			        demo.bodies[idx].cli.farenheightTemp = demo.bodies[idx].cli.heat * farenheightRatio;
                ret += JSON.stringify(demo.bodies[idx].cli,null,'\t')
                typeSet.add(demo.bodies[idx].cli.type);
            }
        }
        
        $("#showClimateData")[0].innerHTML= ret
             
        
    }
}

function findNearestIntersectingObject(clientX, clientY, camera, objects) {
    // Get the picking ray from the point
    var raycaster = getRayCasterFromScreenCoord(clientX, clientY, camera, projector);

    // Find the closest intersecting object
    // Now, cast the ray all render objects in the scene to see if they collide.
    return raycaster.intersectObjects(objects,true);
  
}

// Function that returns a raycaster to use to find intersecting objects
// in a scene given screen pos and a camera, and a projector
function getRayCasterFromScreenCoord(screenX, screenY, camera, projector) {
    var mouse3D = new THREE.Vector3();
    // Get 3D point form the client x y
    mouse3D.x = (screenX / window.innerWidth) * 2 - 1;
    mouse3D.y = -(screenY / window.innerHeight) * 2 + 1;
    mouse3D.z = 0.5;
    return projector.pickingRay(mouse3D, camera);
}


//$(demo.renderer.domElement).mousedown(onMouseDown);
  
$(demo.renderer.domElement)
  .mousemove(onMouseDown);  
