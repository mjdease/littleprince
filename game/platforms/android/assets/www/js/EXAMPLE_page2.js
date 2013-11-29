(function(){//scoping. ignore.

    //define page in here

    //local variables
    var speed = 150;
    var bodies = [];
    var score = 0;

    // Create new page object, if there's a game that has to be done pass in true
    var page = new Page(true);

    // Pass in array of images in format:
    // [{name: "test", path: "assets/images/testimg.png"},
    //  {name: "test2", path: "assets/images/test2img.png"}]
    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "ss", path: "assets/images/spritesheet.png"}
    ]);

    // Pass in path of narration audio, playback is handled automatically.
    page.setNarration("assets/sound/test.mp3");

    // Set the text to be displayed on the page, any number of parameters can be passed in.
    // Display of the text is done automatically.
    page.setText(storyText.page2_1, storyText.page2_2);

    // Add all objects that should be present at the start of the game/page here.
    // Images from required assets above are preloaded and provided in the images parameter.
    // Text defined above are displayed on the page already in staticFront layer.
    // The layers object contains staticBack, dynBack, dynFront, and staticFront in that order,
    // the dyn* layers will show any change to them automatically but batchDraw() should be called on
    // the static* layers if changes are made to them eg layers.staticBack.batchDraw();
    page.initPage = function(images, stage, layers){
        for(var i = 0; i < 10; i++){
            var img = new Kinetic.Image({
                image: images.test,
                x: randomInt(31, stage.getWidth() - 31),
                y: randomInt(35, 600),
                width:62,
                height:71,
                offset: {x:31, y:35}
            });
            img.sb_alive = true;
            bodies.push(img);
            layers.dynFront.add(img);
        }
        var sprite = storybook.defineSprite({
            image: images.ss,
            animation: "testAnim",
            frameRate: 14
        }, 200, 150, {testAnim: 9});
        layers.dynBack.add(sprite);
        sprite.start();
    };

    // Page transition has completed and the game/animations should start now
    // Bind event listeners no earlier than here
    page.startPage = function(){
        page.setState(page.States.PLAYING);
    };

    // Called every frame, be very conservative of what is done in here!
    // frame object contains timeDiff, lastTime, time, and frameRate properties
    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }

        for(var i = 0; i < bodies.length; i++){
            var gameObject = bodies[i];
            if(gameObject.sb_alive){
                var currentY = gameObject.getY();
                var dist =  speed * frame.timeDiff / 1000;
                if(currentY + dist >= stage.getHeight() - 36){
                    dist = (stage.getHeight() - 36) - currentY;
                    gameObject.sb_alive = false;
                    score++;
                    if(score == bodies.length){
                        page.setState(page.States.PASSED);
                    }
                }
                gameObject.move(0, dist);
            }
        }
    }

    //must call register page, passing in the current page object.
    storybook.registerPage(page);

})();// scoping. ignore.
