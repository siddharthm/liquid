var loadMarker=function(src){
	img=$("<img />");
	img.attr("src",src);
	img.load(function(){
		var im=$("<img />");
		var cvs=$("#step1_cvs");
		im.attr("src",src);
		var w=im[0].width;
		var h=im[0].height;
		cvs.attr("width",w);
		cvs.attr("height",h);
		var ctx=cvs[0].getContext("2d");
		var color_green='rgba(0,255,0,0.5)'; 
		var color_red='rgba(255,0,0,0.4)'; 
		var brushColor=color_green;
		var brushSize=10;
		var paths=new Array();
		ctx.drawImage(im[0],0,0);

		var refresh=function(paths){
			ctx.clearRect(0,0,w,h);	
			ctx.drawImage(im[0],0,0);
			for(var i=0;i<paths.length;i++){
				ctx.beginPath();
				ctx.lineWidth=paths[i].brushSize;
				ctx.strokeStyle=paths[i].brushColor;
				for(var j=0;j<paths[i].pathArr.length;j++){
					ctx.lineTo(paths[i].pathArr[j][0],paths[i].pathArr[j][1]);
				}
				ctx.stroke();
			}
		}

		var getEnergyMap=function(paths){
			var c=$("<canvas />");
			c.attr("width",w);
			c.attr("height",h);
			var ctx2=c[0].getContext("2d");
			for(var i=0;i<paths.length;i++){
				ctx2.beginPath();
				ctx2.lineWidth=paths[i].brushSize;
				ctx2.strokeStyle=paths[i].brushColor;
				for(var j=0;j<paths[i].pathArr.length;j++){
					ctx2.lineTo(paths[i].pathArr[j][0],paths[i].pathArr[j][1]);
				}
				ctx2.stroke();
			}
			var imgData=ctx2.getImageData(0,0,w,h).data;
			var eMap=new Array(h);
			for(var i=0;i<h;i++){
				eMap[i]=new Array(w);
				for(var j=0;j<w;j++){
					var r=imgData[(i*w+j)*4];
					var g=imgData[(i*w+j)*4+1];
					var b=imgData[(i*w+j)*4+2];
					var a=imgData[(i*w+j)*4+3];
					if(r==0&&g==0){
						eMap[i][j]=0;
					}
					else if(r>g){
						eMap[i][j]=-1;
					}
					else if(g>=r){
						eMap[i][j]=1;
					}

				}
			}
			// Set global variable manEMap which will be used by seam carve algorithm
			manEMap=eMap;
		}

		cvs.mousedown(function(event){
			var pathObj={"pathArr":[]};
			pathObj.brushColor=brushColor;
			pathObj.brushSize=brushSize;
			paths.push(pathObj);
			cvs.mousemove(function(event){
				var x1= event.pageX - cvs.offset().left;
				var y1= event.pageY - cvs.offset().top;
				paths[paths.length-1].pathArr.push([x1,y1]);
				refresh(paths);
				getEnergyMap(paths);
			});
		});

		cvs.on("mouseout mouseup",function(event){
			cvs.unbind("mousemove");
		});

		// Reset image marking
		$("#step1_reset").click(function(event){
			ctx.drawImage(im[0],0,0);
			paths=new Array();
		});

		// Change color of brush
		var color_li=$("#step1_colorPicker");
		$("#step1_color_green").click(function(event){
			color_li.find("#txt").text($(this).text());
			brushColor=color_green;
		});
		$("#step1_color_red").click(function(event){
			color_li.find("#txt").text($(this).text());
			brushColor=color_red;
		});

		// Change Brush size
		$("#step1_brush_size").click(function(event){
			event.stopPropagation();
		});
		$("#step1_brush_size").change(function(event){
			brushSize=parseInt($(this).val());
		});


	});




}
