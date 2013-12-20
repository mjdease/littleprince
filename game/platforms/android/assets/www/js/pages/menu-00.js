(function(){
    var assets = {};
    var canContinue;

    var page = new Page("menu", 0, true);

    page.setPreviousPage(false);

    page.setNextPage("earthIntro", 0);

    page.setRequiredAssets([
        {name: "continueGame", path:"assets/images/startScreen_menu-continue.png"},
        {name: "newGame", path:"assets/images/startScreen_menu-newGame.png"},
        {name: "credits", path:"assets/images/startScreen_menu-tutorial.png"},
        {name: "glossary", path:"assets/images/startScreen_menu-glossary.png"},
        {name: "title", path:"assets/images/startScreen_title.png"},
        {name: "background", path:"assets/images/startScreen_bg.jpg"},
        {name: "home", path: "assets/images/ui/page_global/button_home.png"},
        {name: "audio", path: "assets/images/ui/page_global/button_audio.png"},
        {name: "head", path: "assets/images/head.png"},
        {name: "glossaryTxt", path: "assets/images/glossary.png"},
        {name: "creditsTxt", path: "assets/images/credits.png"}
    ]);

    page.initPage = function(images, stage, layers){
        canContinue = storybook.hasSavedGame();
        var glossaryHeight;
        var scale = storybook.getScale();

        assets.head = new Kinetic.Image({
            image: images.head,
            visible:false
        });

        assets.glossary = new Kinetic.Image({
            image:images.glossaryTxt,
            visible:false,
            draggable: true,
            dragBoundFunc: function(pos) {
                if(pos.y/scale > 0) pos.y = 0 * scale;
                if(pos.y/scale < 752 - 100 - glossaryHeight) pos.y = (752 - 100 - glossaryHeight) * scale;
                return {
                    x: this.getAbsolutePosition().x,
                    y: pos.y
                }
            }
        });
        glossaryHeight = assets.glossary.getHeight();

        assets.credits = new Kinetic.Image({
            image:images.creditsTxt,
            visible:false
        });

        assets.home = new Kinetic.Image({
            image: images.home,
            visible:false,
            x: 10,
            y: 752 - 10 - 90
        });

        assets.audio = new Kinetic.Image({
            image: images.audio,
            visible:false,
            x: 1280 - 10 - 75,
            y: 752 - 10 - 90
        });

        assets.title = new Kinetic.Image({
            x: 250,
            y: 70,
            image: images.title,
        });

        assets.continueBtn = new Kinetic.Image({
            x: 480,
            y: 300,
            image: images.continueGame,
            opacity: canContinue ? 1 : 0.6
        });

        assets.startBtn = new Kinetic.Image({
            x: 480,
            y: 400,
            image: images.newGame,
        });

        assets.creditsBtn = new Kinetic.Image({
            x: 480,
            y: 600,
            image: images.credits,
        });

        assets.glossaryBtn = new Kinetic.Image({
            x: 480,
            y: 500,
            image: images.glossary,
        });

        for(var name in assets){
            layers.staticFront.add(assets[name]);
        }
        assets.glossary.moveToBottom();
        layers.staticFront.batchDraw();
    };

    page.startPage = function(layers){
        assets.startBtn.on(clickEvt, function(){
            storybook.discardSavedGame();
            storybook.goToPage("next");
        });
        if(canContinue){
            assets.continueBtn.on(clickEvt, function(){
                storybook.continueSavedGame();
            });
        }
        assets.glossaryBtn.on(clickEvt, function(){
            // omg shitty coding
            assets.credits.hide();
            assets.glossary.show();
            assets.head.show();
            assets.title.hide();
            assets.continueBtn.hide();
            assets.startBtn.hide();
            assets.creditsBtn.hide();
            assets.glossaryBtn.hide();
            assets.audio.show();
            assets.home.show();
            layers.staticFront.batchDraw();
        });
        assets.creditsBtn.on(clickEvt, function(){
            // bruteforce ALL the code!
            assets.credits.show();
            assets.glossary.hide();
            assets.head.hide();
            assets.title.hide();
            assets.continueBtn.hide();
            assets.startBtn.hide();
            assets.creditsBtn.hide();
            assets.glossaryBtn.hide();
            assets.audio.show();
            assets.home.show();
            layers.staticFront.batchDraw();
        });
        assets.home.on(clickEvt, function(){
            // ugh 8 hours left
            assets.credits.hide();
            assets.glossary.hide();
            assets.head.hide();
            assets.title.show();
            assets.continueBtn.show();
            assets.startBtn.show();
            assets.creditsBtn.show();
            assets.glossaryBtn.show();
            assets.audio.hide();
            assets.home.hide();
            layers.staticFront.batchDraw();
        });
        assets.audio.on(clickEvt, function(){
            storybook.openSettings();
        });
    };

    page.update = function(frame, stage, layers){

    };

    storybook.registerPage(page);
})();
