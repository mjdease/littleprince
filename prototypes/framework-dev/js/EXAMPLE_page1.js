var page1 = {};

page1.requiredImages = [
    {name: "test", path: "assets/images/testimg.png"}
];

page1.startGame = function(images, stage, layers){
    page1.player = new Kinetic.Image({
        image: images.test,
        x:0,
        y:-53,
        width:370,
        height:53,
        filter: Kinetic.Filters.Colorize,
        filterColorizeColor:Kinetic.Util.getRandomColor()
    });
    layers.dynBack.add(page1.player);
}

page1.update = function(frame, stage, layers){
    if(page1.player && Math.random() < 0.03) {
        page1.player.setPosition(randomInt(0,stage.getWidth()), randomInt(0,stage.getWidth()));
    }
    if(page1.player && Math.random() > 0.99){
        storybook.pageComplete();
    }
}


storybook.registerPage(page1);
