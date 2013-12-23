(function(){
    var assets = {};
    var gameObjects = {};
    var sounds = {};

    var numLamps = 8;
    var lampExtraOffset = 230;
    var rotationSpeed = Math.PI / 16;
    var stageWidth, stageHeight;

    var lampsLit = 0;

    var page = new Page("asteroids.b329", 1, false);

    page.setPreviousPage("asteroids.b329", 0);

    page.setNextPage("menu", 1);

    page.setLeftTextStyle(null, null, null,"#ffffff");
    page.setRightTextStyle(null, null, null,"#ffffff");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/b329/01_night.jpg"},
        {name: "planet", path: "assets/images/asteroids/b329/01_planet.png"},
        {name: "lamp", path: "assets/images/asteroids/b329/01_lamp.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/05/hint_ch05_01.png"}
    ]);

    page.setNarration("assets/narration/B329_2.mp3");
    page.setMusic("assets/sound/asteroids/challenge4Music.mp3");

    page.initPage = function(images, stage, layers){
        gameObjects.lamps = [];

        stageWidth = stage.getWidth();
        stageHeight = stage.getHeight();

        assets.lamp = storybook.defineSprite({
            x:stageWidth/2,
            y:stageHeight,
            image: images.lamp,
            animation: "lampAnim",
            frameRate: 1,
            offset: {x:189, y:391 + lampExtraOffset}
        }, 378, 391, {lampAnim: 2});

        assets.planet = new Kinetic.Image({
            x:stageWidth/2,
            y:stageHeight,
            image: images.planet,
            offset: {x: 368, y:360}
        });

        layers.dynBack.add(assets.planet);

        var rotationIcrement = 2 * Math.PI / numLamps;
        for(var i = 0; i < numLamps; i++){
            var lamp = assets.lamp.clone({
                rotation : i * rotationIcrement
            });
            lamp.on(clickEvt, onLampClick);
            gameObjects.lamps.push(lamp);
            layers.dynFront.add(lamp);
        }
    };

    page.startPage = function(){
        var msPerFrame = 1 / assets.lamp.getFrameRate() * 1000;
        for(var i = 0; i < numLamps; i++){
            var lamp = gameObjects.lamps[i];
            (function(l){
                setTimeout(function(){
                    l.start();
                }, i * msPerFrame / numLamps * 2);
            })(lamp);
        }
    };


     page.startChallenge = function(){
        for(var i = 0; i < numLamps; i++){
            var lamp = gameObjects.lamps[i];
            lamp.stop();
            lamp.setIndex(0);
        }

        page.setState(page.States.PLAYING);
    }

    page.update = function(frame, stage, layers){
        var rotationDiff = rotationSpeed * frame.timeDiff / 1000;
        assets.planet.rotate(rotationDiff);
        for(var i = 0; i < numLamps; i++){
            var lamp = gameObjects.lamps[i];
            lamp.rotate(rotationDiff);
        }
        if(page.getState() === page.States.PLAYING){
            checkEnd(layers.staticFront);
        }
    };

    page.destroyPage = function(){
        resetChallenge();

        for(var n in assets){
            delete assets[n];
        }
        for(n in gameObjects){
            delete gameObjects[n];
        }
        for(n in sounds){
            sounds[n].destroy();
            delete sounds[n];
        }
    };

    function checkEnd(layer){
        if(lampsLit == numLamps){
            endChallenge("You lit all the lamps!", layer);
        }
    }

    function endChallenge(message, layer){
        var msgbox = new Kinetic.Rect({
            x:stageWidth/2,
            y:stageHeight/2,
            width:900,
            height: 72,
            offsetX:450,
            offsetY: 36,
            fill: "green",
            opacity: 0.8,
            stroke: "black",
            strokeWeight: 10
        });
        var msg = new Kinetic.Text({
            text:message,
            fontFamily:"lp_BodyFont",
            fontWeight:"bold",
            fontSize:32,
            padding:20,
            align:"center",
            fill:"black",
            x:stageWidth/2,
            y:stageHeight/2,
            width:900,
            height: 72,
            offsetX:450,
            offsetY: 36,
            listening:false
        });

        page.challengeComplete();

        layer.add(msgbox).add(msg).batchDraw();
    }

    function resetChallenge(){
        lampsLit = 0;
    }

    function onLampClick(e){
        var lamp = e.targetNode;
        if(lamp.getIndex() > 0 || page.getState() != page.States.PLAYING){
            return;
        }
        lamp.setIndex(1);
        lampsLit++;
    }

    storybook.registerPage(page);
})();
