(function(){
    var page = new Page("asteroids.b612", 2, false);

    page.setPreviousPage("asteroids.b612", 1);

    page.setNextPage("menu", 1);

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p13_bg.jpg"}
    ]);

    page.setNarration("assets/sound/asteroids/B612_3.wav");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };
    storybook.registerPage(page);
})();
