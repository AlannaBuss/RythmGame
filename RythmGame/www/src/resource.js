var asset = {
    HelloWorld_png : "asset/HelloWorld.png",
    CloseNormal_png : "asset/CloseNormal.png",
    Circle_png : "asset/circleSprite.png",
    CloseSelected_png : "asset/CloseSelected.png",
    Oroborous_ogg :"asset/Ouroboros.mp3"
};


var g_resources = [];
for (var i in asset) {
    g_resources.push(asset[i]);
}
