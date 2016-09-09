# Scraper example with nodeJS on [Hera website](http://www.gruppohera.it/statico/bologna/db_pulizia_strade.php)

## Installation
1. Download or clone the rep
2. Run `npm install`

## Using
1. Run `npm start`
2. Open your browser: `http://localhost:8080/via/:id?pretty=1&file=1` where `id` represent the identification number given to the "via" by Hera
```
  //Example call
  // id:     786
  // pretty: true

  http://localhost:8080/via/786?pretty=1
```
3. Go to your CLI and check ok message
4. If parameter `file` has been set to `1` a new file named `output.json` should be created  in your project folder with this content

### Response example calling `http://localhost:8080/id/786?pretty=1`
```
{
    "via": "ACRI (VIA)",
    "data": [
        "Il terzo Mercoledì del mese da Largo Trombetti a via dei Bibiena"
    ]
}
```

### Extra parameters
- pretty [optional - default: false]: prettify json
- file [optional - default: false]: write file output.json

## Working example on Heroku
https://hera-bot.herokuapp.com/id/786?pretty=1

## Working example menu
You must be running node in your local machine to make it work
<ul>
  <li><a href='http://localhost:5000/schema?pretty=1'>Schema</a></li>
  <li><a href='http://localhost:5000/id/786?pretty=1'>Example "via 786"</a></li>
  <li><a href='http://localhost:5000/name/reno?pretty=1'>Example "via Riva Reno"</a></li>
  <!-- <li><a href='http://localhost:5000/id/?all=1'>All</a></li> -->
</ul>


## A NOTE ON WEB SCRAPING
Web scraping falls within a gray area of the law. Scraping data for personal use within limits is generally ok but you should always get permission from the website owner before doing so. This example here is very minimalistic in a sense (one request to Hera) so that it does not interfere with Hera’s operations. <strong>Please scrape responsibly.</strong>

## Credits
Inspired on a [scotch.io tutorial](https://scotch.io/tutorials/scraping-the-web-with-node-js) by [Ado Kukic](https://github.com/kukicado)
