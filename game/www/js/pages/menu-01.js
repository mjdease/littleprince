(function(){
    var asteroidBtns = [];
    var nextBtn;

    var page = new Page("menu", 1, true);

    page.setPreviousPage(false);

    page.setNextPage("earthEnding", 0);

    page.setRequiredAssets([
        {name: "background", path: "assets/images/asteroidsMenu/spaceBg.jpg"},
        {name: "b612", path: "assets/images/asteroidsMenu/princeN.png"},
        {name: "b325", path: "assets/images/asteroidsMenu/kingN.png"},
        {name: "b330", path: "assets/images/asteroidsMenu/geographN.png"},
        {name: "b329", path: "assets/images/asteroidsMenu/lampN.png"},
        {name: "b328", path: "assets/images/asteroidsMenu/businessN.png"},
        {name: "b327", path: "assets/images/asteroidsMenu/drunkardN.png"},
        {name: "b326", path: "assets/images/asteroidsMenu/proudN.png"},
        {name: "earth", path: "assets/images/asteroidsMenu/earthN.png"},
        {name: "earthS", path: "assets/images/asteroidsMenu/earthA.png"},

        {name: "b612p", path: "assets/images/asteroidsMenu/princeA.png"},
        {name: "b325p", path: "assets/images/asteroidsMenu/kingA.png"},
        {name: "b330p", path: "assets/images/asteroidsMenu/geographA.png"},
        {name: "b329p", path: "assets/images/asteroidsMenu/lampA.png"},
        {name: "b328p", path: "assets/images/asteroidsMenu/businessA.png"},
        {name: "b327p", path: "assets/images/asteroidsMenu/drunkardA.png"},
        {name: "b326p", path: "assets/images/asteroidsMenu/proudA.png"}
    ]);

    page.initPage = function(images, stage, layers){
        var pos = {
            b612: {x: 40, y: 220},
            b325: {x: 185, y: 0},
            b330: {x: 120, y: 500},
            b329: {x: 700, y: 520},
            b328: {x: 980, y: 380},
            b327: {x: 1000, y: 40},
            b326: {x: 550, y: 0}
        }

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
                var btnText = new Kinetic.Image({
                    image: images[name + (passed ? "p" : "")],
                    x : pos[name].x,
                    y : pos[name].y
                });
                btnText.nextPageId = "asteroids." + name + 0;
                asteroidBtns.push(btnText);
                layers.staticFront.add(btnText);
            }
        }
        if(score == asteroidCount){

         var earthS = new Kinetic.Image({
            image: images.earthS,
            x : 380,
            y : 140
        });
        layers.dynBack.add(earthS);

        }
        else
        var earth = new Kinetic.Image({
            image: images.earth,
            x : 380,
            y : 140
        });
        layers.dynBack.add(earth);
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
