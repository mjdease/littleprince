(function(){
    var page = new Page("earthIntro", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("earthIntro", 1);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
