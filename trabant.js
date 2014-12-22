var fs = require('fs');
var xml2js = require('xml2js');
var request = require('request');

// argument parsing
var args = process.argv.slice(2);
if (args.indexOf('-s') >= 0 || args.indexOf('--setup') >= 0) {
  console.log('setup mode');
} else if (args.length > 0) {
  console.log('invalid command');
}

request(
  'http://www.registrar.ucla.edu/schedule/schedulehome.aspx',
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
     // console.log(body);
    }
  }
);
