var myCanvas = document.getElementById('earthCanvas');
	var ctx = myCanvas.getContext('2d');
	var img = new Image;
	pData = []
	img.crossOrigin=null;
	
	img.onload = function(){
   	  intermediate = []
   	  colors = []
	  myCanvas.height = img.height;
	  myCanvas.width = img.width;
	  ctx.drawImage(img,0,0); // Or at whatever offset you like
	  radius = 10;	  
	  for(b = 0; b < myCanvas.height; b+=1){
//		var widthIncrement = Math.abs(myCanvas.height/2 - b)
//		
//		widthIncrement = widthIncrement * 50
//		
//		
//		widthIncrement = Math.abs(Math.floor(widthIncrement))
//		if(widthIncrement < 10){
//			widthIncrement = 10
//		}
//		widthIncrement = 50
	  	for(a = 0; a < myCanvas.width; a+=1){
	  		
			var pixelData = ctx.getImageData(a, b, 1, 1).data;
			colors.push([pixelData[0],pixelData[1],pixelData[2]])
			intermediate.push([a,b])
			
		}
	}
	//call copy(intermediate) in console and then paste into file  	
	console.log(intermediate)
		runEarth(intermediate,colors,img.width);
	};
	//img.src = "flatearth.jpg";
	img.src = "testSphere.png";
		