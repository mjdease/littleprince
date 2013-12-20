(function(){
    var page = new Page("earthEnding", 7, false);
    var spriteimg, sprite;
    page.setPreviousPage("earthEnding", 6);

    page.setNextPage("earthEnding", 8);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/p31_bg.jpg"},
        {name: "spriteimg", path: "assets/images/earthEnding/p31_sprite.png"},
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        sprite = defineSprite({
            x:670,
            y:70,
            image: images.spriteimg,
            animation: "spriteAnim",
            frameRate: 3
        }, 378, 609, {spriteAnim: 2});
        layers.dynBack.add(sprite);
    };

    page.startPage = function(){
        sprite.start();
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
