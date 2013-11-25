window.storybook = {};

(function(app, K, $, undefined) {
    var stage, layers = {}, updateLoop;
    var deviceReady = false, bookReady = false;
    var currentPage = 0, pages = [], bookPages = [], pagesComplete = [];
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
        var template = Handlebars.compile($("#book-pages-template").html());
        book = $("#storybook").html(template({pages:bookPages}));

        setTimeout(function(){
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

            updateLoop = new K.Animation(function(frame){
                pages[currentPage].update(frame, stage, layers);
            }, [layers.dynBack, layers.dynFront]);

            stage.draw();

            book.turn({
                page:2,
                height: 800,
                width: 1280,
                when: {
                    turned : onNewPage
                }
            });

            nextBtn = $("#btn-next").on("click", function(){
                book.turn("next");
                currentPage++;
                updateLoop.stop();
                clearStage();
                updateButtonVisibility();
            });
            prevBtn = $("#btn-prev").on("click", function(){
                book.turn("prev");
                currentPage--;
                updateLoop.stop();
                clearStage();
                updateButtonVisibility();
            });

            updateButtonVisibility();
        }, 10);
    }

    var onNewPage = function(){
        if(pages[currentPage].requiredImages){
            loadImages(pages[currentPage].requiredImages, initPage);
        }
        else{
            initPage();
        }
    };

    var initPage = function(images){
        pages[currentPage].initPage(images, stage, layers);
        updateLoop.start();
    };

    app.registerPage = function(page){
        if(!bookPages.length){
            bookPages.push({pageClasses : "odd", hasTexture: false, pageId: bookPages.length});
        }
        bookPages.push({pageClasses : "even", hasTexture: true, pageId: bookPages.length});
        bookPages.push({pageClasses : "odd", hasTexture: true, pageId: bookPages.length});
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
