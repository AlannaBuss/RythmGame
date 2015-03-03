var asset = {
    HelloWorld_png : "asset/HelloWorld.png",
    White_png :"asset/White.png",
    Bar_png : "asset/bar.png",
    White_empty: "asset/WhiteEmpty.png",
    White_full: "asset/WhiteFull.png",
    Oroborous_ogg :"asset/Ouroboros.mp3",
    MenuScreen_png:"asset/intro.png",
    Retry_png:"asset/reset.png"
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
