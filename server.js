var express = require('express');

var app = express();

app.use(express.static('node_modules'));

app.use(express.static('public'));
app.get('/', function(request, response){
    console.log("Hello World");
  });

  app.listen(8000);