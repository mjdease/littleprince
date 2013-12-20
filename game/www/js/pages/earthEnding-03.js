(function(){

    var princeImg;
    var princeMoving = new Boolean(0);
    var princeCaught = new Boolean(0);

    var safeSpot;
    var safeSpotPos;

    var foxImage;
    var foxLLimit = 800;
    var foxRLimit = 1200;
    var foxSpeed = 1;
    var foxScale = 1;
    var foxPos;
    var flipTime;

    var page = new Page("earthEnding", 3);

    page.setPreviousPage("earthEnding", 2);

    page.setNextPage("earthEnding", 4);

    page.setRequiredAssets([
        {name: "princeImg", path: "assets/images/earthEnding/prince.png"},
        {name: "safeSpot", path: "assets/images/earthEnding/hedgeDay1.png"},
        {name: "foxImg", path: "assets/images/earthEnding/fox.png"},
        {name: "background", path: "assets/images/earthEnding/bgPage27.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/07/hint_ch07_01.png"}
    ]);


    page.setNarration();

    page.initPage = function(images, stage, layers){

        safeSpot = new Kinetic.Image({
            x: 400,
            y: 0,
            image: images.safeSpot,
            width: 270,
            height: 733
        })

        layers.dynBack.add(safeSpot);

        safeSpotPos = safeSpot.getX();

        princeImg = new Kinetic.Image({
            x: 0,
            y: 600,
            image: images.princeImg,
            width: 131,
            height: 191
        });

        foxImg = new Kinetic.Image({
            x: 800,
            y: 600,
            image: images.foxImg,
            width: 165,
            height: 172
        });

        layers.dynFront.add(princeImg);
        layers.dynFront.add(foxImg);

    };

    page.startPage = function(){

        page.setState(page.States.PLAYING);

        flipTime = Math.floor(Math.random() * (5000-2000) + 2000);

        setInterval(function() {flipFox()}, flipTime);
    };

    page.startChallenge = function(){
        function movePrince()
        {
            var princePos = princeImg.getX() + 10;
            princeImg.setX(princePos);
            princeMoving = 1;
        }

        princeImg.on(clickEvt, movePrince);

        
    }

    page.update = function(frame, stage, layers){

        foxPos = foxImg.getX() + foxSpeed;
        foxImg.setX(foxPos);

        if (foxImg.getX() < foxLLimit)
        {
            foxImg.setX(foxLLimit);
        }

        if (foxImg.getX() > foxRLimit)
        {
            foxImg.getX(foxRLimit);
        }

        if (foxSpeed < 0)
        {
            if(princeMoving == 1)
            {
                //failure start again
                console.log("oops");
                //princeImg.off(clickEvt);
                //princeCaught = 1;
            }
        }

        if ((safeSpotPos >= 400) && (safeSpotPos < 600))
        {
            if ((princeImg.getX() + princeImg.getWidth()) >= safeSpotPos)
            {
                levelTwo();
            }
        }

        if ((safeSpotPos >= 600) && (safeSpotPos < 800))
        {
            if ((princeImg.getX() + princeImg.getWidth()) >= safeSpotPos)
            {
                levelThree();
            }
        }

        if ((safeSpotPos >= 800) && (safeSpotPos < 1000))
        {
            if ((princeImg.getX() + princeImg.getWidth()) >= safeSpotPos)
            {
                princeImg.off(clickEvt);
            }
        }

        if(page.getState() != page.States.PLAYING){
            return;
        }

        princeMoving = 0;

    };

    function flipFox()
    {
        if(princeCaught == 0)
        {
            foxScale*= -1;
            foxImg.setScale({ x: foxScale });

            foxSpeed*= -1;
        }
    }

    function levelTwo()
    {
        alert("Day 2");
        foxLLimit = 800;
        safeSpot.setX(600);
        safeSpotPos = safeSpot.getX();
        princeImg.setX(0);
    }

    function levelThree()
    {
        alert("Day 3");
        foxLLimit = 1000;
        safeSpot.setX(800);
        safeSpotPos = safeSpot.getX();
        princeImg.setX(0);

    }

    function onSpriteClick(e){
        page.challengeComplete();
    }

    storybook.registerPage(page);
})();
