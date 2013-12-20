(function(){
    var page = new Page("asteroids.b328", 1, false);

    page.setPreviousPage("asteroids.b328", 0);

    page.setNextPage("menu", 1);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p22_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
