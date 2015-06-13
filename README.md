# Liquid
Javascript library to resize images using the [Seam Carving](https://en.wikipedia.org/wiki/Seam_carving) algorithm. Created this as part of my 2 week bootcamp at InMobi a year ago. Open sourced with due permissions.

This project contains of 2 parts:
- **Seam Carving Javascript library [seam_carve.js](https://github.com/siddharthm/liquid/blob/master/seam_carve.js)** : You can use this to resize any given image
- **Demo tool** ([Click here](https://cdn.rawgit.com/siddharthm/liquid/f47c3c4987141c56a7bfba58310ab3bf74107bfe/index.html)) : to upload and play around with the library. The demo tool support marking important and unimportant areas in image using mouse (skippable step). You can play around with image using mouse or by using the controllers provided on the top. Results are produced using both standard reszing and seam carving and presented side by side for comparison. For demo tool provide only small size images ( less than 600 x 600 )

## Results
Here is an illustration of resizing using the tool ( No important/unimportant areas were marked in the image )

### Original
![Original Image](/result_images/original.png)

### Using standard technique 
![Standard](/result_images/left.png)

###Using Seam Carving
![Seam Carving](/result_images/right.png)

## Usage
Create a new scImage Object by initializing it with a javascript image object
```Javascript
var img = new scImage(image);
//To use seam carve
img.seam_carve(newWidth,newHeight);
//To get the updated image object
img.getImage()

//Provide an optional heatmap
/* Heatmap is a 2d integer array of size height*width with 
possible values in [-1,0,1] -1 denoting undesirable 0 denoting
neutral and 1 denoting highly desirable
*/
img.seam_carve(newWidth,newHeight,heatMap);

// Resize to nearest aspect ratio
img.nearest_aspect_ration(newWidth, newHeight);

// Resize using standard algorithm
img.resize(newWidth, newHeight);
```

