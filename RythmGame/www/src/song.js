var SongBuffer = function()
{
    this.lBuffer = [];
    this.rBuffer = [];
   
    this.parse=function(err,txt)
    {
        this.lBuffer = [];
        this.rBuffer = [];
        if(txt)
        {
            var dat = txt.split("\n");
            for(var line in dat)
            {
                var token = dat[line].split(' ');
                if(token[0] == 'R')
                {
                    
                    this.rBuffer.push({down:parseFloat(token[1]),up:parseFloat(token[2]), isRightSide:true});             
                }
                else if(token[0]=='L')
                {
                    this.lBuffer.push({down:parseFloat(token[1]),up:parseFloat(token[2]), isRightSide:false});
                }
                
            }
        }

    };
    this.load=function(file)
    {
        cc.loader.loadTxt(file,this.parse.bind(this));
    };
    
};
