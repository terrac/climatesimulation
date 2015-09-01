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
	  for(b = 0; b < myCanvas.height; b+=25){
		var widthIncrement = Math.abs(myCanvas.height/2 - b)
//		
//		widthIncrement = widthIncrement * 50
//		
//		
//		widthIncrement = Math.abs(Math.floor(widthIncrement))
//		if(widthIncrement < 10){
//			widthIncrement = 10
//		}
//		widthIncrement = 50
	  	for(a = 0; a < myCanvas.width; a+=25+ widthIncrement){
	  		
			var pixelData = ctx.getImageData(a, b, 1, 1).data;
			intermediate.push([a,b,[pixelData[0],pixelData[1],pixelData[2]]])
			
		}
	}
	//call copy(intermediate) in console and then paste into file  	
	console.log(intermediate)
		runEarth(img.height,img.width);
	};
	img.src = "flatearth2.jpg";
	//img.src = "testSphere.png";
		