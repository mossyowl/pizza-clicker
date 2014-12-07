module.exports = function (db) {
  var message = require('./message')(db);
  var surprises = {};
    
  surprises.check = function (i) {
    if(surprises[i.toString()]) surprises[i.toString()](i);
  };
  
  surprises['10'] = function (i) {
    message.send('You are in a <br>pizza parlor.');
  };
  
  surprises['25'] = function (i) {
    message.send('A man lurks<br>at a nearby booth.');
  };
  
  surprises['50'] = function (i) {
    message.send('Your pizza tastes good.');
  };
  
  surprises['60'] = function (i) {
    message.send('But the man still lurks, <br>side-eyeing your pizza.');
  };
  
  surprises['100'] = function (i) {
    message.send('The man smacks his lips <br>as he eats his pizza.');
  };
  
  surprises['110'] = function (i) {
    message.send('The man smacks his lips <br>as he stares at your pizza.');
  };
  
  surprises['120'] = function (i) {
    message.send('You put your half-eaten slice <br>down on your plate.');
  };
  
  return surprises;
}

