(function(){
    var page = new Page("earthIntro", 7, false);

    page.setPreviousPage("earthIntro", 6);

    page.setNextPage("earthIntro", 8);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();