(function(){
    var page = new Page("earthEnding", 9, false);

    page.setPreviousPage("earthEnding", 8);

    page.setNextPage("menu", 0);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
