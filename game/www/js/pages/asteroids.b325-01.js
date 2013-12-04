(function(){
    var lay;
    var lastEndCheck = 0;
    var checkThreshold = 500;
    var prince;
    var princeSpeed = 50;
    var rat;
    var ratSpeed = 2 * 30;
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
    var ratPath = [{x: 7, y:1, dir:"right"},
                   {x: 9, y:1, dir:"down"},
                   {x: 9, y:5, dir:"right"},
                   {x:13, y:5, dir:"up"},
                   {x:13, y:3, dir:"left"},
                   {x:12, y:3, dir:"up"},
                   {x:12, y:1, dir:"right"},
                   {x:14, y:1}];
    var ratProgress = 0;
    var ratTarget;
    var ratDir;

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

        var ratIndex = ratPath[ratProgress];
        var ratStart = gridCenters[ratIndex.y][ratIndex.x];
        rat.setPosition(ratStart.x, ratStart.y);
        setNextRatTarget();

        lay.dynFront.add(prince).add(rat);

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
        moveRat(frame.timeDiff);
        if(frame.time - lastEndCheck > checkThreshold){
            lastEndCheck = frame.time;
            checkEnd();
        }
    };

    page.destroyPage = function(){
        //destroy accelerometer when the challenge is complete
        storybook.destroyAccelerometer();
    };

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

    function moveRat(timeDiff){
        var xDiff = 0;
        var yDiff = 0;
        var pos = rat.getPosition();
        switch(ratDir){
            case "right":
                xDiff = ratSpeed * timeDiff/1000;
                if(pos.x + xDiff > ratTarget.x){
                    xDiff = ratTarget.x - pos.x;
                    setNextRatTarget();
                }
                break;
            case "left":
                xDiff = -1 * ratSpeed * timeDiff/1000;
                if(pos.x + xDiff < ratTarget.x){
                    xDiff = ratTarget.x - pos.x;
                    setNextRatTarget();
                }
                break;
            case "up":
                yDiff = -1 * ratSpeed * timeDiff/1000;
                if(pos.y + yDiff < ratTarget.y){
                    yDiff = ratTarget.y - pos.y;
                    setNextRatTarget();
                }
                break;
            case "down":
                yDiff = ratSpeed * timeDiff/1000;
                if(pos.y + yDiff > ratTarget.y){
                    yDiff = ratTarget.y - pos.y;
                    setNextRatTarget();
                }
                break;
        }
        rat.move(xDiff, yDiff);
    }

    function setNextRatTarget(){
        if(ratProgress == ratPath.length - 1){
            checkEnd();
            return;
        }
        ratDir = ratPath[ratProgress].dir;
        ratProgress++;
        ratTarget = gridCenters[ratPath[ratProgress].y][ratPath[ratProgress].x];
    }

    function checkEnd(){
        var ratPos = rat.getPosition();
        var ratTile = getTile(ratPos);
        if(ratTile.y == 1 && ratTile.x == 14){
            finishGame("lose");
        }

        var distance = dist(rat, prince);
        if(distance > 400){
            prince.setIndex(0);
        }
        else if(distance > 150){
            prince.setIndex(1);
        }
        else{
            prince.setIndex(2);
        }

        if(distance < 72){
            finishGame("win");
        }
    }

    function finishGame(result){
        if(result == "win"){
            lay.dynFront.add(new Kinetic.Text({
                text: "You caught the rat!",
                fill: "red",
                fontSize: 30,
                align: "center",
                y: 600,
                x: 1280/2
            }));
            page.challengeComplete();
        }
        else{
            lay.dynFront.add(new Kinetic.Text({
                text: "The rat escaped!",
                fill: "red",
                fontSize: 30,
                align: "center",
                y: 600,
                x: 1280/2
            }));
            page.setState(page.States.FAILED);
        }
    }

    storybook.registerPage(page);
})();
