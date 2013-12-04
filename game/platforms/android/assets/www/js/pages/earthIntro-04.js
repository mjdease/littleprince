(function(){
    var page = new Page("earthIntro", 4, false);

    page.setPreviousPage("earthIntro", 3);

    page.setNextPage("earthIntro", 5);

    page.setNarration("assets/sound/test.mp3");

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
