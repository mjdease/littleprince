(function(){
    var assets = {};
    var gameObjects = {};
    var ui = {};
    var sounds = {};

    var plantCount = 0;

    var stageWidth, stageHeight;
    var numTrees = 5, numFlowers = 10;
    var numTreeFrames = 11, numFlowerFrames = 9, treeFrameThreshold = 7;
    var treeRadius = 110, flowerRadius = 30;

    var endLastCheck = 0;
    var endCheckThreshold = 400;

    var page = new Page("asteroids.b612", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("asteroids.b612", 1);

    page.setRequiredAssets([
        {name: "baobab", path: "assets/images/asteroids/b612/00_baobab.png"},
        {name: "hole", path: "assets/images/asteroids/b612/00_hole.png"},
        {name: "flower", path: "assets/images/asteroids/b612/00_flower.png"},
        {name: "background", path: "assets/images/asteroids/b612/00_ground.jpg"},
        {name: "hint", path: "assets/images/ui/page_challenge/03/hint_ch03_01.png"}
    ]);

    page.setNarration("assets/sound/asteroids/B612_1.wav");
    page.setMusic("assets/sound/earthIntro/challenge2Music.mp3");

    page.initPage = function(images, stage, layers){
        gameObjects.trees = [];
        gameObjects.flowers = [];
        gameObjects.all = [];
        gameObjects.ambient = [];

        stageWidth = stage.getWidth();
        stageHeight = stage.getHeight();

        assets.flower = defineSprite({
            name: "flower",
            image: images.flower,
            animation: "flowerAnim",
            frameRate: 0.8,
            offset: {x:70, y:52}
        }, 140, 105, {flowerAnim: numFlowerFrames});

        assets.tree = defineSprite({
            name: "tree",
            image: images.baobab,
            animation: "baobabAnim",
            frameRate: 0.6,
            offset: {x:192,y:160.5}
        }, 384, 321, {baobabAnim: numTreeFrames});

        assets.hole = defineSprite({
            name: "hole",
            image: images.hole,
            animation: "holeAnim",
            listening: false,
            offset:{x:165.5,y:154},
            visible:false
        }, 331, 308, {holeAnim:3});

        for(var i = 0; i < numTrees; i++){
            var treeObj = makePlant(assets.tree, treeRadius, "tree");
            var tree = treeObj.find(".tree")[0];
            if(i == 0){
                tree.setIndex(10);
                treeObj.setPosition(stageWidth/2, stageHeight/2);
            }
            gameObjects.trees.push({
                node: treeObj,
                type: "tree",
                plant: tree,
                endFrame: numTreeFrames - 1,
                untouchable: false,
                dead: false,
                grown: i == 0 ? true : false
            });
            layers.dynFront.add(treeObj);
            plantCount++;
        }
        for(i = 0; i < numFlowers; i++){
            var flowerObj = makePlant(assets.flower, flowerRadius, "flower");
            gameObjects.flowers.push({
                node: flowerObj,
                type: "flower",
                plant: flowerObj.find(".flower")[0],
                endFrame: numFlowerFrames - 1,
                untouchable: false,
                dead: false,
                grown: false
            });
            layers.dynBack.add(flowerObj);
            plantCount++;
        }

        initUi();

        positionPlants(gameObjects.trees, gameObjects.flowers);
    };

    page.startPage = function(layers){
        for(var i = 0; i < gameObjects.flowers.length; i++){
            var flowerObj = gameObjects.flowers[i];
            var rand = Math.random();
            if(rand < 0.15){
                flowerObj.plant.start();
                flowerObj.doNotPlay = true;
                gameObjects.ambient.push(flowerObj);
            }
            else if(rand < 0.30){
                flowerObj.plant.setIndex(1);
            }
        }
    };

    page.startChallenge = function(layers){
        for(var i = 1; i < gameObjects.trees.length; i++){
            var treeObj = gameObjects.trees[i];
            addPlantListener(treeObj);
            growAfterDelay(treeObj.plant);
            gameObjects.all.push(treeObj);
        }
        for(i = 0; i < gameObjects.flowers.length; i++){
            var flowerObj = gameObjects.flowers[i];
            addPlantListener(flowerObj);
            if(!flowerObj.doNotPlay){
                growAfterDelay(flowerObj.plant);
                gameObjects.all.push(flowerObj);
            }
        }

        layers.dynFront.add(ui.remaining);

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        for(var i = 0; i < gameObjects.ambient.length; i++){
            var obj = gameObjects.ambient[i];
            if(obj.plant.getIndex() === obj.endFrame){
                obj.plant.stop();
            }
        }

        if(page.getState() != page.States.PLAYING){
            return;
        }

        for(var i = 0; i < gameObjects.all.length; i++){
            var obj = gameObjects.all[i];
            var plantIndex = obj.plant.getIndex();
            if(plantIndex === obj.endFrame){
                obj.grown = true;
                obj.plant.stop();
            }
            if(obj.type === "tree" && plantIndex >= treeFrameThreshold){
                obj.untouchable = true;
            }
        }

        if(Date.now() - endLastCheck > endCheckThreshold){
            endLastCheck = Date.now();
            checkEnd(layers.staticFront);
        }
    };

    page.destroyPage = function(){
        resetChallenge();
        for(var n in gameObjects){
            delete gameObjects[n];
        }
        for(n in assets){
            delete assets[n];
        }
        for(n in ui){
            delete ui[n];
        }
        for(n in sounds){
            sounds[n].destroy();
            delete sounds[n];
        }
    };

    function checkEnd(layer){
        var treesRemoved = 0;
        var treesGrown = 0
        for(var i = 0; i < gameObjects.all.length; i++){
            var obj = gameObjects.all[i];
            if(obj.type == "flower" && obj.dead){
                endChallenge(false, "You pulled out a flower. Only remove the baobabs.", layer);
                return;
            }
            if(obj.type === "tree"){
                if(obj.grown){
                    treesGrown++;
                }
                if(obj.dead){
                    treesRemoved++;
                }
            }
        }
        if(treesGrown > 1){
            endChallenge(false, "You didn't remove all the baobabs soon enough.", layer);
            return;
        }
        if(treesRemoved == numTrees - 1){
            endChallenge(true, "You removed all the baobabs!", layer);
            return;
        }
        ui.remaining.setText((numTrees - 1 - treesRemoved) + " Baobabs remain");
    }

    function endChallenge(isPass, message, layer){
        for(var i = 0; i < gameObjects.trees.length; i++){
            gameObjects.trees[i].plant.stop();
        }
        for(i = 0; i < gameObjects.flowers.length; i++){
            gameObjects.flowers[i].plant.stop();
        }

        var msgbox = new Kinetic.Rect({
            x:stageWidth/2,
            y:stageHeight/2,
            width:900,
            height: isPass ? 72 : 104,
            offsetX:450,
            offsetY: isPass ? 36 : 52,
            fill: isPass ? "green" : "red",
            opacity: 0.8,
            stroke: "black",
            strokeWeight: 10
        });
        var msg = new Kinetic.Text({
            text:message + (isPass ? "" : "\nTap to retry."),
            fontFamily:"lp_BodyFont",
            fontWeight:"bold",
            fontSize:32,
            padding:20,
            align:"center",
            fill:"black",
            x:stageWidth/2,
            y:stageHeight/2,
            width:900,
            height: isPass ? 72 : 104,
            offsetX:450,
            offsetY: isPass ? 36 : 52,
            listening:false
        });
        if(isPass){
            ui.remaining.hide();
            page.setState(page.States.PASSED);
        }
        else{
            msgbox.on(clickEvt, function(){
                msg.destroy();
                msgbox.destroy();
                layer.batchDraw();
                restartChallenge();
            });
            page.setState(page.States.FAILED);
        }
        layer.add(msgbox).add(msg).batchDraw();
    }

    function resetChallenge(){
        endLastCheck = 0;
    }

    function restartChallenge(){
        resetChallenge();
        for(var i = 0; i < gameObjects.all.length; i++){
            var obj = gameObjects.all[i];
            obj.untouchable = false;
            obj.dead = false;
            obj.grown = false;
            obj.plant.setIndex(0);
            obj.plant.show();
            var node = obj.node.find(".hole")[0];
            node.setIndex(0);
            node.hide();
            growAfterDelay(obj.plant);
        }
        ui.remaining.show();
        page.setState(page.States.PLAYING);
    }

    function makePlant(plant, radius, type){
        var plantWithHole = new Kinetic.Group({
            id: "plant" + plantCount,
            x:-1000,
            drawHitFunc: function(context) {
                context.beginPath();
                context.arc(0, 0, radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStrokeShape(this);
            }
        });
        plantWithHole.add(assets.hole.clone({scale:type == "flower" ? 0.7 : 1})).add(plant.clone());
        return plantWithHole;
    }

    function addPlantListener(plantObj){
        plantObj.node.on(clickEvt, function(){
            if(plantObj.dead || plantObj.untouchable || plantObj.doNotPlay || page.getState() != page.States.PLAYING ){
                return;
            }
            var hole = plantObj.node.find(".hole")[0];
            if(hole.getVisible()){
                var newIndex = hole.getIndex() + 1;
                hole.setIndex(newIndex);
            }
            else{
                hole.show();
            }
            if(newIndex === 2){
                plantObj.dead = true;
                plantObj.plant.hide();
                plantObj.plant.stop();
            }
        });
    }

    function growAfterDelay(plant){
        setTimeout(function(){
            plant.start();
        }, randomInt(0, 2500));
    }

    function positionPlants(trees, flowers){
        var noCollisions;
        for(var i = 1; i < trees.length; i++){
            var tree = trees[i].node;
            noCollisions = false;
            while(!noCollisions){
                var treeX = randomInt(treeRadius, stageWidth - treeRadius/2);
                var treeY = randomInt(treeRadius, stageHeight - treeRadius/2);
                if(!checkCollision(tree.getId(), {x:treeX,y:treeY}, treeRadius, trees, flowers)){
                    noCollisions = true;
                }
            }
            tree.setPosition(treeX, treeY);
        }
        for(var i = 0; i < flowers.length; i++){
            var flower = flowers[i].node;
            noCollisions = false;
            while(!noCollisions){
                var flowerX = randomInt(flowerRadius, stageWidth - flowerRadius);
                var flowerY = randomInt(flowerRadius, stageHeight - flowerRadius);
                if(!checkCollision(flower.getId(), {x:flowerX,y:flowerY}, flowerRadius, trees, flowers)){
                    noCollisions = true;
                }
            }
            flower.setPosition(flowerX, flowerY);
        }
    }

    function checkCollision(id, point, radius, trees, flowers){
        for(var i = 0; i < trees.length; i++){
            var tree = trees[i].node;
            if(id === tree.getId()){
                continue;
            }
            if(isColliding(point, radius, tree, treeRadius)){
                return true;
            }
        }
        for(i = 0; i < flowers.length; i++){
            var flower = flowers[i].node;
            if(id === flower.getId()){
                continue;
            }
            if(isColliding(point, radius, flower, flowerRadius)){
                return true;
            }
        }
        return false;
    }

    function isColliding(pt1, radius1, pt2, radius2){
        return dist(pt1, pt2) < (radius1 + radius2);
    }

    function initUi(){
        ui.remaining = new Kinetic.Text({
            fontFamily:"lp_BodyFont",
            stroke:"black",
            strokeWidth:1,
            fontSize:36,
            padding:20,
            align:"center",
            fill:"black",
            x:stageWidth/2,
            y:stageHeight - 80,
            width:500,
            offsetX:250,
            listening:false
        });
    }

    storybook.registerPage(page);
})();
