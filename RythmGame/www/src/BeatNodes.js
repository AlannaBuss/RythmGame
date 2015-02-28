
var TapNode = cc.Sprite.extend({
    downBeat:0,
    upBeat:0,
    _parentLayer:null,
    _addedToScene:false,
    _beatTick:0,
    _tappedDown:false,
    _tappedUp:false,
    _isHold:false,
    _progressNode:null,
    _progressHolder:null,
    _progressSprite:null,
    ctor:function(noteInfo, parentLayer)
    {
        this._super(asset.White_png);
        this.attr({
            x: cc.winSize.width / 4 ,
            y: cc.winSize.height + cc.winSize.height*1/6
        });        
        if(noteInfo.isRightSide === true)
        {
            this.attr({x:cc.winSize.width*3/4});
        }
        this.downBeat = noteInfo.down;
        this.upBeat = noteInfo.up;
        if(this.upBeat - this.downBeat > 1/32.0)
        {
            this._isHold = true;
            this._progressHolder = new cc.Sprite(asset.White_empty);
            this._progressNode = new cc.Sprite(asset.White_full);
  

        }
        this._parentLayer = parentLayer;
    },
    updateBeat:function(beatTick)
    {
        this._beatTick = beatTick;
        if(this._beatTick + 1 > this.downBeat && !this._addedToScene)
        {
            
            this._parentLayer.addChild(this);
            if(this._isHold){
                this._parentLayer.addChild(this._progressNode);
                this._parentLayer.addChild(this._progressHolder);
                this._progressNode.attr({
                    x: this.x,
                        y: cc.winSize.height + cc.winSize.height*1/6
                });
                 this._progressHolder.attr({
                    x: this.x,
                    y: cc.winSize.height + cc.winSize.height*1/6
                });
                this._progressNode.setScale(0,0);
            }
                this._addedToScene = true;
                
        }
        if(this._addedToScene)
        {
            if(this._beatTick < this.downBeat || 
               this._beatTick > this.upBeat)
            {
                
                this.y = (cc.winSize.height  * (this.downBeat - this._beatTick) + cc.winSize.height/6);
            }
            else
            {
                var percent = (this._beatTick - this.downBeat) / (this.upBeat - this.downBeat);
                console.log(percent);
                
                this.y = cc.winSize.height/6;
                if(this._isHold == true)
                {
                    this._progressNode.setScaleX(percent);
                    this._progressNode.setScaleY(percent);
                }
            }
            if(this.y < -cc.winSize.height)
            {
                if(this._isHold)
                {
                    
                    this._progressHolder.removeFromParent();
                    this._progressNode.removeFromParent();
                   
                }
                this.removeFromParent();
                return true;
            }
            if(this._isHold)
            {
                this._progressNode.y = this.y;
                this._progressHolder.y = this.y;
            }
        }
    
        
        
    },
    
    tapDown:function(beat)
    {
    
        this._tappedDown = true;
        var goodTiming = 1/8.0;
        var greatTiming = 1/16.0;
        var score = 0;
        if(Math.abs(this.downBeat - beat) < greatTiming)
        {
      
            score = 2;
        }
        else if(Math.abs(this.downBeat - beat) < goodTiming)
        {
            score = 1;
        }
        return score;
    },
    tapUp:function(beat)
    {
        var goodTiming = 1/8.0;
        var greatTiming = 1/16.0;
        var score = 0;
        if(this._tappedDown && !this._tappedUp && Math.abs(this.upBeat - beat) < greatTiming)
        {
      
            score = 2;
        }
        else if(Math.abs(this.upBeat - beat) < goodTiming)
        {
            score = 1;
        }
        this._tappedUp = true;
        return score;   
    }
    
    
                           
});
//Score constants:
//0 = miss
//1 == Good
//2 == WONDERFUL
