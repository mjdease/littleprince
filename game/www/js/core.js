window.storybook = {};

(function(app, K, $, undefined) {
    var gameHeight = 752, gameWidth = 1280, scale = 1;
    var isPhonegap = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    var pgAssetPath = "/andoid_asset/www/";
    var stage, layers = {}, underlay, overlay, updateLoop, transition;
    var deviceReady = false, bookReady = false, waitingForStage = false, pageIsLoading = true;
    var currentPage, targetPage, transitionSpeed = 2000, transitionState = 0, transitionDir = -1, pages = {}, challengeIds = [];
    var prevBtn, nextBtn, homeBtn, audioBtn;
    var book;
    var bookProgress;
    var settings;
    var narration, music;
    var accelerometer = {x:0,y:0,z:0};
    var accWatchId = null;
    var text = {
        startY : 60,
        transSpeed : 800
    };
    var sounds = [];
    var cache = {};

    var menuAssets = [
        {name: "home", path: "assets/images/ui/page_global/button_home.png"},
        {name: "audio", path: "assets/images/ui/page_global/button_audio.png"},
        {name: "next", path: "assets/images/ui/page_global/button_prevPage.png"},
        {name: "prev", path: "assets/images/ui/page_global/button_nextPage.png"},
        {name: "top", path: "assets/images/ui/page_global/textFrame_top.png"},
        {name: "mid", path: "assets/images/ui/page_global/textFrame_content.png"},
        {name: "bottom_hide", path: "assets/images/ui/page_global/textFrame_bottom_hide.png"},
        {name: "bottom_show", path: "assets/images/ui/page_global/textFrame_bottom_show.png"},
        {name: "audio_bar", path: "assets/images/ui/module_audio/audio_bar.png"},
        {name: "audio_bg", path: "assets/images/ui/module_audio/audio_bg.png"},
        {name: "audio_handle", path: "assets/images/ui/module_audio/audio_handle.png"},
        {name: "audio_close", path: "assets/images/ui/module_audio/audio_close.png"},
    ];

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
            loadImages(menuAssets, begin);
        }
    }

    app.startStory = function(){
        bookReady = true;
        if(deviceReady){
            loadImages(menuAssets, begin);
        }
    }

    var begin = function(images){
        loadSavedProgress();
        if(!bookProgress.currentPage){
            for(var i = 0; i < challengeIds.length; i++){
                bookProgress.challenges[challengeIds[i]] = false;
            }
        }
        if(!bookProgress.audio){
            setDefaultAudioLevels();
        }

        stage = new K.Stage({
            container: "game-stage",
            width: gameWidth,
            height: gameHeight
        });

        if(isPhonegap){
            scale = $(window).width()/gameWidth;
            stage.setScale(scale);
        }
        else{
            //DEV option to fit stage on screen. disable before release
            scale = 0.6;
            stage.setScale(scale);
            $("#game-stage").width(gameWidth * scale).height(gameHeight * scale);
        }

        // underlay = new K.Layer();
        layers.staticBack = new K.Layer();
        layers.dynBack = new K.Layer();
        layers.dynFront = new K.Layer();
        layers.staticFront = new K.Layer();
        overlay = new K.Layer();

        // stage.add(underlay);
        stage.add(layers.staticBack);
        stage.add(layers.dynBack);
        stage.add(layers.dynFront);
        stage.add(layers.staticFront);
        stage.add(overlay);

        updateLoop = new K.Animation(function(frame){
            currentPage.update(frame, stage, layers);
        }, [layers.dynBack, layers.dynFront]);

        var state = 'start';
        transition = new K.Animation(function(frame){
            var disp = transitionSpeed * frame.timeDiff/1000 * transitionDir;
            var currentX = layers.staticBack.getX();
            var proposedX = currentX + disp;
            if(state == "start"){
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
                state = "start";
                transitionDone();
            }
        }, [layers.staticFront, layers.staticBack, layers.dynFront, layers.dynBack]);

        text.transitionIn = new K.Animation(function(frame){
            text.position = "transitioning";
            var dispY = text.transSpeed * frame.timeDiff / 1000;
            text.group.move(0, dispY);
            if(text.group.getY() > text.startY){
                text.group.setY(text.startY);
                text.position = "down";
                text.toggle.setImage(text.bottom_hide);
                text.transitionIn.stop();
                layers.staticFront.batchDraw();
            }
        }, layers.staticFront);

        text.transitionOut = new K.Animation(function(frame){
            text.position = "transitioning";
            var dispY = -1 * text.transSpeed * frame.timeDiff / 1000;
            text.group.move(0, dispY);
            if(text.group.getY() < -text.groupHeight){
                text.group.setY(-text.groupHeight);
                text.position = "up";
                text.toggle.setImage(text.bottom_show);
                text.transitionOut.stop();
                layers.staticFront.batchDraw();
            }
        }, layers.staticFront);

        stage.draw();

        nextBtn = new K.Image({
            image: images.next,
            x: gameWidth - 10 - 136,
            y: gameHeight - 10 - 90
        }).on(clickEvt, function(){
            if(transition.isRunning() || pageIsLoading) return;
            changePage("next");
        });

        prevBtn = new K.Image({
            image: images.prev,
            x: 10,
            y: gameHeight - 10 - 90
        }).on(clickEvt, function(){
            if(transition.isRunning() || pageIsLoading) return;
            changePage("previous");
        });
        menuBtn = new K.Image({
            image: images.home,
            x: 10,
            y: 10
        }).on(clickEvt, function(){
            if(transition.isRunning() || pageIsLoading) return;
            app.goToPage("menu0");
        });
        audioBtn = new K.Image({
            image: images.audio,
            x: gameWidth - 10 - 75,
            y: 10
        }).on(clickEvt, function(){
            if(transition.isRunning() || pageIsLoading) return;
            openSettings();
        });

        text.top = new K.Image({
            image: images.top,
            listening: false
        });
        text.topHeight = text.top.getHeight();

        text.mid = new K.Image({
            image: images.mid,
            listening: false
        });
        text.midHeight = text.mid.getHeight();

        text.bottom_show = images.bottom_show;
        text.bottom_hide = images.bottom_hide;
        text.bottom = new K.Image({
            listening: true
        });

        overlay.add(nextBtn).add(prevBtn).add(menuBtn).add(audioBtn);

        initSettings(images);

        if(startAtPageId && pages[startAtPageId]){
            // DEBUG ONLY
            targetPage = pages[startAtPageId];
        }
        else{
            targetPage = pages["menu0"];
        }

        onNewPage();
        // transitionDone();

        updateButtonVisibility();
    }

    var onNewPage = function(){
        // destroy old page
        if(narration){
            narration.destroy();
            narration = null;
        }
        if(music){
            music.destroy();
            music = null;
        }
        stage.off(clickEvt);
        if(currentPage){
            currentPage.setState(currentPage.States.UNINITIALIZED);
            currentPage.destroyPage();
        }

        // set new page
        currentPage = targetPage;
        targetPage = null;

        if(currentPage.id != "menu0"){
            bookProgress.currentPage = currentPage.id;
            saveProgress();
        }

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
        pageIsLoading = true;
        // stage image isn't ready yet so check later
        // if(!cache.stage){
        //     if(waitingForStage && Date.now() - waitingForStage > 2000){
        //         nextBtn.show();
        //         prevBtn.show();
        //         overlay.batchDraw();
        //         return;
        //     }
        //     if(!waitingForStage){
        //         waitingForStage = Date.now();
        //         nextBtn.hide();
        //         prevBtn.hide();
        //         overlay.batchDraw();
        //     }
        //     setTimeout(function(){changePage(page)}, 40);
        // }
        // else{
            // if(waitingForStage){
            //     waitingForStage = false;
            // }
            // underlay.add(cache.stage).batchDraw();
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
            if(music) music.stop();
            //transition.start();
            clearStage();
            onNewPage();
        // }
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
            var maxHeight = Math.max(currentPage.text[0].getHeight(), currentPage.text[1].getHeight());
            var numMidSections = Math.ceil(maxHeight / text.midHeight);
            text.toggle = text.bottom.clone({
                image : text.bottom_hide,
                y : text.topHeight + text.midHeight * numMidSections
            }).on(clickEvt, toggleText);
            text.group = new K.Group({
                x:gameWidth/2,
                y:text.startY,
                offsetX:500
            });
            text.group.add(text.top.clone());
            for(var i = 0; i < numMidSections; i++){
                text.group.add(text.mid.clone({
                    y: text.topHeight + i * text.midHeight
                }));
            }
            text.group.add(text.toggle);
            text.groupHeight = text.topHeight + text.midHeight * numMidSections;
            text.position = "down";
            text.group.add(currentPage.text[0]).add(currentPage.text[1]);
            layers.staticFront.add(text.group);
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
            text.group.add(hint);
            layers.staticFront.batchDraw();

            hint.on(clickEvt, function(e){
                e.cancelBubble = true;
                hint.setVisible(false);
                layers.staticFront.batchDraw();

                if(!currentPage.challengeStarted){
                    currentPage.challengeStarted = true;
                    currentPage.startChallenge(layers);
                    if(narration) narration.stop();
                    if(music) music.play();
                    toggleText(false);
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

            text.group.add(challengeText);
        }

        layers.staticFront.batchDraw();
        layers.staticBack.batchDraw();

        if(currentPage.narrationSrc){
            narration = new Sound(currentPage.narrationSrc, false, false, "narration");
        }
        if(currentPage.musicSrc){
            music = new Sound(currentPage.musicSrc, false, true, "music");
        }

        currentPage.initPage(images, stage, layers);
        updateLoop.start();

        pageIsLoading = false;

        //transitionState++;
        //if(transitionState == 2){
            startPage();
        //}
    };

    var startPage = function(){
        transitionState = 0;
        if(narration) narration.play();
        currentPage.startPage(layers);
        if(!currentPage.hasChallenge){
            app.pageComplete();
        }
        else{
            updateButtonVisibility();
        }

        // underlay.destroyChildren();
        // underlay.batchDraw();
        // delete cache.stage;

        // setTimeout(function(){
        //     stage.toImage({
        //         callback: function(img){
        //             cache.stage = new K.Image({
        //                 image: img,
        //                 scale: 1/scale
        //             });
        //         }
        //     });
        // }, 30);
    }

    app.initializeAccelerometer = function(){
        if(navigator.accelerometer){
            accWatchId = navigator.accelerometer.watchAcceleration(function(acc){
                accelerometer = acc;
            }, function(){}, {frequency:100});
        }
        else{
            var getFakeAccelerometer = startFakeAccelerometer();
            accWatchId =setInterval(function(){accelerometer = getFakeAccelerometer()}, 100);
        }
    };

    app.getAccelerometer = function(){
        return accelerometer;
    };

    app.destroyAccelerometer = function(){
        if(navigator.accelerometer){
            navigator.accelerometer.clearWatch(accWatchId);
        }
        else{
            clearInterval(accWatchId);
        }
        accWatchId = null;
        accelerometer = {x:0,y:0,z:0};
    };

    app.getAsteroidProgress = function(){
        return bookProgress.asteroids;
    };

    //exists here only for backwards compatibility. use defineSprite in util.js
    app.defineSprite = function(){
        return defineSprite.apply(this, arguments);
    };

    app.registerPage = function(page){
        pages[page.id] = page;
        if(page.hasChallenge){
            challengeIds.push(page.id);
        }
    };

    app.registerSound = function(sound){
        sounds.push(sound);
    };

    app.removeSound = function(sound){
        sounds.splice(sounds.indexOf(sound), 1);
    };

    app.getScale = function(){
        return scale;
    };

    app.pageComplete = function(){
        if(currentPage.hasChallenge){
            bookProgress.challenges[currentPage.id] = true;
        }
        if(currentPage.asteroidId && currentPage.nextPage == "menu1"){
            bookProgress.asteroids[currentPage.asteroidId] = true;
        }
        updateButtonVisibility();
        // if(currentPage.hasChallenge){
        //     stage.toImage({
        //         callback: function(img){
        //             cache.stage = new K.Image({
        //                 image: img,
        //                 scale: 1/scale
        //             });
        //         }
        //     });
        // }
    }

    var updateButtonVisibility = function(){
        var challengeDone = true;
        if(currentPage.hasChallenge){
            challengeDone = bookProgress.challenges[currentPage.id];
        }
        menuBtn.toggle(currentPage.id != "menu0");
        audioBtn.toggle(currentPage.id != "menu0");
        prevBtn.toggle(!currentPage.isMenu && !!currentPage.previousPage);
        nextBtn.toggle(!currentPage.isMenu && !!currentPage.nextPage && challengeDone);
        overlay.batchDraw();
    };

    var clearStage = function(){
        for(var layer in layers){
            layers[layer].destroyChildren();
        }
    };

    app.hasSavedGame = function(){
        return bookProgress.currentPage != "menu0";
    };

    app.discardSavedGame = function(){
        bookProgress = {challenges:{}, asteroids:{}};
        setDefaultAudioLevels();
        saveProgress();
    };

    app.continueSavedGame = function(){
        if(bookProgress.currentPage){
            app.goToPage(bookProgress.currentPage);
        }
        else{
            changePage("next");
        }
    };

    function loadSavedProgress(){
        var savedProgress = localStorage.getItem("lp_progress");
        if(savedProgress){
            bookProgress = JSON.parse(savedProgress);
        }
        else{
            bookProgress = {
                challenges:{},
                asteroids:{},
                audio:{
                    narration: 0.7,
                    effects: 0.6,
                    music:0.25
                }
            };
        }
    }

    function saveProgress(){
        localStorage.setItem("lp_progress", JSON.stringify(bookProgress));
    }

    function initSettings(images){
        var sliderOffset = 140;
        var sliderX = gameWidth / 2 - 248;
        var barWidth;

        settings = {
            node : new K.Group()
        };

        var sliderGrp = new K.Group({
            width: 476,
            x : sliderX
        });
        var bar = new K.Image({
            image: images.audio_bar,
            x: sliderOffset
        });
        barWidth = bar.getWidth();
        var handle = new K.Image({
            image: images.audio_handle,
            offsetY: 6,
            offsetX: 20,
            draggable: true,
            dragBoundFunc: function(pos) {
                if(pos.x/scale < sliderX + sliderOffset) pos.x = (sliderX + sliderOffset) * scale;
                if(pos.x/scale > sliderX + sliderOffset + barWidth) pos.x = (sliderX + sliderOffset + barWidth) * scale;
                return {
                    x: pos.x,
                    y: this.getAbsolutePosition().y
                }
            }
        });
        var label = new K.Text({
            fontFamily:"lp_BodyFont",
            fontSize:20,
            stroke:"black",
            strokeWidth:1,
            align:"right",
            fill:"black",
            y:5,
            width:sliderOffset
        });

        settings.node.add(new K.Rect({
            width:gameWidth,
            height:gameHeight,
            fill:"black",
            opacity: 0.7
        })).add(new K.Image({
            image:images.audio_bg,
            x:gameWidth/2,
            y:gameHeight/2,
            offset: {x:246,y:165.5}
        }));

        var closeBtn = new K.Image({
            image: images.audio_close,
            x: 860,
            y: 200
        });
        closeBtn.on(clickEvt, closeSettings);
        settings.node.add(closeBtn);

        var nSlider = {
            node : sliderGrp.clone({y:300}),
            bar : bar.clone(),
            handle : handle.clone({x:getXFromVolume(bookProgress.audio.narration)}),
            label : label.clone({text:"Narration "})
        };
        nSlider.handle.on("dragend", function(e){
            setVolume("narration", getVolumeFromX(nSlider.handle.getX()));
        });
        nSlider.node.add(nSlider.label).add(nSlider.bar).add(nSlider.handle);

        var eSlider = {
            node : sliderGrp.clone({y:380}),
            bar : bar.clone(),
            handle : handle.clone({x:getXFromVolume(bookProgress.audio.effects)}),
            label : label.clone({text:"Effects "})
        };
        eSlider.handle.on("dragend", function(e){
            setVolume("effects", getVolumeFromX(eSlider.handle.getX()));
        });
        eSlider.node.add(eSlider.label).add(eSlider.bar).add(eSlider.handle);

        var mSlider = {
            node : sliderGrp.clone({y:460}),
            bar : bar.clone(),
            handle : handle.clone({x:getXFromVolume(bookProgress.audio.music)}),
            label : label.clone({text:"Music "})
        };
        mSlider.handle.on("dragend", function(e){
            setVolume("music", getVolumeFromX(mSlider.handle.getX()));
        });
        mSlider.node.add(mSlider.label).add(mSlider.bar).add(mSlider.handle);

        settings.node.add(nSlider.node).add(eSlider.node).add(mSlider.node);

        function getVolumeFromX(x){
            return map(x, sliderOffset, sliderOffset + barWidth, 0, 1);
        }

        function getXFromVolume(volume){
            return map(volume, 0, 1, sliderOffset, sliderOffset + barWidth);
        }
    }

    app.openSettings = function(){
        openSettings();
    }

    function openSettings(){
        overlay.add(settings.node);
        overlay.batchDraw();
    }

    function closeSettings(){
        settings.node.remove();
        overlay.batchDraw();
    }

    app.getVolume = function(type){
        if(bookProgress.audio[type] !== undefined){
            return bookProgress.audio[type];
        }
        return 1;
    };

    function setVolume(type, level){
        if(level < 0.01) level = 0;
        if(level > 0.99) level = 1;
        bookProgress.audio[type] = level;
        saveProgress();
        for(var i = 0; i < sounds.length; i++){
            var sound = sounds[i];
            if(sound.type === type){
                sound.setVolume(level);
            }
        }
    }

    function setDefaultAudioLevels(){
        bookProgress.audio = {
            narration: 0.7,
            effects: 0.6,
            music: 0.25
        };
    }

    function toggleText(show){
        if(text.transitionIn.isRunning() || text.transitionOut.isRunning()){
            return;
        }
        if(typeof show === "boolean"){
            if(show && text.position == "up"){
                text.transitionIn.start();
            }
            else if(!show && text.position == "down"){
                text.transitionOut.start();
            }
        }
        else{
            if(text.position === "down"){
                text.transitionOut.start();
            }
            else{
                text.transitionIn.start();
            }
        }
    }

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
})(window.storybook, Kinetic, jQuery);

storybook.initialize();
