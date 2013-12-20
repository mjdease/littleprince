(function(){
    var sprite;
    var questions = new Array ();
    var answers = new Array();
    var questionNum = 0;
    var i, imgName;
    var a1, a2, a3, a4, a5, a6, q1, q2, q3;
    var win = false;
    var page = new Page("earthEnding", 1);
    var sounds = {};
    page.setPreviousPage("earthEnding", 0);

    page.setNextPage("earthEnding", 2);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"},
        {name: "hint", path: "assets/images/ui/page_challenge/06/hint_ch06_01.png"},
        {name: "background", path: "assets/images/earthEnding/desertBg.png"},

        {name: "q1", path: "assets/images/earthIntro/06_q01.png"},
        {name: "a1", path: "assets/images/earthIntro/06_q01_incorrect01.png"},
        {name: "a2", path: "assets/images/earthIntro/06_q01_incorrect02.png"},
        {name: "a3", path: "assets/images/earthIntro/06_q01_correct.png"},

        {name: "q2", path: "assets/images/earthIntro/06_q02.png"},
        {name: "a4", path: "assets/images/earthIntro/06_q02_correct.png"},
        {name: "a5", path: "assets/images/earthIntro/06_q02_incorrect02.png"},
        {name: "a6", path: "assets/images/earthIntro/06_q02_incorrect03.png"},

        {name: "q3", path: "assets/images/earthIntro/06_q03.png"},
        {name: "a7", path: "assets/images/earthIntro/06_q03_correct.png"},
        {name: "a8", path: "assets/images/earthIntro/06_q03_incorrect02.png"},
        {name: "a9", path: "assets/images/earthIntro/06_q03_incorrect01.png"}
    ]);

    page.setNarration();

    page.initPage = function(images, stage, layers){
        for(i=1; i<10; i++){
         questions[i] = new Kinetic.Image({
           image: images["q"+i],
           x: 400,
           y: 100
         });
         layers.dynBack.add(questions[i]);

         answers[i] = new Kinetic.Image({
            image: images["a"+i],
            x : 120,
            y : 550
        });
         layers.dynBack.add(answers[i]);
        }

        sounds.correct = new Sound("assets/sound/earthEnding/ding.mp3", false, false);
        sounds.wrong = new Sound("assets/sound/earthEnding/wrong.mp3", false, false);
    };

    page.startPage = function(){
        questionNum = 1;

        answers[2].move(380,0);
        answers[3].move(750,0);

        answers[5].move(380,0);
        answers[6].move(750,0);

        answers[7].move(380,0);
        answers[8].move(750,0);

        //if question one the hide all the other assets
        for (var x=4; x<10; x++){
            answers[x].hide();
        }
        questions[2].hide();
        questions[3].hide();
    };

    page.startChallenge = function(layers){
        //listening for questions
        answers[1].on(clickEvt, function(){RiddleCheck(questionNum, "A")});
        answers[2].on(clickEvt, function(){RiddleCheck(questionNum, "B")});
        answers[3].on(clickEvt, function(){RiddleCheck(questionNum, "C")});

        answers[4].on(clickEvt, function(){RiddleCheck(questionNum, "A")});
        answers[5].on(clickEvt, function(){RiddleCheck(questionNum, "B")});
        answers[6].on(clickEvt, function(){RiddleCheck(questionNum, "C")});

        answers[7].on(clickEvt, function(){RiddleCheck(questionNum, "A")});
        answers[8].on(clickEvt, function(){RiddleCheck(questionNum, "B")});
        answers[9].on(clickEvt, function(){RiddleCheck(questionNum, "C")});
        console.log(answers[8]);
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
            if(answerCheck == "C"){
                questions[1].hide();
                questions[2].show();
                console.log("Correct");
                sounds.correct.play();
                questionNum = 2;
                answers[1].hide();
                answers[2].hide();
                answers[3].hide();

                answers[4].show();
                answers[5].show();
                answers[6].show();

            } else sounds.wrong.play();
        }
        if(question == 2){
            if(answerCheck == "A"){
                questions[2].hide();
                questions[3].show();
                sounds.correct.play();
                questionNum = 3;
                answers[4].hide();
                answers[5].hide();
                answers[6].hide();

                answers[7].show();
                answers[8].show();
                answers[9].show();

            } else sounds.wrong.play();
        }

        if(question == 3){
            if(answerCheck == "A"){
                sounds.correct.play();
                win = true;
            } else sounds.wrong.play();

        }
    }
    storybook.registerPage(page);
})();
