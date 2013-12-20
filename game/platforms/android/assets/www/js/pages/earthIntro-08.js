(function(){
    var page = new Page("earthIntro", 8, false);

    page.setPreviousPage("earthIntro", 7);

    page.setNextPage("menu", 1);

    page.setNarration("assets/narration/Page9.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/p9_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
