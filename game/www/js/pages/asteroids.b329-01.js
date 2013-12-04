(function(){

    var planetImg;
    var lampSprite;
    var lampOffImg;
    var lampOnImg;

    var page = new Page("asteroids.b329", 1, false);
    var sounds = {};

    page.setPreviousPage("asteroids.b329", 0);

    page.setNextPage("menu", 1);

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/b329/nightTime.png"},
        {name: "planetImg", path: "assets/images/asteroids/b329/planet.png"},
        {name: "lampImg", path: "assets/images/asteroids/b329/lamp.png"},
        {name: "lampOffImg", path: "assets/images/asteroids/b329/lampOff.png"},
        {name: "lampOnImg", path: "assets/images/asteroids/b329/lampOn.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/05/hint_ch05_01.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){
        lampSprite = storybook.defineSprite({
            x:stage.getWidth()/2,
            y:stage.getHeight(),
            image: images.lampImg,
            animation: "lampAnim",
            frameRate: 1,
            offset: {x:189, y:391 + 212}
        }, 378, 391, {lampAnim: 2});
        layers.dynFront.add(lampSprite);

        planetImg = new Kinetic.Image({
            x:stage.getWidth()/2,
            y:stage.getHeight(),
            image: images.planetImg,
            width: 738,
            height: 724,
            offset: {x: 369, y:362}
        });
        layers.dynBack.add(planetImg);

        lampOffImg = new Kinetic.Image({
            x:stage.getWidth()/2,
            y:stage.getHeight(),
            image: images.lampOffImg,
            width: 378,
            height: 391,
            offset: {x:189, y:391 + 212}
        });
        layers.dynFront.add(lampOffImg);

        lampOnImg = images.lampOnImg;

    };

    page.startPage = function(){
        lampSprite.start();
    };


     page.startChallenge = function()
    {
        page.setState(page.States.PLAYING);
        lampSprite.stop();
        lampSprite.destroy();

        lampOffImg.on(clickEvt, onLampClick);

    }

    page.update = function(frame, stage, layers){

       var planetRot = planetImg.getRotationDeg() + 0.5;
        planetImg.setRotationDeg(planetRot);

       var lampSpriteRot = lampSprite.getRotationDeg() + 0.5;
        lampSprite.setRotationDeg(lampSpriteRot);

       var lampOffRot = lampOffImg.getRotationDeg() + 0.5;
        lampOffImg.setRotationDeg(lampOffRot);

        if(page.getState() != page.States.PLAYING){
            return;
        }

    };

    function onLampClick(e){
        //sprite.stop();
        lampOffImg.setImage(lampOnImg);
        page.challengeComplete();
    }

    storybook.registerPage(page);
})();
