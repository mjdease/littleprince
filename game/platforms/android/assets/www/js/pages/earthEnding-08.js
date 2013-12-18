(function(){

    var redStars = 10;
    var yellowStars = 10;
    var blueStars = 10;

    var starRDisplay = new Array();
    var starYDisplay = new Array();
    var starBDisplay = new Array();
    var starRClick;
    var starYClick;
    var starBClick;

    var playByBar;
    var starDisplayBar;

    var sDRAtBar = new Boolean (0);
    var sDYAtBar = new Boolean (0);
    var sDBAtBar = new Boolean (0);

    var sCRClicked = new Boolean (0);
    var sCYClicked = new Boolean (0);
    var sCBClicked = new Boolean (0);

    var score = 0;

    var sounds = {};

    var page = new Page("earthEnding", 8);

    page.setPreviousPage("earthEnding", 7);

    page.setNextPage("earthEnding", 9);

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage32.jpg"},
        {name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch02_01.png"}
        //{name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch01_01_over.png"}
    ]);

    page.setNarration();

    page.initPage = function(images, stage, layers){

        //sounds.soundeffect = new Sound("assets/sound/test.mp3", false, false);

        playByBar = new Kinetic.Rect({
            x: 600,
            y: 500,
            width: 20,
            height: 200,
            fill: 'green',
        });

        starDisplayBar = new Kinetic.Rect({
            x: 0,
            y: 500,
            width: 1400,
            height: 200,
            fill: 'blue',
        })

        layers.staticBack.add(starDisplayBar);
        layers.staticBack.add(playByBar);

        starRClick = new Kinetic.Star({
            x: 400,
            y: 100,
            numPoints: 5,
            innerRadius: 50,
            outerRadius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 14
        });

        starYClick = new Kinetic.Star({
            x: 500,
            y: 90,
            numPoints: 5,
            innerRadius: 10,
            outerRadius: 20,
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 4
        });

        starBClick = new Kinetic.Star({
            x: 600,
            y: 120,
            numPoints: 5,
            innerRadius: 40,
            outerRadius: 60,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 4
        });

        layers.dynFront.add(starRClick);
        layers.dynFront.add(starYClick);
        layers.dynFront.add(starBClick);

        for(var r = 0; r < redStars; r++)
        {
            starRDisplay[r] = new Kinetic.Star({
            x: randomInt(-500, 0),
            y: randomInt(540, 660),
            numPoints: 5,
            innerRadius: 10,
            outerRadius: 20,
            fill: 'red',
            stroke: 'black'
            });

            layers.dynFront.add(starRDisplay[r]);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            starYDisplay[y] = new Kinetic.Star({
            x: randomInt(-500, 0),
            y: randomInt(540, 660),
            numPoints: 5,
            innerRadius: 10,
            outerRadius: 20,
            fill: 'yellow',
            stroke: 'black'
            });

            layers.dynFront.add(starYDisplay[y]);
        }

        for(var b = 0; b < blueStars; b++)
        {
            starBDisplay[b] = new Kinetic.Star({
            x: randomInt(-500, 0),
            y: (540, 660),
            numPoints: 5,
            innerRadius: 10,
            outerRadius: 20,
            fill: 'blue',
            stroke: 'black'
            });

            layers.dynFront.add(starBDisplay[b]);
        }
    };

    page.startPage = function(){

        //move to startChallenge when hint is obtained
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

         starRClick.on(clickEvt, clickStarCR);
         starYClick.on(clickEvt, clickStarCY);
         starBClick.on(clickEvt, clickStarCB);
        // move to startChallenge when hint is obtained
    };

    page.startChallenge = function(){

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){

        for(var r = 0; r < redStars; r++)
        {
            var starRMove = starRDisplay[r].getX() + 0.5;
            starRDisplay[r].setX(starRMove);
        }

        for(var y = 0; y < yellowStars; y++)
        {
            var starYMove = starYDisplay[y].getX() + 0.5;
            starYDisplay[y].setX(starYMove);
        }

        for(var b = 0; b < blueStars; b++)
        {
            var starBMove = starBDisplay[b].getX() + 0.5;
            starBDisplay[b].setX(starBMove);
        }


        for(var r = 0; r < redStars; r++)
        {
            if (((starRDisplay[r].getX() + 10) > 600) && ((starRDisplay[r].getX() + 10) < 620))
            {
                sDRAtBar = 1;
            }
        }

        for(var y = 0; y < yellowStars; y++)
        {
            if(((starYDisplay[y].getX() + 10) > 600) && ((starYDisplay[y].getX() + 10) < 620))
            {
                sDYAtBar = 1;
            }
        }

        for(var b = 0; b < blueStars; b++)
        {
            if(((starBDisplay[b].getX() + 10) > 600) && ((starBDisplay[b].getX() + 10) < 620))
            {
                sDBAtBar = 1;
            }
        }


        if(sCRClicked == 1)
        {
            var sR = starRClick.getStrokeR() + 255;
            var sB = starRClick.getStrokeG() + 255;
            var sG = starRClick.getStrokeB() + 255;;

            starRClick.setStrokeR(sR);
            starRClick.setStrokeG(sG);
            starRClick.setStrokeB(sB);
        }
        else
        {
            var sR = 0;
            var sB = 0;
            var sG = 0;

            starRClick.setStrokeR(sR);
            starRClick.setStrokeG(sG);
            starRClick.setStrokeB(sB);
        }

        if(sCYClicked == 1)
        {
            var sR = starYClick.getStrokeR() + 255;
            var sB = starYClick.getStrokeG() + 255;
            var sG = starYClick.getStrokeB() + 255;;

            starYClick.setStrokeR(sR);
            starYClick.setStrokeG(sG);
            starYClick.setStrokeB(sB);
        }
        else
        {
            var sR = 0;
            var sB = 0;
            var sG = 0;

            starYClick.setStrokeR(sR);
            starYClick.setStrokeG(sG);
            starYClick.setStrokeB(sB);
        }

        if(sCBClicked == 1)
        {
            var sR = starBClick.getStrokeR() + 255;
            var sB = starBClick.getStrokeG() + 255;
            var sG = starBClick.getStrokeB() + 255;;

            starBClick.setStrokeR(sR);
            starBClick.setStrokeG(sG);
            starBClick.setStrokeB(sB);
        }
        else
        {
            var sR = 0;
            var sB = 0;
            var sG = 0;

            starBClick.setStrokeR(sR);
            starBClick.setStrokeG(sG);
            starBClick.setStrokeB(sB);
        }


        if(sCRClicked == 1)
        {
            if (sDRAtBar == 1)
            {
                //play note
                console.log("Hit 1 !");
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
                console.log("Hit 2 !");
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
                console.log("Hit 3 !");
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
        sDRAtBar = 0;
        sDYAtBar = 0;
        sDBAtBar = 0;

        //If all stars are passed bar, do
        if (score >= (redStars + yellowStars + blueStars)/2)
        {
            page.challengeComplete();
        }
        //else re-do challenge


        console.log(score);

        if(page.getState() != page.States.PLAYING){
            return;
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

        starBClick.off(clickEvt);
        starYClick.off(clickEvt);
        starRClick.off(clickEvt);


        //sounds.soundeffect.destroy();
        //delete sounds.soundeffect;
    };

    function onSpriteClick(e){

        //sounds.soundeffect.play();

    }

    storybook.registerPage(page);
})();
