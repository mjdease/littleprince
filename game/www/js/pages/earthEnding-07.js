(function(){
    var page = new Page("earthEnding", 7, false);

    page.setPreviousPage("earthEnding", 6);

    page.setNextPage("earthEnding", 8);

    page.setNarration();

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthEnding/bgPage31.jpg"}
    ]);

    page.initPage = function(images, stage, layers){

    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
