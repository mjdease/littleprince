(function(){
    var page = new Page("earthIntro", 5, false);

    page.setPreviousPage("earthIntro", 4);

    page.setNextPage("earthIntro", 6);

    page.setNarration("assets/narration/Page6.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/p6_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
