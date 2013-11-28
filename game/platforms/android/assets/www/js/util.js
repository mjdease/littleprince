// utility functions

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
