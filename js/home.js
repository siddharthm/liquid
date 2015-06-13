$(document).ready(function(){
	var onCompleteText="Click on a image below to begin editing";

	$("#submit").click(function(event){
		var url=$("#app_url").val();
		if(url){
				$("#app_url_form").hide();
				$("#status").removeAttr("class");
				$("#status").addClass("alert alert-success");
				$("#status").html("<strong>Working...</strong> We are fetching screenshots for you");
				$.get("/jqresize/get_image_urls/"+encodeURIComponent(url),function(data){
					res=JSON.parse(data);
					if(res[0]<0){
						$("#status").removeAttr("class");
						$("#status").addClass("alert alert-danger");
						$("#status").html(res[1]);
					}
					else{
						$("#app_images").show();
						urls_arr=res[1];
						screenshot_urls=[];
						icon_urls=[];
						for(var i=0;i<urls_arr.length;i++){
							if(urls_arr[i][1]=="SCREEN_SHOT")
								screenshot_urls.push(urls_arr[i][0]);
							else if(urls_arr[i][1]=="APP_ICON")
								icon_urls.push(urls_arr[i][0]);
						}
						var appendImg=function(tag,src){
							var div=$("<p class='app_image'></p>")
							var img=$("<img />");
							div.append(img);
							img.attr("src",src);
							img.click({src:src},function(event){
								var form=$("#resizer_form");
								$("#url").val(event.data.src);
								form.submit();
							});
							img.load(function(){
								var height=100;
								var width= Math.floor(this.width*height/this.height);
								var real_height=this.height;
								var real_width=this.width;
								this.title=real_width+" X "+real_height;

								this.height=height;
								this.width=width;
								var label=$("<h6></h6>");
								label.text(this.title);
								div.append(label);
								$(tag).append(this);
								if(this.src==icon_urls[icon_urls.length-1]){
									$("#status").delay(300).slideUp(500,function(){
									$("#message").html(onCompleteText);});
								}
							});

						}
						for(var i=0;i<screenshot_urls.length;i++){
							appendImg("#app_screenshots",screenshot_urls[i]);
						}

						for(var i=0;i<icon_urls.length;i++){
							appendImg("#app_icons",icon_urls[i]);

						}
					}
				});


			}
		else{
				$("#status").removeAttr("class");
				$("#status").addClass("alert alert-danger");
				$("#status").html("<strong>Error: </strong>URL field cannot be empty");	
			}
	});

});
