var SongBuffer = function()
{
    this.lBuffer = [];
    this.rBuffer = [];
   
    this.parse=function(err,txt)
    {
        console.log(this);
        console.log(err);
        console.log(txt);
        this.lBuffer = [];
        this.rBuffer = [];
        if(txt)
        {
            var dat = txt.split("\n");
            console.log(dat);
            for(var line in dat)
            {
                console.log('yee ' + dat[line]);
                var token = dat[line].split(' ');
                console.log(token);
                if(token[0] == 'R')
                {
                    this.rBuffer.push({down:parseFloat(token[1]),up:parseFloat(token[2])});
                }
                else if(token[0]=='L')
                {
                    this.lBuffer.push({down:parseFloat(token[1]),up:parseFloat([2])});
                }
                
            }
        }
        console.log(this);

    };
    this.load=function(file)
    {
        console.log("At load: " + JSON.stringify(this));
        cc.loader.loadTxt(file,this.parse.bind(this));
    };
    
};
