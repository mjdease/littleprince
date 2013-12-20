(function(){
    var page = new Page("asteroids.b329", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("asteroids.b329", 1);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroids/p20_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
