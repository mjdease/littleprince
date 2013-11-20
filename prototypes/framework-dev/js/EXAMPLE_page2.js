var page2 = {};

page2.requiredImages = [
    {name: "test", path: "assets/images/testimg.png"}
];

page2.startGame = function(images, stage, layers){
    page2.player = new Kinetic.Image({
        image: images.test,
        x:0,
        y:-53,
        width:370,
        height:53,
        filter: Kinetic.Filters.Colorize,
        filterColorizeColor:Kinetic.Util.getRandomColor()
    });
    layers.dynBack.add(page2.player);
}

page2.update = function(frame, stage, layers){
    if(page2.player && Math.random() < 0.03) {
        page2.player.setPosition(randomInt(0,stage.getWidth()), randomInt(0,stage.getWidth()));
    }
    if(page2.player && Math.random() > 0.99){
        storybook.pageComplete();
    }
}


storybook.registerPage(page2);
