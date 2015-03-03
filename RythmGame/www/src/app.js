
var SongLayer = cc.Layer.extend({
    LeftBox:null,
    RightBox: null,
    leftCheckLabel:null,
    rightCheckLabel:null,
    scoreLabel:null,
    comboLabel:null,
    score:0,
    leftScore:0,
    rightScore:0,
    beats:[],
    bpm:130,
    barSprite:null,
    combo:0,
    currentBeat:0,
    leftStartHold:0,
    rightStartHold:0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

       
        
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
        
        this.scheduleOnce(this.startGame,3);
       
        
        
        //1 second * (130/60 seconds/beat
        //Load beats
      
  
        var buf = g_songs[0].lBuffer.concat(g_songs[0].rBuffer);
        
        for(var beat in buf)
        {
            var info = buf[beat];
            this.beats.push(new TapNode(info,this));
        }
        
        //Label for the left side
        this.leftCheckLabel = new LeftUpdate();
        this.addChild(this.leftCheckLabel, 5);
        
        //Label for the right side
        this.rightCheckLabel = new RightUpdate();
        this.addChild(this.rightCheckLabel, 5);
        
        //Score Label
        this.scoreLabel = new ScoreLabel();
        this.addChild(this.scoreLabel, 5);

        this.comboLabel = new ComboLabel();
        this.addChild(this.comboLabel, 5);        
        
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
        this.barSprite = new cc.Sprite(asset.Bar_png);
        this.barSprite.attr({x:cc.winSize.width/2,  y:cc.winSize.height/6});
        this.addChild(this.barSprite);
        
        
        return true;
    },
    
    update:function(dt)
    {
        if(this.currentBeat/4 < 1.0)
        {
            cc.audioEngine.setMusicVolume(this.currentBeat/4);
        }
        this.currentBeat += dt*this.bpm/60.0;
        
        for(var aBeat in this.beats)
        {
            
            if(this.beats[aBeat]._active)
            {
                (this.beats[aBeat].updateBeat(this.currentBeat));
                if(this.beats[aBeat].upBeat + 1 < this.currentBeat)
                {
                    if(this.beats[aBeat].rightSide === true)
                    {
                        this.rightCheckLabel.processAction(0);
                        this.combo = 0;
                        this.comboLabel.updateScore(this.combo);
                    }
                    else
                    {
                        this.leftCheckLabel.processAction(0);
                        this.combo = 0;
                        this.comboLabel.updateScore(this.combo);
                    }
                    
                    this.beats[aBeat].remove();
                }
                
            }
        }
            
    },
    startGame:function()
    {
        this.song = new Song({
        url:asset.Oroborous_ogg, bpm:130});
        this.song.play();
        this.scheduleUpdate();
    },
    checkDownTouches:function (side)
    {
        var res = -1;
        for(var aBeat in this.beats)
        {
            if((this.beats[aBeat].rightSide && side == 'R') || 
               (!this.beats[aBeat].rightSide && side == 'L'))
            res = this.beats[aBeat].tapDown(this.currentBeat);
            if(res !== -1)
            {
                console.log(res);
                return res;
            }
        }
        return res;
    },
    checkUpTouches:function (side)
    {
             
        var res = -1;
        for(var aBeat in this.beats)
        {
            var isActive = this.beats[aBeat]._active;
            var isHold = this.beats[aBeat]._isHold;
            if(this.beats[aBeat]._active && 
              (this.beats[aBeat]._isHold &&
               ((this.beats[aBeat].rightSide && side == 'R') || 
               (!this.beats[aBeat].rightSide &&  side == 'L'))))
            {
                res = this.beats[aBeat].tapUp(this.currentBeat);
                if(res != -1)
                {
                    return res;
                }
            }
        }
        return res;
    },
    //Checking for touches
    processBeginEvent: function(event) {

        var status = -1;
        //Check Left
        if(this.LeftBox.checkDidTouch(event.getLocation())){
            status = this.checkDownTouches('L');
            this.leftCheckLabel.processAction(status);
            this.leftStartHold = this.currentBeat;
        //Check Right
        }else if(this.RightBox.checkDidTouch(event.getLocation())){
            status = this.checkDownTouches('R');
            this.rightCheckLabel.processAction(status);
            this.rightStartHold = this.currentBeat;
        }
        
        //Combo stuff
        if(status>0){
            this.combo++;
        }else if(status != -1) {
            this.combo = 0;
        }
        this.comboLabel.updateScore(this.combo);
        this.score += this.scoreLabel.morePoints(status);
    },
    
    //Checking for end touches
    processEndEvent: function(event) {
        var status = -1;
        if(this.LeftBox.checkDidTouch(event.getLocation())){
            status=this.checkUpTouches("L");
            this.leftCheckLabel.processAction(status);
            //console.log("L " + this.leftStartHold + " " + this.currentBeat);
        }
        else if(this.RightBox.checkDidTouch(event.getLocation())){
            status = this.checkUpTouches("R");
            this.rightCheckLabel.processAction(status);
            //console.log("R " + this.rightStartHold + " " + this.currentBeat);
        }
        this.score += this.scoreLabel.morePoints(status);
        if(status === 0){
            this.combo = 0;
        }
        this.scoreLabel.updateScore(this.score);
    },
    restartGame:function(event)
    {
        var scene=new cc.Scene();
        scene.addChild(new startLayer());
        cc.director.runScene(new cc.TransitionFade(1.2,scene));    
    }
    
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SongLayer();
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
    },
    
    morePoints: function(score){
        console.log(score);
        if(score === 0 || score == -1){
            return 0;
        }else if (score == 1){
            return 15;
        }else{
            return 20;
        }
        
    }
});

var ComboLabel = cc.LabelTTF.extend({
    ctor:function(){
        this._super("x0", "Arial", 38);
        this.x = cc.winSize.width / 2;
        this.y = cc.winSize.height / 2;
    },
    
    updateScore: function(combo){
        this.setString("x" + combo);
    }
});

var LeftUpdate = cc.LabelTTF.extend({
    ctor:function(){
        this._super("", "Arial", 38);
        this.x = 3 * cc.winSize.width / 4;
        this.y = cc.winSize.height / 2;
    },
    processAction:function(number){
        if(number !== -1)
        {
            this.x = cc.winSize.width / 4;
            this.y = cc.winSize.height / 2;
            if(number === 0 || number == -1){
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
        }
        
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
        if(number !== -1)
        {
            this.x = 3 * cc.winSize.width / 4;
            this.y = cc.winSize.height / 2;
            if(number === 0 || number == -1){
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
        }
        
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
        this._super("Now Playing\nOuroboros\nKevin Macleod", "Arial", 38);
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

        
var Ready = cc.Sprite.extend({
    ctor:function(arg) {
        this._super(asset.ReadyScreen_png);
        this.attr({
            x : cc.winSize.width / 2,
            y : cc.winSize.height / 2,
            scale: 1
        });
    }
});

var Go = cc.Sprite.extend({
    ctor:function(arg) {
        this._super(asset.GoScreen_png);
        this.attr({
            x : cc.winSize.width / 2,
            y : cc.winSize.height / 2,
            scale: 1
        });
    }
});
