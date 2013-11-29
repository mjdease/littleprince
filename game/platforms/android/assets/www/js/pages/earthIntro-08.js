(function(){
    var page = new Page("earthIntro", 8, false);

    page.setPreviousPage("earthIntro", 7);

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
