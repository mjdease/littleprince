(function(){
    var page = new Page("earthIntro", 2, false);

    page.setPreviousPage("earthIntro", 1);

    page.setNextPage("earthIntro", 3);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
