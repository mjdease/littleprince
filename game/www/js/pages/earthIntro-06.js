(function(){
    var page = new Page("earthIntro", 6, false);

    page.setPreviousPage("earthIntro", 5);

    page.setNextPage("earthIntro", 7);

    page.setNarration("assets/sound/earthIntro/Page7_incomplete.wav");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/bgPage7.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
