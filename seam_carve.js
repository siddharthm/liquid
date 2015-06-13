
function scImage(img){
	this.init(img);
}

scImage.prototype.init=function(img){
	this.img=img
	this.width=img.width;
	this.height=img.height;
	this.pixels=this.getPixelMat(img);
}

scImage.prototype.getPixelMat=function(img){
	var c=document.createElement("canvas");
	c.setAttribute("width",this.width);
	c.setAttribute("height",this.height);
	var ctx=c.getContext("2d");
	ctx.drawImage(img,0,0,this.width,this.height);
	data=ctx.getImageData(0,0,this.width,this.height).data;
	var mat=new Array(this.height);
	for(var i=0;i<this.height;i++){
		mat[i]=new Array(this.width);
		for(var j=0;j<this.width;j++){
			var start=(i*this.width+j)*4;
			mat[i][j]=[data[start],data[start+1],data[start+2],data[start+3] ];
		}
	}
	return mat;
}

scImage.prototype.getData=function(){
	data=new Array();
	for(var i=0;i<this.height;i++){
		for(var j=0;j<this.width;j++){
			data.push.apply(data,this.pixels[i][j]);
		}
	}
	return data;
}

scImage.prototype.getImage=function(){
	var c=document.createElement("canvas");
	c.width=this.width;
	c.height=this.height;
	var ctx=c.getContext("2d");
	var newImg=ctx.createImageData(c.width,c.height);
	var data=this.getData();
	for(var i=0;i<data.length;i++)
		newImg.data[i]=data[i];
	ctx.putImageData(newImg,0,0);
	var img=document.createElement("img");
	img.width=c.width;
	img.height=c.height;
	img.src=c.toDataURL();
	this.img=img;
	this.init(this.img);
	return img;
}

scImage.prototype.resize=function(newW,newH){
	var c=document.createElement("canvas");
	c.width=newW;
	if(!newH)
		newH=Math.floor((newW*this.height)/this.width);
	c.height=newH;
	var ctx=c.getContext("2d");
	img=this.getImage();
	ctx.drawImage(img,0,0,newW,newH);	
	img.src=c.toDataURL();
	img.width=newW;
	img.height=newH;
    this.init(img);
}

scImage.prototype.energy_fn={"e1":function(x,y,pixels,manEMap){
	// Not using manEMap, input for maintaining standard
	var sum=function(arr){
		return arr[0]+arr[1]+arr[2];
	}
	var width=pixels[0].length;
	var height=pixels.length;

	var grad_x,grad_y;
	if(x==0)
		grad_x=sum(pixels[x+1][y])-sum(pixels[x][y]);
	else if(x==(height-1))
		grad_x=sum(pixels[x][y])-sum(pixels[x-1][y]);
	else
		grad_x=sum(pixels[x+1][y])-sum(pixels[x-1][y]);
		
	if(y==0)
		grad_y=sum(pixels[x][y+1])-sum(pixels[x][y]);
	else if(y==(width-1))
		grad_y=sum(pixels[x][y])-sum(pixels[x][y-1]);
	else
		grad_y=sum(pixels[x][y+1])-sum(pixels[x][y-1]);
	
	grad_x=Math.abs(grad_x)
	grad_y=Math.abs(grad_y)

	return (grad_x+grad_y)>>1;
	},"e1_mark":function(x,y,pixels,manEMap){
	var sum=function(arr){
		return arr[0]+arr[1]+arr[2];
	}
	var width=pixels[0].length;
	var height=pixels.length;

	var grad_x,grad_y;
	if(x==0)
		grad_x=sum(pixels[x+1][y])-sum(pixels[x][y]);
	else if(x==(height-1))
		grad_x=sum(pixels[x][y])-sum(pixels[x-1][y]);
	else
		grad_x=sum(pixels[x+1][y])-sum(pixels[x-1][y]);
		
	if(y==0)
		grad_y=sum(pixels[x][y+1])-sum(pixels[x][y]);
	else if(y==(width-1))
		grad_y=sum(pixels[x][y])-sum(pixels[x][y-1]);
	else
		grad_y=sum(pixels[x][y+1])-sum(pixels[x][y-1]);
	
	grad_x=Math.abs(grad_x)
	grad_y=Math.abs(grad_y)

	energyxy=(grad_x+grad_y)>>1;
	if(manEMap&&manEMap[x][y]==1){
			return 255;
		}
		else if(manEMap&&manEMap[x][y]==-1){
			return 0;
		}
		else{
			// To give higher priority to neutral pixels than red pixels
			exy=16+energyxy;
			if(exy>255)
				return 255;
			else
				return exy;
		}
	}

};

