(function(){
    var page = new Page("earthEnding", 4, false);
    var foximg, fox;
    page.setPreviousPage("earthEnding", 3);

    page.setNextPage("earthEnding", 5);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/p28_bg.jpg"},
        {name: "foximg", path: "assets/images/earthEnding/p28_fox.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        fox = defineSprite({
            x:600,
            y:240,
            image: images.foximg,
            animation: "foxAnim",
            frameRate: 3
        }, 555, 431, {foxAnim: 2});
        layers.dynBack.add(fox);
    };

    page.startPage = function(){
        fox.start();
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
