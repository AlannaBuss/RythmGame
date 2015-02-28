
var HelloWorldLayer = cc.Layer.extend({
    LeftBox:null,
    RightBox: null,
    leftCheckLabel:null,
    rightCheckLabel:null,
    leftScore:0,
    rightScore:0,
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

        // add Left box for checking
        this.LeftBox = new Left();
        this.addChild(this.LeftBox, 0);
        
        // add right box for checking
        this.RightBox = new Right();
        this.addChild(this.RightBox, 0);

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
        
        //Label for the left side
        this.leftCheckLabel = new cc.LabelTTF("x0" , "Arial", 38);
        this.leftCheckLabel.x = size.width / 4;
        this.leftCheckLabel.y = size.height / 2;
        this.addChild(this.leftCheckLabel, 5);
        
        //Label for the right side
        this.rightCheckLabel = new cc.LabelTTF("x0" , "Arial", 38);
        this.rightCheckLabel.x = 3 * size.width / 4;
        this.rightCheckLabel.y = size.height / 2;
        this.addChild(this.rightCheckLabel, 5);
        
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
        //Check Left
        if(this.LeftBox.checkDidTouch(event.getLocation())){
            this.leftScore += 1;
        //Check Right
        }else if(this.RightBox.checkDidTouch(event.getLocation())){
            this.rightScore += 1;
        }
        this.leftCheckLabel.setString("x" + this.leftScore, "Arial", 38);
        this.rightCheckLabel.setString("x" + this.rightScore, "Arial", 38);
    }
    
    
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
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
//    ctor:function(arg) {
//        this._super(asset.Circle_png);
//         this.attr({
//            x: cc.winSize.width / 4,
//            y: cc.winSize.height / 2,
//            scale: 1.5,
//            rotation: 180
//        });
//    },
    checkDidTouch:function(touch) {
        var loc = touch;
        if(loc.x < cc.winSize.width / 2  && loc.y < cc.winSize.height / 2){
            return true;
        }
        return false;
    }
});