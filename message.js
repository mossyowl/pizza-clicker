var dom = require('domquery');

module.exports = function (db) {
  var message = {
    el: dom('#message')
  };
  
  message.send = function (text) {
    db.put('message', text, function (err) {
      if (err) return console.error(err);
      message.el.html(text);
    })
  };
  
  message.reset = function () {
    db.put('message', '', function (err) {
      if (err) return console.error(err);
      message.el.html('');
    });
  };
  
  return message;
}