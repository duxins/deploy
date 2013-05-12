var http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    spawn = require('child_process').spawn,
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

app.runShellCmd = function(cmd, args, opts, cb){
  var result = '';

  console.log(cmd + ' ' + args.join(' '));

  cb = cb || function(){};

  child = spawn(cmd,  args, opts);

  child.stdout.on('data', function(data){
    result += data.toString();
  });

  child.stderr.on('data', function(data){
    result += data.toString();
  });

  child.on('close', function(code){
    cb(code, result);
  });
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

app.post('/deploy', function(req, res){

  var project = req.query.project;
  if(!project){
    res.writeHeader(404, {"Content-Type": "text/plain"});
    res.end();
    return;
  }

  app.runShellCmd('node', ['deploy.js', '-p', project], {
    "cwd": __dirname
  },function(code, result){
    res.writeHeader(200, {"Content-Type": "text/plain"})
    res.write(result);
    res.end();
  })
})
