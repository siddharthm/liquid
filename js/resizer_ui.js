$(document).ready(function(){
	var loadResizer=function(src){
		img = $("<img />")
		img.attr('src',src);
		img=new scImage(img[0]);
		var im=$(img.getImage());
		var im2=$(img.getImage());
		im2.attr("title","new Image");
		$("#img_p").append(im2);
		var c=$("#cvs");
		var w=parseInt(im.attr("width"));
		var h=parseInt(im.attr("height"));
		var lineWidth=4;
		var updateCanvas=function(c,im,w,h,lineWidth){
			c.attr("height",h+lineWidth);
			c.attr("width",w+lineWidth);
			var ctx=c[0].getContext("2d");
			/*var img=new scImage(im[0]);
			img.seam_carve_h(w,h);
			var im2=img.getImage();*/
			ctx.drawImage(im[0],0,0,w,h);
			ctx.strokeStyle="#000000";
			ctx.setLineDash([5,5]);
			ctx.beginPath();
			ctx.moveTo(w+1,0);
			ctx.lineTo(w+1,h+1);
			ctx.lineTo(0,h+lineWidth);
			ctx.lineWidth=lineWidth;
			ctx.stroke();
			ctx.closePath();
		}
		updateCanvas(c,im,w,h,lineWidth);
		c.mousedown({"c":c},function(event){
			var x= event.pageX - event.data.c.offset().left;
			var y= event.pageY - event.data.c.offset().top;
			if((x>=w&&x<=(w+lineWidth))&&(y>=h&&y<=(h+lineWidth))){
				event.data.c.mousemove({"c":event.data.c},function(event){
					var x= event.pageX - event.data.c.offset().left;
					var y= event.pageY - event.data.c.offset().top;
					w=x;h=y;
					updateCanvas(event.data.c,im,x,y,lineWidth);
				});
			}
			else if((x>=w&&x<=(w+lineWidth))){
				event.data.c.mousemove({"c":event.data.c},function(event){
					var x= event.pageX - event.data.c.offset().left;
					w=x;
					updateCanvas(event.data.c,im,x,h,lineWidth);
				});
			}
			else if((y>=h&&y<=(h+lineWidth))){
				event.data.c.mousemove({"c":event.data.c},function(event){
					var y= event.pageY - event.data.c.offset().top;
					h=y;
					updateCanvas(event.data.c,im,w,y,lineWidth);
				});
			}
		});
		c.mouseup({"c":c},function(event){
			event.data.c.unbind("mousemove");
		});
	}
	var readURL = function(input){
		var img;
		if( input.files && input.files[0] ){
			var reader=new FileReader();
			reader.onload = function(e){
				$("#img_form").remove();
				loadResizer(e.target.result);
				
			}	
			reader.readAsDataURL(input.files[0]);
		}
	}
	$("#img_path").change(function(){
		readURL(this);
		
	});
});
	
