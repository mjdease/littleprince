// TODO - refine
(function(){
    var speed = 50;

    var redStars = 10;
    var yellowStars = 10;
    var blueStars = 10;
    var purpleStars = 10;

    var count = 0;

    var starRDisplay = new Array();
    var starYDisplay = new Array();
    var starBDisplay = new Array();
    var starPDisplay = new Array();

    var starRClick;
    var starYClick;
    var starGClick;
    var starPClick;

    var playByBar;
    var playByPos;
    var starDisplayBar;

    var sDRAtBar = new Boolean (0);
    var sDYAtBar = new Boolean (0);
    var sDBAtBar = new Boolean (0);
    var sDPAtBar = new Boolean (0);

    var sCRClicked = new Boolean (0);
    var sCYClicked = new Boolean (0);
    var sCBClicked = new Boolean (0);
    var sCPClicked = new Boolean (0);

    var score = 0;
    var starsRCrossed = new Boolean (0);
    var starsYCrossed = new Boolean (0);
    var starsBCrossed = new Boolean (0);
    var starsPCrossed = new Boolean (0);

    var starWidth = 32;
    var barWidth;
    var stageWidth, stageHeight;

    var scoreTxt;

    var sounds = {};

    var page = new Page("earthEnding", 8);

    page.setPreviousPage("earthEnding", 7);

    page.setNextPage("earthEnding", 9);

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage32.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/09/hint_ch09_01.png"},
        {name: "playByBar", path: "assets/images/earthEnding/musicBar.png"},
        {name: "starDisplayBar", path: "assets/images/earthEnding/musicTimeline.png"},
        {name: "starRClick", path: "assets/images/earthEnding/spritesheetStarRed.png"},
        {name: "starYClick", path: "assets/images/earthEnding/spritesheetStarYellow.png"},
        {name: "starGClick", path: "assets/images/earthEnding/spritesheetStarGreen.png"},
        {name: "starPClick", path: "assets/images/earthEnding/spritesheetStarPurple.png"},
        {name: "starRDisplay", path: "assets/images/earthEnding/starRed.png"},
        {name: "starYDisplay", path: "assets/images/earthEnding/starYellow.png"},
        {name: "starBDisplay", path: "assets/images/earthEnding/starGreen.png"},
        {name: "starPDisplay", path: "assets/images/earthEnding/starPurple.png"}
    ]);

    page.setNarration();
    page.setMusic("assets/sound/earthEnding/challenge8Music.mp3");

    page.initPage = function(images, stage, layers){
        stageWidth = stage.getWidth();
        stageHeight = stage.getHeight();

        //sounds.soundeffect = new Sound("assets/sound/test.mp3", false, false);

        scoreTxt = new Kinetic.Text({
            fontFamily:"lp_BodyFont",
            fontSize:32,
            stroke:"white",
            strokeWidth:1,
            align:"center",
            fill:"white",
            y:400,
            x:stageWidth/2,
            width:200,
            offsetX:100
        });

        playByBar = new Kinetic.Image({
            x: 400,
            y: 530,
            image: images.playByBar,
            width: 13,
            height: 224
        });

        playByPos = playByBar.getX();
        barWidth = playByBar.getWidth();

        starDisplayBar = new Kinetic.Image({
            x: 0,
            y: 500,
            image: images.starDisplayBar,
            width: 1280,
            height: 270,
        })

        layers.staticBack.add(starDisplayBar);
        layers.staticBack.add(playByBar);
        layers.dynBack.add(scoreTxt);

        starRClick = storybook.defineSprite({
            x: 400,
            y: 100,
            image: images.starRClick,
            animation: "starRClickAnim",
            frameRate: 2,
            offset: {x:68,y:68}
        }, 136, 136, {starRClickAnim: 2});

        starYClick = storybook.defineSprite({
            x: 500,
            y: 150,
            image: images.starYClick,
            animation: "starYClickAnim",
            frameRate: 2,
            offset: {x:68,y:68}
        }, 136, 136, {starYClickAnim: 2});

        starGClick = storybook.defineSprite({
            x: 600,
            y: 140,
            image: images.starGClick,
            animation: "starGClickAnim",
            frameRate: 2,
            offset: {x:68,y:68}
        }, 136, 136, {starGClickAnim: 2});

        starPClick = storybook.defineSprite({
            x: 700,
            y: 70,
            image: images.starPClick,
            animation: "starPClickAnim",
            frameRate: 2,
            offset: {x:68,y:68}
        }, 136, 136, {starPClickAnim: 2});

        layers.dynFront.add(starRClick);
        layers.dynFront.add(starYClick);
        layers.dynFront.add(starGClick);
        layers.dynFront.add(starPClick);

        for(var r = 0; r < redStars; r++)
        {
            starRDisplay[r] = new Kinetic.Image({
            x: -2500 + r*300,
            y: 540,
            image: images.starRDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starRDisplay[r]);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            starYDisplay[y] = new Kinetic.Image({
            x: -2500 + 150 + y * 300,
            y: 580,
            image: images.starYDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starYDisplay[y]);
        }

        for(var b = 0; b < blueStars; b++)
        {
            starBDisplay[b] = new Kinetic.Image({
            x: -2500 + 75 + b * 175,
            y: 620,
            image: images.starBDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starBDisplay[b]);
        }

        for(var p = 0; p < purpleStars; p++)
        {
            starPDisplay[p] = new Kinetic.Image({
            x: -2500 + 225 + y * 225,
            y: 660,
            image: images.starPDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starPDisplay[p]);
        }


    };

    page.startPage = function(){
        starRClick.start();
        starYClick.start();
        starGClick.start();
        starPClick.start();
    };

    page.startChallenge = function(){

        function clickStarCR()
        {
            sCRClicked = 1;
        }

        function clickStarCY()
        {
            sCYClicked = 1;
        }

        function clickStarCB()
        {
            sCBClicked = 1;
        }

        function clickStarCP()
        {
            sCPClicked = 1;
        }

         starRClick.on(clickEvt, clickStarCR);
         starYClick.on(clickEvt, clickStarCY);
         starGClick.on(clickEvt, clickStarCB);
         starPClick.on(clickEvt, clickStarCP);

         page.setState(page.States.PLAYING);
    }

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }

        for(var r = 0; r < redStars; r++)
        {
            var starX = starRDisplay[r].getX();
            if (Math.abs(starX - playByPos) < 32){
                sDRAtBar = 1;
                if(!starRDisplay[r].passed){
                    count++;
                    starRDisplay[r].passed = true;
                }
            }
        }

        for(var y = 0; y < yellowStars; y++)
        {
            var starX = starYDisplay[y].getX();
            if (Math.abs(starX - playByPos) < 32){
                sDYAtBar = 1;
                if(!starYDisplay[y].passed){
                    count++;
                    starYDisplay[y].passed = true;
                }
            }
        }

        for(var b = 0; b < blueStars; b++)
        {
            var starX = starBDisplay[b].getX();
            if (Math.abs(starX - playByPos) < 32){
                sDBAtBar = 1;
                if(!starBDisplay[b].passed){
                    count++;
                    starBDisplay[b].passed = true;
                }
            }
        }

        for(var p = 0; p < purpleStars; p++)
        {
            var starX = starPDisplay[p].getX();
            if (Math.abs(starX - playByPos) < 32){
                sDPAtBar = 1;
                if(!starPDisplay[p].passed){
                    count++;
                    starPDisplay[p].passed = true;
                }
            }
        }


        if(sCRClicked == 1)
        {
            starRClick.setScale(1.5);
        }
        else
        {
            starRClick.setScale(1);
        }

        if(sCYClicked == 1)
        {
           starYClick.setScale(1.5);
        }
        else
        {
            starYClick.setScale(1);
        }

        if(sCBClicked == 1)
        {
           starGClick.setScale(1.5);
        }
        else
        {
           starGClick.setScale(1);
        }

        if(sCPClicked == 1)
        {
           starPClick.setScale(1.5);
        }
        else
        {
           starPClick.setScale(1);
        }


        if(sCRClicked == 1)
        {
            if (sDRAtBar == 1)
            {
                //play note
                score+= 1;
            }
            else
            {
                //play error sound
                score-= 1;
            }
        }
        if(sCYClicked == 1)
        {
            if (sDYAtBar == 1)
            {
                //play note
                score+= 1;
            }
            else
            {
                //play error sound
                score-= 1;
            }
        }
        if(sCBClicked == 1)
        {
            if (sDBAtBar == 1)
            {   //play note
                score+= 1;
            }
            else
            {
                //play error sound
                score-= 1;
            }
        }

        if(sCPClicked == 1)
        {
            if (sDPAtBar == 1)
            {   //play note
                score+= 1;
            }
            else
            {
                //play error sound
                score-= 1;
            }
        }

        scoreTxt.setText("Score: " + score);

        sCRClicked = 0;
        sCYClicked = 0;
        sCBClicked = 0;
        sCPClicked = 0;
        sDRAtBar = 0;
        sDYAtBar = 0;
        sDBAtBar = 0;
        sDPAtBar = 0;

        for(var r = 0; r < redStars; r++)
        {
            // if(starRDisplay[r])
        }

        //if((starRCrossed == 1) && (starYCrossed ==1) && (starBCrossed == 1) && (starPCrossed == 1))
        //{
        if(count >= 40){
            if (score >= 15)
            {
                 endChallenge(true, "You played the notes!", layers.staticFront);
            }
            else
            {
                endChallenge(false, "You missed to many notes.", layers.staticFront);
            }
        }
            //}
        var dispX = speed * frame.timeDiff /1000;
        for(var r = 0; r < redStars; r++)
        {
            starRDisplay[r].move(dispX, 0);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            starYDisplay[y].move(dispX, 0);
        }

        for(var b = 0; b < blueStars; b++)
        {
            starBDisplay[b].move(dispX, 0);
        }

        for(var p = 0; p < purpleStars; p++)
        {
            starPDisplay[p].move(dispX, 0);
        }
    };

    page.destroyPage = function(){
        resetChallenge();
        // for(var b = 0; b < blueStars; b++)
        // {
        //     starBDisplay[b].off(clickEvt);
        // }

        // for(var y = 0; y < yellowStars; y++)
        // {
        //     starYDisplay[y].off(clickEvt);
        // }

        // for(var r = 0; r < redStars; r++)
        // {
        //     starRDisplay[r].off(clickEvt);
        // }

        // for(var p = 0; p < purpleStars; r++)
        // {
        //     starPDisplay[p].off(clickEvt);
        // }

        // starBClick.off(clickEvt);
        // starYClick.off(clickEvt);
        // starRClick.off(clickEvt);
        // starPClick.off(clickEvt);

        //sounds.soundeffect.destroy();
        //delete sounds.soundeffect;
    };

    function endChallenge(isPass, message, layer){
        var msgbox = new Kinetic.Rect({
            x:stageWidth/2,
            y:stageHeight/2,
            width:900,
            height: 72,
            offsetX:450,
            offsetY: 36,
            fill: isPass ? "green" : "red",
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
        if(isPass){
            page.setState(page.States.PASSED);
        }
        else{
            page.setState(page.States.FAILED);
        }
        layer.add(msgbox).add(msg).batchDraw();
    }

    function resetChallenge(){
        sCRClicked = 0;
        sCYClicked = 0;
        sCBClicked = 0;
        sCPClicked = 0;
        sDRAtBar = 0;
        sDYAtBar = 0;
        sDBAtBar = 0;
        sDPAtBar = 0;

        score = 0;
        count = 0;

        // for(var r = 0; r < redStars; r++)
        // {
        //     starRDisplay[r].passed = false;
        // }

        // for(var y = 0; y < yellowStars; y++)
        // {
        //     starYDisplay[y].passed = false;
        // }

        // for(var b = 0; b < blueStars; b++)
        // {
        //     starBDisplay[b].passed = false;
        // }

        // for(var p = 0; p < purpleStars; p++)
        // {
        //     starPDisplay[p].passed = false;
        // }
    }

    storybook.registerPage(page);
})();
