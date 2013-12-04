(function(){
    var page = new Page("asteroids.b612", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("asteroids.b612", 1);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "background", path: "assets/images/asteroid612/ground.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){
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
    };

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    storybook.registerPage(page);
})();
