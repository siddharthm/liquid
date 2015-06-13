# Liquid
Javascript library to resize images using the [Seam Carving](https://en.wikipedia.org/wiki/Seam_carving) algorithm
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
