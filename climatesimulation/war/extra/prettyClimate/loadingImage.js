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
	  for(b = 0; b < myCanvas.height; b+=30){
		var widthIncrement = Math.cos(2 * Math.PI *b/myCanvas.height) * 20;
		if(b < 70){
			//widthIncrement *= Math.abs(myCanvas.height/2 - b)* .03
		}
		if(b > myCanvas.height - 70){
			//break;
			//widthIncrement *= Math.abs(myCanvas.height/2 - b)* .03
		}
		
		widthIncrement = 40+ widthIncrement
		
	  	for(a = 0; a < myCanvas.width-40; a+=widthIncrement){
	  		
			var pixelData = ctx.getImageData(a, b, 1, 1).data;
			intermediate.push([a,b,[pixelData[0],pixelData[1],pixelData[2]]])
			
		}
	}
	//call copy(intermediate) in console and then paste into file  	
	console.log(intermediate)
		runEarth(img.height,img.width);
	};
	img.src = "flatearth2.jpg";
	//img.src = "flatEarth4.jpg";
	//img.src = "marioEarth.png";
		