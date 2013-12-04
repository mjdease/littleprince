(function(){
    var page = new Page("asteroids.b612", 0, false);

    page.setPreviousPage(false);

    page.setNextPage("asteroids.b612", 1);

    var flower;
    var baobab = new Array();
    var hole = new Array();
    var count = new Array();
    var remove = true;
    var removeCount = 0;
    var count2 = 0;
    var count3 = 0;
    var flowerDeath = false;

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/asteroids/b612/spritesheet_baobabv1.png"},
        {name: "spritehole", path: "assets/images/asteroids/b612/hole.png"},
        {name: "background", path: "assets/images/asteroids/b612/ground.png"},
        {name: "spriteflower", path: "assets/images/asteroids/b612/spritesheet_flowerv1.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/01/hint_ch02_01.png"}
    ]);

    page.setNarration("assets/sound/test.mp3");

    page.initPage = function(images, stage, layers){

        flower = storybook.defineSprite({
            x:180,
            y:360,
            image: images.spriteflower,
            animation: "flowerAnim",
            frameRate: 1
        }, 200, 150, {flowerAnim: 9});
        layers.dynBack.add(flower);
        flower.setScale(0.7);

        for (var i=0; i<2; i++){
            baobab[i] = storybook.defineSprite({
                x:400,
                y:300,
                image: images.spriteimg,
                animation: "baobabAnim",
                frameRate: 1
            }, 767, 642, {baobabAnim: 12});
            layers.dynBack.add(baobab[i]);
            baobab[i].setScale(0.5);
        }
        //if baobab is a full tree then stop
        baobab[0].afterFrame(9, function() {
            baobab[0].stop();
        });

        baobab[1].afterFrame(9, function() {
            baobab[1].stop();
        });

        //hole animation
        for (var s=0; s<3; s++){
            hole[s] = storybook.defineSprite({
                x:25,
                y:330,
                image: images.spritehole,
                animation: "holeAnim",
                frameRate: 3,
                listening: false
            }, 331, 308, {holeAnim:4});
            layers.dynBack.add(hole[s]);
            hole[s].setScale(1);
        }
        flower.afterFrame(7, function() {
            flower.stop();
        });
    };

    page.startPage = function(){
        baobab[0].move(0, 60);
        baobab[1].move(400,0);
        for(var x=0; x<3; x++){
            //hide all holes and move to bottom
            hole[x].hide();
            hole[x].moveToBottom();
        }
        hole[0].move(400,60);
        hole[1].move(800,1);
        hole[2].move(110,-25); //flower hole position

        page.setState(page.States.PLAYING);
    };

    page.startChallenge = function(){
        flower.start();

        baobab[0].start(); //start baobab animation
        baobab[1].start();
        baobab[0].on(clickEvt, function(){seedRemove("baobab0")});
        baobab[1].on(clickEvt, function(){seedRemove("baobab1")});
        flower.on(clickEvt, function(){seedRemove("flower")});

        page.setState(page.States.PLAYING);
    };

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        for(var z=0; z<2; z++){
            if(baobab[z].getIndex() > 5){
                baobab[z].setListening(false);
                remove = false;
            }
        }
        if(removeCount > 1){
            page.setState(page.States.PASSED);
        }

        else if (flowerDeath == true){
            page.setState(page.States.FAILED);
        }
    };

    function onSpriteClick(e){
        page.challengeComplete();
    }

    function seedRemove(seedType){

    //TODO -- dynamic code
    /*var removecount = 0;
    for(var t=0; t<2; t++){
        var name = "baobab"+t;
        count[t] = 0;
        if(seedType == name){
            if(baobab[t].getIndex() > 5){
                baobab[t].setListening(false);
                remove = false;
            }
            baobab[t].on(clickEvt, function() {
                count[t] += 1;
                if(count[t] == 4){
                  baobab[t].hide();
                }
                if(count[t] == 1){
                    hole[t].show();
                    hole[t].setIndex(0);
                    //index = 0;
                }
                if(count[t] == 2){
                    //index = 1;
                    hole[t].setIndex(1);
                }
                if(count[t] == 3){
                    //index = 2;
                    hole[t].setIndex(2);
                }
            });
        }
    }*/
        if(seedType == "baobab0"){
            if(baobab[0].getIndex() > 5){
                baobab[0].setListening(false);
                remove = false;
            }
            baobab[0].on(clickEvt, function() {
                count2 += 1;
                if(count2 == 4){
                  baobab[0].destroy();
                  removeCount += 1;
                }
                if(count2 == 1){
                    hole[0].show();
                    hole[0].setIndex(0);
                    //index = 0;
                }
                if(count2 == 2){
                    //index = 1;
                    hole[0].setIndex(1);
                }
                if(count2 == 3){
                    //index = 2;
                    hole[0].setIndex(2);
                }
            });
        }

        if(seedType == "baobab1"){
            if(baobab[1].getIndex() > 5){
                baobab[1].setListening(false);
                remove = false;
            }
            baobab[1].on(clickEvt, function() {
                count3 += 1;
                if(count3 == 4){
                  baobab[1].destroy();
                  removeCount += 1;
                }
                if(count3 == 1){
                    hole[1].show();
                    hole[1].setIndex(0);
                    //index = 0;
                }
                if(count3 == 2){
                    //index = 1;
                    hole[1].setIndex(1);
                }
                if(count3 == 3){
                    //index = 2;
                    hole[1].setIndex(2);
                }
            });
        }
        if(seedType == "flower"){
            count[2] = 0;
            flower.on(clickEvt, function() {
                count[2] += 1;
                if(count[2] == 4){
                    flower.hide();
                    flowerDeath = true;
                }
                if(count[2] == 1){
                    hole[2].show();
                    hole[2].setScale(0.7);
                    hole[2].setIndex(0);
                }
                if(count[2] == 2){
                    hole[1].setIndex(1);
                }
                if(count[2] == 3){
                    hole[2].setIndex(2);
                }
            });
        }
    };
    storybook.registerPage(page);
})();
