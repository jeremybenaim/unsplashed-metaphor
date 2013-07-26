// require modules, yo!
var request = require('request'),
    http = require('http'),
    fs = require('fs'),
    jsdom = require('jsdom');


// return an error 500 + log the error
function err500 (err, res) {
  console.log('\x1b[31merror w/ request\x1b[0m', err)
  res.statusCode=500;
  res.end();
}

http.createServer(function (req, res) {

  // serves the image
  if (req.url === '/random.jpg') {
    var url = 'http://unsplash.com/random';

    request({ uri: url }, function (error, response, body) {
      // handle request error
      if (error && response.statusCode !== 200) {
        return err500(error, res);
      }
      
      // scrape tumblr post to get img and pipe them to the response (u jelly, proxy?)
      jsdom.env({
        html: body,
        done : function (err, window) {
          url = window.document.querySelector('.photo_div img').src;
          request(url).pipe(res);
        }
      });
    });
  }

  // serves the page (and in this case, any page)
  else if (req.url[0] === '/') { // happens all the time duh, so that we don't have 404

    request( {url: 'http://metaphorpsum.com/paragraphs/1/1?p=true'}, function (error, response, body) {
      // handle request error
      if (error && response.statusCode !== 200) {
        return err500(error, res);
      }

      res.setHeader("Content-Type", "text/html");
      // send crystal clear html code, huh
      res.end('<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>words</title><meta http-equiv="cleartype" content="on"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0"><link href="http://fonts.googleapis.com/css?family=Roboto+Slab:100" rel="stylesheet" type="text/css"><style>*{-moz-box-sizing: border-box;box-sizing: border-box;}html,body{margin:0;padding:0;height:100%;}html{background:url(/random.jpg) center center no-repeat;background-size:cover;}body{-webkit-font-smoothing: antialiased;background:rgba(55,55,55,.8);display:table;width:100%;}p{cursor:pointer;padding:0 10%;margin:0;font: 100 55px "Roboto Slab", serif;color: white; letter-spacing:-.5px;text-shadow: 0 -1px 0 rgba(0,0,0,.6);display: table-cell;vertical-align: middle;text-align: center;}</style></head><body>'+body+'<script>(function(window, document){function reload(){window.location.reload()}document.querySelector("p").addEventListener("click", reload); window.addEventListener("keyup", function(e){ if(e.keyCode===32) reload()});})(window, document)</script></body></html>');
    });
  }
  // just in case I'd want to change the behiavour of routes, that would be the default page: 404
  else {
    res.statusCode=404;
    res.end();
  }

}).listen(1337, '0.0.0.0');
// and voila
console.log('Server running at http://0.0.0.0:1337/');