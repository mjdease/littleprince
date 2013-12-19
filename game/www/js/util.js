// utility functions

// event name abstraction for desktop and mobile
var clickEvt = isPhonegap() ? "tap" : "click";

// Add jquery-style visibility toggle function to Kinetic nodes
Kinetic.Util.addMethods(Kinetic.Image, {
    toggle : function(visible){
        if(typeof visible !== "undefined"){
            this.setVisible(!!visible);        }
        else{
            this.setVisible(!this.getVisible());
        }
    }
});

function getStoryPageById(storyObj, id, index){
    var collection;
    if(/\./.test(id)){
        var levels = id.split(".");
        collection = storyObj[levels[0]][levels[1]];
    }
    else{
        collection = storyObj[id]
    }
    if(!collection){
        return;
    }
    if(index != null){
        return collection[index];
    }
    else{
        return collection;
    }
}

//optons - all sprite options except for animations
//width - frame width
//height - frame height
//animList - Array of objects where the object keys are the names of the animations
//          and the value is the number of frames.
//          eg: [{idle:1}, {run: 14}, {walk: 14}]
 function defineSprite(options, width, height, animList){
    var anim = {}, index = 0;
    if($.isArray(animList)){
        for(var i = 0; i < animList.length; i++){
            var animation = animList[i];
            var animName = Object.getOwnPropertyNames(animation)[0];
            console.log(animName);
            anim[animName] = [];
            for(var j = 0; j < animList[animName]; j++){
                anim[animName].push({
                    x: j * width,
                    y: index * height,
                    width: width,
                    height: height
                });
            }
            index++;
        }
    }
    // old buggy code
    else{
        for(var name in animList){
            anim[name] = [];
            for(var j = 0; j < animList[name]; j++){
                anim[name].push({
                    x: j * width,
                    y: index * height,
                    width: width,
                    height: height
                });
            }
            index++;
        }
    }
    options.animations = anim;
    return new Kinetic.Sprite(options);
}

function addToStage(layer, objs){
    if($.isArray(objs)){
        for(var i = 0; i < objs.length; i++){
            layer.add(objs[i]);
        }
    }
    else{
        layer.add(objs);
    }
}

function startFakeAccelerometer(){
    var acc = {x:0,y:0,z:0};
    $(document).keydown(function(e){
        if (e.which == 37 && acc.x < 10) { // left
            acc.x += 0.5;
        }
        if (e.which == 38 && acc.y > -10) { // up
            acc.y -= 0.5;
        }
        if (e.which == 39 && acc.x > -10) { // right
            acc.x -= 0.5;
        }
        if (e.which == 40 && acc.y < 10) { // down
            acc.y += 0.5;
        }
    });
    return function(){
        return acc;
    };
}

function randomInt(min, max){
    return Math.round(min + Math.random() * (max-min));
}

// returns true if running in phonegap environment
function isPhonegap(){
    return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
}

// pass in two kinetic objects
function dist(obj1, obj2){
    var pt1, pt2;
    if(obj1.x !== undefined && obj1.y !== undefined){
        pt1 = obj1;
    }
    else{
        pt1 = obj1.getPosition();
    }
    if(obj2.x !== undefined && obj2.y !== undefined){
        pt2 = obj2;
    }
    else{
        pt2 = obj2.getPosition();
    }
    return Math.abs(Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2)));
}

// returns correct path depending on the current enironment
function getPath(path){
    if(isPhonegap()){
        path = "/android_asset/www/" + path;
    }
    return path;
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// h,s,and v need to be 0.0-1.0
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

// Sound class, abstracts android and html audio
function Sound(path, autoplay, loop, type){
    if(type === undefined){
        type = "effect";
    }
    this.pg = isPhonegap();
    this.loop = loop;
    this.type = type;
    this.path = getPath(path);
    storybook.registerSound(this);

    this.onStatus = function(status){
        if(this.pg && this.loop && status == Media.MEDIA_STOPPED){
            this.raw.play();
        }
    };

    if(this.pg){
        this.raw = new Media(this.path, null, null, this.onStatus);
        this.raw.setVolume(storybook.getVolume(type));
        if(autoplay){
            this.raw.play();
        }
    }
    else{
        this.raw = new Howl({
            urls : [this.path],
            autoplay : autoplay,
            loop : loop,
        });
        this.raw.volume(storybook.getVolume(type));
    }

    this.play = function(){
        this.raw.play();
    };

    this.stop = function(){
        this.raw.stop();
    };

    this.setVolume = function(volume){
        if(this.pg){
            this.raw.setVolume(volume);
        }
        else{
            this.raw.volume(volume);
        }
    };

    this.destroy = function(){
        storybook.removeSound(this);
        this.stop();
        if(this.pg){
            this.raw.release();
        }
        else{
            this.raw.unload();
        }
    };
}
