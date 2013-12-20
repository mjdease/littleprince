(function(){
    var page = new Page("earthEnding", 6, false);
    var sprite, img;
    page.setPreviousPage("earthEnding", 5);

    page.setNextPage("earthEnding", 7);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/p30_bg.jpg"},
        {name: "spriteimg", path: "assets/images/earthEnding/p30_sprite.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        sprite = defineSprite({
            x:550,
            y:300,
            image: images.spriteimg,
            animation: "spriteAnim",
            frameRate: 3
        }, 551, 461, {spriteAnim: 2});
        layers.dynBack.add(sprite);
    };

    page.startPage = function(){
        sprite.start();
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
