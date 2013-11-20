var page3 = {};

page3.requiredImages = [
    {name: "test", path: "assets/images/testimg.png"}
];

page3.startGame = function(images, stage, layers){
    page3.player = new Kinetic.Image({
        image: images.test,
        x:0,
        y:-53,
        width:370,
        height:53,
        filter: Kinetic.Filters.Colorize,
        filterColorizeColor:Kinetic.Util.getRandomColor()
    });
    layers.dynBack.add(page3.player);
}

page3.update = function(frame, stage, layers){
    if(page3.player && Math.random() < 0.03) {
        page3.player.setPosition(randomInt(0,stage.getWidth()), randomInt(0,stage.getWidth()));
    }
    if(page3.player && Math.random() > 0.99){
        storybook.pageComplete();
    }
}


storybook.registerPage(page3);
storybook.startStory();
