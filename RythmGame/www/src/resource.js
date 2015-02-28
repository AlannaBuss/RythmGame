var asset = {
    HelloWorld_png : "asset/HelloWorld.png",
    CloseNormal_png : "asset/CloseNormal.png",
    Circle_png : "asset/circleSprite.png",
    CloseSelected_png : "asset/CloseSelected.png",
    White_png :"asset/White.png",
    Bar_png : "asset/Bar.png",
    Oroborous_ogg :"asset/Ouroboros.mp3"
  
};

var songs = {
    Oroborus_file: "asset/testSongInput.txt"
};

var g_resources = [];
for (var i in asset) {
    g_resources.push(asset[i]);
}
var g_songs = [];
for(var song in songs)
{
    var newSong = new SongBuffer();
    newSong.load(songs[song]);
    g_songs.push(newSong);
}
