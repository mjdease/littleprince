(function(){
    var sprite;

    var page = new Page("earthEnding", 5);

    page.setPreviousPage("earthEnding", 4);

    page.setNextPage("earthEnding", 6);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "background", path: "assets/images/earthEnding/bgPage29.jpg"}
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
