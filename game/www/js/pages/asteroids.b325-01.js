(function(){
    var lay;
    var prince;
    var princeSpeed = 50;
    var rat;
    var ratSpeed = 30;
    var gridSize = 72;
    var gridStartX = 228;
    var gridStartY = 274;
    var gridWidth = 15;
    var gridHeight = 7;
    var grid = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,1,1,1,1,0,1,1,1],
                [0,0,0,0,0,1,1,1,0,1,0,0,1,0,0],
                [0,0,0,0,0,1,0,0,1,1,1,0,1,1,0],
                [0,0,0,0,0,1,0,1,1,1,0,0,0,1,0],
                [1,1,1,1,1,1,1,1,0,1,1,1,1,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
    var gridCenters = [];

    var page = new Page("asteroids.b325", 1, false);

    page.setPreviousPage("asteroids.b325", 0);

    page.setNextPage("menu", 1);

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/b325/1_ground.png"},
        {name: "hint", path: "assets/images/asteroids/b325/1_hint.png"},
        {name: "prince_s", path: "assets/images/asteroids/b325/1_prince_spritesheet.png"},
        {name: "atmos", path: "assets/images/asteroids/b325/1_atmosphereOverlay.png"},
        {name: "shadow", path: "assets/images/asteroids/b325/1_shadowOverlay.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.setLeftTextStyle(30, 120);

    page.setRightTextStyle(660, 40, 540);

    page.initPage = function(images, stage, layers){
        lay = layers;

        makeGrid();

        layers.staticBack.add(new Kinetic.Image({
            image: images.atmos,
            listening: false
        }));
        layers.staticFront.add(new Kinetic.Image({
            image: images.shadow,
            listening: false
        }));

        prince = storybook.defineSprite({
            image: images.prince_s,
            animation: "normal",
            frameRate: 1,
            scale: 0.75,
            offset:{x:36, y:36}
        }, 96, 96, {normal: 3});

        //temp sprite
        rat = storybook.defineSprite({
            image: images.prince_s,
            animation: "normal",
            frameRate: 1,
            scale: 0.75,
            offset:{x:36, y:36}
        }, 96, 96, {normal: 3});
    };

    page.startPage = function(){

    };

    page.startChallenge = function(){
        page.setState(page.States.PLAYING);

        var princeStart = gridCenters[5][0];
        prince.setPosition(princeStart.x, princeStart.y);
        lay.dynFront.add(prince);

        storybook.initializeAccelerometer();
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        //gets accelerometer values
        //left: x+, right: x-, down: y+, up: y-
        //magnitude ranges from -10 to 10. Ignore z.
        movePrince(storybook.getAccelerometer(), frame.timeDiff);
    };

    page.destroyPage = function(){
        //destroy accelerometer when the challenge is complete
        storybook.destroyAccelerometer();
    };

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    function makeGrid(){
        var halfTile = gridSize / 2;
        for(var y = 0; y < gridHeight; y++){
            var row = [];
            var rowY = y * gridSize + halfTile + gridStartY;
            for(var x = 0; x < gridWidth; x++){
                row.push({x : x * gridSize + halfTile + gridStartX, y: rowY})
            }
            gridCenters.push(row);
        }
    }

    function getTile(pos){
        pos.x -= gridStartX;
        pos.y -= gridStartY;
        return {x: Math.floor(pos.x/gridSize), y: Math.floor(pos.y/gridSize)};
    }

    function movePrince(acc, timeDiff){
        var xVel = acc.x * -1;
        var yVel = acc.y;
        var currentPos = prince.getPosition();
        var curX = currentPos.x;
        var curY = currentPos.y;
        var i = getTile(currentPos);
        var tileCenter = gridCenters[i.y][i.x];
        var xDiff = xVel * princeSpeed * timeDiff / 1000;
        var yDiff = yVel * princeSpeed * timeDiff / 1000;
        if(xDiff > 0){//right
            if(!grid[i.y][i.x + 1]){ // can't enter the right tile
                xDiff = Math.min(xDiff, tileCenter.x - curX);
            }
            else{ // can enter the right tile

            }
        }
        else if(xDiff < 0){//left
            if(!grid[i.y][i.x - 1] || currentPos.x - gridStartX < gridSize){ // can't enter the left tile
                xDiff = Math.max(xDiff, tileCenter.x - curX);
            }
            else{ // can enter the left tile

            }
        }
        if(yDiff > 0){//down
            if(!grid[i.y + 1][i.x]){ // can't enter the down tile
                yDiff = Math.min(yDiff, tileCenter.y - curY);
            }
            else{ // can enter the down tile

            }
        }
        else if(yDiff < 0){//up
            if(!grid[i.y - 1][i.x]){ // can't enter the up tile
                yDiff = Math.max(yDiff, tileCenter.y - curY);
            }
            else{ // can enter the up tile

            }
        }
        prince.move(xDiff, yDiff);
    }

    storybook.registerPage(page);
})();
