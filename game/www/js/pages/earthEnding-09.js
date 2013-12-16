(function(){
    var page = new Page("earthEnding", 9, false);

    page.setPreviousPage("earthEnding", 8);

    page.setNextPage("menu", 0);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage33.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
