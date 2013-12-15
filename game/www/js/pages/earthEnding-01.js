(function(){
    var sprite;
    var answers = new Array();
    var questionNum = 0;
    var i;
    var win = false;
    var page = new Page("earthEnding", 1);

    page.setPreviousPage("earthEnding", 0);

    page.setNextPage("earthEnding", 2);

    page.setRequiredAssets([
        {name: "test", path: "assets/images/testimg.png"},
        {name: "spriteimg", path: "assets/images/spritesheet.png"}
        //{name: "background", path: "assets/images/earthEnding/bgPage25.jpg"}
    ]);

    page.setNarration("assets/sound/test.mp3");

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
    };

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

    if(question == 1)
        if(answerCheck == "A"){
            console.log("Correct");

            questionNum = 2;
            answers[0].hide();
            answers[1].hide();
            answers[2].hide();

            answers[3].show();
            answers[4].show();
            answers[5].show();

        } else console.log("Failed");

    if(question == 2)
        if(answerCheck == "B"){
            console.log("Correct");

            questionNum = 3;
            answers[3].hide();
            answers[4].hide();
            answers[5].hide();

            answers[6].show();
            answers[7].show();
            answers[8].show();

        } else console.log("Failed");

    if(question == 3)
        if(answerCheck == "C"){
            console.log("Correct");
            win = true;
        } else console.log("Failed");
    }

    storybook.registerPage(page);
})();
