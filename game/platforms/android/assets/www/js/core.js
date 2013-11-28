window.storybook = {};

(function(app, K, $, undefined) {
    var isPhonegap = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    var pgAssetPath = "/andoid_asset/www/";
    var stage, layers = {}, updateLoop, transition;
    var deviceReady = false, bookReady = false;
    var currentPage = 0, transitionSpeed = 1500, transitionState = 0, transitionDir = 1, pages = [], pagesComplete = [];
    var prevBtn, nextBtn;
    var book;
    var narration;
    // TODO change these defaults
    var fontDefaults = {
        fontFamily: "Times New Roman",
        fontSize: 24,
        fill: "black"
    };


    app.initialize = function(){
        if(isPhonegap){
            $(document).on("deviceready", onDeviceReady);
        }
        else{
            $().ready(onDeviceReady);
        }
    };

    var onDeviceReady = function(){
        FastClick.attach(document.body);
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
        // if(isPhonegap){
        //     for(var k = 0; k < pages.length; k++){
        //         if(pages[k].narration) {
        //             pages[k].loadNarration();
        //         }
        //     }
        // }
        loadImages([{name: 'texture', path: "assets/images/texture-even.png"}],
            function(imgs){
            stage = new K.Stage({
                container: "game-stage",
                width: 1280,
                height: 800
            });
            layers.staticBack = new K.Layer();
            layers.dynBack = new K.Layer();
            layers.dynFront = new K.Layer();
            layers.staticFront = new K.Layer();

            stage.add(layers.staticBack);
            stage.add(layers.dynBack);
            stage.add(layers.dynFront);
            stage.add(layers.staticFront);

            textureImg = new K.Image({
                x:0,
                y:0,
                height:800,
                width: 1280*3,
                offsetX: 1280,
                image:imgs.texture
            });
            var textureLayer = new K.Layer();
            textureLayer.add(textureImg);
            stage.add(textureLayer);

            updateLoop = new K.Animation(function(frame){
                pages[currentPage].update(frame, stage, layers);
            }, [layers.dynBack, layers.dynFront]);

            var state = 'out';
            transition = new K.Animation(function(frame){
                var disp = transitionSpeed * frame.timeDiff/1000;
                var newX = textureLayer.getX() - (disp * transitionDir);
                if(state == 'out' && ((transitionDir == 1 && newX <= -1280) || (transitionDir == -1 && newX >=1280))){
                    state = "in";
                    newX = transitionDir * 1280;
                    clearStage();
                    onNewPage();
                }
                if(state == "in" && ((transitionDir == 1 && newX <= 0) || (transitionDir == -1 && newX >= 0))){
                    state = "done";
                    newX = 0;
                }
                textureLayer.setX(newX);
                for(var layer in layers){
                    layers[layer].setX(newX);
                }
                if(state == "done"){
                    state = "out";
                    transitionDone();
                }
            }, [layers.staticFront, layers.staticBack, layers.dynFront, layers.dynBack]);

            stage.draw();

            nextBtn = $("#btn-next").on("click", function(){
                if(transition.isRunning()) return;
                currentPage++;
                changePage("next");
            });
            prevBtn = $("#btn-prev").on("click", function(){
                if(transition.isRunning()) return;
                currentPage--;
                changePage("previous");
            });

            updateButtonVisibility();

            onNewPage();
            transitionDone();
        });
    }

    var onNewPage = function(){
        if(pages[currentPage].requiredImages){
            loadImages(pages[currentPage].requiredImages, initPage);
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
        transitionDir = page == "next" ? 1 : -1;
        updateLoop.stop();
        if(narration) narration.stop();
        updateButtonVisibility();
        transition.start();
    };

    var initPage = function(images){
        var newPage = pages[currentPage];
        for(var i = 0; i < newPage.text.length; i++){
            var textBlock = new K.Text($.extend(fontDefaults, newPage.text[i]));
            layers.staticFront.add(textBlock);
        }
        layers.staticFront.batchDraw();
        if(isPhonegap && narration != null){
            narration.release();
            narration = null;
        }
        narration = loadNarration(newPage.narrationSrc);
        newPage.initPage(images, stage, layers);
        updateLoop.start();
        transitionState++;
        if(transitionState == 2){
            startPage();
        }
    };

    var startPage = function(){
        transitionState = 0;
        if(narration) narration.play();
        pages[currentPage].startPage();
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
        pages.push(page);
        pagesComplete.push(false);
    };

    app.pageComplete = function(){
        pagesComplete[currentPage] = true;
        updateButtonVisibility();
    }

    var updateButtonVisibility = function(){
        prevBtn.toggle(currentPage > 0);
        nextBtn.toggle(currentPage < pages.length - 1 && pagesComplete[currentPage]);
    };

    var clearStage = function(){
        for(var layer in layers){
            layers[layer].removeChildren();
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
