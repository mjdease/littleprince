(function(){
    var assets = {};
    var sounds = {};
    var loops = {};
    var ui = {};
    var scale = {
        clouds : -0.15,
        dunes : -0.6,
        sand : -2
    }

    // gameplay constants
    var speed = 226;
    var speedChangeRate = 1.3;
    var landingSpeed = 113;
    var landingSpeedTolerance = 25;
    var maxSpeed = 302;
    var stallSpeed = 87;
    var angle = 0;
    var angleChangeRate = Math.PI/512;
    var angleLimit = Math.PI / 4;
    var angleLandingTolerance = Math.PI / 16;

    // asset layout
    var duneStart = -200;
    var duneOverlap = 360;
    var sandOverlap = 5;
    var stageWidth, duneWidth, sandWidth;

    // inputs
    var increaseSpeed = false;
    var decreaseSpeed = false;
    var increaseAngle = false;
    var decreaseAngle = false;

    // update rate throttles
    var inputLastCheck = 0;
    var inputCheckThreshold = 100;
    var endLastCheck = 0;
    var endCheckThreshold = 400;

    var page = new Page("earthIntro", 1);
    page.setPreviousPage("earthIntro", 0);

    page.setNextPage("earthIntro", 2);

    page.setLeftTextStyle(null, null, null,"#ffffff");
    page.setRightTextStyle(null, null, null,"#ffffff");

    page.setRequiredAssets([
        {name: "plane", path: "assets/images/earthIntro/01_plane.png"},
        {name: "background", path: "assets/images/earthIntro/01_sky.jpg"},
        {name: "dunes", path: "assets/images/earthIntro/01_dunes.png"},
        {name: "sand", path: "assets/images/earthIntro/01_sands.png"},
        {name: "cloud1", path: "assets/images/earthIntro/01_cloud1.png"},
        {name: "cloud2", path: "assets/images/earthIntro/01_cloud2.png"},
        {name: "cloud3", path: "assets/images/earthIntro/01_cloud3.png"},
        {name: "cloud4", path: "assets/images/earthIntro/01_cloud4.png"},
        {name: "cloud5", path: "assets/images/earthIntro/01_cloud5.png"},
        {name: "cloud6", path: "assets/images/earthIntro/01_cloud6.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch01_01.png"}
        ]);

    page.setNarration();

    page.initPage = function(images, stage, layers){
        stageWidth = stage.getWidth();
        stageHeight = stage.getHeight();

        assets.clouds = [];
        loops.clouds = [];
        for(var i = 0; i < 6; i++){
            var cloud = new Kinetic.Image({
                x: randomInt(30, 1200),
                y: randomInt(0, 360),
                image: images["cloud" + i],
            });
            layers.dynBack.add(cloud);
            assets.clouds.push(cloud);
            loops.clouds.push(cloud);
        }

        assets.sand = new Kinetic.Image({
            y: stageHeight,
            image: images.sand,
            offsetY: 120
        });
        sandWidth = assets.sand.getWidth();
        loops.sands = [assets.sand.clone({x:0}), assets.sand.clone({x:sandWidth - sandOverlap}), assets.sand.clone({x:(sandWidth - sandOverlap)*2})];

        assets.dune = new Kinetic.Image({
            y: 374,
            image: images.dunes
        });
        duneWidth = assets.dune.getWidth();
        loops.dunes = [assets.dune.clone({x:duneStart}), assets.dune.clone({x:duneStart + duneWidth - duneOverlap})]

        addToStage(layers.dynBack, loops.dunes);
        addToStage(layers.dynBack, loops.sands);

        assets.plane = defineSprite({
            x: 510,
            y: 190,
            offset: {x:375, y:347},
            image: images.plane,
            animation: "planeAnim",
            frameRate: 24
        }, 644, 446, {planeAnim: 7});
        layers.dynFront.add(assets.plane);

        initializeUi();
    };

    page.startPage = function(layers){
        assets.plane.start();
    };

    page.startChallenge = function(layers){
        initializeUi();

        layers.dynFront.add(ui.angle).add(ui.throttle);
        $(document).on("mouseup touchend", function(){
            increaseSpeed = false;
            decreaseSpeed = false;
            increaseAngle = false;
            decreaseAngle = false;
        });

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        var pageState = page.getState();
        if(pageState == page.States.FAILED || speed == 0){
            return;
        }

        if(pageState == page.States.PASSED){
            speed -= 0.2*speedChangeRate;
            if(speed < 0) {
                assets.plane.stop();
                speed = 0;
            }
        }

        var dispX = speed * Math.cos(angle) * frame.timeDiff / 1000;
        var dispY = speed * Math.sin(angle) * frame.timeDiff / 1000;

        assets.plane.setRotation(angle);
        if(pageState != page.States.PASSED){
            assets.plane.move(0, dispY);
        }

        for(var i = 0; i < loops.clouds.length; i++){
            var cloud = loops.clouds[i];
            if(cloud.getX() + cloud.getWidth() < 0){
                cloud.setX(stageWidth);
            }
            else{
                cloud.move(scale.clouds * dispX, 0);
            }
        }

        for(i = 0; i < loops.dunes.length; i++){
            var dune = loops.dunes[i];
            if(dune.getX() + duneWidth < 0){
                dune.setX(duneWidth - duneOverlap*2);
            }
            dune.move(scale.dunes * dispX, 0);
        }

        for(i = 0; i < loops.sands.length; i++){
            var sand = loops.sands[i];
            var currX = sand.getX();
            if(currX + sandWidth < 0){
                sand.setX(currX + (sandWidth - sandOverlap) * 3);
            }
            sand.move(scale.sand * dispX, 0);
        }

        if(pageState != page.States.PLAYING){
            return;
        }

        updateVelocity();
        checkEnd(layers.staticFront);
    };

    page.destroyPage = function(){
        resetChallenge();

        for(var n in loops){
            delete loops[n];
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

    function getAngleMeterStatus(){
        return 30 + map(angle, -angleLimit, angleLimit, 0, 160);
    }

    function getSpeedMeterStatus(){
        return 30 + map(speed, maxSpeed, stallSpeed, 0, 160);
    }

    function updateVelocity(){
        if(Date.now() - inputLastCheck > inputCheckThreshold){
            inputLastCheck = Date.now();
            if(increaseAngle) angle += angleChangeRate;
            if(decreaseAngle) angle -= angleChangeRate;
            if(increaseSpeed) speed += speedChangeRate;
            if(decreaseSpeed) speed -= speedChangeRate;
            speed += speedChangeRate * 2 * map(angle, -angleLimit, angleLimit, -1, 1);
            if(speed > maxSpeed) speed = maxSpeed;
            if(angle < -angleLimit) angle = -angleLimit;
            if(angle > angleLimit) angle = angleLimit;
            ui.angleIndicator.setY(getAngleMeterStatus());
            ui.angleLabel.setText(Math.round(angle * -180 / Math.PI) + "°");
            ui.throttleIndicator.setY(getSpeedMeterStatus());
            ui.throttleLabel.setText(Math.round(speed / 0.621) + "km/h");
        }
    }

    function checkEnd(layer){
        if(Date.now() - endLastCheck > endCheckThreshold){
            endLastCheck = Date.now();
            if(speed < stallSpeed){
                endChallenge(false, "The plane was travelling too slow and stalled.", layer);
                return;
            }
            //touchdown
            if(assets.plane.getY() > stageHeight - 120){
                if(angle > angleLandingTolerance || angle < -angleLandingTolerance){
                    endChallenge(false, "The plane landed at too steep an angle.", layer);
                    return;
                }
                if(speed > landingSpeed + landingSpeedTolerance){
                    endChallenge(false, "The plane was travelling too fast.", layer);
                    return;
                }
                endChallenge(true, "You landed the plane successfully!", layer);
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
            ui.throttle.hide();
            ui.angle.hide();
            page.setState(page.States.PASSED);
        }
        else{
            assets.plane.stop();
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
        speed = 226;
        angle = 0;
        inputLastCheck = 0;
        endLastCheck = 0;
        increaseSpeed = false;
        decreaseSpeed = false;
        increaseAngle = false;
        decreaseAngle = false;
    }

    function restartChallenge(){
        resetChallenge();
        assets.plane.setPosition(510, 190).start();
        page.setState(page.States.PLAYING);
    }

    function initializeUi(){
        ui.angle = new Kinetic.Group({
            x:1280 - 90 - 20,
            y:stageHeight - 10 - 136 - 10 - 190
        });
        ui.throttle = new Kinetic.Group({
            x:20,
            y:stageHeight - 10 - 136 - 10 - 190
        });

        var label = new Kinetic.Text({
            fontFamily:"lp_BodyFont",
            fontWeight:"bold",
            fontSize:28,
            lineHeight:30,
            width:90,
            align:"center",
            fill:"black"
        });
        var meter = new Kinetic.Rect({
            y:30,
            width: 30,
            height: 160,
            stroke: "black",
            strokeWeight: 3,
            fillLinearGradientStartPointY : 0,
            fillLinearGradientEndPointY : 160
        });
        var loc = new Kinetic.Rect({
            width:10,
            height:10,
            offset: {x:5,y:5},
            rotation : Math.PI/4,
            fill:"black"
        });
        var btn = new Kinetic.Rect({
            width:50,
            height:80,
            fill:"orange"
        });

        ui.angleUp = btn.clone({
            x:40,
            y:30
        }).on("mousedown touchstart", function(){
            decreaseAngle = true;
        })

        ui.angleDown = btn.clone({
            x:40,
            y:30+80,
            fill:"blue"
        }).on("mousedown touchstart", function(){
            increaseAngle = true;
        });
        ui.angleIndicator = loc.clone({
            x: 15,
            y: getAngleMeterStatus()
        });
        ui.angleLabel = label.clone({
            fontSize:24,
            y: 200
        });
        ui.angle.add(meter.clone({
            fillLinearGradientColorStops : [0, "red", 0.5, "green", 1, "red"]
        })).add(label.clone({
            text:"Angle"
        })).add(ui.angleIndicator).add(ui.angleDown).add(ui.angleUp).add(ui.angleLabel);

        ui.throttleUp = btn.clone({
            y:30
        }).on("mousedown touchstart", function(){
            increaseSpeed = true;
        });
        ui.throttleDown = btn.clone({
            y:30+80,
            fill:"blue"
        }).on("mousedown touchstart", function(){
            decreaseSpeed = true;
        });

        ui.throttleIndicator = loc.clone({
            x: 60 + 15,
            y: getSpeedMeterStatus()
        });
        ui.throttleLabel = label.clone({
            fontSize:24,
            y: 200,
            width:120
        });
        ui.throttle.add(meter.clone({
            x: 60,
            fillLinearGradientColorStops : [0, "red", map(landingSpeed, stallSpeed, maxSpeed, 1, 0), "green", 1, "red"]
        })).add(label.clone({
            text:"Speed"
        })).add(ui.throttleIndicator).add(ui.throttleDown).add(ui.throttleUp).add(ui.throttleLabel);
    }

    storybook.registerPage(page);
})();
