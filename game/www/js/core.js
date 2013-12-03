window.storybook = {};

(function(app, K, $, undefined) {
    var gameHeight = 752, gameWidth = 1280;
    var isPhonegap = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    var pgAssetPath = "/andoid_asset/www/";
    var stage, layers = {}, updateLoop, transition;
    var deviceReady = false, bookReady = false;
    var currentPage, targetPage, transitionSpeed = 1500, transitionState = 0, transitionDir = -1, pages = {}, challengesComplete = {};
    var prevBtn, nextBtn, homeBtn, audioBtn;
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
        menuBtn = $("#btn-home").on("click", function(){
            if(transition.isRunning()) return;
            app.goToPage("menu0");
        });
        audioBtn = $("#btn-audio").on("click", function(){
            if(transition.isRunning()) return;
            //app.showSettings();
        });


        if(startAtPageId && pages[startAtPageId]){
            // DEBUG ONLY
            targetPage = pages[startAtPageId];
        }
        else{
            targetPage = pages["menu0"];
        }

        onNewPage();
        transitionDone();

        updateButtonVisibility();
    }

    var onNewPage = function(){
        // destroy old page
        if(narration){
            narration.destroy();
            narration = null;
        }
        stage.off(clickEvt);
        if(currentPage){
            currentPage.setState(currentPage.States.UNINITIALIZED);
            currentPage.destroyPage();
        }

        // set new page
        currentPage = targetPage;
        targetPage = null;

        // initalize new page
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

        if(currentPage.hasChallenge && images["hint"]){
            currentPage.challengeStarted = false;
            var hint = new K.Image({
                image: images.hint,
                visible:false
            });
            var challengeText = currentPage.challengeText.clone();
            var hintSize = hint.getSize();
            hint.setOffset(hintSize.width/2, hintSize.height);
            layers.staticFront.add(hint);
            layers.staticFront.batchDraw();

            hint.on(clickEvt, function(e){
                e.cancelBubble = true;
                hint.setVisible(false);
                layers.staticFront.batchDraw();

                if(!currentPage.challengeStarted){
                    currentPage.challengeStarted = true;
                    currentPage.startChallenge();
                }

                stage.off(clickEvt);
            });

            challengeText.on(clickEvt, function(e){
                e.cancelBubble = true;

                if(hint.getVisible()) return;

                var trigger = challengeText;
                hint.setPosition(trigger.getX() + trigger.getWidth()/2, trigger.getY());
                hint.setVisible(true);
                layers.staticFront.batchDraw();

                stage.on(clickEvt, function(){
                    hint.setVisible(false);
                    layers.staticFront.batchDraw();
                    stage.off(clickEvt);
                });
            });

            layers.staticFront.add(challengeText);
        }

        layers.staticFront.batchDraw();
        layers.staticBack.batchDraw();

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

    //exists here only for backwards compatibility. use defineSprite in util.js
    app.defineSprite = function(){
        return defineSprite.apply(this, arguments);
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
        menuBtn.toggle(currentPage.id != "menu0");
        audioBtn.toggle(currentPage.id != "menu0");
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
        return new Sound(path, false, false);
    }
})(window.storybook, Kinetic, jQuery);

storybook.initialize();
