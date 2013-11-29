(function(){
    var startBtn;

    var page = new Page("menu", 0, true);

    page.setPreviousPage(false);

    page.setNextPage("earthIntro", 0);

    page.initPage = function(images, stage, layers){
        startBtn = new Kinetic.Rect({
            fill: "green",
            x : stage.getWidth()/2,
            y : 600,
            width : 300,
            height: 120,
            offset: {x:150, y:60}
        });
        layers.staticBack.add(startBtn);
        layers.staticBack.batchDraw();
    };

    page.startPage = function(){
        startBtn.on("click", function(){storybook.goToPage("next")});
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
