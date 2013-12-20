(function(){
    var page = new Page("earthIntro", 7, false);
    var sprite, spriteimg;
    page.setPreviousPage("earthIntro", 6);

    page.setNextPage("earthIntro", 8);

    page.setNarration("assets/narration/Page8.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/p8_bg.jpg"},
        {name: "spriteimg", path: "assets/images/earthIntro/p8_sprite.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        sprite = defineSprite({
            x:500,
            y:90,
            image: images.spriteimg,
            animation: "spriteAnim",
            frameRate: 3
        }, 723, 498, {spriteAnim: 3});
        layers.dynBack.add(sprite);
    };

    page.startPage = function(){
        sprite.start();
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
