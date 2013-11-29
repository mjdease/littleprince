//Definition of the Page class

function Page(sectionId, pageNum, isMenu){
    this.id = sectionId + pageNum;
    this.text = getStoryPageById(story, sectionId, pageNum);
    this.challengeText = getStoryPageById(challengeWords, sectionId, pageNum);
    this.hasChallenge = !!this.challengeText;
    this.state = this.States.UNINITIALIZED;
    this.isMenu = isMenu;
    if(/\./.test(sectionId)){
        this.asteroidId = sectionId.split(".")[1];
    }
}

Page.prototype.States = {
    UNINITIALIZED : 0,
    PLAYING : 1,
    PASSED : 2,
    FAILED : 3
};

Page.prototype.setPreviousPage = function(sectionId, pageNum){
    if(sectionId){
        this.previousPage = sectionId + pageNum;
    }
}

Page.prototype.setNextPage = function(sectionId, pageNum){
    if(sectionId){
        this.nextPage = sectionId + pageNum;
    }
}

Page.prototype.getState = function(){
    return this.state;
};

Page.prototype.setState = function(state){
    this.state = state;
    if(state == this.States.PASSED){
        storybook.pageComplete();
    }
};

Page.prototype.challengeComplete = function(){
    this.state = this.States.PASSED;
    storybook.pageComplete();
};

Page.prototype.setNarration = function(path){
    this.narrationSrc = getPath(path);
};

// arguments in array of objects containing name and asset path
Page.prototype.setRequiredAssets = function(images){
    this.requiredImages = images;
};

//override this.
//accepts assets, stage, and layers object arguments
Page.prototype.initPage = function(){};

Page.prototype.startPage = function(){};

//override this.
//accepts frame, stage, and layers object arguments
Page.prototype.update = function(){};
