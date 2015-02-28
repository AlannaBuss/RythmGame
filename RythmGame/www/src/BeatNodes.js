
var TapNode = cc.Sprite.extend({
    downBeat:0,
    upBeat:0,
    _parentLayer:null,
    _addedToScene:false,
    _beatTick:0,
    _tappedDown:false,
    _tappedUp:false,
    ctor:function(noteInfo, parentLayer)
    {
        this._super(asset.White_png);
        this.attr({
            x: cc.winSize.width / 4,
            y: cc.winSize.height + cc.winSize.height+1/6
        });        
        this.downBeat = noteInfo.down;
        this.upBeat = noteInfo.up;
        this._parentLayer = parentLayer;
    },
    updateBeat:function(dBeat)
    {
        this._beatTick += dBeat;
        if(this._beatTick + 1 > this.downBeat && !this._addedToScene)
        {
            
            this._parentLayer.addChild(this);
            this._addedToScene = true;
            
        }
        if(this._addedToScene)
        {
            if(this._beatTick < this.downBeat || 
               this._beatTick > this.upBeat)
            {
                
                this.y = (cc.winSize.height/4 * this.  );
            }
            if(this.y < -cc.winSize.height)
            {
                this.removeFromParent();
                return true;
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
