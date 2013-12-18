(function(){
    var sprite;
    var up, down;
    var index = 0;
    var watercounter = 0;
    var setFillWater, win = false;
    var waterScale, waterimg, wellHandle, handleimg, container, containerimg;

    // update rate throttles
    var inputLastCheck = 0;
    var inputCheckThreshold = 1100;

    var page = new Page("earthEnding", 5);
    var sounds = {};

    page.setPreviousPage("earthEnding", 4);

    page.setNextPage("earthEnding", 6);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/05/hint_ch05_01.png"},
        {name: "background", path: "assets/images/earthEnding/05/bgDesert.png"},
        {name: "spriteimg", path: "assets/images/earthEnding/05/spritesheetWell.png"},
        {name: "handleimg", path: "assets/images/earthEnding/05/wellHandle.png"},
        {name: "containerimg", path: "assets/images/earthEnding/05/container.png"},
        {name: "waterScale", path: "assets/images/earthEnding/05/water.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){
        sprite = storybook.defineSprite({
            x:310,
            y:10,
            image: images.spriteimg,
            animation: "testAnim",
            frameRate: 14
        }, 613, 764, {testAnim: 4});
        layers.dynBack.add(sprite);

        wellHandle = new Kinetic.Image({
            image: images.handleimg,
            x : 900,
            y : 350
        });
        layers.dynBack.add(wellHandle);

        container = new Kinetic.Image({
            image: images.containerimg,
            x : 30,
            y : 200
        });
        layers.dynBack.add(container);

        up = new Kinetic.Rect({
            x: 239,
            y: 600,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });
         layers.dynBack.add(up);

        down = new Kinetic.Rect({
            x: 400,
            y: 600,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });
        layers.dynBack.add(down);

        waterimg = new Kinetic.Image({
            image: images.waterScale,
            x : 92,
            y : 615
        });
        layers.dynBack.add(waterimg);

        sounds.tap = new Sound("assets/sound/earthEnding/water.mp3", false, true);
        sounds.pull = new Sound("assets/sound/earthEnding/pull.mp3", false, true);
    };

    page.startPage = function(){
        waterimg.setScaleY(0);
    };

    page.startChallenge = function(layers){
        sprite.on(clickEvt, onSpriteClick);

        up.on(clickEvt, function(){moveBucket("up")});
        down.on(clickEvt, function(){moveBucket("down")});

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }

        if (setFillWater == true){
            if(Date.now() - inputLastCheck > inputCheckThreshold){
                inputLastCheck = Date.now();
                watercounter -= 0.025;
                console.log(watercounter);
            }
        }

        //Maximum water
        if (watercounter < -0.855){
            setFillWater = false;
            watercounter = -0.855;
            win = false;
        }

        if(watercounter == 0.7) win = true;
        if(win == true){
            page.setState(page.States.PASSED);
        }

        waterimg.setScaleY(watercounter);
    };

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    function moveBucket(arrow){
        if(arrow == "up"){
            //bucket move up
            index++;
            sprite.setIndex(index);
        }

        if(arrow == "down"){
            //bucket move down
            index --;
        }
        sprite.setIndex(index);

        if(index >3){
            sprite.setIndex(3);
        }
        if(index < 1){
            index = 0;
            sprite.setIndex(0);
        }

        //this is wrong -- need to fix
        if(setFillWater == true) sounds.tap.play();
        else sounds.tap.stop();

        //if the bucket is low enough to fill water
        if(index >= 5){
           setFillWater = true;
        }
        else {
            setFillWater = false;
        }

        //speed up water filling
        if(index > 7){
            inputCheckThreshold -= 200
        }
    }

    storybook.registerPage(page);
})();