scImage.prototype.energyMap=function(energy_fn){
	var energyMap=new Array(this.height);
	for(var x=0;x<this.height;x++){
		energyMap[x]=new Array(this.width);
		for(var y=0;y<this.width;y++){
			energyMap[x][y]=energy_fn(x,y,this.pixels,this.manEMap);
		}
	}
	return energyMap;
}

scImage.prototype.plotEnergyMap=function(energyMap,seamPaths){
	var data=new Array();
	var height=energyMap.length;
	var width=energyMap[0].length;
	for(var i=0;i<height;i++){
		for(var j=0;j<width;j++){
			var b=energyMap[i][j];
			data.push(b,b,b,255);
		}
	}
	if(seamPaths){
		for(var i=0;i<seamPaths.length;i++){
			var path=seamPaths[i];
			for(var y=0;y<height;y++){
				var y1=height-y-1;
				var x=path[y];
				data[(y1*width+x)*4]=255;
				data[(y1*width+x)*4+1]=0;
				data[(y1*width+x)*4+2]=0;
			}
		}
	}
	c=document.createElement("canvas");
	c.width=this.width;
	c.height=this.height;
	var ctx=c.getContext("2d");
	var newImg=ctx.createImageData(c.width,c.height);
	for(var i=0;i<data.length;i++)
		newImg.data[i]=data[i];
	ctx.putImageData(newImg,0,0);
	var img=document.createElement("img");
	img.src=c.toDataURL();
	img.width=c.width;
	img.height=c.height;
	return img;
}		

scImage.prototype.calculateSeamMatrixVertical=function(energyMap){
	var min3=function(dpMat,i,j,w,h){
		if(j==(w-1))
			return (dpMat[i-1][j]<dpMat[i-1][j-1])?dpMat[i-1][j]:dpMat[i-1][j-1];
		var min=(dpMat[i-1][j]<dpMat[i-1][j+1])?dpMat[i-1][j]:dpMat[i-1][j+1];
		if(j==0)
			return min;
		else
			return (min<dpMat[i-1][j-1])?min:dpMat[i-1][j-1];
	};

	var width=this.width;
	var height=this.height;
	var dpMat=new Array(height);
	dpMat[0]=new Array(width);
	for(var i=0;i<width;i++)
		dpMat[0][i]=energyMap[0][i];

	for(var i=1;i<height;i++){
		dpMat[i]=new Array(width);
		for(var j=0;j<width;j++){
			dpMat[i][j]=energyMap[i][j]+min3(dpMat,i,j,width,height);
		}
	}
	/*
	var str="";
	for(var i=0;i<height;i++){
		for(var j=0;j<width;j++)
			str=str+" "+dpMat[i][j].toString();
		str+="<br/>";
	}
	$("#matrix").append(str);
	*/
	return dpMat;
}

scImage.prototype.getVerticalPath=function(seamMat,seamPixels,i,w,h){
	var min3=function(dpMat,seamPixels,i,j,w,h){
		var neighbours=new Array();
		if(!seamPixels[i-1][j]){
			neighbours.push([seamMat[i-1][j],j])
		}
		for(var k=j+1;k<w&&seamPixels[i-1][k];k++);
		if(k<w)
			neighbours.push([seamMat[i-1][k],k]);
		for(var k=j-1;k>=0&&seamPixels[i-1][k];k--);
		if(k>=0)
			neighbours.push([seamMat[i-1][k],k]);
		neighbours.sort(function(a,b){return a[0]>=b[0]?1:-1;});
		return neighbours[0][1];
	};

	var path=new Array();
	path.push(i);
	for(var i=h-1;i>0;i--){
		var j=min3(seamMat,seamPixels,i,path[path.length-1],w,h);
		path.push(j);
	}
	return path;
}

