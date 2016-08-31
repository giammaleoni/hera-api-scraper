var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var output;
var url = 'http://www.gruppohera.it/statico/bologna/db_pulizia_strade.php';

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  res.send("<ul><li><a href='http://localhost:5000/schema?pretty=1'>Schema</a></li><li><a href='http://localhost:5000/id/786?pretty=1'>Esempio via 786</a></li><li><a href='http://localhost:5000/id/?all=1'>All</a></li></ul>");
})

//get schema
app.get('/schema', function(req, res){

  request(url, function(error, response, html){
    if(!error){
      var json =[];
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

      output = req.query.pretty ? JSON.stringify(json, null, 4) : JSON.stringify(json);
    } else {
      output = {"error": error}
    }

    // Print file
    if (req.query.file) {
      fs.writeFile('output.json', output, function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
      })
    }

    // Return message to browser
    res.setHeader('Content-Type', 'application/json');
    res.send(output);
  })

})

//get by id
app.get('/id/:id', function(req, res){

  if (req.params.id) {
    url += '?via=' + req.params.id;
  }

  //?pretty=1 or ?pretty=true --> pretty json
  //?file=1   or ?file=true     --> file output

  request(url, function(error, response, html){
    if(!error){
      var json = {via: "", data: []};
      var $ = cheerio.load(html);
      json = {via: "", data: []};

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

      output = req.query.pretty ? JSON.stringify(json, null, 4) : JSON.stringify(json);

    } else {
      output = {"error": error}
    }

    // Print file
    if (req.query.file) {
      fs.writeFile('output.json', output, function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
      })
    }

    // Return message to browser
    res.setHeader('Content-Type', 'application/json');
    res.send(output);

  })
})

// app.listen('8080')
// console.log('Magic happens on port 8080: Open http://localhost:8080/via/786 in your browser');
// exports = module.exports = app;

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'), '. Open browser in http://localhost:5000');
})
