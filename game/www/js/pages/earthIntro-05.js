(function(){
    var page = new Page("earthIntro", 5, false);

    page.setPreviousPage("earthIntro", 4);

    page.setNextPage("earthIntro", 6);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
