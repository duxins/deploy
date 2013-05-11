var http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    port = process.env.PORT?process.env.PORT:3000;

var server = http.createServer(function(req, res){
  res.end();
}).listen(port)

console.log('Server has started at port ' + port);