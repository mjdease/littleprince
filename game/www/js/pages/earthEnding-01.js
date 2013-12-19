(function(){
    var sprite;
    var answers = new Array();
    var questionNum = 0;
    var i;
    var win = false;
    var page = new Page("earthEnding", 1);
    var sounds = {};
    page.setPreviousPage("earthEnding", 0);

    page.setNextPage("earthEnding", 2);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/06/hint_ch06_01.png"},
        {name: "background", path: "assets/images/earthEnding/desertBg.png"}
    ]);

    page.setNarration();

    page.initPage = function(images, stage, layers){

        for(i=0; i<9; i++){
         answers[i] = new Kinetic.Rect({
            x: 239,
            y: 600,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });
         layers.dynBack.add(answers[i]);
        }

        sounds.correct = new Sound("assets/sound/earthEnding/ding.mp3", false, false);
        sounds.wrong = new Sound("assets/sound/earthEnding/wrong.mp3", false, false);
    };

    page.startPage = function(){
        questionNum = 1;

        // draw all assets
        for(i=0; i<9; i++){
            answers[i].move(i*120,0);
        }

        //if question one the hide all the other assets
        for (var x=3; x<9; x++){
            answers[x].hide();
        }
    };

    page.startChallenge = function(layers){
        //listening for questions
        answers[0].on(clickEvt, function(){RiddleCheck(questionNum, "A")});
        answers[1].on(clickEvt, function(){RiddleCheck(questionNum, "B")});
        answers[2].on(clickEvt, function(){RiddleCheck(questionNum, "C")});

        answers[3].on(clickEvt, function(){RiddleCheck(questionNum, "A")});
        answers[4].on(clickEvt, function(){RiddleCheck(questionNum, "B")});
        answers[5].on(clickEvt, function(){RiddleCheck(questionNum, "C")});

        answers[6].on(clickEvt, function(){RiddleCheck(questionNum, "A")});
        answers[7].on(clickEvt, function(){RiddleCheck(questionNum, "B")});
        answers[8].on(clickEvt, function(){RiddleCheck(questionNum, "C")});

        page.setState(page.States.PLAYING);
    }

    page.update = function(frame, stage, layers){
        if(page.getState() != page.States.PLAYING){
            return;
        }
        if(win == true){
            page.setState(page.States.PASSED);
        }
    };

    function onSpriteClick(e){
        sprite.stop();
        page.challengeComplete();
    }

    function RiddleCheck(question, answerCheck){

        if(question == 1){
            if(answerCheck == "A"){
                console.log("Correct");
                sounds.correct.play();
                questionNum = 2;
                answers[0].hide();
                answers[1].hide();
                answers[2].hide();

                answers[3].show();
                answers[4].show();
                answers[5].show();

            } else sounds.wrong.play();
        }
        if(question == 2){
            if(answerCheck == "B"){
                sounds.correct.play();
                questionNum = 3;
                answers[3].hide();
                answers[4].hide();
                answers[5].hide();

                answers[6].show();
                answers[7].show();
                answers[8].show();

            } else sounds.wrong.play();
        }

        if(question == 3){
            if(answerCheck == "C"){
                sounds.correct.play();
                win = true;
            } else sounds.wrong.play();

        }
    }
    storybook.registerPage(page);
})();
