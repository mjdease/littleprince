(function(){
    var page = new Page("earthEnding", 6, false);

    page.setPreviousPage("earthEnding", 5);

    page.setNextPage("earthEnding", 7);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage30.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
