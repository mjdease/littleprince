(function(){
    var page = new Page("earthEnding", 2, false);

    page.setPreviousPage("earthEnding", 1);

    page.setNextPage("earthEnding", 3);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();