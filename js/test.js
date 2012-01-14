<!DOCTYPE HTML>
<html>
    <head>
        <style>
            body {
                margin: 0px;
                padding: 0px;
            }
            
            canvas {
                border: 1px solid #9C9898;
            }
        </style>
        <script src="http://www.html5canvastutorials.com/libraries/kinetic-v3.5.1.js">
        </script>
        <script>
            function loadImages(sources, callback){
                var images = {};
                var loadedImages = 0;
                var numImages = 0;
                for (var src in sources) {
                    numImages++;
                }
                for (var src in sources) {
                    images[src] = new Image();
                    images[src].onload = function(){
                        if (++loadedImages >= numImages) {
                            callback(images);
                        }
                    };
                    images[src].src = sources[src];
                }
            }
            
            function writeMessage(stage, message){
                var context = stage.getContext();
                stage.clear();
                context.font = "18pt Calibri";
                context.fillStyle = "black";
                context.fillText(message, 10, 25);
            }
            
            function drawImages(images){
                var stage = new Kinetic.Stage("container", 578, 200);
                
                // darth vader
                var darthVaderImg = new Kinetic.Image({
                    image: images.darthVader,
                    x: 100,
                    y: 40,
                    width: 200,
                    height: 137
                });
                
                darthVaderImg.on("mouseover", function(){
                    writeMessage(stage, "Darth Vader mouseover!");
                });
                darthVaderImg.on("mouseout", function(){
                    writeMessage(stage, "Darth Vader mouseout!");
                });
                darthVaderImg.on("mousedown", function(){
                    writeMessage(stage, "Darth Vader mousedown!");
                });
                darthVaderImg.on("mouseup", function(){
                    writeMessage(stage, "Darth Vader mouseup!");
                });
                stage.add(darthVaderImg);
                
                // yoda
                var yodaImg = new Kinetic.Image({
                    image: images.yoda,
                    x: 350,
                    y: 55,
                    width: 93,
                    height: 104
                });
                
                yodaImg.on("mouseover", function(){
                    writeMessage(stage, "Yoda mouseover!");
                });
                yodaImg.on("mouseout", function(){
                    writeMessage(stage, "Yoda mouseout!");
                });
                yodaImg.on("mousedown", function(){
                    writeMessage(stage, "Yoda mousedown!");
                });
                yodaImg.on("mouseup", function(){
                    writeMessage(stage, "Yoda mouseup!");
                });
                stage.add(yodaImg);
            }
            
            window.onload = function(){
                var sources = {
                    darthVader: "test.jpg",
                    yoda: "test.jpg"
                };
                loadImages(sources, drawImages);
            };
        </script>
    </head>
    <body onmousedown="return false;">
        <div id="container">
        </div>
    </body>
</html>
