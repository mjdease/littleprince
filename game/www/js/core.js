window.storybook = {};

(function(app, K, $, undefined) {
    var gameHeight = 752, gameWidth = 1280;
    var isPhonegap = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    var pgAssetPath = "/andoid_asset/www/";
    var stage, layers = {}, updateLoop, transition;
    var deviceReady = false, bookReady = false;
    var currentPage, targetPage, transitionSpeed = 1500, transitionState = 0, transitionDir = -1, pages = {}, challengesComplete = {};
    var prevBtn, nextBtn;
    var book;
    var narration;
    var asteroidProgress = {};


    app.initialize = function(){
        if(isPhonegap){
            $(document).on("deviceready", onDeviceReady);
        }
        else{
            $().ready(onDeviceReady);
        }
    };

    var onDeviceReady = function(){
        deviceReady = true;
        if(bookReady){
            begin();
        }
    }

    app.startStory = function(){
        bookReady = true;
        if(deviceReady){
            begin();
        }
    }

    var begin = function(){
        stage = new K.Stage({
            container: "game-stage",
            width: gameWidth,
            height: gameHeight
        });
        layers.staticBack = new K.Layer();
        layers.dynBack = new K.Layer();
        layers.dynFront = new K.Layer();
        layers.staticFront = new K.Layer();

        stage.add(layers.staticBack);
        stage.add(layers.dynBack);
        stage.add(layers.dynFront);
        stage.add(layers.staticFront);

        updateLoop = new K.Animation(function(frame){
            currentPage.update(frame, stage, layers);
        }, [layers.dynBack, layers.dynFront]);

        var state = 'out';
        transition = new K.Animation(function(frame){
            var disp = transitionSpeed * frame.timeDiff/1000 * transitionDir;
            var currentX = layers.staticBack.getX();
            var proposedX = currentX + disp;
            if(state == 'out' && ((transitionDir == -1 && proposedX <= -gameWidth) || (transitionDir == 1 && proposedX >=gameWidth))){
                state = "in";
                disp = transitionDir * -gameWidth - currentX;
                clearStage();
                onNewPage();
            }
            else if(state == "in" && ((transitionDir == -1 && proposedX <= 0) || (transitionDir == 1 && proposedX >= 0))){
                state = "done";
                disp = 0 - currentX;
            }
            for(var layer in layers){
                layers[layer].move(disp, 0);
            }
            if(state == "done"){
                state = "out";
                transitionDone();
            }
        }, [layers.staticFront, layers.staticBack, layers.dynFront, layers.dynBack]);

        stage.draw();

        nextBtn = $("#btn-next").on("click", function(){
            if(transition.isRunning()) return;
            changePage("next");
        });
        prevBtn = $("#btn-prev").on("click", function(){
            if(transition.isRunning()) return;
            changePage("previous");
        });

        targetPage = pages["menu0"];

        onNewPage();
        transitionDone();

        updateButtonVisibility();
    }

    var onNewPage = function(){
        currentPage = targetPage;
        targetPage = null;
        if(currentPage.requiredImages){
            loadImages(currentPage.requiredImages, initPage);
        }
        else{
            initPage();
        }
    };

    var transitionDone = function(){
        transition.stop();
        transitionState++;
        if(transitionState == 2){
            startPage();
        }
    };

    var changePage = function(page){
        if(page){
            var isNext = (page == "next");
            transitionDir = isNext ? -1 : 1;
            targetPage = pages[currentPage[(isNext ? "nextPage" : "previousPage")]];
        }
        else{
            transitionDir = -1;
        }
        updateLoop.stop();
        if(narration) narration.stop();
        transition.start();
    };

    app.goToPage = function(id){
        if(id == "next"){
            changePage("next");
        }
        else{
            targetPage = pages[id];
            changePage(false);
        }
    }

    var initPage = function(images){
        var target = new K.Rect({
            x:0, y:0,
            width: gameWidth,
            height:gameHeight
        });
        target.on(clickEvt, function(e){
            currentPage.onStageClick(e);
        });
        layers.staticBack.add(target);
        if(currentPage.text){
            for(var i = 0; i < currentPage.text.length; i++){
                layers.staticFront.add(currentPage.text[i]);
            }
        }
        if(currentPage.hasChallenge){
            layers.staticFront.add(currentPage.challengeText);
        }
        layers.staticFront.batchDraw();
        if(narration != null){
            if(isPhonegap) narration.release();
            narration = null;
        }
        if(currentPage.narrationSrc){
            narration = loadNarration(currentPage.narrationSrc);
        }
        currentPage.initPage(images, stage, layers);
        updateLoop.start();
        transitionState++;
        if(transitionState == 2){
            startPage();
        }
    };

    var startPage = function(){
        transitionState = 0;
        if(narration) narration.play();
        currentPage.startPage();
        if(!currentPage.hasChallenge){
            app.pageComplete();
        }
        else{
            updateButtonVisibility();
        }
    }

    app.getAsteroidProgress = function(){
        return asteroidProgress;
    }

    //optons - all sprite options except for animations
    //width - frame width
    //height - frame height
    //animList - object where the keys are the names of the animations
    //          and the value is ne number of frames.
    //          eg: {idle:1, run: 14, walk: 14}
    app.defineSprite = function(options, width, height, animList){
        var anim = {}, index = 0;
        for(var name in animList){
            anim[name] = [];
            for(var j = 0; j < animList[name]; j++){
                anim[name].push({
                    x: j * width,
                    y: index * height,
                    width: width,
                    height: height
                });
            }
            index++;
        }
        options.animations = anim;
        return new K.Sprite(options);
    };

    app.registerPage = function(page){
        pages[page.id] = page;
        if(page.hasChallenge){
            challengesComplete[page.id] = false;
        }
    };

    app.pageComplete = function(){
        if(currentPage.hasChallenge){
            challengesComplete[currentPage.id] = true;
        }
        if(currentPage.asteroidId && currentPage.nextPage == "menu1"){
            asteroidProgress[currentPage.asteroidId] = true;
        }
        updateButtonVisibility();
    }

    var updateButtonVisibility = function(){
        var challengeDone = true;
        if(currentPage.hasChallenge){
            challengeDone = challengesComplete[currentPage.id];
        }
        prevBtn.toggle(!currentPage.isMenu && !!currentPage.previousPage);
        nextBtn.toggle(!currentPage.isMenu && !!currentPage.nextPage && challengeDone);
    };

    var clearStage = function(){
        for(var layer in layers){
            layers[layer].destroyChildren();
        }
    };

    // imageList - array of objects containing name and path
    //          eg: [{name: "test", path: "assets/images/testimg.png"},
    //               {name: "test2", path: "assets/images/test2img.png"}]
    // onComplete - function called when all images have been loaded, accepts
    //              object with the loaded images as first parameter.
    var loadImages = function(imageList, onComplete){
        var numImages = imageList.length, images = {};
        var numComplete = 0;
        for(var i = 0; i < numImages; i++){
            (function(obj){
                var img = new Image();
                img.onload = function(){
                    numComplete++;
                    images[obj.name] = img;
                    if(numComplete == numImages){
                        if(images["background"]){
                            layers.staticBack.add(new K.Image({
                                image : images.background,
                                x: 0, y: 0,
                                width: gameWidth,
                                height: gameHeight
                            }));
                            layers.staticBack.batchDraw();
                        }
                        onComplete(images);
                    }
                }
                img.src = obj.path;
            })(imageList[i]);
        }
    };

    var loadNarration = function(path){
        if(isPhonegap){
            return new Media(path);
        }
        else{
            return new Howl({
                urls : [path],
                autoplay : false,
                loop : false
            });
        }
    }
})(window.storybook, Kinetic, jQuery);

storybook.initialize();
