// utility functions
var clickEvt = isPhonegap() ? "tap" : "click";

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
//animList - object where the keys are the names of the animations
//          and the value is ne number of frames.
//          eg: {idle:1, run: 14, walk: 14}
 function defineSprite(options, width, height, animList){
    var anim = {}, index = 0;
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
    options.animations = anim;
    return new Kinetic.Sprite(options);
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
    var pt1 = obj1.getPosition();
    var pt2 = obj2.getPosition();
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}

// returns correct path depending on the current enironment
function getPath(path){
    if(isPhonegap()){
        path = "/android_asset/www/" + path;
    }
    return path;
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
function Sound(path, autoplay, loop){
    this.pg = isPhonegap();
    this.loop = loop;
    this.path = getPath(path);

    this.onStatus = function(status){
        if(this.pg && this.loop && status == Media.MEDIA_STOPPED){
            this.raw.play();
        }
    };

    if(this.pg){
        this.raw = new Media(this.path, null, null, this.onStatus);
        if(autoplay){
            this.raw.play();
        }
    }
    else{
        this.raw = new Howl({
            urls : [this.path],
            autoplay : autoplay,
            loop : loop
        });
    }

    this.play = function(){
        this.raw.play();
    };

    this.stop = function(){
        this.raw.stop();
    };

    this.destroy = function(){
        this.stop();
        if(this.pg){
            this.raw.release();
        }
        else{
            this.raw.unload();
        }
    };
}
