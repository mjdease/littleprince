(function(){
    var page = new Page("asteroids.b612", 1, false);

    page.setPreviousPage("asteroids.b612", 0);

    page.setNextPage("asteroids.b612", 2);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p12_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
