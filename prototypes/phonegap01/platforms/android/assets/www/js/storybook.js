window.phonegap01 = {};

(function(app, $, undefined) {
    var book = null;
    var pageDimensions = {width: $(window).width()/2, height:  $(window).height()};

    app.initialize = function(){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            $(document).on("deviceready", onDeviceReady);
        } else {
            $().ready(onDeviceReady);
        }
    };

    var onDeviceReady = function(){
        book = $("#book").turn({
            height: $(window).height(),
            width: $(window).width(),
            when: {
                turned : onPageTurn
            }
        });
    };

    var onPageTurn = function(e, pageNum){
        if(pageNum < 6){
            if(pageNum == 1) pageNum = 0;
            initializePage(pageNum + 2);
            initializePage(pageNum + 3);
        }
    };

    var initializePage = function(num){
        var gameStage = new Kinetic.Stage({
            container: "page-container-" + num,
            width: pageDimensions.width,
            height: pageDimensions.height
        });
        var textLayer = new Kinetic.Layer();
        var pageText = new Kinetic.Text({
            text: story[num-2],
            fontSize: 20,
            width: pageDimensions.width/2,
            fill: 'black',
            align: 'left',
            x: 30,
            y: randomInt(30, pageDimensions.height/1.5)
        });
        textLayer.add(pageText);

        var gameLayer = new Kinetic.Layer();
        for(var i = 0; i < 50; i++){
            var shape = new Kinetic.Rect({
                fillRGB : {r: randomInt(0, 255), g: randomInt(0, 255), b: randomInt(0, 255)},
                strokeRGB : {r: randomInt(0, 255), g: randomInt(0, 255), b: randomInt(0, 255)},
                strokeWidth : 5,
                x : randomInt(15, pageDimensions.width - 15),
                y : randomInt(15, pageDimensions.height - 15),
                width : 30,
                height : 30,
                draggable : true
            });
            gameLayer.add(shape);
        }

        gameStage.add(gameLayer);
        gameStage.add(textLayer);
    };

    var randomInt = function(min, max){
        return Math.round(min + Math.random() * max-min);
    };
})(window.phonegap01, jQuery);

var story = [
    "Once when I was six years old I saw a magniﬁcent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal. Here is a copy of the drawing.",
    "In the book it said: “Boa constrictors swallow their prey whole, without chewing it. After that they are not able to move, and they sleep through the six months that they need for digestion.”",
    "I pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my ﬁrst drawing. My Drawing Number One. It looked like this:",
    "I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.",
    "But they answered: “Frighten? Why should any one be frightened by a hat?”",
    "My drawing was not a picture of a hat. It was a picture of a boa constrictor digesting an elephant. But since the grown-ups were not able to understand it, I made another drawing: I drew the inside of the boa constrictor, so that the grown-ups could see it clearly. They always need to have things explained. My Drawing Number Two looked like this:"
];
