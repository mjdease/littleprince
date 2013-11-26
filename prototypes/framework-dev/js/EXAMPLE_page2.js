(function(){//scoping. ignore.

    //define page in here

    //local variables
    var speed = 150;
    var bodies = [];
    var score = 0;

    var page = new Page(true);

    page.setRequiredAssets([{name: "test", path: "assets/images/testimg.png"}]);

    page.initPage = function(images, stage, layers){
        for(var i = 0; i < 10; i++){
            var img = new Kinetic.Image({
                image: images.test,
                x: randomInt(31, stage.getWidth() - 31),
                y: randomInt(35, 200),
                width:62,
                height:71,
                offset: {x:31, y:35}
            });
            img.sb_alive = true;
            bodies.push(img);
            layers.dynBack.add(img);
        }
    };

    page.startPage = function(){
        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }

        for(var i = 0; i < bodies.length; i++){
            var gameObject = bodies[i];
            if(gameObject.sb_alive){
                var newY = gameObject.getY() + (speed * frame.timeDiff / 1000);
                if(newY >= stage.getHeight() - 36){
                    newY = stage.getHeight() - 36;
                    gameObject.sb_alive = false;
                    score++;
                    if(score == bodies.length){
                        page.setState(page.States.PASSED);
                    }
                }
                gameObject.setY(newY);
            }
        }
    }

    storybook.registerPage(page);
})();// scoping. ignore.
