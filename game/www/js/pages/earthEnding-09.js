(function(){
    var page = new Page("earthEnding", 9, false);
    var sprite, spriteimg;

    page.setPreviousPage("earthEnding", 8);

    page.setNextPage("menu", 0);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/p33_bg.png"},
        {name: "spriteimg", path: "assets/images/earthEnding/p33_sprite.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        sprite = defineSprite({
            x:360,
            y:100,
            image: images.spriteimg,
            animation: "spriteAnim",
            frameRate: 3
        }, 566, 567, {spriteAnim: 3});
        layers.dynBack.add(sprite);
    };

    page.startPage = function(){
        sprite.start();
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
