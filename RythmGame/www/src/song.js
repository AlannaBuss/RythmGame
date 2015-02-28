var SongBuffer = function(file)
{
    this.lBuffer=null;
    this.rBuffer=null;
    cc.loader.loadTxt(file, function(err, txt)
    {
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
                    this.rBuffer.push({down:token[1],up:token[2]});
                }
                else if(token[0]=='L')
                {
                    this.lBuffer.push({down:token[1],up:token[2]});
                }
                
            }
        }
        
        console.log('Buffers are' + JSON.stringify(this.lBuffer) + ' ' + JSON.stringify(this.rBuffer));
    });
    
};