var level = require('levelup');
var leveljs = require('level-js');
var dom = require('domquery');

var db = level('pizza-clicker', { 
  db: leveljs, valueEncoding: 'json' 
});

var clicks = require('./clicks')(db);
var surprises = require('./surprises')(db);
var message = require('./message')(db);

start();

function start () {
  db.open(function () {
    listeners();
    
    clicks.get(function (err, val) {
      if (err || val === NaN) {
        db.put('clicks', 0, function (err) {
          if (err) return console.error(err);
        });
      }
      else if (val !== 0) clicks.el.html(val)
    });
    
    db.get('message', function (err, msg) {
      if (err || !msg) return;
      message.send(msg);
    });
  });
}

function listeners () {
  dom('#pizza').on('click', function (e) {
    clicks.add(1, function (err, value) {
      surprises.check(value);
    });
  });
  
  dom('#restart').on('click', function (e) {
    console.log('sure you want to lose your progress and restart?');
    restart();
  });
}

function restart () {
  clicks.reset();
  message.reset();
}