// Create scope that's local to this file, avoids variable name collisions
(function(){
    // local variables defined here. not accesible from any other file.
    var sprite;

    // REQUIRED. Create new page object, passing in the section id, page number, and if it's a menu
    var page = new Page("earthIntro", 1,  false);

    // REQUIRED. set the section ID and page number of the previous page, pass false if there is no previous page
    page.setPreviousPage("earthIntro", 0);

    // REQUIRED. set the section ID and page number of the next page, pass false if there is no next page
    page.setNextPage("earthIntro", 2);

    // Set the position and color of the pages text blocks. Separate functions for the left and right blocks.
    // arguments are x, y, width, and color where color is a hex string eg "#ffaa00",
    // All arguments are optional, pass in null if you just want the default to be used
    // Let me know if you need to customize any other properties!
    // If you don't override them, the default properties are:
    // x : 40 (left) 680 (right),
    // y : 40,
    // width : 560,
    // fontFamily: "lp_BodyFont",
    // fontSize: 24,
    // fill: "black",
    // lineHeight: 1.2
    page.setLeftTextStyle(20, 200, null,"#ff0000");

    page.setRightTextStyle(660, 60, null, "#ff00aa");

    // Pass in array of images in format:
    // [{name: "test", path: "assets/images/testimg.png"},
    //  {name: "test2", path: "assets/images/test2img.png"}]
    // these images get loaded before the page is initialized
    // IMPORTANT: 'background' is a reserved name and will automatically
    // be used for the page background. Do not name an image 'background' if it's not the background image.
    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "background", path: "assets/images/testbg.jpg"} // <---automatically used as page background
    ]);

    // Pass in path of narration audio (relative to index.html), playback is handled automatically.
    page.setNarration("assets/sound/test.mp3");

    // Add all objects that should be present at the start of the game/page here.
    // Images from required assets above are preloaded and provided in the images parameter.
    // Save this object to a local variable if you need to access the raw images later in the game.
    // The layers object contains staticBack, dynBack, dynFront, and staticFront in that order,
    // the dyn* layers will show any change to them automatically but batchDraw() should be called on
    // the static* layers if changes are made to them eg layers.staticBack.batchDraw();
    page.initPage = function(images, stage, layers){
        //defineSprite method is a helper for decaring sprites. arguments:
        //optons - all sprite options except for animations
        //width - frame width
        //height - frame height
        //animList - object where the keys are the names of the animations
        //          and the value is the number of frames.
        //          eg: {idle:1, run: 14, walk: 14}
        sprite = defineSprite({
            x:300,
            y:500,
            image: images.spriteimg,
            animation: "testAnim",
            frameRate: 14
        }, 200, 150, {testAnim: 9});

        layers.dynBack.add(sprite);
    };

    // Page transition has completed and the game/animations should start now
    // Event listeners should be bound in here or later - not in the initPage function!
    page.startPage = function(){
        sprite.start();

        sprite.on("click", onSpriteClick);

        // Available states are:
        // page.States.UNINITIALIZED - default state of all pages
        // page.States.PLAYING - set to this state in the startPage function and limit
        //                      the page.update calls to only this state.
        // page.States.PASSED - set by calling page.challengeComplete() pages without
        //                      challenges are set to this state automatically
        // page.States.FAILED - only useful for gameplay logic, not used elsewhere
        page.setState(page.States.PLAYING);
    };

    // Called every frame, be very conservative of what is done in here!
    // Most changes should be done using event listeners instead of in here.
    // frame object contains timeDiff, lastTime, time, and frameRate properties.
    // use timeDiff to create gameplay that's independant of framerate.
    // eg var speed = 100; var moveX = speed * frame.timeDiff / 1000
    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }

    }

    // Called when the user clicks on an _empty_ part of the game.
    // ANY object in the way will prevent this event from firing
    // If you want the obscuring object to never capture events
    // and allow the click through to the stage set the listening property to false
    page.onStageClick = function(e){
        //handle the click event however you want
    };

    //define any functions you need here

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    // REQUIRED. Register page with the book, pass in the current page object.
    storybook.registerPage(page);

})();// end scope
// don't put anything after here.
