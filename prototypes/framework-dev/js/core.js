window.storybook = {};

(function(app, K, $, undefined) {
    var stage, layers = {}, updateLoop, transition;
    var deviceReady = false, bookReady = false;
    var currentPage = 0, transitionSpeed = 1500, transitionState = 0, transitionDir = 1, pages = [], pagesComplete = [];
    var prevBtn, nextBtn;
    var book;


    app.initialize = function(){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            $(document).on("deviceready", onDeviceReady);
        } else {
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
                currentPage++;
                changePage("next");
            });
            prevBtn = $("#btn-prev").on("click", function(){
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
            transitionState = 0;
            pages[currentPage].startPage();
        }
    };

    var changePage = function(page){
        transitionDir = page == "next" ? 1 : -1;
        updateLoop.stop();
        updateButtonVisibility();
        transition.start();
    };

    var initPage = function(images){
        pages[currentPage].initPage(images, stage, layers);
        updateLoop.start();
        transitionState++;
        if(transitionState == 2){
            transitionState = 0;
            pages[currentPage].startPage();
        }
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
})(window.storybook, Kinetic, jQuery);

storybook.initialize();
