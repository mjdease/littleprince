(function(){
    var page = new Page("earthIntro", 8, false);

    page.setPreviousPage("earthIntro", 7);

    page.setNextPage("menu", 1);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/bgPage9.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
