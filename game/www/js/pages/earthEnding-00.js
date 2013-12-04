(function(){
    var page = new Page("earthEnding", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("earthEnding", 1);

    page.setNarration("assets/sound/test.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage24.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
