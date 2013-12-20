(function(){
    var page = new Page("asteroids.b325", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("asteroids.b325", 1);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p14_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
