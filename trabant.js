var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// argument parsing
var args = process.argv.slice(2);
if (args.indexOf('-s') >= 0 || args.indexOf('--setup') >= 0) {
  request(
    'http://www.registrar.ucla.edu/schedule/schedulehome.aspx',
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        console.log($('#ctl00_BodyContentPlaceHolder_SOCmain_lstTermDisp').children().length);
      }
    }
  );
} else if (args.length > 0) {
  console.log('invalid command');
}

