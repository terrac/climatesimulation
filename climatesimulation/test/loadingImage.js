var myCanvas = document.getElementById('earthCanvas');
	var ctx = myCanvas.getContext('2d');
	var img = new Image;
	pData = []
	img.crossOrigin=null;
	
	img.onload = function(){
   	  intermediate = []
	  myCanvas.height = img.height;
	  myCanvas.width = img.width;
	  ctx.drawImage(img,0,0); // Or at whatever offset you like
	  radius = 10;	  
	  for(b = 0; b < myCanvas.height; b+=1){
		var widthIncrement = Math.abs(myCanvas.height/2 - b)
		//console.log(widthIncrement)
		widthIncrement = (widthIncrement+5)* 20
		
		console.log(widthIncrement)
		widthIncrement = Math.floor(widthIncrement)
	  	for(a = 0; a* widthIncrement < myCanvas.width; a+=1){
	  		
			var pixelData = ctx.getImageData(a* widthIncrement, b, 1, 1).data;
			intermediate.push([a,b,[pixelData[0],pixelData[1],pixelData[2]]])
			theta = 2 * Math.PI * a;//U
			phi = Math.PI * b;//V
			
			//_x = Math.cos(theta) * Math.sin(phi) * radius;
			//y = Math.sin(theta) * Math.sin(phi) * radius;
			//y *= 10^26
			//_z = -Math.cos(phi) * radius;
			x = Math.cos(a)* radius;
			y = Math.sin(a)* radius * Math.PI;
			z = Math.cos(b)* radius;
			
			pData.push([x,y,z,pixelData])
		}
	}
	//call copy(intermediate) in console and then paste into file  	
	console.log(intermediate)
	};
	img.src = "flatearth.jpg";    
		