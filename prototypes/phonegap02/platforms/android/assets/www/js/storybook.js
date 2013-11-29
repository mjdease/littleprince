window.phonegap02 = {};

(function(app, $, undefined) {
    // var SCALE = 32;
    var lastUpdate = Date.now();
    var book = null;
    var gameStage, gameLayer, textLayer;
    var world = null;
    var genericSquare = null;
    var bodies = [];
    var page = {width: $(window).width(), height:  $(window).height()};
    var accelerometer = {x:0,y:0,z:0};
    var tapFx;

    app.initialize = function(){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            $(document).on("deviceready", onDeviceReady);
        } else {
            $().ready(onDeviceReady);
        }
    };

    app.run = function(){
        var timeDelta = Date.now() - lastUpdate;
        lastUpdate = Date.now();

        update(timeDelta);
        draw();
    };

    var update = function(timeDelta){
        world.Step(timeDelta, 2, 2);
        for(var i = 0; i < bodies.length; i++){
            var body = bodies[i];
            var pos = body.phys.GetPosition();
            body.phys.ApplyForceToCenter(new Box2D.b2Vec2(accelerometer.y*2000, accelerometer.x*-2000));
            body.vis.setPosition(pos.get_x(), -1 * pos.get_y());
            body.vis.setRotation(body.phys.GetAngle());
        }
    };

    var draw = function(){
        textLayer.find("#acc-x")[0].setText("X : " + accelerometer.x.toFixed(4));
        textLayer.find("#acc-y")[0].setText("Y : " + accelerometer.y.toFixed(4));
        textLayer.find("#acc-z")[0].setText("Z : " + accelerometer.z.toFixed(4));
        gameStage.draw();
    };

    var onDeviceReady = function(){
        book = $("#book");
        //temp
        initDemo();
    };

    var onPageTurn = function(e, pageNum){
        if(pageNum < 6){
            if(pageNum == 1) pageNum = 0;
            initializePage(pageNum + 2);
            initializePage(pageNum + 3);
        }
    };

    var initDemo = function(){
        setInterval(app.run, 1000/60);

        if(navigator.accelerometer){
            navigator.accelerometer.watchAcceleration(function(acc){
                if(Math.abs(acc.x) < .4) acc.x = 0;
                if(Math.abs(acc.y) < .4) acc.y = 0;
                if(Math.abs(acc.z) < .4) acc.z = 0;
                accelerometer = acc;
            }, function(){}, {frequency:100});
        }

        world = new Box2D.b2World(new Box2D.b2Vec2(0,0));

        var bottomWall = world.CreateBody(new Box2D.b2BodyDef());
        var bottomShape = new Box2D.b2EdgeShape();
        bottomShape.Set(new Box2D.b2Vec2(0, -page.height), new Box2D.b2Vec2(page.width, -page.height));
        bottomWall.CreateFixture(bottomShape, 0);

        var topWall = world.CreateBody(new Box2D.b2BodyDef());
        var topShape = new Box2D.b2EdgeShape();
        topShape.Set(new Box2D.b2Vec2(0, 0), new Box2D.b2Vec2(page.width, 0));
        topWall.CreateFixture(topShape, 0);

        var leftWall = world.CreateBody(new Box2D.b2BodyDef());
        var leftShape = new Box2D.b2EdgeShape();
        leftShape.Set(new Box2D.b2Vec2(0, 0), new Box2D.b2Vec2(0, -page.height));
        leftWall.CreateFixture(leftShape, 0);

        var rightWall = world.CreateBody(new Box2D.b2BodyDef());
        var rightShape = new Box2D.b2EdgeShape();
        rightShape.Set(new Box2D.b2Vec2(page.width, 0), new Box2D.b2Vec2(page.width, -page.height));
        rightWall.CreateFixture(rightShape, 0);

        genericSquare = new Box2D.b2PolygonShape();
        genericSquare.SetAsBox(25, 25);


        gameStage = new Kinetic.Stage({
            container: "page-container",
            width: page.width,
            height: page.height
        });
        textLayer = new Kinetic.Layer();
        var pageText = new Kinetic.Text({
            text: story[0],
            fontSize: 28,
            width: page.width/2,
            fill: 'black',
            align: 'left',
            x: 30,
            y: randomInt(30, page.height/1.5)
        });
        textLayer.add(new Kinetic.Text({
            id: "acc-x",
            text: "",
            fontSize: 28,
            width: 150,
            fill: 'black',
            align: 'left',
            x: page.width - 150,
            y: 30
        }));
        textLayer.add(new Kinetic.Text({
            id: "acc-y",
            text: "",
            fontSize: 28,
            width: 150,
            fill: 'black',
            align: 'left',
            x: page.width - 150,
            y: 70
        }));
        textLayer.add(new Kinetic.Text({
            id: "acc-z",
            text: "",
            fontSize: 28,
            width: 150,
            fill: 'black',
            align: 'left',
            x: page.width - 150,
            y: 110
        }));
        textLayer.add(pageText);

        gameLayer = new Kinetic.Layer();

        gameLayer.on("touchstart click", onTap);
        gameLayer.add(new Kinetic.Rect({
            x: 0,
            y: 0,
            width:page.width,
            height:page.height
        }));

        // var obstacle = world.CreateBody(new Box2D.b2BodyDef());
        // var obsShape = new Box2D.b2CircleShape();
        // obsShape.set_m_radius( 150 );
        // console.log(obstacle);
        // obsShape.set_m_p(new Box2D.b2Vec2(page.width * 0.8, page.height/-2));
        // obstacle.CreateFixture(obsShape, 1.0);

        // gameLayer.add(new Kinetic.Circle({
        //     x: page.width * 0.8,
        //     y: page.height/2,
        //     radius: 150,
        //     offset: {x:75, y:75},
        //     fill: Kinetic.Util.getRandomColor()
        // }))

        createBody(page.width/2, page.height/-2);

        gameStage.add(gameLayer);
        gameStage.add(textLayer);

        tapFx = new Howl({
            urls: ["https://dl.dropboxusercontent.com/u/15824593/shot.mp3"]
        });

        var music = new Howl({
            autoplay: true,
            volume: 0.5,
            loop:true,
            urls: ["https://dl.dropboxusercontent.com/u/15824593/bg.mp3"]
        });
    }

    var onTap = function(e){
        createBody(e.x, -e.y);
        tapFx.play();
    }

    var createBody = function(x, y){
        var body = {};

        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        bd.set_position(new Box2D.b2Vec2(x, y));
        body.phys = world.CreateBody(bd);
        body.phys.CreateFixture(genericSquare, 5.0*32);
        body.phys.SetAngularDamping(0.1);

        body.vis = new Kinetic.Rect({
            x: x,
            y: y,
            width: 50,
            height: 50,
            offset: {x:25, y:25},
            fill:Kinetic.Util.getRandomColor()
        });
        gameLayer.add(body.vis);

        bodies.push(body);
    }

    var randomInt = function(min, max){
        return Math.round(min + Math.random() * max-min);
    };
})(window.phonegap02, jQuery);

var story = [
    "Once when I was six years old I saw a magniﬁcent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal. Here is a copy of the drawing.",
    "In the book it said: “Boa constrictors swallow their prey whole, without chewing it. After that they are not able to move, and they sleep through the six months that they need for digestion.”",
    "I pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my ﬁrst drawing. My Drawing Number One. It looked like this:",
    "I showed my masterpiece to the grown-ups, and asked them whether the drawing frightened them.",
    "But they answered: “Frighten? Why should any one be frightened by a hat?”",
    "My drawing was not a picture of a hat. It was a picture of a boa constrictor digesting an elephant. But since the grown-ups were not able to understand it, I made another drawing: I drew the inside of the boa constrictor, so that the grown-ups could see it clearly. They always need to have things explained. My Drawing Number Two looked like this:"
];
