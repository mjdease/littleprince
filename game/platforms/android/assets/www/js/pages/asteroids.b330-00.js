(function(){
    var page = new Page("asteroids.b330", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("asteroids.b330", 1);

    page.setNarration("assets/narration/B330_1.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p23_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
