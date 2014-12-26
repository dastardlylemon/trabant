var util = require('util');
var fs = require('fs');
var readline = require('readline');
var request = require('request');
var cheerio = require('cheerio');

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('> ');

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var verifyInput = function(pred, callback) {
  rl.question('> ', function(answer) {
    if (pred(answer)) {
      rl.pause();
      callback(answer);
    } else {
      verifyInput(pred, callback);
    }
  });
}

var setClass = function() {
  request(
    'http://www.registrar.ucla.edu/schedule/schedulehome.aspx',
    function(error, response, body) {
      if (!error && response.statusCode == 200) { // page loaded, good to go
        util.puts('WELCOME TO TRABANT');
        util.puts('------------------');
        util.puts('Select a term:');

        $ = cheerio.load(body);
        var t_obj = $('#ctl00_BodyContentPlaceHolder_SOCmain_lstTermDisp').children();
        var t_codes = [];
        var terms = t_obj.map(function(i, el) {
          t_codes.push($(this).val());
          return (i + 1) + '. ' + $(this).text();
        })

        for (var i = 0; i < t_obj.length; i++) {
          util.puts(terms[i]);
        }

        verifyInput(isNumber, function(answer) {
          console.log(answer);
        });

      } else {
        util.error('Failed to fetch registrar!');
      }
    }
  );
}

// argument parsing
var args = process.argv.slice(2);
if (args.indexOf('-s') >= 0 || args.indexOf('--setup') >= 0) {
  setClass();
} else if (args.length > 0) {
  util.error('Unrecognized flag');
}


