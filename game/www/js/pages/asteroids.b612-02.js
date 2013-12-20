(function(){
    var page = new Page("asteroids.b612", 2, false);

    page.setPreviousPage("asteroids.b612", 1);

    page.setNextPage("menu", 1);

    page.setRequiredAssets([
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "background", path: "assets/images/asteroids/p13_bg.jpg"}
    ]);

    page.setNarration("assets/sound/asteroids/B612_3.wav");

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
