(function(){
    var page = new Page("earthIntro", 4, false);
    var princ, princimg;
    page.setPreviousPage("earthIntro", 3);

    page.setNextPage("earthIntro", 5);

    page.setNarration("assets/sound/earthIntro/Page5_incomplete.wav");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/p5_bg.jpg"},
        {name: "princimg", path: "assets/images/earthIntro/p5_prince.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        princ = defineSprite({
            x:500,
            y:330,
            image: images.princimg,
            animation: "princAnim",
            frameRate: 3
        }, 204, 378, {princAnim: 3});
        layers.dynBack.add(princ);
    };

    page.startPage = function(){
        princ.on('mousedown', function(evt) {
            princ.start();
        });

        princ.on('mouseup', function(evt) {
            princ.stop();
        });
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
