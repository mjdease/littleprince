(function(){
    var page = new Page("earthIntro", 0, false);
    var narrator, prince, narratorimg, princeimg;

    page.setPreviousPage(false);

    page.setNextPage("earthIntro", 1);

    page.setNarration("assets/sound/earthIntro/Page1.wav");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/01/background.jpg"},
        {name: "narratorimg", path: "assets/images/earthIntro/01/spritesheetNarrator.png"},
        {name: "princeimg", path: "assets/images/earthIntro/01/spritesheetPrince.png"}
    ]);


    page.initPage = function(images, stage, layers){
        // sprite animation for page
        prince = defineSprite({
            x:950,
            y:500,
            image: images.princeimg,
            animation: "princeAnim",
            frameRate: 14
        }, 119, 236, {princeAnim: 3});
        layers.dynBack.add(prince);

        narrator = defineSprite({
            x:100,
            y:40,
            image: images.narratorimg,
            animation: "narratorAnim",
            frameRate: 14
        }, 758, 710, {narratorAnim: 3});
        layers.dynBack.add(narrator);

    };

    page.startPage = function(){
        narrator.on(clickEvt, function(){Animate(1)});
        prince.on(clickEvt, function(){Animate(2)});
    };

    function Animate(set){
        if(set == 1){
            narrator.start();
        } else prince.start();
    }

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
    };

    storybook.registerPage(page);
})();
