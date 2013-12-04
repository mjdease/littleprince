(function(){
    var page = new Page("earthIntro", 2, false);

    page.setPreviousPage("earthIntro", 1);

    page.setNextPage("earthIntro", 3);

    page.setNarration("assets/sound/test.mp3"),

    page.setLeftTextStyle(null, null, null,"#ffffff");
    page.setRightTextStyle(null, null, null,"#ffffff");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/spritePage3.jpg"}
        //{name: "spritePage3", path: "assets/images/earthIntro/spritePage3.jpg"}
    ]);


    page.initPage = function(images, stage, layers){
        // sprite animation for page
        // sprite = storybook.defineSprite({
        //     x:0,
        //     y:0,
        //     image: images.spritePage3,
        //     animation: "testAnim",
        //     frameRate: 1
        // }, 1280, 800, {testAnim: 4});
        // layers.dynBack.add(sprite);

    };

    page.startPage = function(){
        // sprite.start();
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
    };

    storybook.registerPage(page);
})();
