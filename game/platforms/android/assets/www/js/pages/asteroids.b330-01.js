(function(){
    var page = new Page("asteroids.b330", 1, false);

    page.setPreviousPage("asteroids.b330", 0);

    page.setNextPage("menu", 1);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