scImage.prototype.getVerticalSeams=function(seamMat,n){
	// seamMat is the seam matrix calculated from calculateSeamMatrix
	// n is the no of seams to be found
	var width=this.width;
	var height=this.height;

	// seamPixels is a width*height matrix in which the entry i,j
	// is 1 if a pixel is already in path of a seam
	var seamPixels=new Array(height);
	for(var i=0;i<height;i++){
		seamPixels[i]=new Array(width);
		for(var j=0;j<width;j++)
			seamPixels[i][j]=0;
	}

	var arr=new Array(width);
	for(var i=0;i<width;i++)
		arr[i]=[seamMat[height-1][i],i];

	arr.sort(function(x,y){ return (x[0]>=y[0])?1:-1 ;});
	var paths=new Array();
	for(var i=0;i<n;i++){
		var path=this.getVerticalPath(seamMat,seamPixels,arr[i][1],width,height);
		paths.push(path);
		for(var x=height-1;x>=0;x--){
			seamPixels[x][path[height-x-1]]=1;	
		}
	}
	return [paths,seamPixels];
}

scImage.prototype.shrinkEMap=function(emap,seamPixels,n){
	var height=this.height;
	var width=this.width;
	var newWidth=width-n;
	var newHeight=height;
	var resizedImgPixels=new Array(newHeight);
	for(var i=0;i<newHeight;i++){
		resizedImgPixels[i]=new Array(newWidth);
		var skip=0;
		for(var j=0;j<width;j++){
			if(seamPixels[i][j])
				skip+=1;
			else
				resizedImgPixels[i][j-skip]=emap[i][j];
		}
	}
	return resizedImgPixels;
}

scImage.prototype.expandEMap=function(emap,seamPixels,n){
	var height=this.height;
	var width=this.width;
	var newWidth=width+n;
	var newHeight=height;
	var resizedImgPixels=new Array(newHeight);
	for(var i=0;i<newHeight;i++){
		resizedImgPixels[i]=new Array(newWidth);
		var notCopy=true;
		var curr=0;
		for(var j=0;j<newWidth;j++){
			resizedImgPixels[i][j]=emap[i][curr];
			if(notCopy&&seamPixels[i][curr])
				notCopy=false;
			else{
				curr+=1;
				notCopy=true;
			}
		}
	}
	return resizedImgPixels;
}

scImage.prototype.removeSeamsVertical=function(seamPixels,n){
	var height=this.height;
	var width=this.width;
	var newWidth=width-n;
	var newHeight=height;
	var resizedImgPixels=new Array(newHeight);
	for(var i=0;i<newHeight;i++){
		resizedImgPixels[i]=new Array(newWidth);
		var skip=0;
		for(var j=0;j<width;j++){
			if(seamPixels[i][j])
				skip+=1;
			else
				resizedImgPixels[i][j-skip]=this.pixels[i][j];
		}
	}
	this.pixels=resizedImgPixels;
	this.width=newWidth;
	this.height=newHeight;
	this.img=this.getImage();
}

scImage.prototype.enlargeVertical=function(seamPixels,n){
	var height=this.height;
	var width=this.width;
	var newWidth=width+n;
	var newHeight=height;
	var resizedImgPixels=new Array(newHeight);
	for(var i=0;i<newHeight;i++){
		resizedImgPixels[i]=new Array(newWidth);
		var notCopy=true;
		var curr=0;
		for(var j=0;j<newWidth;j++){
			resizedImgPixels[i][j]=this.pixels[i][curr];
			if(notCopy&&seamPixels[i][curr])
				notCopy=false;
			else{
				curr+=1;
				notCopy=true;
			}
		}
	}
	this.pixels=resizedImgPixels;
	this.width=newWidth;
	this.height=newHeight;
	this.img=this.getImage();
}

scImage.prototype.rotate=function(degree){
	var c=document.createElement("canvas");
	c.width=this.height;
	c.height=this.width;
	var ctx=c.getContext("2d");
	ctx.save();
	ctx.translate(c.width/2, c.height/2);
	ctx.rotate(degree);
	ctx.drawImage(this.img,-this.img.width/2,-this.img.height/2);
	var img=document.createElement("img");
	img.width=c.width;
	img.height=c.height;
	img.src=c.toDataURL();
	this.img=img;
	this.init(this.img);
}

