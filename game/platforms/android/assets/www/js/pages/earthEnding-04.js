(function(){
    var page = new Page("earthEnding", 4, false);

    page.setPreviousPage("earthEnding", 3);

    page.setNextPage("earthEnding", 5);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
