if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var client = require("redis").createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
    console.log('using cloud');
} else {
    var client = require("redis").createClient();
    console.log('using local');
}


exports.home=function(req,res){
  res.render('index',{title: 'Short_url'});
};
// make unique id for long_url
exports.ShortURL=function(req,res){
  var long_url=req.body.long_url;
  var id=makeid();

  client.get(id,function(err,data){
    // check if key exists
      if (err) {
          res.status(500).send({'message': err});
      } else {
          if (data === null) {
              // key does not exists
              client.mset([
                  id, long_url,
                  id+'-created', new Date().getTime()
                  ], function(arr, set_res) {console.log(set_res);});

              res.status(201).send({
                    'short_id': id,
                    'short_url': req.protocol + "://" + req.get('host') + '/' + id,
                    'long_url': long_url
                });
          }
          else{
            ShortURl();
          }
        }
  });
};

//redirect page
exports.SearchURL=function(req,res){
  var id;
  if(req.body.short_url){
    var dd=req.body.short_url.split("8000/");
    id=dd[1];
    console.log("idddd"+id);
  }
  if(req.params.info){
    id=req.params.info;
  }

  client.get(id,function(err,data){
    if(err){
        res.status(500).send({'message': err});
    }
    else{
      if(data === null){
        res.status(404).send({'message':'not found long url'});
      }
      else{
        res.redirect(data);
      }
    }
  });
};

var makeid=function(){
  var tt="";
  var stringg="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  for(var i=0;i<2;i++){
    tt += stringg.charAt(Math.floor(Math.random()*stringg.length));
  }
  return tt;
};
