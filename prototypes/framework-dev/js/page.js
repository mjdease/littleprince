//Definition of the Page class

function Page(hasChallenge){
    this.hasChallenge = hasChallenge;
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

// arguments in array of objects containing name and asset path
Page.prototype.setRequiredAssets = function(images){
    this.requiredImages = images;
}

//override this.
//accepts assets, stage, and layers object arguments
Page.prototype.initPage = function(){};

//override this.
//accepts frame, stage, and layers object arguments
Page.prototype.update = function(){};
