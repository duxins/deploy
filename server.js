var http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    port = process.env.PORT?process.env.PORT:3000,
    app = {},
    routes = {
      'POST': {},
      'GET' : {}
    };

app.post = function(pathname, handler){
  routes.POST[pathname] = handler;
};

app.get = function(pathname, handler){
  routes.GET[pathname] = handler;
};

http.createServer(function(req, res){
  req.pathname = url.parse(req.url).pathname;
  req.query = querystring.parse(url.parse(req.url).query);
  req.rawBody = '';

  req.on('data', function(chunk){
    req.rawBody += chunk;
  });

  req.on('end', function(){
    var httpHandler;
    if(routes[req.method] && routes[req.method][req.pathname]){
      httpHandler = routes[req.method][req.pathname];
      httpHandler(req, res);
    }else{
      res.writeHeader(404, {"Content-Type": "text/plain"});
      res.end();
    }
  });

}).listen(port);

console.log('Server has started at port ' + port);

