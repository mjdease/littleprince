(function(){
    var planeSprite;
    var bg1Img;
    var bg2Img;
    var cloud1Img;
    var cloud2Img;
    var cloud3Img;
    var cloud4Img;
    var cloud5Img;
    var cloud6Img;
    var rButtonImg;
    var lButtonImg;
    var uButtonImg;
    var dButtonImg;

    var page = new Page("earthIntro", 1);
    var sounds = {};

    page.setPreviousPage("earthIntro", 0);

    page.setNextPage("earthIntro", 2);

    page.setLeftTextStyle(null, null, null,"#ffffff");
    page.setRightTextStyle(null, null, null,"#ffffff");

    page.setRequiredAssets([
        {name: "planeImg", path: "assets/images/earthIntro/plane.png"},
        {name: "runwayImg", path: "assets/images/earthIntro/runway.png"},
        {name: "background", path: "assets/images/earthIntro/sky.png"},
        {name: "bg1Img", path: "assets/images/earthIntro/bg1.png"},
        {name: "sandImg", path: "assets/images/earthIntro/sands.png"},
        {name: "bg2Img", path: "assets/images/earthIntro/bg2.png"},
        {name: "cloud1Img", path: "assets/images/earthIntro/cloud1.png"},
        {name: "cloud2Img", path: "assets/images/earthIntro/cloud2.png"},
        {name: "cloud3Img", path: "assets/images/earthIntro/cloud3.png"},
        {name: "cloud4Img", path: "assets/images/earthIntro/cloud4.png"},
        {name: "cloud5Img", path: "assets/images/earthIntro/cloud5.png"},
        {name: "cloud6Img", path: "assets/images/earthIntro/cloud6.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch01_01.png"}
    ]);

    page.setNarration();

    page.initPage = function(images, stage, layers){

        sandImg = new Kinetic.Image({
            x: 0,
            y: 600,
            image: images.sandImg,
            width: 2000,
            height: 152
        });
        layers.staticBack.add(sandImg);

        cloud1Img = new Kinetic.Image({
            x: 600,
            y: 0,
            image: images.cloud1Img,
            width: 427,
            height: 172
        });
        layers.dynBack.add(cloud1Img);

        cloud2Img = new Kinetic.Image({
            x: 10,
            y: 50,
            image: images.cloud2Img,
            width: 427,
            height: 172
        });
        layers.dynBack.add(cloud2Img);

        cloud3Img = new Kinetic.Image({
            x: 1000,
            y: 50,
            image: images.cloud3Img,
            width: 427,
            height: 172
        });
        layers.dynBack.add(cloud3Img);

        cloud4Img = new Kinetic.Image({
            x: 500,
            y: 100,
            image: images.cloud4Img,
            width: 427,
            height: 172
        });
        layers.dynBack.add(cloud4Img);

        cloud5Img = new Kinetic.Image({
            x: 250,
            y: 0,
            image: images.cloud5Img,
            width: 427,
            height: 172
        });
        layers.dynBack.add(cloud5Img);

        cloud6Img = new Kinetic.Image({
            x: 0,
            y: 0,
            image: images.cloud6Img,
            width: 427,
            height: 172
        });
        layers.dynBack.add(cloud6Img);

        bg1Img = new Kinetic.Image({
            x: 0,
            y: 0,
            image: images.bg1Img,
            width: 3682,
            height: 698
        });
        layers.dynBack.add(bg1Img);

        bg2Img = new Kinetic.Image({
            x: 0,
            y: 0,
            image: images.bg2Img,
            width: 3682,
            height: 698
        });
        layers.dynBack.add(bg2Img);

        runwayImg = new Kinetic.Image({
            x: 1100,
            y: 700,
            image: images.runwayImg,
            width: 1704,
            height: 60
        });
        layers.dynBack.add(runwayImg);

        planeSprite = storybook.defineSprite({
            x:0,
            y:0,
            image: images.planeImg,
            animation: "planeAnim",
            frameRate: 24
        }, 644, 446, {planeAnim: 7});
        layers.dynFront.add(planeSprite);

        rButton = new Kinetic.Circle({
         x: 1150,
         y: 400,
         radius: 20,
         fill: 'blue'
      });
        lButton = new Kinetic.Circle({
         x: 1110,
         y: 400,
         radius: 20,
         fill: 'red'
      });
      uButton = new Kinetic.Circle({
         x: 1125,
         y: 370,
         radius: 20,
         fill: 'green'
      });
      dButton = new Kinetic.Circle({
         x: 1125,
         y: 430,
         radius: 20,
         fill: 'yellow'
      });

        layers.staticFront.add(rButton);
        layers.staticFront.add(lButton);
        layers.staticFront.add(uButton);
        layers.staticFront.add(dButton);
    };


    page.startPage = function(){
        planeSprite.start();
    };

    page.startChallenge = function()
    {
         function moveImageR()
        {
          var planePosX = planeSprite.getX() + 20;
          planeSprite.setX(planePosX);

          var rotValue = planeSprite.getRotationDeg();
          var planePosY = planeSprite.getY();
          var planeRot = rotValue + planePosY;

          planeSprite.setY(planeRot);


            if(planeSprite.getY() <= 0)
            {
                planeSprite.setY(0);
            }
         }

      function moveImageL()
      {
          var planePos = planeSprite.getX() - 2;
          planeSprite.setX(planePos) ;

          if(planeSprite.getX() <= 0)
            {
                planeSprite.setX(0);
            }

            if(planeSprite.getY() <= 0)
            {
                planeSprite.setY(0);
            }
      }

      function moveImageU()
      {
          var planeRot = planeSprite.getRotationDeg() - 2;
          planeSprite.setRotationDeg(planeRot);

          if(planeSprite.getRotationDeg() <= -16)
            {
                planeSprite.setRotationDeg(-16);
            }
      }

      function moveImageD()
      {
          var planeRot = planeSprite.getRotationDeg() + 2;
          planeSprite.setRotationDeg(planeRot);

          if(planeSprite.getRotationDeg() >= 16)
            {
                planeSprite.setRotationDeg(16);
            }
      }

       rButton.on(clickEvt, moveImageR);
       lButton.on(clickEvt, moveImageL);
       uButton.on(clickEvt, moveImageU);
       dButton.on(clickEvt, moveImageD);

       page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){

       var bg1Pos = bg1Img.getX() -0.20;
        bg1Img.setX(bg1Pos) ;

       var bg2Pos = bg2Img.getX() -0.10;
        bg2Img.setX(bg2Pos) ;

       var cloud1Pos = cloud1Img.getX() - 0.1;
        cloud1Img.setX(cloud1Pos) ;

       var cloud2Pos = cloud2Img.getX() - 0.01;
        cloud2Img.setX(cloud2Pos) ;

        var cloud3Pos = cloud3Img.getX() - 0.1;
        cloud3Img.setX(cloud3Pos) ;

        var cloud4Pos = cloud4Img.getX() - 0.01;
        cloud4Img.setX(cloud4Pos) ;

        var cloud5Pos = cloud5Img.getX() - 0.1;
        cloud5Img.setX(cloud5Pos) ;

        var cloud6Pos = cloud6Img.getX() - 0.1;
        cloud6Img.setX(cloud6Pos) ;


        if(planeSprite.getY() >= 320)
        {
            if((planeSprite.getX() + 644) >= runwayImg.getX())
            {
                if (planeSprite.getRotationDeg() <= 8)
                {
                    page.challengeComplete();

                    rButton.off(clickEvt);
                    lButton.off(clickEvt);
                    uButton.off(clickEvt);
                    dButton.off(clickEvt);

                    planeSprite.stop();
                }
                else
                {
                    //alert('crashed; too steep');
                }
            }
            else
            {
                //alert('missed the runway');
            }
        }

        if ((runwayImg.getX() + 900) <= (planeSprite.getX() + 550))
        {

            //alert('missed it');
        }

        if(page.getState() != page.States.PLAYING){
             return;
        }

        var planePos = planeSprite.getX() + 0.1;
        planeSprite.setX(planePos) ;

        var runwayPos = runwayImg.getX() -0.5;
            runwayImg.setX(runwayPos) ;
    };

    page.onStageClick = function(e){
        console.log(e);
    };

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    storybook.registerPage(page);
})();
