var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var path    = require('path');
var marked = require('marked');

var output;
var url = 'http://www.gruppohera.it/statico/bologna/db_pulizia_strade.php';

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  //res.sendFile(path.join(__dirname, 'menu.html'));
  fs.readFile(path.join(__dirname, 'README.md'), 'utf8', (err, data) => {
    if (err) throw err;
      console.log(data);
      res.send(marked(data));
    });
})

//get schema
app.get('/schema', function(req, res){

  request(url, function(error, response, html){
    if(!error){
      var json = [];
      var $ = cheerio.load(html);

      $("select#via").filter(function(){
        $(this).children().slice(1).each(function(){

          id = $(this).attr("value");
          via = $(this).text().trim();

          json.push({
            id: id,
            via: via,
          });
        });
      })

    } else {
      json = {"error": error}
      // Return message to browser
      res.setHeader('Content-Type', 'application/json');
      res.send(output);
    }

    print_and_send(res, json, req.query.pretty, req.query.file);
  })
})

//get by id
app.get('/id/:id', function(req, res){
  requestById(res, req, req.params.id);
})

//get by name
app.get('/name/:name', function(req, res){

  request(url, function(error, response, html){
    if(!error){
      var schema = [];
      var $ = cheerio.load(html);

      $("select#via").filter(function(){
        $(this).children().slice(1).each(function(){

          id = $(this).attr("value");
          via = $(this).text().trim();

          schema.push({
            id: id,
            via: via,
          });
        });
      });

      target = req.params.name.toUpperCase()

      for (var i = 0; i < schema.length; i++) {
        if (schema[i].via.indexOf(target) !== -1) {
          var json = {id: schema[i].id, via: schema[i].via};
          break;
        }
      }
      if (json) {
        requestById(res, req, json.id);
      }else {
        error("Via non trovata")
      }

    } else {
      error(error);
    }
  })
})

// app.listen('8080')
// console.log('Magic happens on port 8080: Open http://localhost:8080/via/786 in your browser');
// exports = module.exports = app;

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'), '. Open browser in http://localhost:5000');
})

function print_and_send(res, output, pretty, file){

  //pretty or not
  output = pretty ? JSON.stringify(output, null, 4) : JSON.stringify(output);

  // Print file
  if (file) {
    fs.writeFile('output.json', output, function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })
  }

  // Return message to browser
  res.setHeader('Content-Type', 'application/json');
  res.send(output);
}

function requestById(res, req, id) {

  this_url = url + '?via=' + id;

  request(this_url, function(error, response, html){
    if(!error){

      var $ = cheerio.load(html);
      var json = {via: "", data: []};

      $(".selezionato").filter(function(){
        var data = $(this).children().first();
        json.via = data.text().trim();
      })

      $("ul").filter(function(){
        $(this).children().each(function(){
          data = $(this).text().trim();
          data = data.replace('�','ì');
          data = data.replace('mese','mese ');
          json.data.push(data);
        })
      })

    } else {
      error(error);
    }

    print_and_send(res, json, req.query.pretty, req.query.file);

  })
}

function error() {
  json = {"error": error}
  // Return message to browser
  res.setHeader('Content-Type', 'application/json');
  res.send(output);
}
