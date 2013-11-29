(function(){
    var asteroidBtns = [];
    var nextBtn;

    var page = new Page("menu", 1, true);

    page.setPreviousPage(false);

    page.setNextPage("earthEnding", 0);

    page.initPage = function(images, stage, layers){
        var progress = storybook.getAsteroidProgress();
        var score = 0;
        var asteroidCount = 0;
        for(var name in story.asteroids){
            if(name){
                var passed = false;
                asteroidCount++;
                if(progress[name]){
                    passed = true;
                    score++;
                }
                var btnText = new Kinetic.Text({
                    text: name,
                    fontSize: 30,
                    fontFamily: "lp_TitleFont",
                    fill: (passed ? "green" : "black"),
                    x : 100,
                    y : asteroidCount * 40
                });
                btnText.nextPageId = "asteroids." + name + 0;
                asteroidBtns.push(btnText);
                layers.staticFront.add(btnText);
            }
        }
        if(score == asteroidCount){
            nextBtn = new Kinetic.Rect({
                fill: "green",
                x : 900,
                y : 600,
                width : 300,
                height: 120,
                offset: {x:150, y:60}
            });
            layers.staticFront.add(nextBtn);
        }
        layers.staticFront.batchDraw();
    };

    page.startPage = function(){
        for(var i = 0; i < asteroidBtns.length; i++){
            btn = asteroidBtns[i];
            btn.on(clickEvt, function(e){
                storybook.goToPage(e.targetNode.nextPageId);
            });
        }
        if(nextBtn){
            nextBtn.on(clickEvt, function(){
                storybook.goToPage("next");
            });
        }
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
