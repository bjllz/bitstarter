var express = require('express');
var app = express();
var fs=require('fs');

app.use(express.logger());

var buf=new Buffer(fs.readFileSync('index.html'));

var message=buf.toString();
console.log(message);

app.get('/', function(request, response) {
	response.send(message);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
