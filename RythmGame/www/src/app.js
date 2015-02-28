
var HelloWorldLayer = cc.Layer.extend({
    LeftBox:null,
    RightBox: null,
    leftCheckLabel:null,
    rightCheckLabel:null,
    scoreLabel:null,
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
        var songLabel = new SongTitle();
        // position the label on the center of the screen
        // add the label as a child to this layer
        this.addChild(songLabel, 5);

        // add Left box for checking
        this.LeftBox = new Left();
        this.addChild(this.LeftBox, 0);
        
        // add right box for checking
        this.RightBox = new Right();
        this.addChild(this.RightBox, 0);

        songLabel.moveToTop();
        
        
        this.song = new Song({url:asset.Oroborous_ogg, bpm:130});
        this.song.play();
        //1 second * (130/60 seconds/beat
        //this.schedule(this.logBeat, 1*(130.0/(60.0*8)));
        
        
        //Label for the left side
        this.leftCheckLabel = new LeftUpdate();
        this.addChild(this.leftCheckLabel, 5);
        
        //Label for the right side
        this.rightCheckLabel = new RightUpdate();
        this.addChild(this.rightCheckLabel, 5);
        
        //Score Label
        this.scoreLabel = new ScoreLabel();
        this.addChild(this.scoreLabel, 5);
        
        
        //Checks for "touches" copied from HYPERLOOP
        if (cc.sys.capabilities.hasOwnProperty('touches')) {
        cc.eventManager.addListener({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function (touches, event) {
                //Touch ends
                 for(var touch in touches){
                    event.getCurrentTarget().processEndEvent(touches[0]);
                  }
            },
            onTouchesBegan:function(touches, event){
                //New added in to make it so you can check multiple clicks at the same time.   
                for(var touch in touches){
                    event.getCurrentTarget().processBeginEvent(touches[0]);
                  }
            }
            }, this);
        }
        return true;
    },
    
    //Checking for touches
    processBeginEvent: function(event) {
        //Check Left
        if(this.LeftBox.checkDidTouch(event.getLocation())){
            this.leftCheckLabel.processAction(3);
        //Check Right
        }else if(this.RightBox.checkDidTouch(event.getLocation())){
            this.rightCheckLabel.processAction(3);
        }
    },
    
    //Checking for end touches
    processEndEvent: function(event) {
        if(this.LeftBox.checkDidTouch(event.getLocation())){
            this.leftCheckLabel.processAction(3);
        }
        else if(this.RightBox.checkDidTouch(event.getLocation())){
            this.rightCheckLabel.processAction(3);
        }
        this.scoreLabel.updateScore(this.score);
    }
    
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var ScoreLabel = cc.LabelTTF.extend({
    ctor:function(){
        this._super("0", "Arial", 25);
        this.x = cc.winSize.width / 2;
        this.y = cc.winSize.height - 40;
    },
    
    updateScore:function(score){
        this.setString("" + score);
    }
});

var LeftUpdate = cc.LabelTTF.extend({
    ctor:function(){
        this._super("", "Arial", 38);
        this.x = 3 * cc.winSize.width / 4;
        this.y = cc.winSize.height / 2;
    },
    processAction:function(number){
        this.x = cc.winSize.width / 4;
        this.y = cc.winSize.height / 2;
        if(number === 0){
            this.setString("Miss");
        }else if(number == 1){
            this.setString("Good");
        }else{
            this.setString("Perfect");
        }
         var colorChange = 
            cc.spawn(
                cc.tintTo(0, 255, 255, 255)
            );
        this.runAction(colorChange);
        this.show();
        this.scheduleOnce(this.move, colorChange.getDuration());
        
    },
    move:function(){
       
        var movement = 
            cc.spawn(
                cc.moveBy(0.5, cc.p(0, 40)),
                cc.tintTo(0.5, 0, 0, 0)
            );
        this.runAction(movement);
        this.scheduleOnce(this.hide, movement.getDuration());
    },
    
    hide:function()
    {
        this.setVisible(false);
    },
    show:function(){
        this.setVisible(true);
    }

});

var RightUpdate = cc.LabelTTF.extend({
    ctor:function(){
        this._super("", "Arial", 38);
        this.x = 3 * cc.winSize.width / 4;
        this.y = cc.winSize.height / 2;
    },
    processAction:function(number){
        this.x = 3 * cc.winSize.width / 4;
        this.y = cc.winSize.height / 2;
        if(number === 0){
            this.setString("Miss");
        }else if(number == 1){
            this.setString("Good");
        }else{
            this.setString("Perfect");
        }
         var colorChange = 
            cc.spawn(
                cc.tintTo(0, 255, 255, 255)
            );
        this.runAction(colorChange);
        this.show();
        this.scheduleOnce(this.move, colorChange.getDuration());
        
    },
    move:function(){
       
        var movement = 
            cc.spawn(
                cc.moveBy(0.5, cc.p(0, 40)),
                cc.tintTo(0.5, 0, 0, 0)
            );
        this.runAction(movement);
        this.scheduleOnce(this.hide, movement.getDuration());
    },
    
    hide:function()
    {
        this.setVisible(false);
    },
    show:function(){
        this.setVisible(true);
    }

});

var SongTitle = cc.LabelTTF.extend({
    ctor:function() {
        this._super("Ouroboros", "Arial", 38);
        this.x = cc.winSize.width / 2;
        this.y = 0;
    },
    
    moveToTop:function(){
        var movement = 
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, cc.winSize.height - 40)),
                cc.tintTo(2.5,255,125,0)
                
            );
        this.runAction(movement);
        this.scheduleOnce(this.hide,movement.getDuration());
        
    },
    
    hide:function()
    {
        this.setVisible(false);
    }
});

var Right = cc.Sprite.extend({
    checkDidTouch:function(touch) {
        var loc = touch;
        if(loc.x > cc.winSize.width / 2  && loc.y < cc.winSize.height / 2){
            return true;
        }
        return false;
    }
});

var Left = cc.Sprite.extend({
    checkDidTouch:function(touch) {
        var loc = touch;
        if(loc.x < cc.winSize.width / 2  && loc.y < cc.winSize.height / 2){
            return true;
        }
        return false;
    }
});

var Song = function(info){
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

        


