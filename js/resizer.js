var loadResizer=function(src,emap){
	img = $("<img />");
	img.attr('src',src);
	img.load(function(){
		img=new scImage(this);
		var im=$(img.getImage());
		var im2=$(img.getImage());
		var im3=$(img.getImage());
		im3.hide();
		im2.attr("id","resized_img");
		var im_original=$(img.getImage());
		var im_original2=$(img.getImage());
		im2.attr("title","seamcarved Image");
		$("#img_p").append(im2);
		//$("#img_p").append(im3);
		var c=$("#cvs");
		var w=parseInt(im.attr("width"));
		var h=parseInt(im.attr("height"));
		var lineWidth=4;
		var aspectLock=false;
		var cropLock=false;
		var cropX1;
		var cropY1;
		var updateCanvas=function(c,im,w,h,lineWidth){
			w=Math.floor(w);
			h=Math.floor(h);
			c.attr("width",w+lineWidth);
			c.attr("height",h+lineWidth);
			c.attr("imgW",w);
			c.attr("imgH",h);
			var ctx=c[0].getContext("2d");
			ctx.drawImage(im[0],0,0,w,h);
			ctx.strokeStyle="#000000";
			//ctx.setLineDash([7,7]);

			ctx.beginPath();
			ctx.moveTo(w+1,0);
			ctx.lineTo(w+1,h+1);
			ctx.lineTo(0,h);
			ctx.lineWidth=lineWidth;
			ctx.stroke();
			ctx.closePath();
			$("#statusDiv").html(Math.floor(w).toString()+"X"+Math.floor(h).toString());
			var img_data=ctx.getImageData(0,0,w,h);
			var newC=document.createElement("canvas");
			newC.height=h;
			newC.width=w;
			newC.getContext("2d").putImageData(img_data,0,0);
			var a_left=$("#a_downloadL");
			a_left.attr("href",im[0].src);
			a_left.attr("download","image.jpg");
				
		}
		updateCanvas(c,im_original,w,h,lineWidth);
		var cursorChange=function(event){
			var x= event.pageX - c.offset().left;
			var y= event.pageY - c.offset().top;
			if(cropLock){
				if(x<w&&y<h){
					c.css("cursor","crosshair");
				}
			}
			else{
				if((x>=w&&x<=(w+lineWidth))||(y>=h&&y<=(h+lineWidth))){
					c.css("cursor","move");
				}
				else{
					c.css("cursor","default");
				}
			}

		};
		c.mousemove(cursorChange);
		c.mousedown({"c":c},function(event){
			c.mousemove(cursorChange);
			var x= event.pageX - event.data.c.offset().left;
			var y= event.pageY - event.data.c.offset().top;
			if(!cropLock){
				if((x>=w&&x<=(w+lineWidth))&&(y>=h&&y<=(h+lineWidth))){
					event.data.c.mousemove({"c":event.data.c},function(event){
						var x= event.pageX - event.data.c.offset().left;
						var y= event.pageY - event.data.c.offset().top;
						w=x;h=y;
						updateCanvas(event.data.c,im_original,x,y,lineWidth);
					});
				}
				else if((x>=w&&x<=(w+lineWidth))){
					event.data.c.mousemove({"c":event.data.c},function(event){
						var x= event.pageX - event.data.c.offset().left;
						w=x;
						updateCanvas(event.data.c,im_original,x,h,lineWidth);
					});
				}
				else if((y>=h&&y<=(h+lineWidth))){
					event.data.c.mousemove({"c":event.data.c},function(event){
						var y= event.pageY - event.data.c.offset().top;
						h=y;
						updateCanvas(event.data.c,im_original,w,y,lineWidth);
					});
				}
			}
			else{
				cropX1=x;
				cropY1=y;
			}
		});
		c.mouseup({"c":c,"img":im_original,"img2":im2},function(event){
			event.data.c.unbind("mousemove");
			if(cropLock){
				var im=new scImage(event.data.img[0]);
				var x= event.pageX - event.data.c.offset().left;
				var y= event.pageY - event.data.c.offset().top;
				cropX2=x;
				cropY2=y;
				im.crop(cropX1,cropY1,cropX2,cropY2);
				im2.attr("src",im.getImage().src);
				w=im.width;
				h=im.height;
				im2.attr("height",h);
				im2.attr("width",w);
				im2[0].height=h;
				im2[0].width=w;
				im_original=$(im.getImage());
				updateCanvas(event.data.c,im2,w,h,lineWidth);
				$("#cropUL").click();

			}
			else{
				var im=new scImage(event.data.img[0]);
				var w=c.attr("imgW"),h=c.attr("imgH");

				im.seam_carve(w,h,emap);
				im2.attr("src",im.getImage().src);
				im2.attr("height",im.height);
				im2.attr("width",im.width);

				var im=new scImage(event.data.img[0]);
				im.nearest_aspect_ratio(w,h);
				im3.attr("src",im.getImage().src);
				im3.attr("height",im.height);
				im3.attr("width",im.width);
				event.data.c.mousemove(cursorChange);

			}
			event.data.c.mousemove(cursorChange);
			var a_right=$("#a_downloadR");
			a_right.attr("href",im2.attr("src"));
			a_right.attr("download","image.jpg");
		});
		$("#reset").click({"c":c,"img":im_original2},function(event){
			var im=new scImage(event.data.img[0]);
			im2.attr("src",im.getImage().src);
			im2.attr("height",im.height);
			im2.attr("width",im.width);
			w=im.width;
			h=im.height;
			updateCanvas(event.data.c,im2,w,h,lineWidth);

			var a_right=$("#a_downloadR");
			a_right.attr("href",im2.attr("src"));
			a_right.attr("download","image.jpg");
		});
		$(".noSpin").click(function(event){
			event.stopPropagation();
		});
		$("#aspectL").click(function(e){
			$("#aspectL").hide();
			$("#aspectUL").show();
			aspectLock=false;
		});
		$("#aspectUL").click(function(e){
			$("#aspectL").show();
			$("#aspectUL").hide();
			aspectLock=true;
		});
		$("#cropL").click(function(e){
			$("#cropL").hide();
			$("#cropUL").show();
			cropLock=true;
		});
		$("#cropUL").click(function(e){
			$("#cropL").show();
			$("#cropUL").hide();
			cropLock=false;
		});

		$(".increase, .decrease").click({"c":c,"img":im_original},function(event){
			var im=new scImage(event.data.img[0]);
			var im_orig=new scImage(event.data.img[0]);
			//var w=event.data.c.attr("width");
			//var h=event.data.c.attr("height");
			var newW=w,newH=h;
			if($(this).hasClass("height")){
				var stepSize=parseInt($("#stepH").val());
				if($(this).hasClass("decrease"))
					stepSize=-stepSize;
				newH+=stepSize;
				if(aspectLock)
					newW=Math.floor((w*newH)/h);
			}
			else{
				var stepSize=parseInt($("#stepW").val());
				if($(this).hasClass("decrease"))
					stepSize=-stepSize;
				newW+=stepSize;
				if(aspectLock)
					newH=Math.floor((h*newW)/w);
			}
			im_orig.resize(newW,newH);
			im.seam_carve(newW,newH,emap);
			im2.attr("src",im.getImage().src);
			im2.attr("height",im.height);
			im2.attr("width",im.width);
			w=newW;
			h=newH;
			updateCanvas(event.data.c,$(im_orig.getImage()),newW,newH,lineWidth);

			var a_right=$("#a_downloadR");
			a_right.attr("href",im2.attr("src"));
			a_right.attr("download","image.jpg");
		});

		$("#hwResize").click({"c":c,"img":im_original},function(event){
			var im=new scImage(event.data.img[0]);
			var im_orig=new scImage(event.data.img[0]);
			var newW=parseInt($("#resizeWidth").val());
			var newH=parseInt($("#resizeHeight").val());
			if(newW>0&&newH>0){
				im_orig.resize(newW,newH);
				im.seam_carve(newW,newH,emap);
				im2.attr("src",im.getImage().src);
				im2.attr("height",im.height);
				im2.attr("width",im.width);
				w=newW;
				h=newH;
				updateCanvas(event.data.c,$(im_orig.getImage()),newW,newH,lineWidth);

				var a_right=$("#a_downloadR");
				a_right.attr("href",im2.attr("src"));
				a_right.attr("download","image.jpg");
			}
		});
		
		$("#uploadUAC").click(function(event){
			$("#image_area").hide();
			$("#upload_form_div").show();
		});

		$("#uploadUAC_submit").click(function(event){
			/*
			var cvs_temp=$("canvas");
			cvs_temp.attr("height",im2.attr("height"));
			cvs_temp.attr("width",im2.attr("width"));
			var ctx_temp=cvs_temp[0].getContext("2d");
			ctx_temp.drawImage(im2[0],0,0);
			var dataURL=cvs_temp[0].toDataURL();
			*/
			var dataURL=im2.attr("src");

			var country=$("#country option:selected").val();
			var imageType=$("#imageType option:selected").val();
			var market=$("#market option:selected").val();
		   	var marketId=$("#marketId").val();
			
			function getCookie(name) {
				var cookieValue = null;
				if (document.cookie && document.cookie != '') {
					var cookies = document.cookie.split(';');
					for (var i = 0; i < cookies.length; i++) {
						var cookie = jQuery.trim(cookies[i]);
						// Does this cookie string begin with the name we want?
						if (cookie.substring(0, name.length + 1) == (name + '=')) {
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
							break;
						}
					}
				}
				return cookieValue;
			}
			var csrftoken = getCookie('csrftoken');	

			function csrfSafeMethod(method) {
				// these HTTP methods do not require CSRF protection
				return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
			}
			$.ajaxSetup({
				beforeSend: function(xhr, settings) {
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader("X-CSRFToken", csrftoken);
					}
				}
			});
			$.ajax({
				type:"POST",
				url: "/jqresize/upload_UAC/",
				data: {
					imgBase64: dataURL,
					country: country,
					marketId: marketId,
					market: market,
					imageType: imageType,
					},
				}).done(function(response){
					$("#upload_form_div").html(response);
				});
		});
	});
	
};