scImage.prototype.manEMapResize=function(manEMap,newW,newH){
	var h=manEMap.length;
	var w=manEMap[0].length;
	

	var c=document.createElement("canvas");
	c.width=w;
	c.height=h;
	var ctx=c.getContext("2d");
	var imgData=ctx.getImageData(0,0,w,h);

	for(var i=0;i<h;i++){
		for(var j=0;j<w;j++){
			if(manEMap[i][j]==1)
				imgData.data[(i*w+j)*4]=255;
			else if(manEMap[i][j]==-1)
				imgData.data[(i*w+j)*4]=0;
			else if(manEMap[i][j]==0)
				imgData.data[(i*w+j)*4]=128;
			imgData.data[(i*w+j)*4+3]=255;

		}
	}
	ctx.putImageData(imgData,0,0);
	var img=document.createElement("img");
	img.height=h;
	img.width=w;
	img.src=c.toDataURL();
	var c2=document.createElement("canvas");
	c2.height=newH;
	c2.width=newW;
	ctx2=c2.getContext("2d");
	ctx2.drawImage(img,0,0,w,h,0,0,newW,newH);

	var imgData=ctx2.getImageData(0,0,newW,newH).data;
	var eMap=new Array(newH);
	for(var i=0;i<newH;i++){
		eMap[i]=new Array(newW);
		for(var j=0;j<newW;j++){
			var r=imgData[(i*newW+j)*4];
			if(r<=256&&r>192){
				eMap[i][j]=1;
			}
			else if(r>=0&&r<=64){
				eMap[i][j]=-1;
			}
			else if(r>64&&r<=192){
				eMap[i][j]=0;
			}
			else
				console.log("hi",r);
		}
	}
	//$("body").append($(c2));
	return eMap;
}

scImage.prototype.seam_carve=function(newW,newH,manEMap){
	var width=this.width;
	var height=this.height;
	if(!newH)
		var newH=this.height;
	var aspectW=Math.ceil((newH*width)/height);
	var n=Math.abs(newW-aspectW);
	this.resize(aspectW,newH);
	if(manEMap)
		this.manEMap=this.manEMapResize(manEMap,aspectW,newH);
	var currWidth=width;
	var totalSeams=0;
	var enlarge=(newW>aspectW);
	var totalRemoved=0;
	var div;
	if(enlarge)
		div=20;
	else
		div=50;
	var step=Math.floor(currWidth/div);
	while(totalRemoved<n){
		if(totalRemoved+step<=n){
			this.seam_carve_width(enlarge,step);
		}
		else{
			step=n-totalRemoved;
			this.seam_carve_width(enlarge,step);
		}
		totalRemoved+=step;
		if(enlarge)
			currWidth+=step;
		else
			currWidth-=step;
		step=Math.floor(currWidth/div);
	}
	//this.rotate(Math.PI/2);
	//this.seam_carve_width(false,10);
	//this.rotate(-Math.PI/2);

}

scImage.prototype.seam_carve_width=function(enlarge,n){
	if(enlarge)
		var emap=this.energyMap(this.energy_fn.e1);
	else
		var emap=this.energyMap(this.energy_fn.e1_mark);
	var seamEnergyMatrixVertical=this.calculateSeamMatrixVertical(emap);
	var arr=this.getVerticalSeams(seamEnergyMatrixVertical,n);
	var paths=arr[0];
	var seamPixels=arr[1];
	if(enlarge){
		if(this.manEMap)
			this.manEMap=this.expandEMap(this.manEMap,seamPixels,n);
		this.enlargeVertical(seamPixels,n);
	}
	else{
		if(this.manEMap)
			this.manEMap=this.shrinkEMap(this.manEMap,seamPixels,n);
		this.removeSeamsVertical(seamPixels,n);
	}
}

scImage.prototype.nearest_aspect_ratio=function(w,h){
	var width=this.width;
	var height=this.height;
	var aspH=Math.floor((height*w)/width);
	var aspW=Math.floor((width*h)/height);
	var centChangeH=Math.floor(Math.abs((aspH-height)/height));
	var centChangeW=Math.floor(Math.abs((aspW-width)/width));
	if(centChangeW<centChangeH)
		this.resize(aspW,h);
	else
		this.resize(w,aspH);
}

scImage.prototype.crop=function(x1,y1,x2,y2){
	var c=document.createElement("canvas");
	var newW=x2-x1+1;
	var newH=y2-y1+1;

	c.width=newW;
	c.height=newH;
	var ctx=c.getContext("2d");
	img=this.getImage();
	ctx.drawImage(img,x1,y1,newW,newH,0,0,newW,newH);	
	img.src=c.toDataURL();
	img.width=newW;
	img.height=newH;
    this.init(img);
}
