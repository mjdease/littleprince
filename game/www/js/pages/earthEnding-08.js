(function(){
    var sprite;
    var sounds = {};

    var page = new Page("earthEnding", 8);

    page.setPreviousPage("earthEnding", 7);

    page.setNextPage("earthEnding", 9);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "hint", path: "assets/images/testHint.png"}
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

        sounds.soundeffect = new Sound("assets/sound/test.mp3", false, false);

        layers.dynBack.add(sprite);
    };

    page.startPage = function(){
        sprite.start();
    };

    page.startChallenge = function(){
        sprite.on(clickEvt, onSpriteClick);

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
    };

    page.destroyPage = function(){
        sprite.off(clickEvt);

        sounds.soundeffect.destroy();
        delete sounds.soundeffect;
    };

    function onSpriteClick(e){
        sprite.stop();
        sounds.soundeffect.play();
        page.challengeComplete();
    }

    storybook.registerPage(page);
})();
