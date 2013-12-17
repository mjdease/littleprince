(function(){
    var page = new Page("earthEnding", 4, false);

    page.setPreviousPage("earthEnding", 3);

    page.setNextPage("earthEnding", 5);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage28.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
