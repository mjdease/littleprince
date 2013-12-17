(function(){
    var startBtn;
    var howtoBtn;
    var title, contBtn, glossaryBtn;
    var canContinue;

    var page = new Page("menu", 0, true);

    page.setPreviousPage(false);

    page.setNextPage("earthIntro", 0);

    page.setRequiredAssets([
        {name: "continueGame", path:"assets/images/startScreen_menu-continue.png"},
        {name: "newGame", path:"assets/images/startScreen_menu-newGame.png"},
        {name: "howtoGame", path:"assets/images/startScreen_menu-tutorial.png"},
        {name: "glossary", path:"assets/images/startScreen_menu-glossary.png"},
        {name: "title", path:"assets/images/startScreen_title.png"},
        {name: "background", path:"assets/images/startScreen_bg.jpg"}
    ]);

    page.initPage = function(images, stage, layers){
        canContinue = storybook.hasSavedGame();

        title = new Kinetic.Image({
            x: 250,
            y: 70,
            image: images.title,
        });
        layers.staticFront.add(title);
        layers.staticFront.batchDraw();

        contBtn = new Kinetic.Image({
            x: 480,
            y: 50,
            image: images.continueGame,
            opacity: canContinue ? 1 : 0.6
        });
        layers.staticFront.add(contBtn);
        layers.staticFront.batchDraw();
        contBtn.move(0,250);

        startBtn = new Kinetic.Image({
            x: 480,
            y: 50,
            image: images.newGame,
        });
        layers.staticFront.add(startBtn);
        layers.staticFront.batchDraw();
        startBtn.move(0,350);

        howtoBtn = new Kinetic.Image({
            x: 480,
            y: 50,
            image: images.howtoGame,
        });

        layers.staticFront.add(howtoBtn);
        layers.staticFront.batchDraw();
        howtoBtn.move(0,450);

        glossaryBtn = new Kinetic.Image({
            x: 480,
            y: 50,
            image: images.glossary,
        });

        layers.staticFront.add(glossaryBtn);
        layers.staticFront.batchDraw();
        glossaryBtn.move(0,550);
    };

    page.startPage = function(){
        startBtn.on(clickEvt, function(){
            storybook.discardSavedGame();
            storybook.goToPage("next");
        });
        if(canContinue){
            contBtn.on(clickEvt, function(){
                storybook.continueSavedGame();
            });
        }
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
