(function(){
    var page = new Page("earthIntro", 3, false);

    page.setPreviousPage("earthIntro", 2);

    page.setNextPage("earthIntro", 4);

    page.setNarration("assets/sound/earthIntro/Page4_incomplete.wav");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/bgPage5.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
