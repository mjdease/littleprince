(function(){
    var page = new Page("asteroids.b326", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("menu", 1);

    page.setNarration("assets/narration/B325_1.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p16_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
