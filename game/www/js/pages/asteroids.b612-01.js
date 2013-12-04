(function(){
    var page = new Page("asteroids.b612", 1, false);

    page.setPreviousPage("asteroids.b612", 0);

    page.setNextPage("asteroids.b612", 2);

    page.setNarration("assets/sound/test.mp3");

    page.setRequiredAssets([
        {name: "spritehole", path: "assets/images/asteroid612/hole.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "background", path: "assets/images/asteroid612/ground.png"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
