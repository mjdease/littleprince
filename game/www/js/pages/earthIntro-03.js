(function(){
    var page = new Page("earthIntro", 3, false);
    var narrator, narrimg;
    page.setPreviousPage("earthIntro", 2);

    page.setNextPage("earthIntro", 4);

    page.setNarration("assets/sound/earthIntro/Page4_incomplete.wav");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/p4_bg.jpg"},
        {name: "narrimg", path: "assets/images/earthIntro/p4_narrator.png"}
    ]);

    page.initPage = function(images, stage, layers){
        // sprite animation for page
        narr = defineSprite({
            x:0,
            y:200,
            image: images.narrimg,
            animation: "narrAnim",
            frameRate: 3
        }, 805, 488, {narrAnim: 4});
        layers.dynBack.add(narr);
    };

    page.startPage = function(){
        narr.on('mousedown', function(evt) {
            narr.start();
        });

        narr.on('mouseup', function(evt) {
            narr.stop();
        });
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
