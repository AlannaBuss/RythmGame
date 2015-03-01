
var TapNode = cc.Sprite.extend({
    downBeat:0,
    upBeat:0,
    rightSide:false,
    _parentLayer:null,
    _addedToScene:false,
    _beatTick:0,
    _tappedDown:false,
    _tappedUp:false,
    _isHold:false,
    _progressNode:null,
    _progressHolder:null,
    _progressSprite:null,
    _active:true,
    ctor:function(noteInfo, parentLayer)
    {
        this._super(asset.White_png);
        this.attr({
            x: cc.winSize.width / 4 ,
            y: cc.winSize.height + cc.winSize.height*1/6
        });        
        if(noteInfo.isRightSide === true)
        {
            this.rightSide=true;
            this.attr({x:cc.winSize.width*3/4});
        }
        this.downBeat = noteInfo.down;
        this.upBeat = noteInfo.up;
        if(this.upBeat - this.downBeat > 1)
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
                this._progressNode.setScale(0.1,0.1);
            }
            else
            {
                this._parentLayer.addChild(this);
            }
                this._addedToScene = true;
                
        }
        if(this._addedToScene)
        {
            if(!this._tappedDown || (this._beatTick < this.downBeat || 
               this._beatTick > this.upBeat))
            {
                
                this.y = (cc.winSize.height  * (this.downBeat - this._beatTick) + cc.winSize.height/6);
            }
            else
            {
                var percent = 0.9 * (this._beatTick - this.downBeat) / (this.upBeat - this.downBeat);
                
                this.y = cc.winSize.height/6;
                if(this._isHold === true)
                {
                    this._progressNode.setScaleX(percent + 0.1);
                    this._progressNode.setScaleY(percent + 0.1);
                }
            }
            if(this.y < -cc.winSize.height)
            {
               //this.remove();
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
        var score = -1;
        //console.log("Checking.. " + this._active + " "  + this._tappedDown + " " + Math.abs(this.downBeat - beat));
        if(this._active && !this._tappedDown && Math.abs(this.downBeat - beat) < 1/4.0)
        {

            this._tappedDown = true;
            var goodTiming = 1/8.0;
            var greatTiming = 1/16.0;
            score = 0;
            if(Math.abs(this.downBeat - beat) < greatTiming)
            {

                score = 2;
            }
            else if(Math.abs(this.downBeat - beat) < goodTiming)
            {
                score = 1;
            }
            if(!this._isHold)
            {
                this.remove();
            }
        }
        return score;
    },
    tapUp:function(beat)
    {
        if(this._active && !this._tappedDown)
        {
            return -1;
        }
        var goodTiming = 1/8.0;
        var greatTiming = 1/16.0;
        var score = 0;
        if(!this._tappedUp && Math.abs(this.upBeat - beat) < greatTiming)
        {
      
            score = 2;
        }
        else if(!this._tappedUp && Math.abs(this.upBeat - beat) < goodTiming)
        {
            score = 1;
        }
        this.remove();
        this._tappedUp = true;
        return score;   
    },
    remove:function()
    {
        if(this._active)
        {
            var fadeAction = new cc.Spawn(
                cc.fadeTo(0.15, 0),
                cc.scaleTo(0.15,1.5)
            );
            this.scheduleOnce(this._removeFromParent,0.35);
            this.runAction(fadeAction);
            
            this._active = false;
        }
        return true;
    },
    _removeFromParent:function()
    {
        this.cleanup();
        
        if(this._isHold)
        {
                    
            this._progressHolder.removeFromParent();
            this._progressNode.removeFromParent();
                   
        }
        this.removeFromParent();
           
    }
    
    
                           
});
//Score constants:
//0 = miss
//1 == Good
//2 == WONDERFUL
