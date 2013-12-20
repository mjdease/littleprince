(function(){
    var page = new Page("earthIntro", 6, false);
    var handimg, hand;
    page.setPreviousPage("earthIntro", 5);

    page.setNextPage("earthIntro", 7);

    page.setNarration("assets/sound/earthIntro/Page7_incomplete.wav");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/p7_bg.jpg"},
        {name: "handimg", path: "assets/images/earthIntro/p7_hand.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        hand = defineSprite({
            x:0,
            y:330,
            image: images.handimg,
            animation: "handAnim",
            frameRate: 7
        }, 1223, 607, {handAnim: 3});
        layers.dynBack.add(hand);
    };

    page.startPage = function(){
        hand.start();
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
