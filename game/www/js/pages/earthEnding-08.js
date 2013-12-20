(function(){

    var redStars = 10;
    var yellowStars = 10;
    var blueStars = 10;
    var purpleStars = 10;

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

    page.initPage = function(images, stage, layers){

        //sounds.soundeffect = new Sound("assets/sound/test.mp3", false, false);

        playByBar = new Kinetic.Image({
            x: 400,
            y: 530,
            image: images.playByBar,
            width: 13,
            height: 224
        });

        playByPos = playByBar.getX();

        starDisplayBar = new Kinetic.Image({
            x: 0,
            y: 500,
            image: images.starDisplayBar,
            width: 1280,
            height: 270,
        })

        layers.staticBack.add(starDisplayBar);
        layers.staticBack.add(playByBar);

        starRClick = storybook.defineSprite({
            x: 400,
            y: 100,
            image: images.starRClick,
            animation: "starRClickAnim",
            frameRate: 2
        }, 136, 136, {starRClickAnim: 2});

        starYClick = storybook.defineSprite({
            x: 500,
            y: 50,
            image: images.starYClick,
            animation: "starYClickAnim",
            frameRate: 2
        }, 136, 136, {starYClickAnim: 2});

        starGClick = storybook.defineSprite({
            x: 600,
            y: 140,
            image: images.starGClick,
            animation: "starGClickAnim",
            frameRate: 2
        }, 136, 136, {starGClickAnim: 2});

        starPClick = storybook.defineSprite({
            x: 700,
            y: 70,
            image: images.starPClick,
            animation: "starPClickAnim",
            frameRate: 2
        }, 136, 136, {starPClickAnim: 2});

        layers.dynFront.add(starRClick);
        layers.dynFront.add(starYClick);
        layers.dynFront.add(starGClick);
        layers.dynFront.add(starPClick);

        for(var r = 0; r < redStars; r++)
        {
            starRDisplay[r] = new Kinetic.Image({
            x: randomInt(-1000, 0),
            y: randomInt(540, 660),
            image: images.starRDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starRDisplay[r]);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            starYDisplay[y] = new Kinetic.Image({
            x: randomInt(-1000, 0),
            y: randomInt(540, 660),
            image: images.starYDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starYDisplay[y]);
        }

        for(var b = 0; b < blueStars; b++)
        {
            starBDisplay[b] = new Kinetic.Image({
            x: randomInt(-1000, 0),
            y: (540, 660),
            image: images.starBDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starBDisplay[b]);
        }

        for(var p = 0; p < purpleStars; p++)
        {
            starPDisplay[p] = new Kinetic.Image({
            x: randomInt(-1000, 0),
            y: (540, 660),
            image: images.starPDisplay,
            width: 32,
            height: 32
            });

            layers.dynFront.add(starBDisplay[p]);
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

        for(var r = 0; r < redStars; r++)
        {
            if (((starRDisplay[r].getX() + starRDisplay[r].getWidth()) > playByPos) && (starRDisplay[r].getX() + (playByBar.getWidth()/2)) < (playByPos + playByBar.getWidth()))

            {
                sDRAtBar = 1;
            }
        }

        for(var y = 0; y < yellowStars; y++)
        {
            if(((starYDisplay[y].getX() + starYDisplay[y].getWidth()) > playByPos) && (starYDisplay[y].getX() + (playByBar.getWidth()/2)) < (playByPos + playByBar.getWidth()))            {
                sDYAtBar = 1;
            }
        }

        for(var b = 0; b < blueStars; b++)
        {
            if(((starBDisplay[b].getX() + starBDisplay[b].getWidth()) > playByPos) && (starRDisplay[b].getX() + (playByBar.getWidth()/2)) < (playByPos + playByBar.getWidth()))
            {
                sDBAtBar = 1;
            }
        }

        for(var p = 0; p < purpleStars; p++)
        {
            if(((starPDisplay[p].getX() + starPDisplay[p].getWidth()) > playByPos) && (starRDisplay[p].getX() + (playByBar.getWidth()/2)) < (playByPos + playByBar.getWidth()))
            {
                sDPAtBar = 1;
            }
        }


        if(sCRClicked == 1)
        {
            starRClick.setScale(1.5);
            starRClick.setOffset(36,36);
        }
        else
        {
            starRClick.setScale(1);
            starRClick.setOffset(0,0);
        }

        if(sCYClicked == 1)
        {
           starYClick.setScale(1.5);
           starYClick.setOffset(36,36);
        }
        else
        {
            starYClick.setScale(1);
            starYClick.setOffset(0,0);
        }

        if(sCBClicked == 1)
        {
           starGClick.setScale(1.5);
           starGClick.setOffset(36,36);
        }
        else
        {
           starGClick.setScale(1);
           starGClick.setOffset(0,0);
        }

        if(sCPClicked == 1)
        {
           starPClick.setScale(1.5);
           starPClick.setOffset(36,36);
        }
        else
        {
           starPClick.setScale(1);
           starPClick.setOffset(0,0);
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
                console.log("oops");
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
                console.log("oops");
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
                console.log("oops");
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
                console.log("oops");
                score-= 1;
            }
        }

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
        // console.log("all stars have crossed");
            if (score >= (redStars + yellowStars + blueStars + purpleStars)/4)
            {
                 page.challengeComplete();
            }
            else
            {
                //console.log("failed mission");
            }
            //}


        console.log(score);

        if(page.getState() != page.States.PLAYING){
            return;
        }

        for(var r = 0; r < redStars; r++)
        {
            var starRMove = starRDisplay[r].getX() + 5.5;
            starRDisplay[r].setX(starRMove);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            var starYMove = starYDisplay[y].getX() + 5.5;
            starYDisplay[y].setX(starYMove);
        }

        for(var b = 0; b < blueStars; b++)
        {
            var starBMove = starBDisplay[b].getX() + 5.5;
            starBDisplay[b].setX(starBMove);
        }

        for(var p = 0; p < purpleStars; p++)
        {
            var starPMove = starPDisplay[p].getX() + 5.5;
            starPDisplay[p].setX(starPMove);
        }
    };

    page.destroyPage = function(){

        for(var b = 0; b < blueStars; b++)
        {
            starBDisplay[b].off(clickEvt);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            starYDisplay[y].off(clickEvt);
        }

        for(var r = 0; r < redStars; r++)
        {
            starRDisplay[r].off(clickEvt);
        }

        for(var p = 0; p < purpleStars; r++)
        {
            starPDisplay[p].off(clickEvt);
        }

        starBClick.off(clickEvt);
        starYClick.off(clickEvt);
        starRClick.off(clickEvt);
        starPClick.off(clickEvt);


        //sounds.soundeffect.destroy();
        //delete sounds.soundeffect;
    };

    function onSpriteClick(e){

        //sounds.soundeffect.play();

    }

    storybook.registerPage(page);
})();
