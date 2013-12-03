(function(){
    var page = new Page("asteroids.b325", 1, false);

    page.setPreviousPage("asteroids.b325", 0);

    page.setNextPage("menu", 1);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){
        storybook.initializeAccelerometer();
        sprite = storybook.defineSprite({
            x:300,
            y:500,
            image: images.spriteimg,
            animation: "testAnim",
            frameRate: 14
        }, 200, 150, {testAnim: 9});
        layers.dynBack.add(sprite);
    };

    page.startPage = function(){
        sprite.start();

        sprite.on(clickEvt, onSpriteClick);

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        //gets accelerometer values
        //left: x+, right: x-, down: y+, up: y-
        //magnitude ranges from -10 to 10. Ignore z.
        //storybook.getAccelerometer();
    };

    page.destroyPage = function(){
        //destroy accelerometer when the challenge is complete
        storybook.destroyAccelerometer();
    };

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    storybook.registerPage(page);
})();
