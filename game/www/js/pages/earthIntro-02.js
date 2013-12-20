(function(){
    var loops = {};
    var speed = -20;

    var page = new Page("earthIntro", 2, false);

    page.setPreviousPage("earthIntro", 1);

    page.setNextPage("earthIntro", 3);

    page.setNarration("assets/narration/Page3.mp3");

    page.setRequiredAssets([
        {name: "background", path: "assets/images/earthIntro/02_background.jpg"},
        {name: "cloud1", path: "assets/images/earthIntro/02_cloud1.png"},
        {name: "cloud2", path: "assets/images/earthIntro/02_cloud2.png"},
        {name: "cloud3", path: "assets/images/earthIntro/02_cloud3.png"},
    ]);


    page.initPage = function(images, stage, layers){
        loops.clouds = [];
        for(var i = 1; i < 4; i++){
            var cloud = new Kinetic.Image({
                x: randomInt(30, 1200),
                y: randomInt(30, 130),
                image: images["cloud" + i],
            });
            layers.dynBack.add(cloud);
            loops.clouds.push(cloud);
        }
    };

    page.startPage = function(){

    };

    page.update = function(frame, stage, layers){
        var dispX = speed * frame.timeDiff / 1000;
        for(var i = 0; i < loops.clouds.length; i++){
            var cloud = loops.clouds[i];
            if(cloud.getX() + cloud.getWidth() < 0){
                cloud.setX(stageWidth);
            }
            else{
                cloud.move(dispX, 0);
            }
        }
    };

    storybook.registerPage(page);
})();
