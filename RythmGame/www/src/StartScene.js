var StartLayer = cc.layer.extend({
    onEnter:function()
    {
        var sprite = cc.Sprite(asset.Intro_png);
        this.addChild(sprite);
        
    },
    startGame:function()
    {
        var scene =new cc.Scene();
        scene.addChild(new HelloWorldLayer());
        cc.director.runScene(new cc.TransitionFade(1.2,scene);     
    }
    
});
var StartScene = cc.scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
})



