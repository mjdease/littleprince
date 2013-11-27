//Definition of the Page class

function Page(hasChallenge){
    this.hasChallenge = hasChallenge;
    this.text = [];
    this.state = this.States.UNINITIALIZED;
}

Page.prototype.States = {
    UNINITIALIZED : 0,
    PLAYING : 1,
    PASSED : 2,
    FAILED : 3
};

Page.prototype.getState = function(){
    return this.state;
};

Page.prototype.setState = function(state){
    this.state = state;
    if(state == this.States.PASSED){
        storybook.pageComplete();
    }
};

Page.prototype.setText = function(){
    for(var i = 0; i < arguments.length; i++){
        this.text.push(arguments[i]);
    }
}

Page.prototype.setNarration = function(path){
    this.narration = new Howl({
        urls: [getPath(path)],
        autoplay: false,
        loop: false
    });
}

// arguments in array of objects containing name and asset path
Page.prototype.setRequiredAssets = function(images){
    this.requiredImages = images;
}

//override this.
//accepts assets, stage, and layers object arguments
Page.prototype.initPage = function(){};

Page.prototype.startPage = function(){};

//override this.
//accepts frame, stage, and layers object arguments
Page.prototype.update = function(){};
