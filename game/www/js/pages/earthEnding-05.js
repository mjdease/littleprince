(function(){
    var assets = {};
    var gameObjects = {};
    var ui = {};
    var sounds = {};

    var stageWidth, stageHeight;

    // gameplay constants
    var depthPerRotation = 250;
    var raisedDepth = 150;
    var maxDepth = depthPerRotation * 4;
    var waterDepth = depthPerRotation * 3;
    var fillRate = 0.05;
    var maxFill = 1;
    var targetFill = 0.7;
    var targetTolerance = 0.1;

    var fill = 0;

    // update rate throttles
    var inputLastCheck = 0;
    var inputCheckThreshold = 40;
    var endLastCheck = 0;
    var endCheckThreshold = 400;

    var page = new Page("earthEnding", 5);

    page.setPreviousPage("earthEnding", 4);

    page.setNextPage("earthEnding", 6);

    page.setRequiredAssets([
        {name: "hint", path: "assets/images/ui/page_challenge/08/hint_ch08_01.png"},
        {name: "background", path: "assets/images/earthEnding/05/5_background.jpg"},
        {name: "handle", path: "assets/images/earthEnding/05/5_handle.png"},
        {name: "well", path: "assets/images/earthEnding/05/5_well.png"},
        {name: "bucket", path: "assets/images/earthEnding/05/5_bucket.png"},
        {name: "rope", path: "assets/images/earthEnding/05/5_rope.png"},
        {name: "reel", path: "assets/images/earthEnding/05/5_reel.png"},
        {name: "container", path: "assets/images/earthEnding/05/5_container.png"},
        {name: "water", path: "assets/images/earthEnding/05/5_water.png"}
    ]);

    page.setNarration();

    page.initPage = function(images, stage, layers){
        stageWidth = stage.getWidth();
        stageHeight = stage.getHeight();

        ui.touch = false;

        assets.bucket = new Kinetic.Image({
            image: images.bucket
        });
        assets.rope = new Kinetic.Image({
            image: images.rope
        });
        assets.reel = new Kinetic.Image({
            image: images.reel
        });

        ui.water = new Kinetic.Image({
            x:162,
            y:712,
            image: images.water,
            scaleY: 0,
            offset:{x:66,y:368}
        });
        ui.container = new Kinetic.Image({
            image: images.container,
            x : 162,
            y : 712,
            offset : {x:133,y:426}
        });
        ui.handle = new Kinetic.Image({
            image: images.handle,
            x : 1075,
            y : 540,
            offset : {x:154,y:154}
        });

        var well = new Kinetic.Image({
            x:502,
            y:752,
            image: images.well,
            offsetY: 347
        });
        layers.staticFront.add(well).batchDraw();
        well.moveToBottom();

        sounds.tap = new Sound("assets/sound/earthEnding/water.mp3", false, true);
        sounds.pull = new Sound("assets/sound/earthEnding/pull.mp3", false, true);

        gameObjects.bucket = new Bucket(577, 53, assets.bucket.getWidth());

        layers.dynBack.add(gameObjects.bucket.node);

        stage.on("mouseup touchend", function(){
            ui.touched = false;
            ui.angle = null;
            sounds.pull.stop();
        });
        var handlePosition = ui.handle.getPosition();
        ui.handle.on("mousemove touchmove", function(e){
            if(!ui.touched || page.getState() != page.States.PLAYING){
                return;
            }
            if(Date.now() - inputLastCheck > inputCheckThreshold){
                inputLastCheck = Date.now();
                var pointer = {x : e.pageX/storybook.getScale(), y : e.pageY/storybook.getScale()}
                var angle = Math.atan2(pointer.y - handlePosition.y, pointer.x - handlePosition.x);
                var rotationDirection = getRotationDirection(angle, ui.angle);
                var depth = gameObjects.bucket.getDepth();
                if(rotationDirection < 0 && depth === 0 ||
                    rotationDirection > 0 && depth === maxDepth){
                    return;
                }
                ui.handle.setRotation(angle);
                if(ui.angle !== null){
                    gameObjects.bucket.move(rotationDirection * getDepthFromAngle(angle, ui.angle));
                }
                ui.angle = angle;
            }
        });
    };

    page.startPage = function(){

    };

    page.startChallenge = function(layers){
        layers.dynFront.add(ui.water).add(ui.handle);
        layers.staticFront.add(ui.container).batchDraw();

        ui.handle.on("mousedown touchstart", function(){
            ui.touched = true;
            ui.angle = null;
            sounds.pull.play();
        });

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }

        var fillScale = (gameObjects.bucket.getDepth() - waterDepth) / (maxDepth - waterDepth);
        if(fillScale > 0){
            fill += (fillScale * fillRate * frame.timeDiff/1000);
            ui.water.setScaleY(fill);
        }

        checkEnd(layers.staticFront);
    };

    page.destroyPage = function(){
        for(n in assets){
            delete assets[n];
        }
        for(n in ui){
            delete ui[n];
        }
        for(n in gameObjects){
            delete gameObjects[n];
        }
        for(n in sounds){
            sounds[n].destroy();
            delete sounds[n];
        }
    };

    function resetChallenge(){
        fill = 0
        inputLastCheck = 0;
        endLastCheck = 0;
        ui.touching = false;
        ui.water.setScaleY(fill);
    }

    function restartChallenge(){
        resetChallenge();
        gameObjects.bucket.setDepth(0);
        page.setState(page.States.PLAYING);
    }

    function checkEnd(layer){
        if(Date.now() - endLastCheck > endCheckThreshold){
            endLastCheck = Date.now();
            var depth = gameObjects.bucket.getDepth();
            if(fill > targetFill + targetTolerance){
                endChallenge(false, "The bucket is too full.", layer);
                return;
            }
            if(depth < raisedDepth && fill > 0){
                if(fill < targetFill - targetTolerance){
                    endChallenge(false, "You didn't get enough water.", layer);
                    return;
                }
                endChallenge(true, "You collected the water for the little prince!", layer);
                return;
            }
        }
    }

    function endChallenge(isPass, message, layer){
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
            ui.water.hide();
            ui.container.hide();
            ui.handle.hide();
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

    function getRotationDirection(newAngle, oldAngle){
        if(newAngle > Math.PI/2 && oldAngle < -Math.PI/2){
            // clockwise
            return -1;
        }
        if(newAngle < -Math.PI/2 && oldAngle > Math.PI/2){
            // counter-clockwise
            return 1;
        }
        if(newAngle > oldAngle){
            // clockwise
            return -1;
        }
        else{
            // counter-clockwise
            return 1;
        }
    }

    function getDepthFromAngle(newAngle, oldAngle){
        var theta;
        if(newAngle > Math.PI/2 && oldAngle < -Math.PI/2){
            theta = (Math.PI - newAngle) + (oldAngle + Math.PI);
        }
        else if(newAngle < -Math.PI/2 && oldAngle > Math.PI/2){
            theta = (newAngle + Math.PI) + (Math.PI - oldAngle);
        }
        else{
            // #shittycoding
            theta = Math.abs(Math.abs(newAngle) - Math.abs(oldAngle));
        }
        var totalRotation = maxDepth / depthPerRotation * 2 * Math.PI;
        return theta/totalRotation*maxDepth;
    }

    function Bucket(x, y, width){
        var depth = 0;
        var reelOverlap = 5;
        var bucketOverlap = 6;
        var rope = new Kinetic.Collection();
        var ropeSegmentHeight = assets.rope.getHeight();
        var reelHeight = assets.reel.getHeight();

        this.node = new Kinetic.Group({
            x:x,
            y:y,
            offsetX:width/2
        });

        var reel = assets.reel.clone({
            offsetX:-width/2 + assets.reel.getWidth()/2
        });
        var bucket = assets.bucket.clone({
            offsetY:-assets.reel.getHeight()
        });

        this.node.add(reel).add(bucket);

        this.setDepth = function(d){
            depth = d;
            if(depth < 0) depth = 0;
            if(depth > maxDepth) depth = maxDepth;
            var requiredSegments = Math.ceil((depth + reelOverlap + bucketOverlap)/ropeSegmentHeight);
            var offsetY = depth - requiredSegments * ropeSegmentHeight;
            if(requiredSegments > rope.length){
                var cachedLength = rope.length;
                for(var i = 0; i < requiredSegments - cachedLength; i++){
                    var newSegment = assets.rope.clone({
                        offsetY:-reelHeight + reelOverlap,
                        offsetX:-width/2 + assets.rope.getWidth()/2
                    });
                    rope.splice(0,0,newSegment);
                    this.node.add(newSegment);
                    newSegment.moveToBottom();
                }
            }
            if(requiredSegments < rope.length && rope.length){
                var removedSegment = rope.splice(0,1);
            }
            rope.each(function(segment, i){
                segment.setY(offsetY + i * ropeSegmentHeight);
            });
            bucket.setY(depth - bucketOverlap);
            if(depth > waterDepth){
                if(!sounds.tap.isPlaying) sounds.tap.play();
            }
            else{
                if(sounds.tap.isPlaying) sounds.tap.stop();
            }
        };

        this.getDepth = function(){
            return depth;
        };

        // - is up + is down
        this.move = function(d){
            this.setDepth(depth + d);
        };

        this.setDepth(0);
    }

    storybook.registerPage(page);
})();
