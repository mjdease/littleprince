(function(){
    var sprite;
    var up, down;
    var bucket;
    var index = 0;
    var watercounter = 0;
    var setFillWater = false;
    // update rate throttles
    var inputLastCheck = 0;
    var inputCheckThreshold = 1100;

    var page = new Page("earthEnding", 5);
    var sounds = {};

    page.setPreviousPage("earthEnding", 4);

    page.setNextPage("earthEnding", 6);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch02_01.png"},
        {name: "background", path: "assets/images/earthEnding/bgPage29.jpg"},
        {name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch02_01.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){
        sprite = storybook.defineSprite({
            x:300,
            y:500,
            image: images.spriteimg,
            animation: "testAnim",
            frameRate: 14
        }, 200, 150, {testAnim: 9});
        layers.dynBack.add(sprite);

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

        sounds.tap = new Sound("assets/sound/earthEnding/water.mp3", false, true);
    };

    page.startPage = function(){

        sprite.on(clickEvt, onSpriteClick);

        up.on(clickEvt, function(){moveBucket("up")});
        down.on(clickEvt, function(){moveBucket("down")});

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        if(setFillWater == true){
            if(Date.now() - inputLastCheck > inputCheckThreshold){
                inputLastCheck = Date.now();
                watercounter++;
                console.log(watercounter);
            }
        }
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
            sprite.setIndex(index);
        }

        if(index > 8){
            //index = 8;
            sprite.setIndex(8);
        }

        //Speed up the water fill
        if(index > 9){
            inputCheckThreshold -= 200;
        }

        if(index < 1){
            index = 0;
            sprite.setIndex(0);
        }

        //if the bucket is low enough for the water
        if(index >= 8){
           setFillWater = true;
        } else
        setFillWater = false;
        sounds.tap.stop();

        if(setFillWater == true)sounds.tap.play();
    }

    storybook.registerPage(page);
})();
