var util = require('util');
var fs = require('fs');
var readline = require('readline');
var request = require('request');
var table = require('easy-table');
var cheerio = require('cheerio');

var CONST_REG_URL = 'http://www.registrar.ucla.edu/schedule/schedulehome.aspx';
var CONST_SEARCH_URL = 'http://www.registrar.ucla.edu/schedule/crsredir.aspx?termsel=%s&subareasel=%s';

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
  var w_class = {};
  request(
    CONST_REG_URL,
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
        });

        for (var i = 0; i < t_obj.length; i++) {
          util.puts(terms[i]);
        }

        verifyInput(isNumber, function(answer) {
          if (answer > t_obj.length) {
            util.error('Invalid term number');
          } else {
            var term = t_codes[answer - 1];
            var s_obj = $('#ctl00_BodyContentPlaceHolder_SOCmain_lstSubjectArea').children();
            var s_codes = [];
            var subjects = s_obj.map(function(i, el) {
              s_codes.push($(this).val());
              return (i + 1) + '. ' + $(this).text();
            });

            // format the data so it's more readable
            // this can probably be optimized but whatever
            var t = new table;
            var s_table = [];
            for (var i = 0; i < s_obj.length; i += 3) {
              var row = {};
              if (subjects[i]) {
                row[0] = subjects[i];
              }
              if (subjects[i + 1]) {
                row[1] = subjects[i + 1];
              }
              if (subjects[i + 2]) {
                row[2] = subjects[i + 2];
              }
              s_table.push(row);
            }

            s_table.forEach(function(row) {
              t.cell('1', row[0]);
              t.cell('2', row[1]);
              t.cell('3', row[2]);
              t.newRow();
            });

            util.puts(t.print());

            verifyInput(isNumber, function(answer) {
              if (answer > s_obj.length) {
                util.error('Invalid subject number');
              } else {
                console.log(s_codes[answer - 1].split(' ').join('+'));
              }
            });
          }
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


