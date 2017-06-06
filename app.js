var express = require('express');
var fs = require('fs');
var app = express();
var request = require('request');
var zlib = require('zlib');

var filename = "/posts.json.gz";

// var url = "http://post1.unzipper2.cf" + filename;
var url = "http://post2.unzipper2.cf/new_posts.json.gz";

app.use('/public', express.static(__dirname + '/public'));

app.locals = ({
  title: 'Unzipper 2'
});

app.all('*', function(req, res, next){
  request({
    method: 'GET',
    uri: url,
    gzip: true
  }, function(error, response, body) {
    if(error) {
      console.log("Couldn't retrieve JSON: " + error);
    } else {
      res.locals.posts = JSON.parse(body);
      next();
    }
  });
});

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/post/:slug', function(req, res, next){
  res.locals.posts.forEach(function(post){
    if (req.params.slug === post.slug){
      res.render('post.ejs', { post: post });
    }
  })
});

app.get('/api/posts', function(req, res){
  res.json(res.locals.posts);
});

app.listen(3000);
console.log('app is listening at localhost:3000');
