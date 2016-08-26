var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var json = {via: "", data: []};
var output;

app.get('/via/:id', function(req, res){

  url = 'http://www.gruppohera.it/statico/bologna/db_pulizia_strade.php?via=' + req.params.id;

  //?pretty=1 or ?pretty=true --> pretty json
  //?file=1   or ?file=true     --> file output

  request(url, function(error, response, html){
    if(!error){
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

app.listen('8080')
console.log('Magic happens on port 8080: Open http://localhost:8080/via/786 in your browser');
exports = module.exports = app;
