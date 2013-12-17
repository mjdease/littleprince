(function(){
    var page = new Page("earthIntro", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("earthIntro", 1);

    page.setNarration();

    page.setLeftTextStyle(null, null, null,"#ffffff");
    page.setRightTextStyle(null, null, null,"#ffffff");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/spritePage1.jpg"}
        //{name: "spritePage1", path: "assets/images/earthIntro/spritePage1.jpg"}
    ]);


    page.initPage = function(images, stage, layers){
        // sprite animation for page
        // sprite = storybook.defineSprite({
        //     x:0,
        //     y:0,
        //     image: images.spritePage1,
        //     animation: "testAnim",
        //     frameRate: 4
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
