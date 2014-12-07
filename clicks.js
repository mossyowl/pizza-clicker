var dom = require('domquery');

module.exports = function (db) {
  var clicks = {
    el: dom('#clicks')
  };
  
  clicks.add = function (i, cb) {
    if (typeof i === 'function') {
      var cb = i;
      var i = 1;
    }
    
    db.get('clicks', function (err, value) {
      var count = value + i;
      db.put('clicks', count, function (err) {
        if (err) return cb(err);
        clicks.el.html(count)
        cb(null, count);
      });
    });
  };
  
  clicks.get = function (cb) {
    db.get('clicks', cb);
  };
  
  clicks.reset = function () {
    db.put('clicks', 0, function (err) {
      if (err) return console.error(err);
      clicks.el.html('');
    });
  };
  
  return clicks;
}


