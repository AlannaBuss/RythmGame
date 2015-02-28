
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    song:null,
    debugLabel:null,
    leftCheckLabel:null,
    score:0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progassets. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            asset.CloseNormal_png,
            asset.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Ouroboros"
        // create and initialize a label
        var songLabel = new cc.LabelTTF("Ouroboros", "Arial", 38);
        // position the label on the center of the screen
        songLabel.x = size.width / 2;
        songLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(songLabel, 5);

        // add Notes
        this.sprite = new Notes();
        this.addChild(this.sprite, 0);

        // this.sprite.runAction(
        //    cc.sequence(
        //    cc.rotateTo(2, 0),
        //        cc.scaleTo(2, 1, 1)
        //    )
        //);
        songLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );
        this.song = new Song({url:asset.Oroborous_ogg, bpm:130});
        this.song.play();
        //1 second * (130/60 seconds/beat
        this.schedule(this.logBeat, 1*(130.0/(60.0*8)));
        
        
        //Label for the left side
        this.leftCheckLabel = new cc.LabelTTF("x0" , "Arial", 38);
        this.leftCheckLabel.x = size.width / 4;
        this.leftCheckLabel.y = size.height / 2;
        this.addChild(this.leftCheckLabel, 5);
        
        //Checks for "touches" copied from HYPERLOOP
        if (cc.sys.capabilities.hasOwnProperty('touches')) {
        cc.eventManager.addListener({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function (touches, event) {
                    var touch = touches[0];
                if (this.prevTouchId != touch.getID())
                    this.prevTouchId = touch.getID();
                else    
                    event.getCurrentTarget().processEvent(touches[0]);
            }
            }, this);
        }
        return true;
    },
    
    //Checking for left side touches
    processEvent: function(event) {
        if(this.sprite.checkDidTouch(event.getLocation())){
            this.score += 1;
        }
         this.score += 1;
        this.leftCheckLabel.setString("x" + this.score, "Arial", 38);
    }
    
    
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


var Notes = cc.Sprite.extend({
    ctor:function(arg) {
        this._super(asset.Circle_png);
         this.attr({
            x: cc.winSize.width / 4,
            y: cc.winSize.height / 2,
            scale: 1.5,
            rotation: 180
        });
    },
    checkDidTouch:function(touch) {
        var loc = touch;
        var bb = cc.winSize.width / 2;
        bb.y = cc.winSize.height;
        console.log(bb.x + ' ' + bb.y + ' ' + bb.width + ' ' + bb.height);
        console.log(touch.x + ' ' + touch.y);
        if(loc.x > bb.x && loc.x < bb.x + bb.width && loc.y > bb.y && loc.y < bb.y + bb.height){
            return true;
        }
        return false;
    }
});var Song = function(info){
    console.log(cc.audioEngine);
    this.songInfo = info;
    console.log(this.songInfo);
    cc.audioEngine.playMusic(info.url);
    cc.audioEngine.pauseMusic();

    this.songTime = function()
    {
        return cc.audioEngine._currMusic._context.currentTime;    
    };
    this.beat = function()
    {
        
        return this.songTime()/(this.songInfo.bpm/60.0);
    };
    this.play = function()
    {
        return cc.audioEngine.resumeMusic();
    };
    this.maxBeat = function()
    {
        return cc.audioEngine._currMusic._buffer.length / (this.songInfo.bpm/60.0);
    };
    
};

        


