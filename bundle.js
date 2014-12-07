(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/sethvincent/workspace/mossyowl/pizza-clicker/clicks.js":[function(require,module,exports){
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



},{"domquery":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/index.js":[function(require,module,exports){
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
},{"./clicks":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/clicks.js","./message":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/message.js","./surprises":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/surprises.js","domquery":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/index.js","level-js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/index.js","levelup":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/levelup.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/message.js":[function(require,module,exports){
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
},{"domquery":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/index.js":[function(require,module,exports){
var newElement = require("new-element");
var select = require("./lib/select");

module.exports = select;
module.exports.create = create;

function create (tag) {
  if (tag.charAt(0) == '<') { // html
    return select(newElement(tag));
  }

  return select(document.createElement(tag));
}

},{"./lib/select":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/select.js","new-element":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-element/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/attr.js":[function(require,module,exports){
module.exports = attr;

function attr (chain) {
  return function attr (element, name, value) {
    if (arguments.length == 2) {
      return element.getAttribute(name);
    }

    element.setAttribute(name, value);

    return chain;
  };
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/events.js":[function(require,module,exports){
var events = require("dom-event");
var delegate = require("component-delegate");
var keyEvent = require("key-event");
var trim = require("trim");

module.exports = {
  change: shortcut('change'),
  click: shortcut('click'),
  keydown: shortcut('keydown'),
  keyup: shortcut('keyup'),
  keypress: shortcut('keypress'),
  mousedown: shortcut('mousedown'),
  mouseover: shortcut('mouseover'),
  mouseup: shortcut('mouseup'),
  resize: shortcut('resize'),
  on: on,
  off: off,
  onKey: onKey,
  offKey: offKey
};

function shortcut (type){
  return function(element, callback){
    return on(element, type, callback);
  };
}

function off (element, event, selector, callback){
  if (arguments.length == 4) {
    return delegate.unbind(element, selector, event, callback);
  }

  callback = selector;

  events.off(element, event, callback);
}

function on (element, event, selector, callback){
  if (arguments.length == 3) {
    callback = selector;
  }

  if (arguments.length == 4) {
    return delegate.bind(element, selector, event, callback);
  }

  events.on(element, event, callback);
}

function onKey (element, key, callback) {
  keyEvent.on(element, key, callback);
}

function offKey (element, key, callback) {
  keyEvent.off(element, key, callback);
}

},{"component-delegate":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/component-delegate/index.js","dom-event":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-event/index.js","key-event":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/index.js","trim":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/trim/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/html.js":[function(require,module,exports){
var format = require('format-text');

module.exports = html;

function html (chain) {
  return function (element, newValue, vars){
    if (arguments.length > 1) {
      element.innerHTML = arguments.length > 2 ? format(newValue, vars) : newValue;
      return chain;
    }

    return element.innerHTML;
  };
}

},{"format-text":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/format-text/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/select.js":[function(require,module,exports){
var newChain = require("new-chain");
var format = require('format-text');
var classes = require('dom-classes');
var tree = require('dom-tree');
var newElement = require('new-element');
var selectDOM = require('dom-select').all;
var style = require('dom-style');
var closest = require("discore-closest");
var siblings = require("siblings");

var attr = require('./attr');
var events = require('./events');
var html = require('./html');
var text = require('./text');
var value = require('./value');

module.exports = select;

function select (query) {
  var key, chain, methods, elements;
  var task;

  if (typeof query == 'string' && query.charAt(0) == '<') {
    // Create new element from `query`
    elements = [newElement(query, arguments[1])];
  } else if (typeof query == 'string') {
    // Select given CSS query
    elements = Array.prototype.slice.call(selectDOM(query, arguments[1]));
  } else if (query == document) {
    elements = [document.documentElement];
  } else if (arguments.length == 1 && Array.isArray(arguments[0])) {
    elements = arguments[0];
  } else {
    elements = Array.prototype.slice.call(arguments);
  }

  methods = {
    addClass: applyEachElement(classes.add, elements),
    removeClass: applyEachElement(classes.remove, elements),
    toggleClass: applyEachElement(classes.toggle, elements),
    show: applyEachElement(style.show, elements),
    hide: applyEachElement(style.hide, elements),
    style: applyEachElement(style, elements)
  };

  for (key in events) {
    methods[key] = applyEachElement(events[key], elements);
  }

  for (key in tree) {
    methods[key] = applyEachElement(tree[key], elements);
  }

  chain = newChain.from(elements)(methods);

  chain.attr = applyEachElement(attr(chain), elements);
  chain.classes = applyEachElement(classes, elements);
  chain.hasClass = applyEachElement(classes.has, elements),
  chain.html = applyEachElement(html(chain), elements);
  chain.text = applyEachElement(text(chain), elements);
  chain.val = applyEachElement(value(chain), elements);
  chain.value = applyEachElement(value(chain), elements);
  chain.parent = selectEachElement(parent, elements);
  chain.select = selectEachElement(selectChild, elements);
  chain.siblings = selectEachElement(siblings, elements);

  return chain;
}

function parent (element, selector) {
  if (!selector) return element.parentNode;
  return closest(element, selector);
};

function selectChild (element, query) {
  return select(query, element);
}

function applyEachElement (fn, elements) {
  if (!fn) throw new Error('Undefined function.');

  return function () {
    var i, len, ret, params, ret;

    len = elements.length;
    i = -1;
    params = [undefined].concat(Array.prototype.slice.call(arguments));

    while (++i < len) {
      params[0] = elements[i];
      ret = fn.apply(undefined, params);
    }

    return ret;
  };
}

function selectEachElement (fn, els) {
  return function () {
    var result = [];
    var params = [undefined].concat(Array.prototype.slice.call(arguments));

    var len = els.length;
    var i = -1;
    var ret;
    var t;
    var tlen;

    while (++i < len) {
      params[0] = els[i];
      ret = fn.apply(undefined, params);

      if (Array.isArray(ret)) {
        tlen = ret.length;
        t = -1;

        while (++t < tlen) {
          if (result.indexOf(ret[t]) != -1) continue;
          result.push(ret[t]);
        }

        continue;
      }

      if (!ret) continue;
      if (result.indexOf(ret) != -1) continue;

      result.push(ret);
    }


    return select(result);
  };
}

},{"./attr":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/attr.js","./events":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/events.js","./html":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/html.js","./text":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/text.js","./value":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/value.js","discore-closest":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/index.js","dom-classes":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-classes/index.js","dom-select":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/index.js","dom-style":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/index.js","dom-tree":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-tree/index.js","format-text":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/format-text/index.js","new-chain":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-chain/index.js","new-element":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-element/index.js","siblings":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/siblings/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/text.js":[function(require,module,exports){
var format = require('format-text');

module.exports = text;

function text (chain){
  return function (element, newValue, vars) {
    if (arguments.length > 1) {
      element.textContent = arguments.length > 2 ? format(newValue, vars) : newValue;
      return chain;
    }

    return element.textContent;
  };
}

},{"format-text":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/format-text/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/lib/value.js":[function(require,module,exports){
var value = require("dom-value");

module.exports = withChain;

function withChain (chain) {
  return function (el, update) {
    if (arguments.length == 2) {
      value(el, update);
      return chain;
    }

    return value(el);
  };
}

},{"dom-value":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-value/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/component-delegate/index.js":[function(require,module,exports){
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

},{"closest":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/index.js","event":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/component-delegate/node_modules/component-event/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/component-delegate/node_modules/component-event/index.js":[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/index.js":[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf, root) {
  element = checkYoSelf ? {parentNode: element} : element

  root = root || document

  // Make sure `element !== document` and `element != null`
  // otherwise we get an illegal invocation
  while ((element = element.parentNode) && element !== document) {
    if (matches(element, selector))
      return element
    // After `matches` on the edge case that
    // the selector matches the root
    // (when the root is not the document)
    if (element === root)
      return  
  }
}
},{"matches-selector":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/node_modules/component-matches-selector/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/node_modules/component-matches-selector/index.js":[function(require,module,exports){
/**
 * Module dependencies.
 */

var query = require('query');

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

},{"query":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/node_modules/component-matches-selector/node_modules/component-query/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/discore-closest/node_modules/component-matches-selector/node_modules/component-query/index.js":[function(require,module,exports){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-classes/index.js":[function(require,module,exports){
/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var whitespaceRe = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

module.exports = classes;
module.exports.add = add;
module.exports.contains = has;
module.exports.has = has;
module.exports.toggle = toggle;
module.exports.remove = remove;
module.exports.removeMatching = removeMatching;

function classes (el) {
  if (el.classList) {
    return el.classList;
  }

  var str = el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(whitespaceRe);
  if ('' === arr[0]) arr.shift();
  return arr;
}

function add (el, name) {
  // classList
  if (el.classList) {
    el.classList.add(name);
    return;
  }

  // fallback
  var arr = classes(el);
  var i = index(arr, name);
  if (!~i) arr.push(name);
  el.className = arr.join(' ');
}

function has (el, name) {
  return el.classList
    ? el.classList.contains(name)
    : !! ~index(classes(el), name);
}

function remove (el, name) {
  if ('[object RegExp]' == toString.call(name)) {
    return removeMatching(el, name);
  }

  // classList
  if (el.classList) {
    el.classList.remove(name);
    return;
  }

  // fallback
  var arr = classes(el);
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  el.className = arr.join(' ');
}

function removeMatching (el, re, ref) {
  var arr = Array.prototype.slice.call(classes(el));
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      remove(el, arr[i]);
    }
  }
}

function toggle (el, name) {
  // classList
  if (el.classList) {
    return el.classList.toggle(name);
  }

  // fallback
  if (has(el, name)) {
    remove(el, name);
  } else {
    add(el, name);
  }
}

},{"indexof":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-classes/node_modules/indexof/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-classes/node_modules/indexof/index.js":[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-event/index.js":[function(require,module,exports){
module.exports = on;
module.exports.on = on;
module.exports.off = off;

function on (element, event, callback, capture) {
  !element.addEventListener && (event = 'on' + event);
  (element.addEventListener || element.attachEvent).call(element, event, callback, capture);
  return callback;
}

function off (element, event, callback, capture) {
  !element.removeEventListener && (event = 'on' + event);
  (element.removeEventListener || element.detachEvent).call(element, event, callback, capture);
  return callback;
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/fallback.js":[function(require,module,exports){
var qwery = require("qwery");

module.exports = {
  one: one,
  all: all
};

function all (selector, parent) {
  return qwery(selector, parent);
}

function one (selector, parent) {
  return all(selector, parent)[0];
}

},{"qwery":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/node_modules/qwery/qwery.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/index.js":[function(require,module,exports){
var fallback = require('./fallback');

module.exports = one;
module.exports.all = all;

function one (selector, parent) {
  parent || (parent = document);

  if (parent.querySelector) {
    return parent.querySelector(selector);
  }

  return fallback.one(selector, parent);
}

function all (selector, parent) {
  parent || (parent = document);

  if (parent.querySelectorAll) {
    return parent.querySelectorAll(selector);
  }

  return fallback.all(selector, parent);
}

},{"./fallback":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/fallback.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/node_modules/qwery/qwery.js":[function(require,module,exports){
/*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  * MIT License
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

  var walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      }
    , '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode
      }
    , '~': function (node) {
        return node && node.previousSibling
      }
    , '+': function (node, contestant, p1, p2) {
        if (!node) return false
        return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
      }
    }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  // not quite as fast as inline loops in older browsers so don't use liberally
  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  // called using `this` as element and arguments from regex group results.
  // given => div.hello[title="world"]:foo('bar')
  // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      // select is for attrib equality
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  // given a selector, first check for simple cases then collect all base candidate matches and filter
  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    // collect base candidates to filter
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    // filter elements according to the right-most part of the selector
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    // filter further according to the rest of the selector (the left side)
    each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  // compare element to a selector
  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  // given elements matching the right-most part of a selector, filter out any that don't match the rest
  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    // recursively work backwards through the tokens and up the dom, covering all options
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j;
    o:
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    // easy, fast cases that we can dispatch with simple DOM calls
    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  // where the root is not document and a relationship selector is first we have to
  // do some awkward adjustments to get it to work, even with qSA
  function collectSelector(root, collector) {
    return function (s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
          // make sure the el has an id, rewrite the query, set root to doc and run it
          if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
          s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
          collector(root.parentNode || root, s, true)
          oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
    }()
  , hasByClass = !!doc[byClass]
    // has native qSA support
  , hasQSA = doc.querySelector && doc[qSA]
    // use native qSA
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          // most work is done right here, defer to qSA
          return arrayify(root[qSA](selector))
        }
        // special case where we need the services of `collectSelector()`
        each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
    }
    // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      // configNativeQSA: use fully-internal selector or native qSA where present
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
});

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/index.js":[function(require,module,exports){
var toCamelCase = require('to-camel-case');

module.exports = style;
module.exports.hide = effect('display', 'none');
module.exports.show = effect('display', 'initial');

function all(element, css) {
  var name;
  for ( name in css ) {
    one(element, name, css[name]);
  }
}

function effect(name, value) {
  return function (element, override) {
    style(element, name, arguments.length > 1 ? override : value);
  };
}

function one(element, name, value) {
  element.style[toCamelCase((name == 'float') ? 'cssFloat' : name)] = value;
}

function style(element) {
  if (arguments.length == 3) {
    return one(element, arguments[1], arguments[2]);
  }

  return all(element, arguments[1]);
}

},{"to-camel-case":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/node_modules/to-camel-case/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/node_modules/to-camel-case/index.js":[function(require,module,exports){

var toSpace = require('to-space-case');


/**
 * Expose `toCamelCase`.
 */

module.exports = toCamelCase;


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */


function toCamelCase (string) {
  return toSpace(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase();
  });
}
},{"to-space-case":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/node_modules/to-camel-case/node_modules/to-space-case/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/node_modules/to-camel-case/node_modules/to-space-case/index.js":[function(require,module,exports){

var clean = require('to-no-case');


/**
 * Expose `toSpaceCase`.
 */

module.exports = toSpaceCase;


/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */


function toSpaceCase (string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : '';
  });
}
},{"to-no-case":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/node_modules/to-camel-case/node_modules/to-space-case/node_modules/to-no-case/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-style/node_modules/to-camel-case/node_modules/to-space-case/node_modules/to-no-case/index.js":[function(require,module,exports){

/**
 * Expose `toNoCase`.
 */

module.exports = toNoCase;


/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/;
var hasCamel = /[a-z][A-Z]/;
var hasSeparator = /[\W_]/;


/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase (string) {
  if (hasSpace.test(string)) return string.toLowerCase();

  if (hasSeparator.test(string)) string = unseparate(string);
  if (hasCamel.test(string)) string = uncamelize(string);
  return string.toLowerCase();
}


/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g;


/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate (string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : '';
  });
}


/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g;


/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize (string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
  });
}
},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-tree/index.js":[function(require,module,exports){
var newElement = require("./new-element");
var select = require('./select');

module.exports = {
  add: withChildren(add),
  addAfter: withChildren(addAfter),
  addBefore: withChildren(addBefore),
  insert: insert,
  replace: replace,
  remove: remove
};

function add (parent, child, vars) {
  select(parent).appendChild(newElement(child, vars));
}

function addAfter (parent, child/*[, vars], reference */) {
  var ref = select(arguments[arguments.length - 1], parent).nextSibling;
  var vars = arguments.length > 3 ? arguments[2] : undefined;

  if (ref == null) {
    return add(parent, child, vars);
  }

  addBefore(parent, child, vars, ref);
}

function addBefore (parent, child/*[, vars], reference */) {
  var ref = arguments[arguments.length - 1];
  var vars = arguments.length > 3 ? arguments[2] : undefined;
  select(parent).insertBefore(newElement(child, vars), select(ref, parent));
}

function insert (element /*[,vars], parent */) {
  var parent = arguments[arguments.length - 1];
  var vars = arguments.length > 2 ? arguments[1] : undefined;

  add(select(parent), element, vars);
}

function replace (parent, target, repl, vars) {
  select(parent).replaceChild(select(newElement(repl, vars)), select(target, parent));
}

function remove (element, child) {
  var i, all;

  if (arguments.length == 1 && typeof element != 'string') {
    return element.parentNode.removeChild(element);
  }

  all = arguments.length > 1 ? select.all(child, element) : select.all(element);
  i = all.length;

  while (i--) {
    all[i].parentNode.removeChild(all[i]);
  }

}

function withChildren (fn) {
  return function (_, children) {
    if (!Array.isArray(children)) children = [children];

    var i = -1;
    var len = children.length;
    var params = Array.prototype.slice.call(arguments);

    while (++i < len) {
      params[1] = children[i];
      fn.apply(undefined, params);
    }
  };
}

},{"./new-element":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-tree/new-element.js","./select":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-tree/select.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-tree/new-element.js":[function(require,module,exports){
var newElement = require("new-element");

module.exports = ifNecessary;

function ifNecessary (html, vars) {
  if (!isHTML(html)) return html;
  return newElement(html, vars);
}

function isHTML(text){
  return typeof text == 'string' && text.charAt(0) == '<';
}

},{"new-element":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-element/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-tree/select.js":[function(require,module,exports){
var select = require('dom-select');

module.exports = ifNecessary;
module.exports.all = ifNecessaryAll;

function ifNecessary (child, parent) {
  if (Array.isArray(child)) {
    child = child[0];
  }

  if ( typeof child != 'string') {
    return child;
  }

  if (typeof parent == 'string') {
    parent = select(parent, document);
  }

  return select(child, parent);
}

function ifNecessaryAll (child, parent) {
  if (Array.isArray(child)) {
    child = child[0];
  }

  if ( typeof child != 'string') {
    return [child];
  }

  if (typeof parent == 'string') {
    parent = select(parent, document);
  }

  return select.all(child, parent);
}

},{"dom-select":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-select/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-value/index.js":[function(require,module,exports){

/**
 * Module dependencies.
 */

var typeOf = require('component-type');

/**
 * Set or get `el`'s' value.
 *
 * @param {Element} el
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

module.exports = function(el, val){
  if (2 == arguments.length) return set(el, val);
  return get(el);
};

/**
 * Get `el`'s value.
 */

function get(el) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (el.checked) {
        var attr = el.getAttribute('value');
        return null == attr ? true : attr;
      } else {
        return false;
      }
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        if (radio.checked) return radio.value;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        if (option.selected) return option.value;
      }
      break;
    default:
      return el.value;
  }
}

/**
 * Set `el`'s value.
 */

function set(el, val) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (val) {
        el.checked = true;
      } else {
        el.checked = false;
      }
      break;
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        radio.checked = radio.value === val;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        option.selected = option.value === val;
      }
      break;
    default:
      el.value = val;
  }
}

/**
 * Element type.
 */

function type(el) {
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);
  if (group) el = el[0];
  var name = el.nodeName.toLowerCase();
  var type = el.getAttribute('type');

  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';
  if ('select' == name) return 'select';
  return name;
}

},{"component-type":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-value/node_modules/component-type/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/dom-value/node_modules/component-type/index.js":[function(require,module,exports){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/format-text/index.js":[function(require,module,exports){
module.exports = format;

function format(text) {
  var context;

  if (typeof arguments[1] == 'object' && arguments[1]) {
    context = arguments[1];
  } else {
    context = Array.prototype.slice.call(arguments, 1);
  }

  return String(text).replace(/\{?\{([^{}]+)}}?/g, replace(context));
};

function replace (context, nil){
  return function (tag, name) {
    if (tag.substring(0, 2) == '{{' && tag.substring(tag.length - 2) == '}}') {
      return '{' + name + '}';
    }

    if (!context.hasOwnProperty(name)) {
      return tag;
    }

    if (typeof context[name] == 'function') {
      return context[name]();
    }

    return context[name];
  }
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/index.js":[function(require,module,exports){
var keynameOf = require("keyname-of");
var events = require("dom-event");

module.exports = on;
module.exports.on = on;
module.exports.off = off;

function on (element, keys, callback) {
  var expected = parse(keys);

  var fn = events.on(element, 'keyup', function(event){

    if ((event.ctrlKey || undefined) == expected.ctrl &&
       (event.altKey || undefined) == expected.alt &&
       (event.shiftKey || undefined) == expected.shift &&
       keynameOf(event.keyCode) == expected.key){

      callback(event);
    }

  });


  callback['cb-' + keys] = fn;

  return callback;
}

function off (element, keys, callback) {
  events.off(element, 'keyup', callback['cb-' + keys]);
}

function parse (keys){
  var result = {};
  keys = keys.split(/[^\w]+/);

  var i = keys.length, name;
  while ( i -- ){
    name = keys[i].trim();

    if(name == 'ctrl') {
      result.ctrl = true;
      continue;
    }

    if(name == 'alt') {
      result.alt = true;
      continue;
    }

    if(name == 'shift') {
      result.shift = true;
      continue;
    }

    result.key = name.trim();
  }

  return result;
}

},{"dom-event":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/node_modules/dom-event/index.js","keyname-of":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/node_modules/keyname-of/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/node_modules/dom-event/index.js":[function(require,module,exports){
module.exports = on;
module.exports.on = on;
module.exports.off = off;

function on (element, event, callback, capture) {
  (element.addEventListener || element.attachEvent).call(element, event, callback, capture);
  return callback;
}

function off (element, event, callback, capture) {
  (element.removeEventListener || element.detachEvent).call(element, event, callback, capture);
  return callback;
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/node_modules/keyname-of/index.js":[function(require,module,exports){
var map = require("keynames");

module.exports = keynameOf;

function keynameOf (n) {
   return map[n] || String.fromCharCode(n).toLowerCase();
}

},{"keynames":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/node_modules/keyname-of/node_modules/keynames/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/key-event/node_modules/keyname-of/node_modules/keynames/index.js":[function(require,module,exports){
module.exports = {
  8   : 'backspace',
  9   : 'tab',
  13  : 'enter',
  16  : 'shift',
  17  : 'ctrl',
  18  : 'alt',
  20  : 'capslock',
  27  : 'esc',
  32  : 'space',
  33  : 'pageup',
  34  : 'pagedown',
  35  : 'end',
  36  : 'home',
  37  : 'left',
  38  : 'up',
  39  : 'right',
  40  : 'down',
  45  : 'ins',
  46  : 'del',
  91  : 'meta',
  93  : 'meta',
  224 : 'meta'
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-chain/index.js":[function(require,module,exports){
module.exports = newChain;
module.exports.from = from;

function from(chain){

  return function(){
    var m, i;

    m = methods.apply(undefined, arguments);
    i   = m.length;

    while ( i -- ) {
      chain[ m[i].name ] = m[i].fn;
    }

    m.forEach(function(method){
      chain[ method.name ] = function(){
        method.fn.apply(this, arguments);
        return chain;
      };
    });

    return chain;
  };

}

function methods(){
  var all, el, i, len, result, key;

  all    = Array.prototype.slice.call(arguments);
  result = [];
  i      = all.length;

  while ( i -- ) {
    el = all[i];

    if ( typeof el == 'function' ) {
      result.push({ name: el.name, fn: el });
      continue;
    }

    if ( typeof el != 'object' ) continue;

    for ( key in el ) {
      result.push({ name: key, fn: el[key] });
    }
  }

  return result;
}

function newChain(){
  return from({}).apply(undefined, arguments);
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-element/index.js":[function(require,module,exports){
var domify = require("domify");
var format = require("format-text");

module.exports = newElement;

function newElement (html, vars) {
  if (arguments.length == 1) return domify(html);
  return domify(format(html, vars));
}

},{"domify":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-element/node_modules/domify/index.js","format-text":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/format-text/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/new-element/node_modules/domify/index.js":[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/siblings/index.js":[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function(el, selector) {
  var node = el.parentNode.firstChild
  var siblings = []
  
  for ( ; node; node = node.nextSibling ) {
    if ( node.nodeType === 1 && node !== el ) {
      if (!selector) siblings.push(node)
      else if (matches(node, selector)) siblings.push(node)
    }
  }
  
  return siblings
}

},{"matches-selector":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/siblings/node_modules/matches-selector/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/siblings/node_modules/matches-selector/index.js":[function(require,module,exports){
'use strict';

var proto = Element.prototype;
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/domquery/node_modules/trim/index.js":[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/index.js":[function(require,module,exports){
(function (Buffer){
module.exports = Level

var IDB = require('idb-wrapper')
var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var util = require('util')
var Iterator = require('./iterator')
var isBuffer = require('isbuffer')
var xtend = require('xtend')
var toBuffer = require('typedarray-to-buffer')

function Level(location) {
  if (!(this instanceof Level)) return new Level(location)
  if (!location) throw new Error("constructor requires at least a location argument")
  this.IDBOptions = {}
  this.location = location
}

util.inherits(Level, AbstractLevelDOWN)

Level.prototype._open = function(options, callback) {
  var self = this
    
  var idbOpts = {
    storeName: this.location,
    autoIncrement: false,
    keyPath: null,
    onStoreReady: function () {
      callback && callback(null, self.idb)
    }, 
    onError: function(err) {
      callback && callback(err)
    }
  }
  
  xtend(idbOpts, options)
  this.IDBOptions = idbOpts
  this.idb = new IDB(idbOpts)
}

Level.prototype._get = function (key, options, callback) {
  this.idb.get(key, function (value) {
    if (value === undefined) {
      // 'NotFound' error, consistent with LevelDOWN API
      return callback(new Error('NotFound'))
    }
    // by default return buffers, unless explicitly told not to
    var asBuffer = true
    if (options.asBuffer === false) asBuffer = false
    if (options.raw) asBuffer = false
    if (asBuffer) {
      if (value instanceof Uint8Array) value = toBuffer(value)
      else value = new Buffer(String(value))
    }
    return callback(null, value, key)
  }, callback)
}

Level.prototype._del = function(id, options, callback) {
  this.idb.remove(id, callback, callback)
}

Level.prototype._put = function (key, value, options, callback) {
  if (value instanceof ArrayBuffer) {
    value = toBuffer(new Uint8Array(value))
  }
  var obj = this.convertEncoding(key, value, options)
  if (Buffer.isBuffer(obj.value)) {
    obj.value = new Uint8Array(value.toArrayBuffer())
  }
  this.idb.put(obj.key, obj.value, function() { callback() }, callback)
}

Level.prototype.convertEncoding = function(key, value, options) {
  if (options.raw) return {key: key, value: value}
  if (value) {
    var stringed = value.toString()
    if (stringed === 'NaN') value = 'NaN'
  }
  var valEnc = options.valueEncoding
  var obj = {key: key, value: value}
  if (value && (!valEnc || valEnc !== 'binary')) {
    if (typeof obj.value !== 'object') {
      obj.value = stringed
    }
  }
  return obj
}

Level.prototype.iterator = function (options) {
  if (typeof options !== 'object') options = {}
  return new Iterator(this.idb, options)
}

Level.prototype._batch = function (array, options, callback) {
  var op
  var i
  var k
  var copiedOp
  var currentOp
  var modified = []
  
  if (array.length === 0) return setTimeout(callback, 0)
  
  for (i = 0; i < array.length; i++) {
    copiedOp = {}
    currentOp = array[i]
    modified[i] = copiedOp
    
    var converted = this.convertEncoding(currentOp.key, currentOp.value, options)
    currentOp.key = converted.key
    currentOp.value = converted.value

    for (k in currentOp) {
      if (k === 'type' && currentOp[k] == 'del') {
        copiedOp[k] = 'remove'
      } else {
        copiedOp[k] = currentOp[k]
      }
    }
  }

  return this.idb.batch(modified, function(){ callback() }, callback)
}

Level.prototype._close = function (callback) {
  this.idb.db.close()
  callback()
}

Level.prototype._approximateSize = function (start, end, callback) {
  var err = new Error('Not implemented')
  if (callback)
    return callback(err)

  throw err
}

Level.prototype._isBuffer = function (obj) {
  return Buffer.isBuffer(obj)
}

Level.destroy = function (db, callback) {
  if (typeof db === 'object') {
    var prefix = db.IDBOptions.storePrefix || 'IDBWrapper-'
    var dbname = db.location
  } else {
    var prefix = 'IDBWrapper-'
    var dbname = db
  }
  var request = indexedDB.deleteDatabase(prefix + dbname)
  request.onsuccess = function() {
    callback()
  }
  request.onerror = function(err) {
    callback(err)
  }
}

var checkKeyValue = Level.prototype._checkKeyValue = function (obj, type) {
  if (obj === null || obj === undefined)
    return new Error(type + ' cannot be `null` or `undefined`')
  if (obj === null || obj === undefined)
    return new Error(type + ' cannot be `null` or `undefined`')
  if (isBuffer(obj) && obj.byteLength === 0)
    return new Error(type + ' cannot be an empty ArrayBuffer')
  if (String(obj) === '')
    return new Error(type + ' cannot be an empty String')
  if (obj.length === 0)
    return new Error(type + ' cannot be an empty Array')
}

}).call(this,require("buffer").Buffer)
},{"./iterator":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/iterator.js","abstract-leveldown":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-leveldown.js","buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","idb-wrapper":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/idb-wrapper/idbstore.js","isbuffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/isbuffer/index.js","typedarray-to-buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/typedarray-to-buffer/index.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js","xtend":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/iterator.js":[function(require,module,exports){
var util = require('util')
var AbstractIterator  = require('abstract-leveldown').AbstractIterator
var ltgt = require('ltgt')

module.exports = Iterator

function Iterator (db, options) {
  if (!options) options = {}
  this.options = options
  AbstractIterator.call(this, db)
  this._order = options.reverse ? 'DESC': 'ASC'
  this._limit = options.limit
  this._count = 0
  this._done  = false
  var lower = ltgt.lowerBound(options)
  var upper = ltgt.upperBound(options)
  this._keyRange = lower || upper ? this.db.makeKeyRange({
    lower: lower,
    upper: upper,
    excludeLower: ltgt.lowerBoundExclusive(options),
    excludeUpper: ltgt.upperBoundExclusive(options)
  }) : null
  this.callback = null
}

util.inherits(Iterator, AbstractIterator)

Iterator.prototype.createIterator = function() {
  var self = this

  self.iterator = self.db.iterate(function () {
    self.onItem.apply(self, arguments)
  }, {
    keyRange: self._keyRange,
    autoContinue: false,
    order: self._order,
    onError: function(err) { console.log('horrible error', err) },
  })
}

// TODO the limit implementation here just ignores all reads after limit has been reached
// it should cancel the iterator instead but I don't know how
Iterator.prototype.onItem = function (value, cursor, cursorTransaction) {
  if (!cursor && this.callback) {
    this.callback()
    this.callback = false
    return
  }
  var shouldCall = true

  if (!!this._limit && this._limit > 0 && this._count++ >= this._limit)
    shouldCall = false

  if (shouldCall) this.callback(false, cursor.key, cursor.value)
  if (cursor) cursor['continue']()
}

Iterator.prototype._next = function (callback) {
  if (!callback) return new Error('next() requires a callback argument')
  if (!this._started) {
    this.createIterator()
    this._started = true
  }
  this.callback = callback
}

},{"abstract-leveldown":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-leveldown.js","ltgt":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/ltgt/index.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-chained-batch.js":[function(require,module,exports){
(function (process){
/* Copyright (c) 2013 Rod Vagg, MIT License */

function AbstractChainedBatch (db) {
  this._db         = db
  this._operations = []
  this._written    = false
}

AbstractChainedBatch.prototype._checkWritten = function () {
  if (this._written)
    throw new Error('write() already called on this batch')
}

AbstractChainedBatch.prototype.put = function (key, value) {
  this._checkWritten()

  var err = this._db._checkKeyValue(key, 'key', this._db._isBuffer)
  if (err) throw err
  err = this._db._checkKeyValue(value, 'value', this._db._isBuffer)
  if (err) throw err

  if (!this._db._isBuffer(key)) key = String(key)
  if (!this._db._isBuffer(value)) value = String(value)

  if (typeof this._put == 'function' )
    this._put(key, value)
  else
    this._operations.push({ type: 'put', key: key, value: value })

  return this
}

AbstractChainedBatch.prototype.del = function (key) {
  this._checkWritten()

  var err = this._db._checkKeyValue(key, 'key', this._db._isBuffer)
  if (err) throw err

  if (!this._db._isBuffer(key)) key = String(key)

  if (typeof this._del == 'function' )
    this._del(key)
  else
    this._operations.push({ type: 'del', key: key })

  return this
}

AbstractChainedBatch.prototype.clear = function () {
  this._checkWritten()

  this._operations = []

  if (typeof this._clear == 'function' )
    this._clear()

  return this
}

AbstractChainedBatch.prototype.write = function (options, callback) {
  this._checkWritten()

  if (typeof options == 'function')
    callback = options
  if (typeof callback != 'function')
    throw new Error('write() requires a callback argument')
  if (typeof options != 'object')
    options = {}

  this._written = true

  if (typeof this._write == 'function' )
    return this._write(callback)

  if (typeof this._db._batch == 'function')
    return this._db._batch(this._operations, options, callback)

  process.nextTick(callback)
}

module.exports = AbstractChainedBatch
}).call(this,require('_process'))
},{"_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-iterator.js":[function(require,module,exports){
(function (process){
/* Copyright (c) 2013 Rod Vagg, MIT License */

function AbstractIterator (db) {
  this.db = db
  this._ended = false
  this._nexting = false
}

AbstractIterator.prototype.next = function (callback) {
  var self = this

  if (typeof callback != 'function')
    throw new Error('next() requires a callback argument')

  if (self._ended)
    return callback(new Error('cannot call next() after end()'))
  if (self._nexting)
    return callback(new Error('cannot call next() before previous next() has completed'))

  self._nexting = true
  if (typeof self._next == 'function') {
    return self._next(function () {
      self._nexting = false
      callback.apply(null, arguments)
    })
  }

  process.nextTick(function () {
    self._nexting = false
    callback()
  })
}

AbstractIterator.prototype.end = function (callback) {
  if (typeof callback != 'function')
    throw new Error('end() requires a callback argument')

  if (this._ended)
    return callback(new Error('end() already called on iterator'))

  this._ended = true

  if (typeof this._end == 'function')
    return this._end(callback)

  process.nextTick(callback)
}

module.exports = AbstractIterator

}).call(this,require('_process'))
},{"_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-leveldown.js":[function(require,module,exports){
(function (process,Buffer){
/* Copyright (c) 2013 Rod Vagg, MIT License */

var xtend                = require('xtend')
  , AbstractIterator     = require('./abstract-iterator')
  , AbstractChainedBatch = require('./abstract-chained-batch')

function AbstractLevelDOWN (location) {
  if (!arguments.length || location === undefined)
    throw new Error('constructor requires at least a location argument')

  if (typeof location != 'string')
    throw new Error('constructor requires a location string argument')

  this.location = location
}

AbstractLevelDOWN.prototype.open = function (options, callback) {
  if (typeof options == 'function')
    callback = options

  if (typeof callback != 'function')
    throw new Error('open() requires a callback argument')

  if (typeof options != 'object')
    options = {}

  if (typeof this._open == 'function')
    return this._open(options, callback)

  process.nextTick(callback)
}

AbstractLevelDOWN.prototype.close = function (callback) {
  if (typeof callback != 'function')
    throw new Error('close() requires a callback argument')

  if (typeof this._close == 'function')
    return this._close(callback)

  process.nextTick(callback)
}

AbstractLevelDOWN.prototype.get = function (key, options, callback) {
  var err

  if (typeof options == 'function')
    callback = options

  if (typeof callback != 'function')
    throw new Error('get() requires a callback argument')

  if (err = this._checkKeyValue(key, 'key', this._isBuffer))
    return callback(err)

  if (!this._isBuffer(key))
    key = String(key)

  if (typeof options != 'object')
    options = {}

  if (typeof this._get == 'function')
    return this._get(key, options, callback)

  process.nextTick(function () { callback(new Error('NotFound')) })
}

AbstractLevelDOWN.prototype.put = function (key, value, options, callback) {
  var err

  if (typeof options == 'function')
    callback = options

  if (typeof callback != 'function')
    throw new Error('put() requires a callback argument')

  if (err = this._checkKeyValue(key, 'key', this._isBuffer))
    return callback(err)

  if (err = this._checkKeyValue(value, 'value', this._isBuffer))
    return callback(err)

  if (!this._isBuffer(key))
    key = String(key)

  // coerce value to string in node, don't touch it in browser
  // (indexeddb can store any JS type)
  if (!this._isBuffer(value) && !process.browser)
    value = String(value)

  if (typeof options != 'object')
    options = {}

  if (typeof this._put == 'function')
    return this._put(key, value, options, callback)

  process.nextTick(callback)
}

AbstractLevelDOWN.prototype.del = function (key, options, callback) {
  var err

  if (typeof options == 'function')
    callback = options

  if (typeof callback != 'function')
    throw new Error('del() requires a callback argument')

  if (err = this._checkKeyValue(key, 'key', this._isBuffer))
    return callback(err)

  if (!this._isBuffer(key))
    key = String(key)

  if (typeof options != 'object')
    options = {}

  if (typeof this._del == 'function')
    return this._del(key, options, callback)

  process.nextTick(callback)
}

AbstractLevelDOWN.prototype.batch = function (array, options, callback) {
  if (!arguments.length)
    return this._chainedBatch()

  if (typeof options == 'function')
    callback = options

  if (typeof callback != 'function')
    throw new Error('batch(array) requires a callback argument')

  if (!Array.isArray(array))
    return callback(new Error('batch(array) requires an array argument'))

  if (typeof options != 'object')
    options = {}

  var i = 0
    , l = array.length
    , e
    , err

  for (; i < l; i++) {
    e = array[i]
    if (typeof e != 'object')
      continue

    if (err = this._checkKeyValue(e.type, 'type', this._isBuffer))
      return callback(err)

    if (err = this._checkKeyValue(e.key, 'key', this._isBuffer))
      return callback(err)

    if (e.type == 'put') {
      if (err = this._checkKeyValue(e.value, 'value', this._isBuffer))
        return callback(err)
    }
  }

  if (typeof this._batch == 'function')
    return this._batch(array, options, callback)

  process.nextTick(callback)
}

//TODO: remove from here, not a necessary primitive
AbstractLevelDOWN.prototype.approximateSize = function (start, end, callback) {
  if (   start == null
      || end == null
      || typeof start == 'function'
      || typeof end == 'function') {
    throw new Error('approximateSize() requires valid `start`, `end` and `callback` arguments')
  }

  if (typeof callback != 'function')
    throw new Error('approximateSize() requires a callback argument')

  if (!this._isBuffer(start))
    start = String(start)

  if (!this._isBuffer(end))
    end = String(end)

  if (typeof this._approximateSize == 'function')
    return this._approximateSize(start, end, callback)

  process.nextTick(function () {
    callback(null, 0)
  })
}

AbstractLevelDOWN.prototype._setupIteratorOptions = function (options) {
  var self = this

  options = xtend(options)

  ;[ 'start', 'end', 'gt', 'gte', 'lt', 'lte' ].forEach(function (o) {
    if (options[o] && self._isBuffer(options[o]) && options[o].length === 0)
      delete options[o]
  })

  options.reverse = !!options.reverse

  // fix `start` so it takes into account gt, gte, lt, lte as appropriate
  if (options.reverse && options.lt)
    options.start = options.lt
  if (options.reverse && options.lte)
    options.start = options.lte
  if (!options.reverse && options.gt)
    options.start = options.gt
  if (!options.reverse && options.gte)
    options.start = options.gte

  if ((options.reverse && options.lt && !options.lte)
    || (!options.reverse && options.gt && !options.gte))
    options.exclusiveStart = true // start should *not* include matching key

  return options
}

AbstractLevelDOWN.prototype.iterator = function (options) {
  if (typeof options != 'object')
    options = {}

  options = this._setupIteratorOptions(options)

  if (typeof this._iterator == 'function')
    return this._iterator(options)

  return new AbstractIterator(this)
}

AbstractLevelDOWN.prototype._chainedBatch = function () {
  return new AbstractChainedBatch(this)
}

AbstractLevelDOWN.prototype._isBuffer = function (obj) {
  return Buffer.isBuffer(obj)
}

AbstractLevelDOWN.prototype._checkKeyValue = function (obj, type) {

  if (obj === null || obj === undefined)
    return new Error(type + ' cannot be `null` or `undefined`')

  if (this._isBuffer(obj)) {
    if (obj.length === 0)
      return new Error(type + ' cannot be an empty Buffer')
  } else if (String(obj) === '')
    return new Error(type + ' cannot be an empty String')
}

module.exports.AbstractLevelDOWN    = AbstractLevelDOWN
module.exports.AbstractIterator     = AbstractIterator
module.exports.AbstractChainedBatch = AbstractChainedBatch

}).call(this,require('_process'),require("buffer").Buffer)
},{"./abstract-chained-batch":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-chained-batch.js","./abstract-iterator":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-iterator.js","_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","xtend":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/node_modules/xtend/index.js":[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/idb-wrapper/idbstore.js":[function(require,module,exports){
/*global window:false, self:false, define:false, module:false */

/**
 * @license IDBWrapper - A cross-browser wrapper for IndexedDB
 * Copyright (c) 2011 - 2013 Jens Arps
 * http://jensarps.de/
 *
 * Licensed under the MIT (X11) license
 */

(function (name, definition, global) {
  if (typeof define === 'function') {
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition();
  } else {
    global[name] = definition();
  }
})('IDBStore', function () {

  'use strict';

  var defaultErrorHandler = function (error) {
    throw error;
  };

  var defaults = {
    storeName: 'Store',
    storePrefix: 'IDBWrapper-',
    dbVersion: 1,
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: function () {
    },
    onError: defaultErrorHandler,
    indexes: []
  };

  /**
   *
   * The IDBStore constructor
   *
   * @constructor
   * @name IDBStore
   * @version 1.4.1
   *
   * @param {Object} [kwArgs] An options object used to configure the store and
   *  set callbacks
   * @param {String} [kwArgs.storeName='Store'] The name of the store
   * @param {String} [kwArgs.storePrefix='IDBWrapper-'] A prefix that is
   *  internally used to construct the name of the database, which will be
   *  kwArgs.storePrefix + kwArgs.storeName
   * @param {Number} [kwArgs.dbVersion=1] The version of the store
   * @param {String} [kwArgs.keyPath='id'] The key path to use. If you want to
   *  setup IDBWrapper to work with out-of-line keys, you need to set this to
   *  `null`
   * @param {Boolean} [kwArgs.autoIncrement=true] If set to true, IDBStore will
   *  automatically make sure a unique keyPath value is present on each object
   *  that is stored.
   * @param {Function} [kwArgs.onStoreReady] A callback to be called when the
   *  store is ready to be used.
   * @param {Function} [kwArgs.onError=throw] A callback to be called when an
   *  error occurred during instantiation of the store.
   * @param {Array} [kwArgs.indexes=[]] An array of indexData objects
   *  defining the indexes to use with the store. For every index to be used
   *  one indexData object needs to be passed in the array.
   *  An indexData object is defined as follows:
   * @param {Object} [kwArgs.indexes.indexData] An object defining the index to
   *  use
   * @param {String} kwArgs.indexes.indexData.name The name of the index
   * @param {String} [kwArgs.indexes.indexData.keyPath] The key path of the index
   * @param {Boolean} [kwArgs.indexes.indexData.unique] Whether the index is unique
   * @param {Boolean} [kwArgs.indexes.indexData.multiEntry] Whether the index is multi entry
   * @param {Function} [onStoreReady] A callback to be called when the store
   * is ready to be used.
   * @example
      // create a store for customers with an additional index over the
      // `lastname` property.
      var myCustomerStore = new IDBStore({
        dbVersion: 1,
        storeName: 'customer-index',
        keyPath: 'customerid',
        autoIncrement: true,
        onStoreReady: populateTable,
        indexes: [
          { name: 'lastname', keyPath: 'lastname', unique: false, multiEntry: false }
        ]
      });
   * @example
      // create a generic store
      var myCustomerStore = new IDBStore({
        storeName: 'my-data-store',
        onStoreReady: function(){
          // start working with the store.
        }
      });
   */
  var IDBStore = function (kwArgs, onStoreReady) {

    if (typeof onStoreReady == 'undefined' && typeof kwArgs == 'function') {
      onStoreReady = kwArgs;
    }
    if (Object.prototype.toString.call(kwArgs) != '[object Object]') {
      kwArgs = {};
    }

    for (var key in defaults) {
      this[key] = typeof kwArgs[key] != 'undefined' ? kwArgs[key] : defaults[key];
    }

    this.dbName = this.storePrefix + this.storeName;
    this.dbVersion = parseInt(this.dbVersion, 10) || 1;

    onStoreReady && (this.onStoreReady = onStoreReady);

    var env = typeof window == 'object' ? window : self;
    this.idb = env.indexedDB || env.webkitIndexedDB || env.mozIndexedDB;
    this.keyRange = env.IDBKeyRange || env.webkitIDBKeyRange || env.mozIDBKeyRange;

    this.features = {
      hasAutoIncrement: !env.mozIndexedDB
    };

    this.consts = {
      'READ_ONLY':         'readonly',
      'READ_WRITE':        'readwrite',
      'VERSION_CHANGE':    'versionchange',
      'NEXT':              'next',
      'NEXT_NO_DUPLICATE': 'nextunique',
      'PREV':              'prev',
      'PREV_NO_DUPLICATE': 'prevunique'
    };

    this.openDB();
  };

  IDBStore.prototype = /** @lends IDBStore */ {

    /**
     * A pointer to the IDBStore ctor
     *
     * @type IDBStore
     */
    constructor: IDBStore,

    /**
     * The version of IDBStore
     *
     * @type String
     */
    version: '1.4.1',

    /**
     * A reference to the IndexedDB object
     *
     * @type Object
     */
    db: null,

    /**
     * The full name of the IndexedDB used by IDBStore, composed of
     * this.storePrefix + this.storeName
     *
     * @type String
     */
    dbName: null,

    /**
     * The version of the IndexedDB used by IDBStore
     *
     * @type Number
     */
    dbVersion: null,

    /**
     * A reference to the objectStore used by IDBStore
     *
     * @type Object
     */
    store: null,

    /**
     * The store name
     *
     * @type String
     */
    storeName: null,

    /**
     * The key path
     *
     * @type String
     */
    keyPath: null,

    /**
     * Whether IDBStore uses autoIncrement
     *
     * @type Boolean
     */
    autoIncrement: null,

    /**
     * The indexes used by IDBStore
     *
     * @type Array
     */
    indexes: null,

    /**
     * A hashmap of features of the used IDB implementation
     *
     * @type Object
     * @proprty {Boolean} autoIncrement If the implementation supports
     *  native auto increment
     */
    features: null,

    /**
     * The callback to be called when the store is ready to be used
     *
     * @type Function
     */
    onStoreReady: null,

    /**
     * The callback to be called if an error occurred during instantiation
     * of the store
     *
     * @type Function
     */
    onError: null,

    /**
     * The internal insertID counter
     *
     * @type Number
     * @private
     */
    _insertIdCount: 0,

    /**
     * Opens an IndexedDB; called by the constructor.
     *
     * Will check if versions match and compare provided index configuration
     * with existing ones, and update indexes if necessary.
     *
     * Will call this.onStoreReady() if everything went well and the store
     * is ready to use, and this.onError() is something went wrong.
     *
     * @private
     *
     */
    openDB: function () {

      var openRequest = this.idb.open(this.dbName, this.dbVersion);
      var preventSuccessCallback = false;

      openRequest.onerror = function (error) {

        var gotVersionErr = false;
        if ('error' in error.target) {
          gotVersionErr = error.target.error.name == 'VersionError';
        } else if ('errorCode' in error.target) {
          gotVersionErr = error.target.errorCode == 12;
        }

        if (gotVersionErr) {
          this.onError(new Error('The version number provided is lower than the existing one.'));
        } else {
          this.onError(error);
        }
      }.bind(this);

      openRequest.onsuccess = function (event) {

        if (preventSuccessCallback) {
          return;
        }

        if(this.db){
          this.onStoreReady();
          return;
        }

        this.db = event.target.result;

        if(typeof this.db.version == 'string'){
          this.onError(new Error('The IndexedDB implementation in this browser is outdated. Please upgrade your browser.'));
          return;
        }

        if(!this.db.objectStoreNames.contains(this.storeName)){
          // We should never ever get here.
          // Lets notify the user anyway.
          this.onError(new Error('Something is wrong with the IndexedDB implementation in this browser. Please upgrade your browser.'));
          return;
        }

        var emptyTransaction = this.db.transaction([this.storeName], this.consts.READ_ONLY);
        this.store = emptyTransaction.objectStore(this.storeName);

        // check indexes
        var existingIndexes = Array.prototype.slice.call(this.getIndexList());
        this.indexes.forEach(function(indexData){
          var indexName = indexData.name;

          if(!indexName){
            preventSuccessCallback = true;
            this.onError(new Error('Cannot create index: No index name given.'));
            return;
          }

          this.normalizeIndexData(indexData);

          if(this.hasIndex(indexName)){
            // check if it complies
            var actualIndex = this.store.index(indexName);
            var complies = this.indexComplies(actualIndex, indexData);
            if(!complies){
              preventSuccessCallback = true;
              this.onError(new Error('Cannot modify index "' + indexName + '" for current version. Please bump version number to ' + ( this.dbVersion + 1 ) + '.'));
            }

            existingIndexes.splice(existingIndexes.indexOf(indexName), 1);
          } else {
            preventSuccessCallback = true;
            this.onError(new Error('Cannot create new index "' + indexName + '" for current version. Please bump version number to ' + ( this.dbVersion + 1 ) + '.'));
          }

        }, this);

        if (existingIndexes.length) {
          preventSuccessCallback = true;
          this.onError(new Error('Cannot delete index(es) "' + existingIndexes.toString() + '" for current version. Please bump version number to ' + ( this.dbVersion + 1 ) + '.'));
        }

        preventSuccessCallback || this.onStoreReady();
      }.bind(this);

      openRequest.onupgradeneeded = function(/* IDBVersionChangeEvent */ event){

        this.db = event.target.result;

        if(this.db.objectStoreNames.contains(this.storeName)){
          this.store = event.target.transaction.objectStore(this.storeName);
        } else {
          var optionalParameters = { autoIncrement: this.autoIncrement };
          if (this.keyPath !== null) {
            optionalParameters.keyPath = this.keyPath;
          }
          this.store = this.db.createObjectStore(this.storeName, optionalParameters);
        }

        var existingIndexes = Array.prototype.slice.call(this.getIndexList());
        this.indexes.forEach(function(indexData){
          var indexName = indexData.name;

          if(!indexName){
            preventSuccessCallback = true;
            this.onError(new Error('Cannot create index: No index name given.'));
          }

          this.normalizeIndexData(indexData);

          if(this.hasIndex(indexName)){
            // check if it complies
            var actualIndex = this.store.index(indexName);
            var complies = this.indexComplies(actualIndex, indexData);
            if(!complies){
              // index differs, need to delete and re-create
              this.store.deleteIndex(indexName);
              this.store.createIndex(indexName, indexData.keyPath, { unique: indexData.unique, multiEntry: indexData.multiEntry });
            }

            existingIndexes.splice(existingIndexes.indexOf(indexName), 1);
          } else {
            this.store.createIndex(indexName, indexData.keyPath, { unique: indexData.unique, multiEntry: indexData.multiEntry });
          }

        }, this);

        if (existingIndexes.length) {
          existingIndexes.forEach(function(_indexName){
            this.store.deleteIndex(_indexName);
          }, this);
        }

      }.bind(this);
    },

    /**
     * Deletes the database used for this store if the IDB implementations
     * provides that functionality.
     */
    deleteDatabase: function () {
      if (this.idb.deleteDatabase) {
        this.idb.deleteDatabase(this.dbName);
      }
    },

    /*********************
     * data manipulation *
     *********************/

    /**
     * Puts an object into the store. If an entry with the given id exists,
     * it will be overwritten. This method has a different signature for inline
     * keys and out-of-line keys; please see the examples below.
     *
     * @param {*} [key] The key to store. This is only needed if IDBWrapper
     *  is set to use out-of-line keys. For inline keys - the default scenario -
     *  this can be omitted.
     * @param {Object} value The data object to store.
     * @param {Function} [onSuccess] A callback that is called if insertion
     *  was successful.
     * @param {Function} [onError] A callback that is called if insertion
     *  failed.
     * @returns {IDBTransaction} The transaction used for this operation.
     * @example
        // Storing an object, using inline keys (the default scenario):
        var myCustomer = {
          customerid: 2346223,
          lastname: 'Doe',
          firstname: 'John'
        };
        myCustomerStore.put(myCustomer, mySuccessHandler, myErrorHandler);
        // Note that passing success- and error-handlers is optional.
     * @example
        // Storing an object, using out-of-line keys:
       var myCustomer = {
         lastname: 'Doe',
         firstname: 'John'
       };
       myCustomerStore.put(2346223, myCustomer, mySuccessHandler, myErrorHandler);
      // Note that passing success- and error-handlers is optional.
     */
    put: function (key, value, onSuccess, onError) {
      if (this.keyPath !== null) {
        onError = onSuccess;
        onSuccess = value;
        value = key;
      }
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);

      var hasSuccess = false,
          result = null,
          putRequest;

      var putTransaction = this.db.transaction([this.storeName], this.consts.READ_WRITE);
      putTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      putTransaction.onabort = onError;
      putTransaction.onerror = onError;

      if (this.keyPath !== null) { // in-line keys
        this._addIdPropertyIfNeeded(value);
        putRequest = putTransaction.objectStore(this.storeName).put(value);
      } else { // out-of-line keys
        putRequest = putTransaction.objectStore(this.storeName).put(value, key);
      }
      putRequest.onsuccess = function (event) {
        hasSuccess = true;
        result = event.target.result;
      };
      putRequest.onerror = onError;

      return putTransaction;
    },

    /**
     * Retrieves an object from the store. If no entry exists with the given id,
     * the success handler will be called with null as first and only argument.
     *
     * @param {*} key The id of the object to fetch.
     * @param {Function} [onSuccess] A callback that is called if fetching
     *  was successful. Will receive the object as only argument.
     * @param {Function} [onError] A callback that will be called if an error
     *  occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    get: function (key, onSuccess, onError) {
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);

      var hasSuccess = false,
          result = null;
      
      var getTransaction = this.db.transaction([this.storeName], this.consts.READ_ONLY);
      getTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      getTransaction.onabort = onError;
      getTransaction.onerror = onError;
      var getRequest = getTransaction.objectStore(this.storeName).get(key);
      getRequest.onsuccess = function (event) {
        hasSuccess = true;
        result = event.target.result;
      };
      getRequest.onerror = onError;

      return getTransaction;
    },

    /**
     * Removes an object from the store.
     *
     * @param {*} key The id of the object to remove.
     * @param {Function} [onSuccess] A callback that is called if the removal
     *  was successful.
     * @param {Function} [onError] A callback that will be called if an error
     *  occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    remove: function (key, onSuccess, onError) {
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);

      var hasSuccess = false,
          result = null;

      var removeTransaction = this.db.transaction([this.storeName], this.consts.READ_WRITE);
      removeTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      removeTransaction.onabort = onError;
      removeTransaction.onerror = onError;

      var deleteRequest = removeTransaction.objectStore(this.storeName)['delete'](key);
      deleteRequest.onsuccess = function (event) {
        hasSuccess = true;
        result = event.target.result;
      };
      deleteRequest.onerror = onError;

      return removeTransaction;
    },

    /**
     * Runs a batch of put and/or remove operations on the store.
     *
     * @param {Array} dataArray An array of objects containing the operation to run
     *  and the data object (for put operations).
     * @param {Function} [onSuccess] A callback that is called if all operations
     *  were successful.
     * @param {Function} [onError] A callback that is called if an error
     *  occurred during one of the operations.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    batch: function (dataArray, onSuccess, onError) {
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);

      if(Object.prototype.toString.call(dataArray) != '[object Array]'){
        onError(new Error('dataArray argument must be of type Array.'));
      }
      var batchTransaction = this.db.transaction([this.storeName] , this.consts.READ_WRITE);
      batchTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(hasSuccess);
      };
      batchTransaction.onabort = onError;
      batchTransaction.onerror = onError;
      
      var count = dataArray.length;
      var called = false;
      var hasSuccess = false;

      var onItemSuccess = function () {
        count--;
        if (count === 0 && !called) {
          called = true;
          hasSuccess = true;
        }
      };

      dataArray.forEach(function (operation) {
        var type = operation.type;
        var key = operation.key;
        var value = operation.value;

        var onItemError = function (err) {
          batchTransaction.abort();
          if (!called) {
            called = true;
            onError(err, type, key);
          }
        };

        if (type == 'remove') {
          var deleteRequest = batchTransaction.objectStore(this.storeName)['delete'](key);
          deleteRequest.onsuccess = onItemSuccess;
          deleteRequest.onerror = onItemError;
        } else if (type == 'put') {
          var putRequest;
          if (this.keyPath !== null) { // in-line keys
            this._addIdPropertyIfNeeded(value);
            putRequest = batchTransaction.objectStore(this.storeName).put(value);
          } else { // out-of-line keys
            putRequest = batchTransaction.objectStore(this.storeName).put(value, key);
          }
          putRequest.onsuccess = onItemSuccess;
          putRequest.onerror = onItemError;
        }
      }, this);

      return batchTransaction;
    },

    /**
     * Takes an array of objects and stores them in a single transaction.
     *
     * @param {Array} dataArray An array of objects to store
     * @param {Function} [onSuccess] A callback that is called if all operations
     *  were successful.
     * @param {Function} [onError] A callback that is called if an error
     *  occurred during one of the operations.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    putBatch: function (dataArray, onSuccess, onError) {
      var batchData = dataArray.map(function(item){
        return { type: 'put', value: item };
      });

      return this.batch(batchData, onSuccess, onError);
    },

    /**
     * Takes an array of keys and removes matching objects in a single
     * transaction.
     *
     * @param {Array} keyArray An array of keys to remove
     * @param {Function} [onSuccess] A callback that is called if all operations
     *  were successful.
     * @param {Function} [onError] A callback that is called if an error
     *  occurred during one of the operations.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    removeBatch: function (keyArray, onSuccess, onError) {
      var batchData = keyArray.map(function(key){
        return { type: 'remove', key: key };
      });

      return this.batch(batchData, onSuccess, onError);
    },

    /**
     * Takes an array of keys and fetches matching objects
     *
     * @param {Array} keyArray An array of keys identifying the objects to fetch
     * @param {Function} [onSuccess] A callback that is called if all operations
     *  were successful.
     * @param {Function} [onError] A callback that is called if an error
     *  occurred during one of the operations.
     * @param {String} [arrayType='sparse'] The type of array to pass to the
     *  success handler. May be one of 'sparse', 'dense' or 'skip'. Defaults to
     *  'sparse'. This parameter specifies how to handle the situation if a get
     *  operation did not throw an error, but there was no matching object in
     *  the database. In most cases, 'sparse' provides the most desired
     *  behavior. See the examples for details.
     * @returns {IDBTransaction} The transaction used for this operation.
     * @example
     // given that there are two objects in the database with the keypath
     // values 1 and 2, and the call looks like this:
     myStore.getBatch([1, 5, 2], onError, function (data) { … }, arrayType);

     // this is what the `data` array will be like:

     // arrayType == 'sparse':
     // data is a sparse array containing two entries and having a length of 3:
       [Object, 2: Object]
         0: Object
         2: Object
         length: 3
         __proto__: Array[0]
     // calling forEach on data will result in the callback being called two
     // times, with the index parameter matching the index of the key in the
     // keyArray.

     // arrayType == 'dense':
     // data is a dense array containing three entries and having a length of 3,
     // where data[1] is of type undefined:
       [Object, undefined, Object]
         0: Object
         1: undefined
         2: Object
         length: 3
         __proto__: Array[0]
     // calling forEach on data will result in the callback being called three
     // times, with the index parameter matching the index of the key in the
     // keyArray, but the second call will have undefined as first argument.

     // arrayType == 'skip':
     // data is a dense array containing two entries and having a length of 2:
       [Object, Object]
         0: Object
         1: Object
         length: 2
         __proto__: Array[0]
     // calling forEach on data will result in the callback being called two
     // times, with the index parameter not matching the index of the key in the
     // keyArray.
     */
    getBatch: function (keyArray, onSuccess, onError, arrayType) {
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);
      arrayType || (arrayType = 'sparse');

      if(Object.prototype.toString.call(keyArray) != '[object Array]'){
        onError(new Error('keyArray argument must be of type Array.'));
      }
      var batchTransaction = this.db.transaction([this.storeName] , this.consts.READ_ONLY);
      batchTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      batchTransaction.onabort = onError;
      batchTransaction.onerror = onError;

      var data = [];
      var count = keyArray.length;
      var called = false;
      var hasSuccess = false;
      var result = null;

      var onItemSuccess = function (event) {
        if (event.target.result || arrayType == 'dense') {
          data.push(event.target.result);
        } else if (arrayType == 'sparse') {
          data.length++;
        }
        count--;
        if (count === 0) {
          called = true;
          hasSuccess = true;
          result = data;
        }
      };

      keyArray.forEach(function (key) {

        var onItemError = function (err) {
          called = true;
          result = err;
          onError(err);
          batchTransaction.abort();
        };

        var getRequest = batchTransaction.objectStore(this.storeName).get(key);
        getRequest.onsuccess = onItemSuccess;
        getRequest.onerror = onItemError;

      }, this);

      return batchTransaction;
    },

    /**
     * Fetches all entries in the store.
     *
     * @param {Function} [onSuccess] A callback that is called if the operation
     *  was successful. Will receive an array of objects.
     * @param {Function} [onError] A callback that will be called if an error
     *  occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    getAll: function (onSuccess, onError) {
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);
      var getAllTransaction = this.db.transaction([this.storeName], this.consts.READ_ONLY);
      var store = getAllTransaction.objectStore(this.storeName);
      if (store.getAll) {
        this._getAllNative(getAllTransaction, store, onSuccess, onError);
      } else {
        this._getAllCursor(getAllTransaction, store, onSuccess, onError);
      }

      return getAllTransaction;
    },

    /**
     * Implements getAll for IDB implementations that have a non-standard
     * getAll() method.
     *
     * @param {Object} getAllTransaction An open READ transaction.
     * @param {Object} store A reference to the store.
     * @param {Function} onSuccess A callback that will be called if the
     *  operation was successful.
     * @param {Function} onError A callback that will be called if an
     *  error occurred during the operation.
     * @private
     */
    _getAllNative: function (getAllTransaction, store, onSuccess, onError) {
      var hasSuccess = false,
          result = null;

      getAllTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      getAllTransaction.onabort = onError;
      getAllTransaction.onerror = onError;

      var getAllRequest = store.getAll();
      getAllRequest.onsuccess = function (event) {
        hasSuccess = true;
        result = event.target.result;
      };
      getAllRequest.onerror = onError;
    },

    /**
     * Implements getAll for IDB implementations that do not have a getAll()
     * method.
     *
     * @param {Object} getAllTransaction An open READ transaction.
     * @param {Object} store A reference to the store.
     * @param {Function} onSuccess A callback that will be called if the
     *  operation was successful.
     * @param {Function} onError A callback that will be called if an
     *  error occurred during the operation.
     * @private
     */
    _getAllCursor: function (getAllTransaction, store, onSuccess, onError) {
      var all = [],
          hasSuccess = false,
          result = null;

      getAllTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      getAllTransaction.onabort = onError;
      getAllTransaction.onerror = onError;

      var cursorRequest = store.openCursor();
      cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          all.push(cursor.value);
          cursor['continue']();
        }
        else {
          hasSuccess = true;
          result = all;
        }
      };
      cursorRequest.onError = onError;
    },

    /**
     * Clears the store, i.e. deletes all entries in the store.
     *
     * @param {Function} [onSuccess] A callback that will be called if the
     *  operation was successful.
     * @param {Function} [onError] A callback that will be called if an
     *  error occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    clear: function (onSuccess, onError) {
      onError || (onError = defaultErrorHandler);
      onSuccess || (onSuccess = noop);

      var hasSuccess = false,
          result = null;

      var clearTransaction = this.db.transaction([this.storeName], this.consts.READ_WRITE);
      clearTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      clearTransaction.onabort = onError;
      clearTransaction.onerror = onError;

      var clearRequest = clearTransaction.objectStore(this.storeName).clear();
      clearRequest.onsuccess = function (event) {
        hasSuccess = true;
        result = event.target.result;
      };
      clearRequest.onerror = onError;

      return clearTransaction;
    },

    /**
     * Checks if an id property needs to present on a object and adds one if
     * necessary.
     *
     * @param {Object} dataObj The data object that is about to be stored
     * @private
     */
    _addIdPropertyIfNeeded: function (dataObj) {
      if (!this.features.hasAutoIncrement && typeof dataObj[this.keyPath] == 'undefined') {
        dataObj[this.keyPath] = this._insertIdCount++ + Date.now();
      }
    },

    /************
     * indexing *
     ************/

    /**
     * Returns a DOMStringList of index names of the store.
     *
     * @return {DOMStringList} The list of index names
     */
    getIndexList: function () {
      return this.store.indexNames;
    },

    /**
     * Checks if an index with the given name exists in the store.
     *
     * @param {String} indexName The name of the index to look for
     * @return {Boolean} Whether the store contains an index with the given name
     */
    hasIndex: function (indexName) {
      return this.store.indexNames.contains(indexName);
    },

    /**
     * Normalizes an object containing index data and assures that all
     * properties are set.
     *
     * @param {Object} indexData The index data object to normalize
     * @param {String} indexData.name The name of the index
     * @param {String} [indexData.keyPath] The key path of the index
     * @param {Boolean} [indexData.unique] Whether the index is unique
     * @param {Boolean} [indexData.multiEntry] Whether the index is multi entry
     */
    normalizeIndexData: function (indexData) {
      indexData.keyPath = indexData.keyPath || indexData.name;
      indexData.unique = !!indexData.unique;
      indexData.multiEntry = !!indexData.multiEntry;
    },

    /**
     * Checks if an actual index complies with an expected index.
     *
     * @param {Object} actual The actual index found in the store
     * @param {Object} expected An Object describing an expected index
     * @return {Boolean} Whether both index definitions are identical
     */
    indexComplies: function (actual, expected) {
      var complies = ['keyPath', 'unique', 'multiEntry'].every(function (key) {
        // IE10 returns undefined for no multiEntry
        if (key == 'multiEntry' && actual[key] === undefined && expected[key] === false) {
          return true;
        }
        // Compound keys
        if (key == 'keyPath' && Object.prototype.toString.call(expected[key]) == '[object Array]') {
          var exp = expected.keyPath;
          var act = actual.keyPath;

          // IE10 can't handle keyPath sequences and stores them as a string.
          // The index will be unusable there, but let's still return true if
          // the keyPath sequence matches.
          if (typeof act == 'string') {
            return exp.toString() == act;
          }

          // Chrome/Opera stores keyPath squences as DOMStringList, Firefox
          // as Array
          if ( ! (typeof act.contains == 'function' || typeof act.indexOf == 'function') ) {
            return false;
          }

          if (act.length !== exp.length) {
            return false;
          }

          for (var i = 0, m = exp.length; i<m; i++) {
            if ( ! ( (act.contains && act.contains(exp[i])) || act.indexOf(exp[i] !== -1) )) {
              return false;
            }
          }
          return true;
        }
        return expected[key] == actual[key];
      });
      return complies;
    },

    /**********
     * cursor *
     **********/

    /**
     * Iterates over the store using the given options and calling onItem
     * for each entry matching the options.
     *
     * @param {Function} onItem A callback to be called for each match
     * @param {Object} [options] An object defining specific options
     * @param {Object} [options.index=null] An IDBIndex to operate on
     * @param {String} [options.order=ASC] The order in which to provide the
     *  results, can be 'DESC' or 'ASC'
     * @param {Boolean} [options.autoContinue=true] Whether to automatically
     *  iterate the cursor to the next result
     * @param {Boolean} [options.filterDuplicates=false] Whether to exclude
     *  duplicate matches
     * @param {Object} [options.keyRange=null] An IDBKeyRange to use
     * @param {Boolean} [options.writeAccess=false] Whether grant write access
     *  to the store in the onItem callback
     * @param {Function} [options.onEnd=null] A callback to be called after
     *  iteration has ended
     * @param {Function} [options.onError=throw] A callback to be called
     *  if an error occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    iterate: function (onItem, options) {
      options = mixin({
        index: null,
        order: 'ASC',
        autoContinue: true,
        filterDuplicates: false,
        keyRange: null,
        writeAccess: false,
        onEnd: null,
        onError: defaultErrorHandler
      }, options || {});

      var directionType = options.order.toLowerCase() == 'desc' ? 'PREV' : 'NEXT';
      if (options.filterDuplicates) {
        directionType += '_NO_DUPLICATE';
      }

      var hasSuccess = false;
      var cursorTransaction = this.db.transaction([this.storeName], this.consts[options.writeAccess ? 'READ_WRITE' : 'READ_ONLY']);
      var cursorTarget = cursorTransaction.objectStore(this.storeName);
      if (options.index) {
        cursorTarget = cursorTarget.index(options.index);
      }

      cursorTransaction.oncomplete = function () {
        if (!hasSuccess) {
          options.onError(null);
          return;
        }
        if (options.onEnd) {
          options.onEnd();
        } else {
          onItem(null);
        }
      };
      cursorTransaction.onabort = options.onError;
      cursorTransaction.onerror = options.onError;

      var cursorRequest = cursorTarget.openCursor(options.keyRange, this.consts[directionType]);
      cursorRequest.onerror = options.onError;
      cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          onItem(cursor.value, cursor, cursorTransaction);
          if (options.autoContinue) {
            cursor['continue']();
          }
        } else {
          hasSuccess = true;
        }
      };

      return cursorTransaction;
    },

    /**
     * Runs a query against the store and passes an array containing matched
     * objects to the success handler.
     *
     * @param {Function} onSuccess A callback to be called when the operation
     *  was successful.
     * @param {Object} [options] An object defining specific query options
     * @param {Object} [options.index=null] An IDBIndex to operate on
     * @param {String} [options.order=ASC] The order in which to provide the
     *  results, can be 'DESC' or 'ASC'
     * @param {Boolean} [options.filterDuplicates=false] Whether to exclude
     *  duplicate matches
     * @param {Object} [options.keyRange=null] An IDBKeyRange to use
     * @param {Function} [options.onError=throw] A callback to be called if an error
     *  occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    query: function (onSuccess, options) {
      var result = [];
      options = options || {};
      options.onEnd = function () {
        onSuccess(result);
      };
      return this.iterate(function (item) {
        result.push(item);
      }, options);
    },

    /**
     *
     * Runs a query against the store, but only returns the number of matches
     * instead of the matches itself.
     *
     * @param {Function} onSuccess A callback to be called if the opration
     *  was successful.
     * @param {Object} [options] An object defining specific options
     * @param {Object} [options.index=null] An IDBIndex to operate on
     * @param {Object} [options.keyRange=null] An IDBKeyRange to use
     * @param {Function} [options.onError=throw] A callback to be called if an error
     *  occurred during the operation.
     * @returns {IDBTransaction} The transaction used for this operation.
     */
    count: function (onSuccess, options) {

      options = mixin({
        index: null,
        keyRange: null
      }, options || {});

      var onError = options.onError || defaultErrorHandler;

      var hasSuccess = false,
          result = null;

      var cursorTransaction = this.db.transaction([this.storeName], this.consts.READ_ONLY);
      cursorTransaction.oncomplete = function () {
        var callback = hasSuccess ? onSuccess : onError;
        callback(result);
      };
      cursorTransaction.onabort = onError;
      cursorTransaction.onerror = onError;

      var cursorTarget = cursorTransaction.objectStore(this.storeName);
      if (options.index) {
        cursorTarget = cursorTarget.index(options.index);
      }
      var countRequest = cursorTarget.count(options.keyRange);
      countRequest.onsuccess = function (evt) {
        hasSuccess = true;
        result = evt.target.result;
      };
      countRequest.onError = onError;

      return cursorTransaction;
    },

    /**************/
    /* key ranges */
    /**************/

    /**
     * Creates a key range using specified options. This key range can be
     * handed over to the count() and iterate() methods.
     *
     * Note: You must provide at least one or both of "lower" or "upper" value.
     *
     * @param {Object} options The options for the key range to create
     * @param {*} [options.lower] The lower bound
     * @param {Boolean} [options.excludeLower] Whether to exclude the lower
     *  bound passed in options.lower from the key range
     * @param {*} [options.upper] The upper bound
     * @param {Boolean} [options.excludeUpper] Whether to exclude the upper
     *  bound passed in options.upper from the key range
     * @param {*} [options.only] A single key value. Use this if you need a key
     *  range that only includes one value for a key. Providing this
     *  property invalidates all other properties.
     * @return {Object} The IDBKeyRange representing the specified options
     */
    makeKeyRange: function(options){
      /*jshint onecase:true */
      var keyRange,
          hasLower = typeof options.lower != 'undefined',
          hasUpper = typeof options.upper != 'undefined',
          isOnly = typeof options.only != 'undefined';

      switch(true){
        case isOnly:
          keyRange = this.keyRange.only(options.only);
          break;
        case hasLower && hasUpper:
          keyRange = this.keyRange.bound(options.lower, options.upper, options.excludeLower, options.excludeUpper);
          break;
        case hasLower:
          keyRange = this.keyRange.lowerBound(options.lower, options.excludeLower);
          break;
        case hasUpper:
          keyRange = this.keyRange.upperBound(options.upper, options.excludeUpper);
          break;
        default:
          throw new Error('Cannot create KeyRange. Provide one or both of "lower" or "upper" value, or an "only" value.');
      }

      return keyRange;

    }

  };

  /** helpers **/

  var noop = function () {
  };
  var empty = {};
  var mixin = function (target, source) {
    var name, s;
    for (name in source) {
      s = source[name];
      if (s !== empty[name] && s !== target[name]) {
        target[name] = s;
      }
    }
    return target;
  };

  IDBStore.version = IDBStore.prototype.version;

  return IDBStore;

}, this);

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/isbuffer/index.js":[function(require,module,exports){
var Buffer = require('buffer').Buffer;

module.exports = isBuffer;

function isBuffer (o) {
  return Buffer.isBuffer(o)
    || /\[object (.+Array|Array.+)\]/.test(Object.prototype.toString.call(o));
}

},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/ltgt/index.js":[function(require,module,exports){
(function (Buffer){

exports.compare = function (a, b) {

  if(Buffer.isBuffer(a)) {
    var l = Math.min(a.length, b.length)
    for(var i = 0; i < l; i++) {
      var cmp = a[i] - b[i]
      if(cmp) return cmp
    }
    return a.length - b.length
  }

  return a < b ? -1 : a > b ? 1 : 0
}

function has(obj, key) {
  return Object.hasOwnProperty.call(obj, key)
}

// to be compatible with the current abstract-leveldown tests
// nullish or empty strings.
// I could use !!val but I want to permit numbers and booleans,
// if possible.

function isDef (val) {
  return val !== undefined && val !== ''
}

function has (range, name) {
  return Object.hasOwnProperty.call(range, name)
}

function hasKey(range, name) {
  return Object.hasOwnProperty.call(range, name) && name
}

var lowerBoundKey = exports.lowerBoundKey = function (range) {
    return (
       hasKey(range, 'gt')
    || hasKey(range, 'gte')
    || hasKey(range, 'min')
    || (range.reverse ? hasKey(range, 'end') : hasKey(range, 'start'))
    || undefined
    )
}

var lowerBound = exports.lowerBound = function (range) {
  var k = lowerBoundKey(range)
  return k && range[k]
  return (
      has(range, 'gt')                      ? range.gt
    : has(range, 'gte')                     ? range.gte
    : has(range, 'min')                     ? range.min
    : has(range, 'start') && !range.reverse ? range.start
    : has(range, 'end')   && range.reverse  ? range.end
    :                                         undefined
  )
}

exports.lowerBoundInclusive = function (range) {
  return has(range, 'gt') ? false : true
}

exports.upperBoundInclusive =
  function (range) {
    return has(range, 'lt') || !range.minEx ? false : true
  }

var lowerBoundExclusive = exports.lowerBoundExclusive =
  function (range) {
    return has(range, 'gt') || range.minEx ? true : false
  }

var upperBoundExclusive = exports.upperBoundExclusive =
  function (range) {
    return has(range, 'lt') ? true : false
  }

var upperBoundKey = exports.upperBoundKey = function (range) {
    return (
       hasKey(range, 'lt')
    || hasKey(range, 'lte')
    || hasKey(range, 'max')
    || (range.reverse ? hasKey(range, 'start') : hasKey(range, 'end'))
    || undefined
    )
}

var upperBound = exports.upperBound = function (range) {
  var k = upperBoundKey(range)
  return k && range[k]
}

function id (e) { return e }

exports.toLtgt = function (range, _range, map, lower, upper) {
  _range = _range || {}
  map = map || id
  var defaults = arguments.length > 3
  var lb = exports.lowerBoundKey(range)
  var ub = exports.upperBoundKey(range)
  if(lb) {
    if(lb === 'gt') _range.gt = map(range.gt)
    else            _range.gte = map(range[lb])
  }
  else if(defaults)
    _range.gte = lower

  if(ub) {
    if(ub === 'lt') _range.lt = map(range.lt)
    else            _range.lte = map(range[ub])
  }
  else if(defaults)
    _range.lte = upper

  _range.reverse = !!range.reverse

  return _range
}

exports.contains = function (range, key, compare) {
  compare = compare || exports.compare

  var lb = lowerBound(range)
  if(isDef(lb)) {
    var cmp = compare(key, lb)
    if(cmp < 0 || (cmp === 0 && lowerBoundExclusive(range)))
      return false
  }

  var ub = upperBound(range)
  if(isDef(ub)) {
    var cmp = compare(key, ub)
    if(cmp > 0 || (cmp === 0) && upperBoundExclusive(range))
      return false
  }

  return true
}

exports.filter = function (range, compare) {
  return function (key) {
    return exports.contains(range, key, compare)
  }
}

}).call(this,require("buffer").Buffer)
},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/typedarray-to-buffer/index.js":[function(require,module,exports){
(function (Buffer){
/**
 * Convert a typed array to a Buffer without a copy
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install typedarray-to-buffer`
 */

module.exports = function (arr) {
  if (typeof Buffer._augment === 'function' && Buffer.TYPED_ARRAY_SUPPORT) {
    // If `Buffer` is from the `buffer` module and this browser supports typed arrays,
    // then augment it with all the `Buffer` methods.
    return Buffer._augment(arr)
  } else {
    // Otherwise, fallback to creating a `Buffer` with a copy.
    return new Buffer(arr)
  }
}

}).call(this,require("buffer").Buffer)
},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/has-keys.js":[function(require,module,exports){
module.exports = hasKeys

function hasKeys(source) {
    return source !== null &&
        (typeof source === "object" ||
        typeof source === "function")
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/index.js":[function(require,module,exports){
var Keys = require("object-keys")
var hasKeys = require("./has-keys")

module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        if (!hasKeys(source)) {
            continue
        }

        var keys = Keys(source)

        for (var j = 0; j < keys.length; j++) {
            var name = keys[j]
            target[name] = source[name]
        }
    }

    return target
}

},{"./has-keys":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/has-keys.js","object-keys":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/foreach.js":[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var isFunction = function (fn) {
	var isFunc = (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
	if (!isFunc && typeof window !== 'undefined') {
		isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
	}
	return isFunc;
};

module.exports = function forEach(obj, fn) {
	if (!isFunction(fn)) {
		throw new TypeError('iterator must be a function');
	}
	var i, k,
		isString = typeof obj === 'string',
		l = obj.length,
		context = arguments.length > 2 ? arguments[2] : null;
	if (l === +l) {
		for (i = 0; i < l; i++) {
			if (context === null) {
				fn(isString ? obj.charAt(i) : obj[i], i, obj);
			} else {
				fn.call(context, isString ? obj.charAt(i) : obj[i], i, obj);
			}
		}
	} else {
		for (k in obj) {
			if (hasOwn.call(obj, k)) {
				if (context === null) {
					fn(obj[k], k, obj);
				} else {
					fn.call(context, obj[k], k, obj);
				}
			}
		}
	}
};


},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/index.js":[function(require,module,exports){
module.exports = Object.keys || require('./shim');


},{"./shim":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/shim.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/isArguments.js":[function(require,module,exports){
var toString = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toString.call(value);
	var isArguments = str === '[object Arguments]';
	if (!isArguments) {
		isArguments = str !== '[object Array]'
			&& value !== null
			&& typeof value === 'object'
			&& typeof value.length === 'number'
			&& value.length >= 0
			&& toString.call(value.callee) === '[object Function]';
	}
	return isArguments;
};


},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/shim.js":[function(require,module,exports){
(function () {
	"use strict";

	// modified from https://github.com/kriskowal/es5-shim
	var has = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		forEach = require('./foreach'),
		isArgs = require('./isArguments'),
		hasDontEnumBug = !({'toString': null}).propertyIsEnumerable('toString'),
		hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
		dontEnums = [
			"toString",
			"toLocaleString",
			"valueOf",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"constructor"
		],
		keysShim;

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object',
			isFunction = toString.call(object) === '[object Function]',
			isArguments = isArgs(object),
			theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError("Object.keys called on a non-object");
		}

		if (isArguments) {
			forEach(object, function (value) {
				theKeys.push(value);
			});
		} else {
			var name,
				skipProto = hasProtoEnumBug && isFunction;

			for (name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(name);
				}
			}
		}

		if (hasDontEnumBug) {
			var ctor = object.constructor,
				skipConstructor = ctor && ctor.prototype === object;

			forEach(dontEnums, function (dontEnum) {
				if (!(skipConstructor && dontEnum === 'constructor') && has.call(object, dontEnum)) {
					theKeys.push(dontEnum);
				}
			});
		}
		return theKeys;
	};

	module.exports = keysShim;
}());


},{"./foreach":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/foreach.js","./isArguments":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/xtend/node_modules/object-keys/isArguments.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/batch.js":[function(require,module,exports){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var util          = require('./util')
  , WriteError    = require('./errors').WriteError

  , getOptions    = util.getOptions
  , dispatchError = util.dispatchError

function Batch (levelup, codec) {
  this._levelup = levelup
  this._codec = codec
  this.batch = levelup.db.batch()
  this.ops = []
}

Batch.prototype.put = function (key_, value_, options) {
  options = getOptions(this._levelup, options)

  var key   = this._codec.encodeKey(key_, options)
    , value = this._codec.encodeValue(value_, options)

  try {
    this.batch.put(key, value)
  } catch (e) {
    throw new WriteError(e)
  }
  this.ops.push({ type : 'put', key : key, value : value })

  return this
}

Batch.prototype.del = function (key_, options) {
  options = getOptions(this._levelup, options)

  var key = this._codec.encodeKey(key_, options)

  try {
    this.batch.del(key)
  } catch (err) {
    throw new WriteError(err)
  }
  this.ops.push({ type : 'del', key : key })

  return this
}

Batch.prototype.clear = function () {
  try {
    this.batch.clear()
  } catch (err) {
    throw new WriteError(err)
  }

  this.ops = []
  return this
}

Batch.prototype.write = function (callback) {
  var levelup = this._levelup
    , ops     = this.ops

  try {
    this.batch.write(function (err) {
      if (err)
        return dispatchError(levelup, new WriteError(err), callback)
      levelup.emit('batch', ops)
      if (callback)
        callback()
    })
  } catch (err) {
    throw new WriteError(err)
  }
}

module.exports = Batch

},{"./errors":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/errors.js","./util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/util.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/codec.js":[function(require,module,exports){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var encodings = require('./encodings')

function getKeyEncoder (options, op) {
  var type = ((op && op.keyEncoding) || options.keyEncoding) || 'utf8'
  return encodings[type] || type
}

function getValueEncoder (options, op) {
  var type = (((op && (op.valueEncoding || op.encoding))
      || options.valueEncoding || options.encoding)) || 'utf8'
  return encodings[type] || type
}

/*
  Encode a key.
  This method takes two options, because the leveldb instance
  has options, and this operation (a put, del, or batch)
  also has options that may override the leveldb's options.
*/

function encodeKey (key, options, op) {
  return getKeyEncoder(options, op).encode(key)
}

/*
  Encode a value.
  Takes 2 options, for the same reason as encodeKey
*/

function encodeValue (value, options, op) {
  return getValueEncoder(options, op).encode(value)
}

/*
  Decode an encoded key
*/

function decodeKey (key, options) {
  return getKeyEncoder(options).decode(key)
}

/*
  Decode an encoded value
*/

function decodeValue (value, options) {
  return getValueEncoder(options).decode(value)
}

/*
  check whether this value should be requested as a buffer
  (if false, then it will be a string)
  this allows an optimization in leveldown where leveldown
  retrives a string directly, and thus avoids a memory copy.
*/

function isValueAsBuffer (options, op) {
  return getValueEncoder(options, op).buffer
}

/*
  check whether a given key should be requested as a buffer.
*/

function isKeyAsBuffer (options, op) {
  return getKeyEncoder(options, op).buffer
}


module.exports = {
    encodeKey       : encodeKey
  , encodeValue     : encodeValue
  , isValueAsBuffer : isValueAsBuffer
  , isKeyAsBuffer   : isKeyAsBuffer
  , decodeValue     : decodeValue
  , decodeKey       : decodeKey
}

},{"./encodings":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/encodings.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/encodings.js":[function(require,module,exports){
(function (Buffer){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var encodingNames = [
        'hex'
      , 'utf8'
      , 'utf-8'
      , 'ascii'
      , 'binary'
      , 'base64'
      , 'ucs2'
      , 'ucs-2'
      , 'utf16le'
      , 'utf-16le'
    ]

module.exports = (function () {
  function isBinary (data) {
    return data === undefined || data === null || Buffer.isBuffer(data)
  }

  var encodings = {}

  encodings.utf8 = encodings['utf-8'] = {
      encode : function (data) {
        return isBinary(data) ? data : String(data)
      }
    , decode : function (data) { return data }
    , buffer : false
    , type   : 'utf8'
  }

  encodings.json = {
      encode : JSON.stringify
    , decode : JSON.parse
    , buffer : false
    , type   : 'json'
  }

  encodings.binary = {
      encode : function (data) {
        return isBinary(data) ? data : new Buffer(data)
      }
    , decode : function (data) {
        return data
      }
    , buffer : true
    , type   : 'binary'
  }

  encodingNames.forEach(function (type) {
    if (encodings[type])
      return

    encodings[type] = {
        encode : function (data) {
          return isBinary(data) ? data : new Buffer(data, type)
        }
      , decode : function (buffer) {
          return buffer.toString(type)
        }
      , buffer : true
      , type   : type // useful for debugging purposes
    }
  })

  return encodings
})()


}).call(this,require("buffer").Buffer)
},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/errors.js":[function(require,module,exports){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var createError   = require('errno').create
  , LevelUPError  = createError('LevelUPError')
  , NotFoundError = createError('NotFoundError', LevelUPError)

NotFoundError.prototype.notFound = true
NotFoundError.prototype.status   = 404

module.exports = {
    LevelUPError        : LevelUPError
  , InitializationError : createError('InitializationError', LevelUPError)
  , OpenError           : createError('OpenError', LevelUPError)
  , ReadError           : createError('ReadError', LevelUPError)
  , WriteError          : createError('WriteError', LevelUPError)
  , NotFoundError       : NotFoundError
  , EncodingError       : createError('EncodingError', LevelUPError)
}

},{"errno":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/errno/errno.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/levelup.js":[function(require,module,exports){
(function (process){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var EventEmitter   = require('events').EventEmitter
  , inherits       = require('util').inherits
  , extend         = require('xtend')
  , prr            = require('prr')
  , DeferredLevelDOWN = require('deferred-leveldown')

  , WriteError     = require('./errors').WriteError
  , ReadError      = require('./errors').ReadError
  , NotFoundError  = require('./errors').NotFoundError
  , OpenError      = require('./errors').OpenError
  , EncodingError  = require('./errors').EncodingError
  , InitializationError = require('./errors').InitializationError

  , ReadStream     = require('./read-stream')
  , WriteStream    = require('./write-stream')
  , util           = require('./util')
  , Batch          = require('./batch')
  , codec          = require('./codec')

  , getOptions     = util.getOptions
  , defaultOptions = util.defaultOptions
  , getLevelDOWN   = util.getLevelDOWN
  , dispatchError  = util.dispatchError
  , isDefined      = util.isDefined

function getCallback (options, callback) {
  return typeof options == 'function' ? options : callback
}

// Possible LevelUP#_status values:
//  - 'new'     - newly created, not opened or closed
//  - 'opening' - waiting for the database to be opened, post open()
//  - 'open'    - successfully opened the database, available for use
//  - 'closing' - waiting for the database to be closed, post close()
//  - 'closed'  - database has been successfully closed, should not be
//                 used except for another open() operation

function LevelUP (location, options, callback) {
  if (!(this instanceof LevelUP))
    return new LevelUP(location, options, callback)

  var error

  EventEmitter.call(this)
  this.setMaxListeners(Infinity)

  if (typeof location == 'function') {
    options = typeof options == 'object' ? options : {}
    options.db = location
    location = null
  } else if (typeof location == 'object' && typeof location.db == 'function') {
    options = location
    location = null
  }


  if (typeof options == 'function') {
    callback = options
    options  = {}
  }

  if ((!options || typeof options.db != 'function') && typeof location != 'string') {
    error = new InitializationError(
        'Must provide a location for the database')
    if (callback) {
      return process.nextTick(function () {
        callback(error)
      })
    }
    throw error
  }

  options      = getOptions(this, options)
  this.options = extend(defaultOptions, options)
  this._codec = options.codec || codec
  this._status = 'new'
  // set this.location as enumerable but not configurable or writable
  prr(this, 'location', location, 'e')

  this.open(callback)
}

inherits(LevelUP, EventEmitter)

LevelUP.prototype.open = function (callback) {
  var self = this
    , dbFactory
    , db

  if (this.isOpen()) {
    if (callback)
      process.nextTick(function () { callback(null, self) })
    return this
  }

  if (this._isOpening()) {
    return callback && this.once(
        'open'
      , function () { callback(null, self) }
    )
  }

  this.emit('opening')

  this._status = 'opening'
  this.db      = new DeferredLevelDOWN(this.location)
  dbFactory    = this.options.db || getLevelDOWN()
  db           = dbFactory(this.location)

  db.open(this.options, function (err) {
    if (err) {
      return dispatchError(self, new OpenError(err), callback)
    } else {
      self.db.setDb(db)
      self.db = db
      self._status = 'open'
      if (callback)
        callback(null, self)
      self.emit('open')
      self.emit('ready')
    }
  })
}

LevelUP.prototype.close = function (callback) {
  var self = this

  if (this.isOpen()) {
    this._status = 'closing'
    this.db.close(function () {
      self._status = 'closed'
      self.emit('closed')
      if (callback)
        callback.apply(null, arguments)
    })
    this.emit('closing')
    this.db = null
  } else if (this._status == 'closed' && callback) {
    return process.nextTick(callback)
  } else if (this._status == 'closing' && callback) {
    this.once('closed', callback)
  } else if (this._isOpening()) {
    this.once('open', function () {
      self.close(callback)
    })
  }
}

LevelUP.prototype.isOpen = function () {
  return this._status == 'open'
}

LevelUP.prototype._isOpening = function () {
  return this._status == 'opening'
}

LevelUP.prototype.isClosed = function () {
  return (/^clos/).test(this._status)
}

function maybeError(db, options, callback) {
  if (!db._isOpening() && !db.isOpen()) {
    dispatchError(
        db
      , new ReadError('Database is not open')
      , callback
    )
    return true
  }
}

function writeError (db, message, callback) {
  dispatchError(
      db
     , new WriteError(message)
     , callback
  )
}

function readError (db, message, callback) {
  dispatchError(
      db
     , new ReadError(message)
     , callback
  )
  return true
}


LevelUP.prototype.get = function (key_, options, callback) {
  var self = this
    , key

  callback = getCallback(options, callback)

  if (maybeError(this, options, callback))
    return

  if (key_ === null || key_ === undefined || 'function' !== typeof callback)
    return readError(this
      , 'get() requires key and callback arguments', callback)

  options = util.getOptions(this, options)
  key = this._codec.encodeKey(key_, options)

  options.asBuffer = this._codec.isValueAsBuffer(options)

  this.db.get(key, options, function (err, value) {
    if (err) {
      if ((/notfound/i).test(err)) {
        err = new NotFoundError(
            'Key not found in database [' + key_ + ']', err)
      } else {
        err = new ReadError(err)
      }
      return dispatchError(self, err, callback)
    }
    if (callback) {
      try {
        value = self._codec.decodeValue(value, options)
      } catch (e) {
        return callback(new EncodingError(e))
      }
      callback(null, value)
    }
  })
}

LevelUP.prototype.put = function (key_, value_, options, callback) {
  var self = this
    , key
    , value

  callback = getCallback(options, callback)

  if (key_ === null || key_ === undefined
        || value_ === null || value_ === undefined)
    return writeError(this, 'put() requires key and value arguments', callback)

  if (maybeError(this, options, callback))
    return

  options = getOptions(this, options)
  key     = this._codec.encodeKey(key_, options)
  value   = this._codec.encodeValue(value_, options)

  this.db.put(key, value, options, function (err) {
    if (err) {
      return dispatchError(self, new WriteError(err), callback)
    } else {
      self.emit('put', key_, value_)
      if (callback)
        callback()
    }
  })
}

LevelUP.prototype.del = function (key_, options, callback) {
  var self = this
    , key

  callback = getCallback(options, callback)

  if (key_ === null || key_ === undefined)
    return writeError(this, 'del() requires a key argument', callback)

  if (maybeError(this, options, callback))
    return

  options = getOptions(this, options)
  key     = this._codec.encodeKey(key_, options)

  this.db.del(key, options, function (err) {
    if (err) {
      return dispatchError(self, new WriteError(err), callback)
    } else {
      self.emit('del', key_)
      if (callback)
        callback()
    }
  })
}

LevelUP.prototype.batch = function (arr_, options, callback) {
  var self = this
    , keyEnc
    , valueEnc
    , arr

  if (!arguments.length)
    return new Batch(this, codec)

  callback = getCallback(options, callback)

  if (!Array.isArray(arr_))
    return writeError(this, 'batch() requires an array argument', callback)

  if (maybeError(this, options, callback))
    return

  options  = getOptions(this, options)
  keyEnc   = options.keyEncoding
  valueEnc = options.valueEncoding

  arr = arr_.map(function (e) {
    if (e.type === undefined || e.key === undefined)
      return {}

    // inherit encoding
    var kEnc = e.keyEncoding || keyEnc
      , vEnc = e.valueEncoding || e.encoding || valueEnc
      , o

    // If we're not dealing with plain utf8 strings or plain
    // Buffers then we have to do some work on the array to
    // encode the keys and/or values. This includes JSON types.

    if (kEnc != 'utf8' && kEnc != 'binary'
        || vEnc != 'utf8' && vEnc != 'binary') {
      o = {
          type: e.type
        , key: self._codec.encodeKey(e.key, options, e)
      }

      if (e.value !== undefined)
        o.value = self._codec.encodeValue(e.value, options, e)

      return o
    } else {
      return e
    }
  })

  this.db.batch(arr, options, function (err) {
    if (err) {
      return dispatchError(self, new WriteError(err), callback)
    } else {
      self.emit('batch', arr_)
      if (callback)
        callback()
    }
  })
}

// DEPRECATED: prefer accessing LevelDOWN for this: db.db.approximateSize()
LevelUP.prototype.approximateSize = function (start_, end_, options, callback) {
  var self = this
    , start
    , end

  callback = getCallback(options, callback)

  options = getOptions(options, callback)

  if (start_ === null || start_ === undefined
        || end_ === null || end_ === undefined || 'function' !== typeof callback)
    return readError(this, 'approximateSize() requires start, end and callback arguments', callback)

  start = this._codec.encodeKey(start_, this.options)
  end   = this._codec.encodeKey(end_, this.options)

  this.db.approximateSize(start, end, function (err, size) {
    if (err) {
      return dispatchError(self, new OpenError(err), callback)
    } else if (callback) {
      callback(null, size)
    }
  })
}

LevelUP.prototype.readStream =
LevelUP.prototype.createReadStream = function (options) {
  var self = this
  options = extend( {keys: true, values: true}, this.options, options)

  options.keyEncoding   = options.keyEncoding   || options.encoding
  options.valueEncoding = options.valueEncoding || options.encoding

  if (isDefined(options.start))
    options.start = this._codec.encodeKey(options.start, options)
  if (isDefined(options.end))
    options.end = this._codec.encodeKey(options.end, options)
  if (isDefined(options.gte))
    options.gte = this._codec.encodeKey(options.gte, options)
  if (isDefined(options.gt))
    options.gt = this._codec.encodeKey(options.gt, options)
  if (isDefined(options.lte))
    options.lte = this._codec.encodeKey(options.lte, options)
  if (isDefined(options.lt))
    options.lt = this._codec.encodeKey(options.lt, options)
  if ('number' !== typeof options.limit)
    options.limit = -1

  options.keyAsBuffer   = this._codec.isKeyAsBuffer(options)
  options.valueAsBuffer = this._codec.isValueAsBuffer(options)

  var makeData = options.keys && options.values
    ? function (key, value) {
        return {
            key: self._codec.decodeKey(key, options)
          , value: self._codec.decodeValue(value, options)
        }
      }
    : options.keys
    ? function (key) {
        return self._codec.decodeKey(key, options)
      }
    : options.values
    ? function (_, value) {
        return self._codec.decodeValue(value, options)
      }
    : function () {}

  var stream = new ReadStream(options, makeData)

  if (this.isOpen()) {
    stream.setIterator(self.db.iterator(options))
  } else {
    this.once('ready', function () {
      stream.setIterator(self.db.iterator(options))
    })
  }

  return stream
}

LevelUP.prototype.keyStream =
LevelUP.prototype.createKeyStream = function (options) {
  return this.createReadStream(extend(options, { keys: true, values: false }))
}

LevelUP.prototype.valueStream =
LevelUP.prototype.createValueStream = function (options) {
  return this.createReadStream(extend(options, { keys: false, values: true }))
}

LevelUP.prototype.writeStream =
LevelUP.prototype.createWriteStream = function (options) {
  //XXX is extend needed here?
  return new WriteStream(extend(options), this)
}

LevelUP.prototype.toString = function () {
  return 'LevelUP'
}

function utilStatic (name) {
  return function (location, callback) {
    getLevelDOWN()[name](location, callback || function () {})
  }
}

module.exports         = LevelUP
module.exports.copy    = util.copy
// DEPRECATED: prefer accessing LevelDOWN for this: require('leveldown').destroy()
module.exports.destroy = utilStatic('destroy')
// DEPRECATED: prefer accessing LevelDOWN for this: require('leveldown').repair()
module.exports.repair  = utilStatic('repair')


}).call(this,require('_process'))
},{"./batch":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/batch.js","./codec":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/codec.js","./errors":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/errors.js","./read-stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/read-stream.js","./util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/util.js","./write-stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/write-stream.js","_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","deferred-leveldown":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/deferred-leveldown/deferred-leveldown.js","events":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","prr":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/prr/prr.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js","xtend":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/read-stream.js":[function(require,module,exports){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

// NOTE: we are fixed to readable-stream@1.0.x for now
// for pure Streams2 across Node versions
var Readable      = require('readable-stream').Readable
  , inherits      = require('util').inherits
  , extend        = require('xtend')
  , EncodingError = require('./errors').EncodingError
  , util          = require('./util')



function ReadStream (options, makeData) {
  if (!(this instanceof ReadStream))
    return new ReadStream(options, makeData)

  Readable.call(this, { objectMode: true, highWaterMark: options.highWaterMark })

  // purely to keep `db` around until we're done so it's not GCed if the user doesn't keep a ref

  this._waiting = false
  this._options = options
  this._makeData = makeData
}

inherits(ReadStream, Readable)

ReadStream.prototype.setIterator = function (it) {
  var self = this
  this._iterator = it
  if(this._destroyed) return it.end(function () {})
  if(this._waiting) {
    this._waiting = false
    return this._read()
  }
  return this
}

ReadStream.prototype._read = function read () {
  var self = this
  if (self._destroyed)
    return
  if(!self._iterator)
    return this._waiting = true

  self._iterator.next(function(err, key, value) {
    if (err || (key === undefined && value === undefined)) {
      if (!err && !self._destroyed)
        self.push(null)
      return self._cleanup(err)
    }


    try {
      value = self._makeData(key, value)
    } catch (e) {
      return self._cleanup(new EncodingError(e))
    }
    if (!self._destroyed)
      self.push(value)
  })
}

ReadStream.prototype._cleanup = function (err) {
  if (this._destroyed)
    return

  this._destroyed = true

  var self = this
  if (err)
    self.emit('error', err)

  if (self._iterator) {
    self._iterator.end(function () {
      self._iterator = null
      self.emit('close')
    })
  } else {
    self.emit('close')
  }
}

ReadStream.prototype.destroy = function () {
  this._cleanup()
}

ReadStream.prototype.toString = function () {
  return 'LevelUP.ReadStream'
}


module.exports = ReadStream


},{"./errors":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/errors.js","./util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/util.js","readable-stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/readable.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js","xtend":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/util.js":[function(require,module,exports){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var extend        = require('xtend')
  , LevelUPError  = require('./errors').LevelUPError
  , encodings     = require('./encodings')
  , defaultOptions = {
        createIfMissing : true
      , errorIfExists   : false
      , keyEncoding     : 'utf8'
      , valueEncoding   : 'utf8'
      , compression     : true
    }

  , leveldown
  , encodingOpts = (function () {
      var eo = {}
      for(var e in encodings)
        eo[e] = {valueEncoding: encodings[e]}
      return eo
    }())

function copy (srcdb, dstdb, callback) {
  srcdb.readStream()
    .pipe(dstdb.writeStream())
    .on('close', callback ? callback : function () {})
    .on('error', callback ? callback : function (err) { throw err })
}

function getOptions (levelup, options) {
  var s = typeof options == 'string' // just an encoding
  if (!s && options && options.encoding && !options.valueEncoding)
    options.valueEncoding = options.encoding
  return extend(
      (levelup && levelup.options) || {}
    , s ? encodingOpts[options] || encodingOpts[defaultOptions.valueEncoding]
        : options
  )
}

function getLevelDOWN () {
  if (leveldown)
    return leveldown

  var requiredVersion       = require('../package.json').devDependencies.leveldown
    , missingLevelDOWNError = 'Could not locate LevelDOWN, try `npm install leveldown`'
    , leveldownVersion

  try {
    leveldownVersion = require('leveldown/package').version
  } catch (e) {
    throw new LevelUPError(missingLevelDOWNError)
  }

  if (!require('semver').satisfies(leveldownVersion, requiredVersion)) {
    throw new LevelUPError(
        'Installed version of LevelDOWN ('
      + leveldownVersion
      + ') does not match required version ('
      + requiredVersion
      + ')'
    )
  }

  try {
    return leveldown = require('leveldown')
  } catch (e) {
    throw new LevelUPError(missingLevelDOWNError)
  }
}

function dispatchError (levelup, error, callback) {
  return typeof callback == 'function'
    ? callback(error)
    : levelup.emit('error', error)
}

function isDefined (v) {
  return typeof v !== 'undefined'
}

module.exports = {
    defaultOptions  : defaultOptions
  , copy            : copy
  , getOptions      : getOptions
  , getLevelDOWN    : getLevelDOWN
  , dispatchError   : dispatchError
  , isDefined       : isDefined
}

},{"../package.json":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/package.json","./encodings":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/encodings.js","./errors":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/errors.js","leveldown":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/browser-resolve/empty.js","leveldown/package":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/browser-resolve/empty.js","semver":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/browser-resolve/empty.js","xtend":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/write-stream.js":[function(require,module,exports){
(function (process,global){
/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License
 * <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var Stream       = require('stream').Stream
  , inherits     = require('util').inherits
  , extend       = require('xtend')
  , bl           = require('bl')

  , setImmediate = global.setImmediate || process.nextTick

  , getOptions   = require('./util').getOptions

  , defaultOptions = { type: 'put' }

function WriteStream (options, db) {
  if (!(this instanceof WriteStream))
    return new WriteStream(options, db)

  Stream.call(this)
  this._options = extend(defaultOptions, getOptions(db, options))
  this._db      = db
  this._buffer  = []
  this._status  = 'init'
  this._end     = false
  this.writable = true
  this.readable = false

  var self = this
    , ready = function () {
        if (!self.writable)
          return
        self._status = 'ready'
        self.emit('ready')
        self._process()
      }

  if (db.isOpen())
    setImmediate(ready)
  else
    db.once('ready', ready)
}

inherits(WriteStream, Stream)

WriteStream.prototype.write = function (data) {
  if (!this.writable)
    return false
  this._buffer.push(data)
  if (this._status != 'init')
    this._processDelayed()
  if (this._options.maxBufferLength &&
      this._buffer.length > this._options.maxBufferLength) {
    this._writeBlock = true
    return false
  }
  return true
}

WriteStream.prototype.end = function (data) {
  var self = this
  if (data)
    this.write(data)
  setImmediate(function () {
    self._end = true
    self._process()
  })
}

WriteStream.prototype.destroy = function () {
  this.writable = false
  this.end()
}

WriteStream.prototype.destroySoon = function () {
  this.end()
}

WriteStream.prototype.add = function (entry) {
  if (!entry.props)
    return
  if (entry.props.Directory)
    entry.pipe(this._db.writeStream(this._options))
  else if (entry.props.File || entry.File || entry.type == 'File')
    this._write(entry)
  return true
}

WriteStream.prototype._processDelayed = function () {
  var self = this
  setImmediate(function () {
    self._process()
  })
}

WriteStream.prototype._process = function () {
  var buffer
    , self = this

    , cb = function (err) {
        if (!self.writable)
          return
        if (self._status != 'closed')
          self._status = 'ready'
        if (err) {
          self.writable = false
          return self.emit('error', err)
        }
        self._process()
      }

  if (self._status != 'ready' && self.writable) {
    if (self._buffer.length && self._status != 'closed')
      self._processDelayed()
    return
  }

  if (self._buffer.length && self.writable) {
    self._status = 'writing'
    buffer       = self._buffer
    self._buffer = []

    self._db.batch(buffer.map(function (d) {
      return {
          type          : d.type || self._options.type
        , key           : d.key
        , value         : d.value
        , keyEncoding   : d.keyEncoding || self._options.keyEncoding
        , valueEncoding : d.valueEncoding
            || d.encoding
            || self._options.valueEncoding
      }
    }), cb)

    if (self._writeBlock) {
      self._writeBlock = false
      self.emit('drain')
    }

    // don't allow close until callback has returned
    return
  }

  if (self._end && self._status != 'closed') {
    self._status  = 'closed'
    self.writable = false
    self.emit('close')
  }
}

WriteStream.prototype._write = function (entry) {
  var key = entry.path || entry.props.path
    , self = this

  if (!key)
    return

  entry.pipe(bl(function (err, data) {
    if (err) {
      self.writable = false
      return self.emit('error', err)
    }

    if (self._options.fstreamRoot &&
        key.indexOf(self._options.fstreamRoot) > -1)
      key = key.substr(self._options.fstreamRoot.length + 1)

    self.write({ key: key, value: data.slice(0) })
  }))
}

WriteStream.prototype.toString = function () {
  return 'LevelUP.WriteStream'
}

module.exports = WriteStream

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/lib/util.js","_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","bl":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/bl/bl.js","stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js","xtend":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/bl/bl.js":[function(require,module,exports){
(function (Buffer){
var DuplexStream = require('readable-stream').Duplex
  , util         = require('util')

function BufferList (callback) {
  if (!(this instanceof BufferList))
    return new BufferList(callback)

  this._bufs  = []
  this.length = 0

  if (typeof callback == 'function') {
    this._callback = callback

    var piper = function (err) {
      if (this._callback) {
        this._callback(err)
        this._callback = null
      }
    }.bind(this)

    this.on('pipe', function (src) {
      src.on('error', piper)
    })
    this.on('unpipe', function (src) {
      src.removeListener('error', piper)
    })
  }
  else if (Buffer.isBuffer(callback))
    this.append(callback)
  else if (Array.isArray(callback)) {
    callback.forEach(function (b) {
      Buffer.isBuffer(b) && this.append(b)
    }.bind(this))
  }

  DuplexStream.call(this)
}

util.inherits(BufferList, DuplexStream)

BufferList.prototype._offset = function (offset) {
  var tot = 0, i = 0, _t
  for (; i < this._bufs.length; i++) {
    _t = tot + this._bufs[i].length
    if (offset < _t)
      return [ i, offset - tot ]
    tot = _t
  }
}

BufferList.prototype.append = function (buf) {
  this._bufs.push(Buffer.isBuffer(buf) ? buf : new Buffer(buf))
  this.length += buf.length
  return this
}

BufferList.prototype._write = function (buf, encoding, callback) {
  this.append(buf)
  if (callback)
    callback()
}

BufferList.prototype._read = function (size) {
  if (!this.length)
    return this.push(null)
  size = Math.min(size, this.length)
  this.push(this.slice(0, size))
  this.consume(size)
}

BufferList.prototype.end = function (chunk) {
  DuplexStream.prototype.end.call(this, chunk)

  if (this._callback) {
    this._callback(null, this.slice())
    this._callback = null
  }
}

BufferList.prototype.get = function (index) {
  return this.slice(index, index + 1)[0]
}

BufferList.prototype.slice = function (start, end) {
  return this.copy(null, 0, start, end)
}

BufferList.prototype.copy = function (dst, dstStart, srcStart, srcEnd) {
  if (typeof srcStart != 'number' || srcStart < 0)
    srcStart = 0
  if (typeof srcEnd != 'number' || srcEnd > this.length)
    srcEnd = this.length
  if (srcStart >= this.length)
    return dst || new Buffer(0)
  if (srcEnd <= 0)
    return dst || new Buffer(0)

  var copy   = !!dst
    , off    = this._offset(srcStart)
    , len    = srcEnd - srcStart
    , bytes  = len
    , bufoff = (copy && dstStart) || 0
    , start  = off[1]
    , l
    , i

  // copy/slice everything
  if (srcStart === 0 && srcEnd == this.length) {
    if (!copy) // slice, just return a full concat
      return Buffer.concat(this._bufs)

    // copy, need to copy individual buffers
    for (i = 0; i < this._bufs.length; i++) {
      this._bufs[i].copy(dst, bufoff)
      bufoff += this._bufs[i].length
    }

    return dst
  }

  // easy, cheap case where it's a subset of one of the buffers
  if (bytes <= this._bufs[off[0]].length - start) {
    return copy
      ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes)
      : this._bufs[off[0]].slice(start, start + bytes)
  }

  if (!copy) // a slice, we need something to copy in to
    dst = new Buffer(len)

  for (i = off[0]; i < this._bufs.length; i++) {
    l = this._bufs[i].length - start

    if (bytes > l) {
      this._bufs[i].copy(dst, bufoff, start)
    } else {
      this._bufs[i].copy(dst, bufoff, start, start + bytes)
      break
    }

    bufoff += l
    bytes -= l

    if (start)
      start = 0
  }

  return dst
}

BufferList.prototype.toString = function (encoding, start, end) {
  return this.slice(start, end).toString(encoding)
}

BufferList.prototype.consume = function (bytes) {
  while (this._bufs.length) {
    if (bytes > this._bufs[0].length) {
      bytes -= this._bufs[0].length
      this.length -= this._bufs[0].length
      this._bufs.shift()
    } else {
      this._bufs[0] = this._bufs[0].slice(bytes)
      this.length -= bytes
      break
    }
  }
  return this
}

BufferList.prototype.duplicate = function () {
  var i = 0
    , copy = new BufferList()

  for (; i < this._bufs.length; i++)
    copy.append(this._bufs[i])

  return copy
}

BufferList.prototype.destroy = function () {
  this._bufs.length = 0;
  this.length = 0;
  this.push(null);
}

;(function () {
  var methods = {
      'readDoubleBE' : 8
    , 'readDoubleLE' : 8
    , 'readFloatBE'  : 4
    , 'readFloatLE'  : 4
    , 'readInt32BE'  : 4
    , 'readInt32LE'  : 4
    , 'readUInt32BE' : 4
    , 'readUInt32LE' : 4
    , 'readInt16BE'  : 2
    , 'readInt16LE'  : 2
    , 'readUInt16BE' : 2
    , 'readUInt16LE' : 2
    , 'readInt8'     : 1
    , 'readUInt8'    : 1
  }

  for (var m in methods) {
    (function (m) {
      BufferList.prototype[m] = function (offset) {
        return this.slice(offset, offset + methods[m])[m](0)
      }
    }(m))
  }
}())

module.exports = BufferList

}).call(this,require("buffer").Buffer)
},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","readable-stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/readable.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/deferred-leveldown/deferred-leveldown.js":[function(require,module,exports){
(function (process,Buffer){
var util              = require('util')
  , AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN

function DeferredLevelDOWN (location) {
  AbstractLevelDOWN.call(this, typeof location == 'string' ? location : '') // optional location, who cares?
  this._db         = undefined
  this._operations = []
}

util.inherits(DeferredLevelDOWN, AbstractLevelDOWN)

// called by LevelUP when we have a real DB to take its place
DeferredLevelDOWN.prototype.setDb = function (db) {
  this._db = db
  this._operations.forEach(function (op) {
    db[op.method].apply(db, op.args)
  })
}

DeferredLevelDOWN.prototype._open = function (options, callback) {
  return process.nextTick(callback)
}

// queue a new deferred operation
DeferredLevelDOWN.prototype._operation = function (method, args) {
  if (this._db)
    return this._db[method].apply(this._db, args)
  this._operations.push({ method: method, args: args })
}

// deferrables
'put get del batch approximateSize'.split(' ').forEach(function (m) {
  DeferredLevelDOWN.prototype['_' + m] = function () {
    this._operation(m, arguments)
  }
})

DeferredLevelDOWN.prototype._isBuffer = function (obj) {
  return Buffer.isBuffer(obj)
}

// don't need to implement this as LevelUP's ReadStream checks for 'ready' state
DeferredLevelDOWN.prototype._iterator = function () {
  throw new TypeError('not implemented')
}

module.exports = DeferredLevelDOWN

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","abstract-leveldown":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/deferred-leveldown/node_modules/abstract-leveldown/abstract-leveldown.js","buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","util":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/deferred-leveldown/node_modules/abstract-leveldown/abstract-leveldown.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-leveldown.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-leveldown.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/abstract-leveldown.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/errno/custom.js":[function(require,module,exports){
var prr = require('prr')

function init (type, message, cause) {
  prr(this, {
      type    : type
    , name    : type
      // can be passed just a 'cause'
    , cause   : typeof message != 'string' ? message : cause
    , message : !!message && typeof message != 'string' ? message.message : message

  }, 'ewr')
}

// generic prototype, not intended to be actually used - helpful for `instanceof`
function CustomError (message, cause) {
  Error.call(this)
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, arguments.callee)
  init.call(this, 'CustomError', message, cause)
}

CustomError.prototype = new Error()

function createError (errno, type, proto) {
  var err = function (message, cause) {
    init.call(this, type, message, cause)
    //TODO: the specificity here is stupid, errno should be available everywhere
    if (type == 'FilesystemError') {
      this.code    = this.cause.code
      this.path    = this.cause.path
      this.errno   = this.cause.errno
      this.message =
        (errno.errno[this.cause.errno]
          ? errno.errno[this.cause.errno].description
          : this.cause.message)
        + (this.cause.path ? ' [' + this.cause.path + ']' : '')
    }
    Error.call(this)
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, arguments.callee)
  }
  err.prototype = !!proto ? new proto() : new CustomError()
  return err
}

module.exports = function (errno) {
  var ce = function (type, proto) {
    return createError(errno, type, proto)
  }
  return {
      CustomError     : CustomError
    , FilesystemError : ce('FilesystemError')
    , createError     : ce
  }
}

},{"prr":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/prr/prr.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/errno/errno.js":[function(require,module,exports){
var all = module.exports.all = [
 {
  "errno": -1,
  "code": "UNKNOWN",
  "description": "unknown error"
 },
 {
  "errno": 0,
  "code": "OK",
  "description": "success"
 },
 {
  "errno": 1,
  "code": "EOF",
  "description": "end of file"
 },
 {
  "errno": 2,
  "code": "EADDRINFO",
  "description": "getaddrinfo error"
 },
 {
  "errno": 3,
  "code": "EACCES",
  "description": "permission denied"
 },
 {
  "errno": 4,
  "code": "EAGAIN",
  "description": "resource temporarily unavailable"
 },
 {
  "errno": 5,
  "code": "EADDRINUSE",
  "description": "address already in use"
 },
 {
  "errno": 6,
  "code": "EADDRNOTAVAIL",
  "description": "address not available"
 },
 {
  "errno": 7,
  "code": "EAFNOSUPPORT",
  "description": "address family not supported"
 },
 {
  "errno": 8,
  "code": "EALREADY",
  "description": "connection already in progress"
 },
 {
  "errno": 9,
  "code": "EBADF",
  "description": "bad file descriptor"
 },
 {
  "errno": 10,
  "code": "EBUSY",
  "description": "resource busy or locked"
 },
 {
  "errno": 11,
  "code": "ECONNABORTED",
  "description": "software caused connection abort"
 },
 {
  "errno": 12,
  "code": "ECONNREFUSED",
  "description": "connection refused"
 },
 {
  "errno": 13,
  "code": "ECONNRESET",
  "description": "connection reset by peer"
 },
 {
  "errno": 14,
  "code": "EDESTADDRREQ",
  "description": "destination address required"
 },
 {
  "errno": 15,
  "code": "EFAULT",
  "description": "bad address in system call argument"
 },
 {
  "errno": 16,
  "code": "EHOSTUNREACH",
  "description": "host is unreachable"
 },
 {
  "errno": 17,
  "code": "EINTR",
  "description": "interrupted system call"
 },
 {
  "errno": 18,
  "code": "EINVAL",
  "description": "invalid argument"
 },
 {
  "errno": 19,
  "code": "EISCONN",
  "description": "socket is already connected"
 },
 {
  "errno": 20,
  "code": "EMFILE",
  "description": "too many open files"
 },
 {
  "errno": 21,
  "code": "EMSGSIZE",
  "description": "message too long"
 },
 {
  "errno": 22,
  "code": "ENETDOWN",
  "description": "network is down"
 },
 {
  "errno": 23,
  "code": "ENETUNREACH",
  "description": "network is unreachable"
 },
 {
  "errno": 24,
  "code": "ENFILE",
  "description": "file table overflow"
 },
 {
  "errno": 25,
  "code": "ENOBUFS",
  "description": "no buffer space available"
 },
 {
  "errno": 26,
  "code": "ENOMEM",
  "description": "not enough memory"
 },
 {
  "errno": 27,
  "code": "ENOTDIR",
  "description": "not a directory"
 },
 {
  "errno": 28,
  "code": "EISDIR",
  "description": "illegal operation on a directory"
 },
 {
  "errno": 29,
  "code": "ENONET",
  "description": "machine is not on the network"
 },
 {
  "errno": 31,
  "code": "ENOTCONN",
  "description": "socket is not connected"
 },
 {
  "errno": 32,
  "code": "ENOTSOCK",
  "description": "socket operation on non-socket"
 },
 {
  "errno": 33,
  "code": "ENOTSUP",
  "description": "operation not supported on socket"
 },
 {
  "errno": 34,
  "code": "ENOENT",
  "description": "no such file or directory"
 },
 {
  "errno": 35,
  "code": "ENOSYS",
  "description": "function not implemented"
 },
 {
  "errno": 36,
  "code": "EPIPE",
  "description": "broken pipe"
 },
 {
  "errno": 37,
  "code": "EPROTO",
  "description": "protocol error"
 },
 {
  "errno": 38,
  "code": "EPROTONOSUPPORT",
  "description": "protocol not supported"
 },
 {
  "errno": 39,
  "code": "EPROTOTYPE",
  "description": "protocol wrong type for socket"
 },
 {
  "errno": 40,
  "code": "ETIMEDOUT",
  "description": "connection timed out"
 },
 {
  "errno": 41,
  "code": "ECHARSET",
  "description": "invalid Unicode character"
 },
 {
  "errno": 42,
  "code": "EAIFAMNOSUPPORT",
  "description": "address family for hostname not supported"
 },
 {
  "errno": 44,
  "code": "EAISERVICE",
  "description": "servname not supported for ai_socktype"
 },
 {
  "errno": 45,
  "code": "EAISOCKTYPE",
  "description": "ai_socktype not supported"
 },
 {
  "errno": 46,
  "code": "ESHUTDOWN",
  "description": "cannot send after transport endpoint shutdown"
 },
 {
  "errno": 47,
  "code": "EEXIST",
  "description": "file already exists"
 },
 {
  "errno": 48,
  "code": "ESRCH",
  "description": "no such process"
 },
 {
  "errno": 49,
  "code": "ENAMETOOLONG",
  "description": "name too long"
 },
 {
  "errno": 50,
  "code": "EPERM",
  "description": "operation not permitted"
 },
 {
  "errno": 51,
  "code": "ELOOP",
  "description": "too many symbolic links encountered"
 },
 {
  "errno": 52,
  "code": "EXDEV",
  "description": "cross-device link not permitted"
 },
 {
  "errno": 53,
  "code": "ENOTEMPTY",
  "description": "directory not empty"
 },
 {
  "errno": 54,
  "code": "ENOSPC",
  "description": "no space left on device"
 },
 {
  "errno": 55,
  "code": "EIO",
  "description": "i/o error"
 },
 {
  "errno": 56,
  "code": "EROFS",
  "description": "read-only file system"
 },
 {
  "errno": 57,
  "code": "ENODEV",
  "description": "no such device"
 },
 {
  "errno": 58,
  "code": "ESPIPE",
  "description": "invalid seek"
 },
 {
  "errno": 59,
  "code": "ECANCELED",
  "description": "operation canceled"
 }
]


module.exports.errno = {
    '-1': all[0]
  , '0': all[1]
  , '1': all[2]
  , '2': all[3]
  , '3': all[4]
  , '4': all[5]
  , '5': all[6]
  , '6': all[7]
  , '7': all[8]
  , '8': all[9]
  , '9': all[10]
  , '10': all[11]
  , '11': all[12]
  , '12': all[13]
  , '13': all[14]
  , '14': all[15]
  , '15': all[16]
  , '16': all[17]
  , '17': all[18]
  , '18': all[19]
  , '19': all[20]
  , '20': all[21]
  , '21': all[22]
  , '22': all[23]
  , '23': all[24]
  , '24': all[25]
  , '25': all[26]
  , '26': all[27]
  , '27': all[28]
  , '28': all[29]
  , '29': all[30]
  , '31': all[31]
  , '32': all[32]
  , '33': all[33]
  , '34': all[34]
  , '35': all[35]
  , '36': all[36]
  , '37': all[37]
  , '38': all[38]
  , '39': all[39]
  , '40': all[40]
  , '41': all[41]
  , '42': all[42]
  , '44': all[43]
  , '45': all[44]
  , '46': all[45]
  , '47': all[46]
  , '48': all[47]
  , '49': all[48]
  , '50': all[49]
  , '51': all[50]
  , '52': all[51]
  , '53': all[52]
  , '54': all[53]
  , '55': all[54]
  , '56': all[55]
  , '57': all[56]
  , '58': all[57]
  , '59': all[58]
}


module.exports.code = {
    'UNKNOWN': all[0]
  , 'OK': all[1]
  , 'EOF': all[2]
  , 'EADDRINFO': all[3]
  , 'EACCES': all[4]
  , 'EAGAIN': all[5]
  , 'EADDRINUSE': all[6]
  , 'EADDRNOTAVAIL': all[7]
  , 'EAFNOSUPPORT': all[8]
  , 'EALREADY': all[9]
  , 'EBADF': all[10]
  , 'EBUSY': all[11]
  , 'ECONNABORTED': all[12]
  , 'ECONNREFUSED': all[13]
  , 'ECONNRESET': all[14]
  , 'EDESTADDRREQ': all[15]
  , 'EFAULT': all[16]
  , 'EHOSTUNREACH': all[17]
  , 'EINTR': all[18]
  , 'EINVAL': all[19]
  , 'EISCONN': all[20]
  , 'EMFILE': all[21]
  , 'EMSGSIZE': all[22]
  , 'ENETDOWN': all[23]
  , 'ENETUNREACH': all[24]
  , 'ENFILE': all[25]
  , 'ENOBUFS': all[26]
  , 'ENOMEM': all[27]
  , 'ENOTDIR': all[28]
  , 'EISDIR': all[29]
  , 'ENONET': all[30]
  , 'ENOTCONN': all[31]
  , 'ENOTSOCK': all[32]
  , 'ENOTSUP': all[33]
  , 'ENOENT': all[34]
  , 'ENOSYS': all[35]
  , 'EPIPE': all[36]
  , 'EPROTO': all[37]
  , 'EPROTONOSUPPORT': all[38]
  , 'EPROTOTYPE': all[39]
  , 'ETIMEDOUT': all[40]
  , 'ECHARSET': all[41]
  , 'EAIFAMNOSUPPORT': all[42]
  , 'EAISERVICE': all[43]
  , 'EAISOCKTYPE': all[44]
  , 'ESHUTDOWN': all[45]
  , 'EEXIST': all[46]
  , 'ESRCH': all[47]
  , 'ENAMETOOLONG': all[48]
  , 'EPERM': all[49]
  , 'ELOOP': all[50]
  , 'EXDEV': all[51]
  , 'ENOTEMPTY': all[52]
  , 'ENOSPC': all[53]
  , 'EIO': all[54]
  , 'EROFS': all[55]
  , 'ENODEV': all[56]
  , 'ESPIPE': all[57]
  , 'ECANCELED': all[58]
}


module.exports.custom = require("./custom")(module.exports)
module.exports.create = module.exports.custom.createError
},{"./custom":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/errno/custom.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/prr/prr.js":[function(require,module,exports){
/*!
  * prr
  * (c) 2013 Rod Vagg <rod@vagg.org>
  * https://github.com/rvagg/prr
  * License: MIT
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports)
    module.exports = definition()
  else
    context[name] = definition()
})('prr', this, function() {

  var setProperty = typeof Object.defineProperty == 'function'
      ? function (obj, key, options) {
          Object.defineProperty(obj, key, options)
          return obj
        }
      : function (obj, key, options) { // < es5
          obj[key] = options.value
          return obj
        }

    , makeOptions = function (value, options) {
        var oo = typeof options == 'object'
          , os = !oo && typeof options == 'string'
          , op = function (p) {
              return oo
                ? !!options[p]
                : os
                  ? options.indexOf(p[0]) > -1
                  : false
            }

        return {
            enumerable   : op('enumerable')
          , configurable : op('configurable')
          , writable     : op('writable')
          , value        : value
        }
      }

    , prr = function (obj, key, value, options) {
        var k

        options = makeOptions(value, options)

        if (typeof key == 'object') {
          for (k in key) {
            if (Object.hasOwnProperty.call(key, k)) {
              options.value = key[k]
              setProperty(obj, k, options)
            }
          }
          return obj
        }

        return setProperty(obj, key, options)
      }

  return prr
})
},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_readable.js","./_stream_writable":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_writable.js","_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","core-util-is":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_passthrough.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_transform.js","core-util-is":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_readable.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","core-util-is":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","events":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js","isarray":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/isarray/index.js","stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js","string_decoder/":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/string_decoder/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_transform.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js","core-util-is":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_writable.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js","_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js","core-util-is":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/core-util-is/lib/util.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js","stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/core-util-is/lib/util.js":[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/isarray/index.js":[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/string_decoder/index.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/readable.js":[function(require,module,exports){
var Stream = require('stream'); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js","./lib/_stream_passthrough.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_passthrough.js","./lib/_stream_readable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_readable.js","./lib/_stream_transform.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_transform.js","./lib/_stream_writable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_writable.js","stream":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/xtend/index.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/node_modules/xtend/index.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/node_modules/xtend/index.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/level-js/node_modules/abstract-leveldown/node_modules/xtend/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/package.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={
  "name": "levelup",
  "description": "Fast & simple storage - a Node.js-style LevelDB wrapper",
  "version": "0.19.0",
  "contributors": [
    {
      "name": "Rod Vagg",
      "email": "r@va.gg",
      "url": "https://github.com/rvagg"
    },
    {
      "name": "John Chesley",
      "email": "john@chesl.es",
      "url": "https://github.com/chesles/"
    },
    {
      "name": "Jake Verbaten",
      "email": "raynos2@gmail.com",
      "url": "https://github.com/raynos"
    },
    {
      "name": "Dominic Tarr",
      "email": "dominic.tarr@gmail.com",
      "url": "https://github.com/dominictarr"
    },
    {
      "name": "Max Ogden",
      "email": "max@maxogden.com",
      "url": "https://github.com/maxogden"
    },
    {
      "name": "Lars-Magnus Skog",
      "email": "lars.magnus.skog@gmail.com",
      "url": "https://github.com/ralphtheninja"
    },
    {
      "name": "David Björklund",
      "email": "david.bjorklund@gmail.com",
      "url": "https://github.com/kesla"
    },
    {
      "name": "Julian Gruber",
      "email": "julian@juliangruber.com",
      "url": "https://github.com/juliangruber"
    },
    {
      "name": "Paolo Fragomeni",
      "email": "paolo@async.ly",
      "url": "https://github.com/hij1nx"
    },
    {
      "name": "Anton Whalley",
      "email": "anton.whalley@nearform.com",
      "url": "https://github.com/No9"
    },
    {
      "name": "Matteo Collina",
      "email": "matteo.collina@gmail.com",
      "url": "https://github.com/mcollina"
    },
    {
      "name": "Pedro Teixeira",
      "email": "pedro.teixeira@gmail.com",
      "url": "https://github.com/pgte"
    },
    {
      "name": "James Halliday",
      "email": "mail@substack.net",
      "url": "https://github.com/substack"
    }
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/rvagg/node-levelup.git"
  },
  "homepage": "https://github.com/rvagg/node-levelup",
  "keywords": [
    "leveldb",
    "stream",
    "database",
    "db",
    "store",
    "storage",
    "json"
  ],
  "main": "lib/levelup.js",
  "dependencies": {
    "bl": "~0.8.1",
    "deferred-leveldown": "~0.2.0",
    "errno": "~0.1.1",
    "prr": "~0.0.0",
    "readable-stream": "~1.0.26",
    "semver": "~2.3.1",
    "xtend": "~3.0.0"
  },
  "devDependencies": {
    "leveldown": "~0.10.0",
    "bustermove": "*",
    "tap": "*",
    "referee": "*",
    "rimraf": "*",
    "async": "*",
    "fstream": "*",
    "tar": "*",
    "mkfiletree": "*",
    "readfiletree": "*",
    "slow-stream": ">=0.0.4",
    "delayed": "*",
    "boganipsum": "*",
    "du": "*",
    "memdown": "*",
    "msgpack-js": "*"
  },
  "browser": {
    "leveldown": false,
    "leveldown/package": false,
    "semver": false
  },
  "scripts": {
    "test": "tap test/*-test.js --stderr",
    "functionaltests": "node ./test/functional/fstream-test.js && node ./test/functional/binary-data-test.js && node ./test/functional/compat-test.js",
    "alltests": "npm test && npm run-script functionaltests"
  },
  "license": "MIT",
  "gitHead": "fb742b01990139b44b1816de87a6e1b2de629627",
  "bugs": {
    "url": "https://github.com/rvagg/node-levelup/issues"
  },
  "_id": "levelup@0.19.0",
  "_shasum": "f6b60a168c86c2fe5d5953476cbe9786ccf0a3f7",
  "_from": "levelup@*",
  "_npmVersion": "1.4.23",
  "_npmUser": {
    "name": "rvagg",
    "email": "rod@vagg.org"
  },
  "maintainers": [
    {
      "name": "rvagg",
      "email": "rod@vagg.org"
    }
  ],
  "dist": {
    "shasum": "f6b60a168c86c2fe5d5953476cbe9786ccf0a3f7",
    "tarball": "http://registry.npmjs.org/levelup/-/levelup-0.19.0.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/levelup/-/levelup-0.19.0.tgz",
  "readme": "ERROR: No README data found!"
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/browser-resolve/empty.js":[function(require,module,exports){

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/index.js":[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    if (encoding === 'base64')
      subject = base64clean(subject)
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (this.length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start) throw new TypeError('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new TypeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new TypeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","ieee754":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","is-array":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/is-array/index.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js":[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js":[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/buffer/node_modules/is-array/index.js":[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/node_modules/inherits/inherits_browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/duplex.js":[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_duplex.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_duplex.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_passthrough.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_passthrough.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_passthrough.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_passthrough.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_transform.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_transform.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_transform.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_transform.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_writable.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_writable.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_writable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/lib/_stream_writable.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/passthrough.js":[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_passthrough.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/readable.js":[function(require,module,exports){
module.exports=require("/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/readable.js")
},{"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/readable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/levelup/node_modules/readable-stream/readable.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/transform.js":[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_transform.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/writable.js":[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/lib/_stream_writable.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/stream-browserify/index.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js","readable-stream/duplex.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/duplex.js","readable-stream/passthrough.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/passthrough.js","readable-stream/readable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/readable.js","readable-stream/transform.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/transform.js","readable-stream/writable.js":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/readable-stream/writable.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/util.js":[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/util/support/isBufferBrowser.js","_process":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","inherits":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js"}],"/Users/sethvincent/workspace/mossyowl/pizza-clicker/surprises.js":[function(require,module,exports){
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


},{"./message":"/Users/sethvincent/workspace/mossyowl/pizza-clicker/message.js"}]},{},["/Users/sethvincent/workspace/mossyowl/pizza-clicker/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiY2xpY2tzLmpzIiwiaW5kZXguanMiLCJtZXNzYWdlLmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L2xpYi9hdHRyLmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L2xpYi9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbGliL2h0bWwuanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbGliL3NlbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9saWIvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9saWIvdmFsdWUuanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1kZWxlZ2F0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvY29tcG9uZW50LWRlbGVnYXRlL25vZGVfbW9kdWxlcy9jb21wb25lbnQtZXZlbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2Rpc2NvcmUtY2xvc2VzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZGlzY29yZS1jbG9zZXN0L25vZGVfbW9kdWxlcy9jb21wb25lbnQtbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZGlzY29yZS1jbG9zZXN0L25vZGVfbW9kdWxlcy9jb21wb25lbnQtbWF0Y2hlcy1zZWxlY3Rvci9ub2RlX21vZHVsZXMvY29tcG9uZW50LXF1ZXJ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L25vZGVfbW9kdWxlcy9kb20tY2xhc3Nlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLWNsYXNzZXMvbm9kZV9tb2R1bGVzL2luZGV4b2YvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2RvbS1ldmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLXNlbGVjdC9mYWxsYmFjay5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLXNlbGVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLXNlbGVjdC9ub2RlX21vZHVsZXMvcXdlcnkvcXdlcnkuanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2RvbS1zdHlsZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLXN0eWxlL25vZGVfbW9kdWxlcy90by1jYW1lbC1jYXNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L25vZGVfbW9kdWxlcy9kb20tc3R5bGUvbm9kZV9tb2R1bGVzL3RvLWNhbWVsLWNhc2Uvbm9kZV9tb2R1bGVzL3RvLXNwYWNlLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2RvbS1zdHlsZS9ub2RlX21vZHVsZXMvdG8tY2FtZWwtY2FzZS9ub2RlX21vZHVsZXMvdG8tc3BhY2UtY2FzZS9ub2RlX21vZHVsZXMvdG8tbm8tY2FzZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLXRyZWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2RvbS10cmVlL25ldy1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L25vZGVfbW9kdWxlcy9kb20tdHJlZS9zZWxlY3QuanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2RvbS12YWx1ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZG9tLXZhbHVlL25vZGVfbW9kdWxlcy9jb21wb25lbnQtdHlwZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvZm9ybWF0LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2tleS1ldmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMva2V5LWV2ZW50L25vZGVfbW9kdWxlcy9kb20tZXZlbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL2tleS1ldmVudC9ub2RlX21vZHVsZXMva2V5bmFtZS1vZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMva2V5LWV2ZW50L25vZGVfbW9kdWxlcy9rZXluYW1lLW9mL25vZGVfbW9kdWxlcy9rZXluYW1lcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvbmV3LWNoYWluL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L25vZGVfbW9kdWxlcy9uZXctZWxlbWVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvbmV3LWVsZW1lbnQvbm9kZV9tb2R1bGVzL2RvbWlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21xdWVyeS9ub2RlX21vZHVsZXMvc2libGluZ3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tcXVlcnkvbm9kZV9tb2R1bGVzL3NpYmxpbmdzL25vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXF1ZXJ5L25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy9hYnN0cmFjdC1sZXZlbGRvd24vYWJzdHJhY3QtY2hhaW5lZC1iYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbC1qcy9ub2RlX21vZHVsZXMvYWJzdHJhY3QtbGV2ZWxkb3duL2Fic3RyYWN0LWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy9hYnN0cmFjdC1sZXZlbGRvd24vYWJzdHJhY3QtbGV2ZWxkb3duLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy9hYnN0cmFjdC1sZXZlbGRvd24vbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy9pZGItd3JhcHBlci9pZGJzdG9yZS5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbC1qcy9ub2RlX21vZHVsZXMvaXNidWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbGV2ZWwtanMvbm9kZV9tb2R1bGVzL2x0Z3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbGV2ZWwtanMvbm9kZV9tb2R1bGVzL3R5cGVkYXJyYXktdG8tYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy94dGVuZC9oYXMta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbC1qcy9ub2RlX21vZHVsZXMveHRlbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbGV2ZWwtanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9mb3JlYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbGV2ZWwtanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbC1qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL3NoaW0uanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9saWIvYmF0Y2guanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9saWIvY29kZWMuanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9saWIvZW5jb2RpbmdzLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbGliL2Vycm9ycy5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbHVwL2xpYi9sZXZlbHVwLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbGliL3JlYWQtc3RyZWFtLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9saWIvd3JpdGUtc3RyZWFtLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL2JsL2JsLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL2RlZmVycmVkLWxldmVsZG93bi9kZWZlcnJlZC1sZXZlbGRvd24uanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvZGVmZXJyZWQtbGV2ZWxkb3duL25vZGVfbW9kdWxlcy9hYnN0cmFjdC1sZXZlbGRvd24vYWJzdHJhY3QtbGV2ZWxkb3duLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL2Vycm5vL2N1c3RvbS5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbHVwL25vZGVfbW9kdWxlcy9lcnJuby9lcnJuby5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbHVwL25vZGVfbW9kdWxlcy9wcnIvcHJyLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9kdXBsZXguanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbHVwL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV93cml0YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbHVwL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbm9kZV9tb2R1bGVzL2NvcmUtdXRpbC1pcy9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9sZXZlbHVwL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL25vZGVfbW9kdWxlcy9pc2FycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9ub2RlX21vZHVsZXMvc3RyaW5nX2RlY29kZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xldmVsdXAvcGFja2FnZS5qc29uIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2lzLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9kdXBsZXguanMiLCJub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9kdXBsZXguanMiLCJub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9wYXNzdGhyb3VnaC5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vcGFzc3Rocm91Z2guanMiLCJub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwic3VycHJpc2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbHNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7O0FDREE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7QUFDQTs7QUNEQTs7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGRvbSA9IHJlcXVpcmUoJ2RvbXF1ZXJ5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRiKSB7XG4gIHZhciBjbGlja3MgPSB7XG4gICAgZWw6IGRvbSgnI2NsaWNrcycpXG4gIH07XG4gIFxuICBjbGlja3MuYWRkID0gZnVuY3Rpb24gKGksIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgY2IgPSBpO1xuICAgICAgdmFyIGkgPSAxO1xuICAgIH1cbiAgICBcbiAgICBkYi5nZXQoJ2NsaWNrcycsIGZ1bmN0aW9uIChlcnIsIHZhbHVlKSB7XG4gICAgICB2YXIgY291bnQgPSB2YWx1ZSArIGk7XG4gICAgICBkYi5wdXQoJ2NsaWNrcycsIGNvdW50LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuICAgICAgICBjbGlja3MuZWwuaHRtbChjb3VudClcbiAgICAgICAgY2IobnVsbCwgY291bnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIFxuICBjbGlja3MuZ2V0ID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgZGIuZ2V0KCdjbGlja3MnLCBjYik7XG4gIH07XG4gIFxuICBjbGlja3MucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZGIucHV0KCdjbGlja3MnLCAwLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgY2xpY2tzLmVsLmh0bWwoJycpO1xuICAgIH0pO1xuICB9O1xuICBcbiAgcmV0dXJuIGNsaWNrcztcbn1cblxuXG4iLCJ2YXIgbGV2ZWwgPSByZXF1aXJlKCdsZXZlbHVwJyk7XG52YXIgbGV2ZWxqcyA9IHJlcXVpcmUoJ2xldmVsLWpzJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnZG9tcXVlcnknKTtcblxudmFyIGRiID0gbGV2ZWwoJ3BpenphLWNsaWNrZXInLCB7IFxuICBkYjogbGV2ZWxqcywgdmFsdWVFbmNvZGluZzogJ2pzb24nIFxufSk7XG5cbnZhciBjbGlja3MgPSByZXF1aXJlKCcuL2NsaWNrcycpKGRiKTtcbnZhciBzdXJwcmlzZXMgPSByZXF1aXJlKCcuL3N1cnByaXNlcycpKGRiKTtcbnZhciBtZXNzYWdlID0gcmVxdWlyZSgnLi9tZXNzYWdlJykoZGIpO1xuXG5zdGFydCgpO1xuXG5mdW5jdGlvbiBzdGFydCAoKSB7XG4gIGRiLm9wZW4oZnVuY3Rpb24gKCkge1xuICAgIGxpc3RlbmVycygpO1xuICAgIFxuICAgIGNsaWNrcy5nZXQoZnVuY3Rpb24gKGVyciwgdmFsKSB7XG4gICAgICBpZiAoZXJyIHx8IHZhbCA9PT0gTmFOKSB7XG4gICAgICAgIGRiLnB1dCgnY2xpY2tzJywgMCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodmFsICE9PSAwKSBjbGlja3MuZWwuaHRtbCh2YWwpXG4gICAgfSk7XG4gICAgXG4gICAgZGIuZ2V0KCdtZXNzYWdlJywgZnVuY3Rpb24gKGVyciwgbXNnKSB7XG4gICAgICBpZiAoZXJyIHx8ICFtc2cpIHJldHVybjtcbiAgICAgIG1lc3NhZ2Uuc2VuZChtc2cpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbGlzdGVuZXJzICgpIHtcbiAgZG9tKCcjcGl6emEnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGNsaWNrcy5hZGQoMSwgZnVuY3Rpb24gKGVyciwgdmFsdWUpIHtcbiAgICAgIHN1cnByaXNlcy5jaGVjayh2YWx1ZSk7XG4gICAgfSk7XG4gIH0pO1xuICBcbiAgZG9tKCcjcmVzdGFydCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coJ3N1cmUgeW91IHdhbnQgdG8gbG9zZSB5b3VyIHByb2dyZXNzIGFuZCByZXN0YXJ0PycpO1xuICAgIHJlc3RhcnQoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnQgKCkge1xuICBjbGlja3MucmVzZXQoKTtcbiAgbWVzc2FnZS5yZXNldCgpO1xufSIsInZhciBkb20gPSByZXF1aXJlKCdkb21xdWVyeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkYikge1xuICB2YXIgbWVzc2FnZSA9IHtcbiAgICBlbDogZG9tKCcjbWVzc2FnZScpXG4gIH07XG4gIFxuICBtZXNzYWdlLnNlbmQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIGRiLnB1dCgnbWVzc2FnZScsIHRleHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBtZXNzYWdlLmVsLmh0bWwodGV4dCk7XG4gICAgfSlcbiAgfTtcbiAgXG4gIG1lc3NhZ2UucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZGIucHV0KCdtZXNzYWdlJywgJycsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBtZXNzYWdlLmVsLmh0bWwoJycpO1xuICAgIH0pO1xuICB9O1xuICBcbiAgcmV0dXJuIG1lc3NhZ2U7XG59IiwidmFyIG5ld0VsZW1lbnQgPSByZXF1aXJlKFwibmV3LWVsZW1lbnRcIik7XG52YXIgc2VsZWN0ID0gcmVxdWlyZShcIi4vbGliL3NlbGVjdFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZWxlY3Q7XG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGU7XG5cbmZ1bmN0aW9uIGNyZWF0ZSAodGFnKSB7XG4gIGlmICh0YWcuY2hhckF0KDApID09ICc8JykgeyAvLyBodG1sXG4gICAgcmV0dXJuIHNlbGVjdChuZXdFbGVtZW50KHRhZykpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZykpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBhdHRyO1xuXG5mdW5jdGlvbiBhdHRyIChjaGFpbikge1xuICByZXR1cm4gZnVuY3Rpb24gYXR0ciAoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIGNoYWluO1xuICB9O1xufVxuIiwidmFyIGV2ZW50cyA9IHJlcXVpcmUoXCJkb20tZXZlbnRcIik7XG52YXIgZGVsZWdhdGUgPSByZXF1aXJlKFwiY29tcG9uZW50LWRlbGVnYXRlXCIpO1xudmFyIGtleUV2ZW50ID0gcmVxdWlyZShcImtleS1ldmVudFwiKTtcbnZhciB0cmltID0gcmVxdWlyZShcInRyaW1cIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGFuZ2U6IHNob3J0Y3V0KCdjaGFuZ2UnKSxcbiAgY2xpY2s6IHNob3J0Y3V0KCdjbGljaycpLFxuICBrZXlkb3duOiBzaG9ydGN1dCgna2V5ZG93bicpLFxuICBrZXl1cDogc2hvcnRjdXQoJ2tleXVwJyksXG4gIGtleXByZXNzOiBzaG9ydGN1dCgna2V5cHJlc3MnKSxcbiAgbW91c2Vkb3duOiBzaG9ydGN1dCgnbW91c2Vkb3duJyksXG4gIG1vdXNlb3Zlcjogc2hvcnRjdXQoJ21vdXNlb3ZlcicpLFxuICBtb3VzZXVwOiBzaG9ydGN1dCgnbW91c2V1cCcpLFxuICByZXNpemU6IHNob3J0Y3V0KCdyZXNpemUnKSxcbiAgb246IG9uLFxuICBvZmY6IG9mZixcbiAgb25LZXk6IG9uS2V5LFxuICBvZmZLZXk6IG9mZktleVxufTtcblxuZnVuY3Rpb24gc2hvcnRjdXQgKHR5cGUpe1xuICByZXR1cm4gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spe1xuICAgIHJldHVybiBvbihlbGVtZW50LCB0eXBlLCBjYWxsYmFjayk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9mZiAoZWxlbWVudCwgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayl7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcbiAgICByZXR1cm4gZGVsZWdhdGUudW5iaW5kKGVsZW1lbnQsIHNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgY2FsbGJhY2sgPSBzZWxlY3RvcjtcblxuICBldmVudHMub2ZmKGVsZW1lbnQsIGV2ZW50LCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIG9uIChlbGVtZW50LCBldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKXtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMykge1xuICAgIGNhbGxiYWNrID0gc2VsZWN0b3I7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSA0KSB7XG4gICAgcmV0dXJuIGRlbGVnYXRlLmJpbmQoZWxlbWVudCwgc2VsZWN0b3IsIGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBldmVudHMub24oZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gb25LZXkgKGVsZW1lbnQsIGtleSwgY2FsbGJhY2spIHtcbiAga2V5RXZlbnQub24oZWxlbWVudCwga2V5LCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIG9mZktleSAoZWxlbWVudCwga2V5LCBjYWxsYmFjaykge1xuICBrZXlFdmVudC5vZmYoZWxlbWVudCwga2V5LCBjYWxsYmFjayk7XG59XG4iLCJ2YXIgZm9ybWF0ID0gcmVxdWlyZSgnZm9ybWF0LXRleHQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBodG1sO1xuXG5mdW5jdGlvbiBodG1sIChjaGFpbikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVsZW1lbnQsIG5ld1ZhbHVlLCB2YXJzKXtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBmb3JtYXQobmV3VmFsdWUsIHZhcnMpIDogbmV3VmFsdWU7XG4gICAgICByZXR1cm4gY2hhaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQuaW5uZXJIVE1MO1xuICB9O1xufVxuIiwidmFyIG5ld0NoYWluID0gcmVxdWlyZShcIm5ldy1jaGFpblwiKTtcbnZhciBmb3JtYXQgPSByZXF1aXJlKCdmb3JtYXQtdGV4dCcpO1xudmFyIGNsYXNzZXMgPSByZXF1aXJlKCdkb20tY2xhc3NlcycpO1xudmFyIHRyZWUgPSByZXF1aXJlKCdkb20tdHJlZScpO1xudmFyIG5ld0VsZW1lbnQgPSByZXF1aXJlKCduZXctZWxlbWVudCcpO1xudmFyIHNlbGVjdERPTSA9IHJlcXVpcmUoJ2RvbS1zZWxlY3QnKS5hbGw7XG52YXIgc3R5bGUgPSByZXF1aXJlKCdkb20tc3R5bGUnKTtcbnZhciBjbG9zZXN0ID0gcmVxdWlyZShcImRpc2NvcmUtY2xvc2VzdFwiKTtcbnZhciBzaWJsaW5ncyA9IHJlcXVpcmUoXCJzaWJsaW5nc1wiKTtcblxudmFyIGF0dHIgPSByZXF1aXJlKCcuL2F0dHInKTtcbnZhciBldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL2h0bWwnKTtcbnZhciB0ZXh0ID0gcmVxdWlyZSgnLi90ZXh0Jyk7XG52YXIgdmFsdWUgPSByZXF1aXJlKCcuL3ZhbHVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2VsZWN0O1xuXG5mdW5jdGlvbiBzZWxlY3QgKHF1ZXJ5KSB7XG4gIHZhciBrZXksIGNoYWluLCBtZXRob2RzLCBlbGVtZW50cztcbiAgdmFyIHRhc2s7XG5cbiAgaWYgKHR5cGVvZiBxdWVyeSA9PSAnc3RyaW5nJyAmJiBxdWVyeS5jaGFyQXQoMCkgPT0gJzwnKSB7XG4gICAgLy8gQ3JlYXRlIG5ldyBlbGVtZW50IGZyb20gYHF1ZXJ5YFxuICAgIGVsZW1lbnRzID0gW25ld0VsZW1lbnQocXVlcnksIGFyZ3VtZW50c1sxXSldO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBxdWVyeSA9PSAnc3RyaW5nJykge1xuICAgIC8vIFNlbGVjdCBnaXZlbiBDU1MgcXVlcnlcbiAgICBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdERPTShxdWVyeSwgYXJndW1lbnRzWzFdKSk7XG4gIH0gZWxzZSBpZiAocXVlcnkgPT0gZG9jdW1lbnQpIHtcbiAgICBlbGVtZW50cyA9IFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdO1xuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkpIHtcbiAgICBlbGVtZW50cyA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIH1cblxuICBtZXRob2RzID0ge1xuICAgIGFkZENsYXNzOiBhcHBseUVhY2hFbGVtZW50KGNsYXNzZXMuYWRkLCBlbGVtZW50cyksXG4gICAgcmVtb3ZlQ2xhc3M6IGFwcGx5RWFjaEVsZW1lbnQoY2xhc3Nlcy5yZW1vdmUsIGVsZW1lbnRzKSxcbiAgICB0b2dnbGVDbGFzczogYXBwbHlFYWNoRWxlbWVudChjbGFzc2VzLnRvZ2dsZSwgZWxlbWVudHMpLFxuICAgIHNob3c6IGFwcGx5RWFjaEVsZW1lbnQoc3R5bGUuc2hvdywgZWxlbWVudHMpLFxuICAgIGhpZGU6IGFwcGx5RWFjaEVsZW1lbnQoc3R5bGUuaGlkZSwgZWxlbWVudHMpLFxuICAgIHN0eWxlOiBhcHBseUVhY2hFbGVtZW50KHN0eWxlLCBlbGVtZW50cylcbiAgfTtcblxuICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICBtZXRob2RzW2tleV0gPSBhcHBseUVhY2hFbGVtZW50KGV2ZW50c1trZXldLCBlbGVtZW50cyk7XG4gIH1cblxuICBmb3IgKGtleSBpbiB0cmVlKSB7XG4gICAgbWV0aG9kc1trZXldID0gYXBwbHlFYWNoRWxlbWVudCh0cmVlW2tleV0sIGVsZW1lbnRzKTtcbiAgfVxuXG4gIGNoYWluID0gbmV3Q2hhaW4uZnJvbShlbGVtZW50cykobWV0aG9kcyk7XG5cbiAgY2hhaW4uYXR0ciA9IGFwcGx5RWFjaEVsZW1lbnQoYXR0cihjaGFpbiksIGVsZW1lbnRzKTtcbiAgY2hhaW4uY2xhc3NlcyA9IGFwcGx5RWFjaEVsZW1lbnQoY2xhc3NlcywgZWxlbWVudHMpO1xuICBjaGFpbi5oYXNDbGFzcyA9IGFwcGx5RWFjaEVsZW1lbnQoY2xhc3Nlcy5oYXMsIGVsZW1lbnRzKSxcbiAgY2hhaW4uaHRtbCA9IGFwcGx5RWFjaEVsZW1lbnQoaHRtbChjaGFpbiksIGVsZW1lbnRzKTtcbiAgY2hhaW4udGV4dCA9IGFwcGx5RWFjaEVsZW1lbnQodGV4dChjaGFpbiksIGVsZW1lbnRzKTtcbiAgY2hhaW4udmFsID0gYXBwbHlFYWNoRWxlbWVudCh2YWx1ZShjaGFpbiksIGVsZW1lbnRzKTtcbiAgY2hhaW4udmFsdWUgPSBhcHBseUVhY2hFbGVtZW50KHZhbHVlKGNoYWluKSwgZWxlbWVudHMpO1xuICBjaGFpbi5wYXJlbnQgPSBzZWxlY3RFYWNoRWxlbWVudChwYXJlbnQsIGVsZW1lbnRzKTtcbiAgY2hhaW4uc2VsZWN0ID0gc2VsZWN0RWFjaEVsZW1lbnQoc2VsZWN0Q2hpbGQsIGVsZW1lbnRzKTtcbiAgY2hhaW4uc2libGluZ3MgPSBzZWxlY3RFYWNoRWxlbWVudChzaWJsaW5ncywgZWxlbWVudHMpO1xuXG4gIHJldHVybiBjaGFpbjtcbn1cblxuZnVuY3Rpb24gcGFyZW50IChlbGVtZW50LCBzZWxlY3Rvcikge1xuICBpZiAoIXNlbGVjdG9yKSByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlO1xuICByZXR1cm4gY2xvc2VzdChlbGVtZW50LCBzZWxlY3Rvcik7XG59O1xuXG5mdW5jdGlvbiBzZWxlY3RDaGlsZCAoZWxlbWVudCwgcXVlcnkpIHtcbiAgcmV0dXJuIHNlbGVjdChxdWVyeSwgZWxlbWVudCk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5RWFjaEVsZW1lbnQgKGZuLCBlbGVtZW50cykge1xuICBpZiAoIWZuKSB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBmdW5jdGlvbi4nKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpLCBsZW4sIHJldCwgcGFyYW1zLCByZXQ7XG5cbiAgICBsZW4gPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgaSA9IC0xO1xuICAgIHBhcmFtcyA9IFt1bmRlZmluZWRdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgIHBhcmFtc1swXSA9IGVsZW1lbnRzW2ldO1xuICAgICAgcmV0ID0gZm4uYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEVhY2hFbGVtZW50IChmbiwgZWxzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBwYXJhbXMgPSBbdW5kZWZpbmVkXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cbiAgICB2YXIgbGVuID0gZWxzLmxlbmd0aDtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciByZXQ7XG4gICAgdmFyIHQ7XG4gICAgdmFyIHRsZW47XG5cbiAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICBwYXJhbXNbMF0gPSBlbHNbaV07XG4gICAgICByZXQgPSBmbi5hcHBseSh1bmRlZmluZWQsIHBhcmFtcyk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJldCkpIHtcbiAgICAgICAgdGxlbiA9IHJldC5sZW5ndGg7XG4gICAgICAgIHQgPSAtMTtcblxuICAgICAgICB3aGlsZSAoKyt0IDwgdGxlbikge1xuICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihyZXRbdF0pICE9IC0xKSBjb250aW51ZTtcbiAgICAgICAgICByZXN1bHQucHVzaChyZXRbdF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmV0KSBjb250aW51ZTtcbiAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihyZXQpICE9IC0xKSBjb250aW51ZTtcblxuICAgICAgcmVzdWx0LnB1c2gocmV0KTtcbiAgICB9XG5cblxuICAgIHJldHVybiBzZWxlY3QocmVzdWx0KTtcbiAgfTtcbn1cbiIsInZhciBmb3JtYXQgPSByZXF1aXJlKCdmb3JtYXQtdGV4dCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRleHQ7XG5cbmZ1bmN0aW9uIHRleHQgKGNoYWluKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtZW50LCBuZXdWYWx1ZSwgdmFycykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gZm9ybWF0KG5ld1ZhbHVlLCB2YXJzKSA6IG5ld1ZhbHVlO1xuICAgICAgcmV0dXJuIGNoYWluO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50LnRleHRDb250ZW50O1xuICB9O1xufVxuIiwidmFyIHZhbHVlID0gcmVxdWlyZShcImRvbS12YWx1ZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3aXRoQ2hhaW47XG5cbmZ1bmN0aW9uIHdpdGhDaGFpbiAoY2hhaW4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlbCwgdXBkYXRlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgICAgdmFsdWUoZWwsIHVwZGF0ZSk7XG4gICAgICByZXR1cm4gY2hhaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlKGVsKTtcbiAgfTtcbn1cbiIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgY2xvc2VzdCA9IHJlcXVpcmUoJ2Nsb3Nlc3QnKVxuICAsIGV2ZW50ID0gcmVxdWlyZSgnZXZlbnQnKTtcblxuLyoqXG4gKiBEZWxlZ2F0ZSBldmVudCBgdHlwZWAgdG8gYHNlbGVjdG9yYFxuICogYW5kIGludm9rZSBgZm4oZSlgLiBBIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiBpcyByZXR1cm5lZCB3aGljaCBtYXkgYmUgcGFzc2VkIHRvIGAudW5iaW5kKClgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmJpbmQgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3IsIHR5cGUsIGZuLCBjYXB0dXJlKXtcbiAgcmV0dXJuIGV2ZW50LmJpbmQoZWwsIHR5cGUsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG4gICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QodGFyZ2V0LCBzZWxlY3RvciwgdHJ1ZSwgZWwpO1xuICAgIGlmIChlLmRlbGVnYXRlVGFyZ2V0KSBmbi5jYWxsKGVsLCBlKTtcbiAgfSwgY2FwdHVyZSk7XG59O1xuXG4vKipcbiAqIFVuYmluZCBldmVudCBgdHlwZWAncyBjYWxsYmFjayBgZm5gLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24oZWwsIHR5cGUsIGZuLCBjYXB0dXJlKXtcbiAgZXZlbnQudW5iaW5kKGVsLCB0eXBlLCBmbiwgY2FwdHVyZSk7XG59O1xuIiwidmFyIGJpbmQgPSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdhdHRhY2hFdmVudCcsXG4gICAgdW5iaW5kID0gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcicgOiAnZGV0YWNoRXZlbnQnLFxuICAgIHByZWZpeCA9IGJpbmQgIT09ICdhZGRFdmVudExpc3RlbmVyJyA/ICdvbicgOiAnJztcblxuLyoqXG4gKiBCaW5kIGBlbGAgZXZlbnQgYHR5cGVgIHRvIGBmbmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmJpbmQgPSBmdW5jdGlvbihlbCwgdHlwZSwgZm4sIGNhcHR1cmUpe1xuICBlbFtiaW5kXShwcmVmaXggKyB0eXBlLCBmbiwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gIHJldHVybiBmbjtcbn07XG5cbi8qKlxuICogVW5iaW5kIGBlbGAgZXZlbnQgYHR5cGVgJ3MgY2FsbGJhY2sgYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FwdHVyZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24oZWwsIHR5cGUsIGZuLCBjYXB0dXJlKXtcbiAgZWxbdW5iaW5kXShwcmVmaXggKyB0eXBlLCBmbiwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gIHJldHVybiBmbjtcbn07IiwidmFyIG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IsIGNoZWNrWW9TZWxmLCByb290KSB7XG4gIGVsZW1lbnQgPSBjaGVja1lvU2VsZiA/IHtwYXJlbnROb2RlOiBlbGVtZW50fSA6IGVsZW1lbnRcblxuICByb290ID0gcm9vdCB8fCBkb2N1bWVudFxuXG4gIC8vIE1ha2Ugc3VyZSBgZWxlbWVudCAhPT0gZG9jdW1lbnRgIGFuZCBgZWxlbWVudCAhPSBudWxsYFxuICAvLyBvdGhlcndpc2Ugd2UgZ2V0IGFuIGlsbGVnYWwgaW52b2NhdGlvblxuICB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpICYmIGVsZW1lbnQgIT09IGRvY3VtZW50KSB7XG4gICAgaWYgKG1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3IpKVxuICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAvLyBBZnRlciBgbWF0Y2hlc2Agb24gdGhlIGVkZ2UgY2FzZSB0aGF0XG4gICAgLy8gdGhlIHNlbGVjdG9yIG1hdGNoZXMgdGhlIHJvb3RcbiAgICAvLyAod2hlbiB0aGUgcm9vdCBpcyBub3QgdGhlIGRvY3VtZW50KVxuICAgIGlmIChlbGVtZW50ID09PSByb290KVxuICAgICAgcmV0dXJuICBcbiAgfVxufSIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgcXVlcnkgPSByZXF1aXJlKCdxdWVyeScpO1xuXG4vKipcbiAqIEVsZW1lbnQgcHJvdG90eXBlLlxuICovXG5cbnZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG4vKipcbiAqIFZlbmRvciBmdW5jdGlvbi5cbiAqL1xuXG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1xuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbi8qKlxuICogRXhwb3NlIGBtYXRjaCgpYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoO1xuXG4vKipcbiAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xuICBpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm4gZmFsc2U7XG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xuICB2YXIgbm9kZXMgPSBxdWVyeS5hbGwoc2VsZWN0b3IsIGVsLnBhcmVudE5vZGUpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJmdW5jdGlvbiBvbmUoc2VsZWN0b3IsIGVsKSB7XG4gIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3IsIGVsKXtcbiAgZWwgPSBlbCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG9uZShzZWxlY3RvciwgZWwpO1xufTtcblxuZXhwb3J0cy5hbGwgPSBmdW5jdGlvbihzZWxlY3RvciwgZWwpe1xuICBlbCA9IGVsIHx8IGRvY3VtZW50O1xuICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG59O1xuXG5leHBvcnRzLmVuZ2luZSA9IGZ1bmN0aW9uKG9iail7XG4gIGlmICghb2JqLm9uZSkgdGhyb3cgbmV3IEVycm9yKCcub25lIGNhbGxiYWNrIHJlcXVpcmVkJyk7XG4gIGlmICghb2JqLmFsbCkgdGhyb3cgbmV3IEVycm9yKCcuYWxsIGNhbGxiYWNrIHJlcXVpcmVkJyk7XG4gIG9uZSA9IG9iai5vbmU7XG4gIGV4cG9ydHMuYWxsID0gb2JqLmFsbDtcbiAgcmV0dXJuIGV4cG9ydHM7XG59O1xuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBpbmRleCA9IHJlcXVpcmUoJ2luZGV4b2YnKTtcblxuLyoqXG4gKiBXaGl0ZXNwYWNlIHJlZ2V4cC5cbiAqL1xuXG52YXIgd2hpdGVzcGFjZVJlID0gL1xccysvO1xuXG4vKipcbiAqIHRvU3RyaW5nIHJlZmVyZW5jZS5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzZXM7XG5tb2R1bGUuZXhwb3J0cy5hZGQgPSBhZGQ7XG5tb2R1bGUuZXhwb3J0cy5jb250YWlucyA9IGhhcztcbm1vZHVsZS5leHBvcnRzLmhhcyA9IGhhcztcbm1vZHVsZS5leHBvcnRzLnRvZ2dsZSA9IHRvZ2dsZTtcbm1vZHVsZS5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbm1vZHVsZS5leHBvcnRzLnJlbW92ZU1hdGNoaW5nID0gcmVtb3ZlTWF0Y2hpbmc7XG5cbmZ1bmN0aW9uIGNsYXNzZXMgKGVsKSB7XG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICByZXR1cm4gZWwuY2xhc3NMaXN0O1xuICB9XG5cbiAgdmFyIHN0ciA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gIHZhciBhcnIgPSBzdHIuc3BsaXQod2hpdGVzcGFjZVJlKTtcbiAgaWYgKCcnID09PSBhcnJbMF0pIGFyci5zaGlmdCgpO1xuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBhZGQgKGVsLCBuYW1lKSB7XG4gIC8vIGNsYXNzTGlzdFxuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBmYWxsYmFja1xuICB2YXIgYXJyID0gY2xhc3NlcyhlbCk7XG4gIHZhciBpID0gaW5kZXgoYXJyLCBuYW1lKTtcbiAgaWYgKCF+aSkgYXJyLnB1c2gobmFtZSk7XG4gIGVsLmNsYXNzTmFtZSA9IGFyci5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIGhhcyAoZWwsIG5hbWUpIHtcbiAgcmV0dXJuIGVsLmNsYXNzTGlzdFxuICAgID8gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpXG4gICAgOiAhISB+aW5kZXgoY2xhc3NlcyhlbCksIG5hbWUpO1xufVxuXG5mdW5jdGlvbiByZW1vdmUgKGVsLCBuYW1lKSB7XG4gIGlmICgnW29iamVjdCBSZWdFeHBdJyA9PSB0b1N0cmluZy5jYWxsKG5hbWUpKSB7XG4gICAgcmV0dXJuIHJlbW92ZU1hdGNoaW5nKGVsLCBuYW1lKTtcbiAgfVxuXG4gIC8vIGNsYXNzTGlzdFxuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBmYWxsYmFja1xuICB2YXIgYXJyID0gY2xhc3NlcyhlbCk7XG4gIHZhciBpID0gaW5kZXgoYXJyLCBuYW1lKTtcbiAgaWYgKH5pKSBhcnIuc3BsaWNlKGksIDEpO1xuICBlbC5jbGFzc05hbWUgPSBhcnIuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVNYXRjaGluZyAoZWwsIHJlLCByZWYpIHtcbiAgdmFyIGFyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNsYXNzZXMoZWwpKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmUudGVzdChhcnJbaV0pKSB7XG4gICAgICByZW1vdmUoZWwsIGFycltpXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZSAoZWwsIG5hbWUpIHtcbiAgLy8gY2xhc3NMaXN0XG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICByZXR1cm4gZWwuY2xhc3NMaXN0LnRvZ2dsZShuYW1lKTtcbiAgfVxuXG4gIC8vIGZhbGxiYWNrXG4gIGlmIChoYXMoZWwsIG5hbWUpKSB7XG4gICAgcmVtb3ZlKGVsLCBuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBhZGQoZWwsIG5hbWUpO1xuICB9XG59XG4iLCJcbnZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnIsIG9iail7XG4gIGlmIChpbmRleE9mKSByZXR1cm4gYXJyLmluZGV4T2Yob2JqKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoYXJyW2ldID09PSBvYmopIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBvbjtcbm1vZHVsZS5leHBvcnRzLm9uID0gb247XG5tb2R1bGUuZXhwb3J0cy5vZmYgPSBvZmY7XG5cbmZ1bmN0aW9uIG9uIChlbGVtZW50LCBldmVudCwgY2FsbGJhY2ssIGNhcHR1cmUpIHtcbiAgIWVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAmJiAoZXZlbnQgPSAnb24nICsgZXZlbnQpO1xuICAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIHx8IGVsZW1lbnQuYXR0YWNoRXZlbnQpLmNhbGwoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrLCBjYXB0dXJlKTtcbiAgcmV0dXJuIGNhbGxiYWNrO1xufVxuXG5mdW5jdGlvbiBvZmYgKGVsZW1lbnQsIGV2ZW50LCBjYWxsYmFjaywgY2FwdHVyZSkge1xuICAhZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICYmIChldmVudCA9ICdvbicgKyBldmVudCk7XG4gIChlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgfHwgZWxlbWVudC5kZXRhY2hFdmVudCkuY2FsbChlbGVtZW50LCBldmVudCwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuICByZXR1cm4gY2FsbGJhY2s7XG59XG4iLCJ2YXIgcXdlcnkgPSByZXF1aXJlKFwicXdlcnlcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvbmU6IG9uZSxcbiAgYWxsOiBhbGxcbn07XG5cbmZ1bmN0aW9uIGFsbCAoc2VsZWN0b3IsIHBhcmVudCkge1xuICByZXR1cm4gcXdlcnkoc2VsZWN0b3IsIHBhcmVudCk7XG59XG5cbmZ1bmN0aW9uIG9uZSAoc2VsZWN0b3IsIHBhcmVudCkge1xuICByZXR1cm4gYWxsKHNlbGVjdG9yLCBwYXJlbnQpWzBdO1xufVxuIiwidmFyIGZhbGxiYWNrID0gcmVxdWlyZSgnLi9mYWxsYmFjaycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9uZTtcbm1vZHVsZS5leHBvcnRzLmFsbCA9IGFsbDtcblxuZnVuY3Rpb24gb25lIChzZWxlY3RvciwgcGFyZW50KSB7XG4gIHBhcmVudCB8fCAocGFyZW50ID0gZG9jdW1lbnQpO1xuXG4gIGlmIChwYXJlbnQucXVlcnlTZWxlY3Rvcikge1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH1cblxuICByZXR1cm4gZmFsbGJhY2sub25lKHNlbGVjdG9yLCBwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBhbGwgKHNlbGVjdG9yLCBwYXJlbnQpIHtcbiAgcGFyZW50IHx8IChwYXJlbnQgPSBkb2N1bWVudCk7XG5cbiAgaWYgKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfVxuXG4gIHJldHVybiBmYWxsYmFjay5hbGwoc2VsZWN0b3IsIHBhcmVudCk7XG59XG4iLCIvKiFcbiAgKiBAcHJlc2VydmUgUXdlcnkgLSBBIEJsYXppbmcgRmFzdCBxdWVyeSBzZWxlY3RvciBlbmdpbmVcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3F3ZXJ5XG4gICogY29weXJpZ2h0IER1c3RpbiBEaWF6IDIwMTJcbiAgKiBNSVQgTGljZW5zZVxuICAqL1xuXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgncXdlcnknLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudFxuICAgICwgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnRcbiAgICAsIGJ5Q2xhc3MgPSAnZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSdcbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgcVNBID0gJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gICAgLCB1c2VOYXRpdmVRU0EgPSAndXNlTmF0aXZlUVNBJ1xuICAgICwgdGFnTmFtZSA9ICd0YWdOYW1lJ1xuICAgICwgbm9kZVR5cGUgPSAnbm9kZVR5cGUnXG4gICAgLCBzZWxlY3QgLy8gbWFpbiBzZWxlY3QoKSBtZXRob2QsIGFzc2lnbiBsYXRlclxuXG4gICAgLCBpZCA9IC8jKFtcXHdcXC1dKykvXG4gICAgLCBjbGFzID0gL1xcLltcXHdcXC1dKy9nXG4gICAgLCBpZE9ubHkgPSAvXiMoW1xcd1xcLV0rKSQvXG4gICAgLCBjbGFzc09ubHkgPSAvXlxcLihbXFx3XFwtXSspJC9cbiAgICAsIHRhZ09ubHkgPSAvXihbXFx3XFwtXSspJC9cbiAgICAsIHRhZ0FuZE9yQ2xhc3MgPSAvXihbXFx3XSspP1xcLihbXFx3XFwtXSspJC9cbiAgICAsIHNwbGl0dGFibGUgPSAvKF58LClcXHMqWz5+K10vXG4gICAgLCBub3JtYWxpenIgPSAvXlxccyt8XFxzKihbLFxcc1xcK1xcfj5dfCQpXFxzKi9nXG4gICAgLCBzcGxpdHRlcnMgPSAvW1xcc1xcPlxcK1xcfl0vXG4gICAgLCBzcGxpdHRlcnNNb3JlID0gLyg/IVtcXHNcXHdcXC1cXC9cXD9cXCZcXD1cXDpcXC5cXChcXClcXCEsQCMlPD5cXHtcXH1cXCRcXCpcXF4nXCJdKlxcXXxbXFxzXFx3XFwrXFwtXSpcXCkpL1xuICAgICwgc3BlY2lhbENoYXJzID0gLyhbLiorP1xcXj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nXG4gICAgLCBzaW1wbGUgPSAvXihcXCp8W2EtejAtOV0rKT8oPzooW1xcLlxcI10rW1xcd1xcLVxcLiNdKyk/KS9cbiAgICAsIGF0dHIgPSAvXFxbKFtcXHdcXC1dKykoPzooW1xcfFxcXlxcJFxcKlxcfl0/XFw9KVsnXCJdPyhbIFxcd1xcLVxcL1xcP1xcJlxcPVxcOlxcLlxcKFxcKVxcISxAIyU8Plxce1xcfVxcJFxcKlxcXl0rKVtcIiddPyk/XFxdL1xuICAgICwgcHNldWRvID0gLzooW1xcd1xcLV0rKShcXChbJ1wiXT8oW14oKV0rKVsnXCJdP1xcKSk/L1xuICAgICwgZWFzeSA9IG5ldyBSZWdFeHAoaWRPbmx5LnNvdXJjZSArICd8JyArIHRhZ09ubHkuc291cmNlICsgJ3wnICsgY2xhc3NPbmx5LnNvdXJjZSlcbiAgICAsIGRpdmlkZXJzID0gbmV3IFJlZ0V4cCgnKCcgKyBzcGxpdHRlcnMuc291cmNlICsgJyknICsgc3BsaXR0ZXJzTW9yZS5zb3VyY2UsICdnJylcbiAgICAsIHRva2VuaXpyID0gbmV3IFJlZ0V4cChzcGxpdHRlcnMuc291cmNlICsgc3BsaXR0ZXJzTW9yZS5zb3VyY2UpXG4gICAgLCBjaHVua2VyID0gbmV3IFJlZ0V4cChzaW1wbGUuc291cmNlICsgJygnICsgYXR0ci5zb3VyY2UgKyAnKT8nICsgJygnICsgcHNldWRvLnNvdXJjZSArICcpPycpXG5cbiAgdmFyIHdhbGtlciA9IHtcbiAgICAgICcgJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZSAhPT0gaHRtbCAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAsICc+JzogZnVuY3Rpb24gKG5vZGUsIGNvbnRlc3RhbnQpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlID09IGNvbnRlc3RhbnQucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAsICd+JzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgIH1cbiAgICAsICcrJzogZnVuY3Rpb24gKG5vZGUsIGNvbnRlc3RhbnQsIHAxLCBwMikge1xuICAgICAgICBpZiAoIW5vZGUpIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gKHAxID0gcHJldmlvdXMobm9kZSkpICYmIChwMiA9IHByZXZpb3VzKGNvbnRlc3RhbnQpKSAmJiBwMSA9PSBwMiAmJiBwMVxuICAgICAgfVxuICAgIH1cblxuICBmdW5jdGlvbiBjYWNoZSgpIHtcbiAgICB0aGlzLmMgPSB7fVxuICB9XG4gIGNhY2hlLnByb3RvdHlwZSA9IHtcbiAgICBnOiBmdW5jdGlvbiAoaykge1xuICAgICAgcmV0dXJuIHRoaXMuY1trXSB8fCB1bmRlZmluZWRcbiAgICB9XG4gICwgczogZnVuY3Rpb24gKGssIHYsIHIpIHtcbiAgICAgIHYgPSByID8gbmV3IFJlZ0V4cCh2KSA6IHZcbiAgICAgIHJldHVybiAodGhpcy5jW2tdID0gdilcbiAgICB9XG4gIH1cblxuICB2YXIgY2xhc3NDYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCBjbGVhbkNhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIGF0dHJDYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCB0b2tlbkNhY2hlID0gbmV3IGNhY2hlKClcblxuICBmdW5jdGlvbiBjbGFzc1JlZ2V4KGMpIHtcbiAgICByZXR1cm4gY2xhc3NDYWNoZS5nKGMpIHx8IGNsYXNzQ2FjaGUucyhjLCAnKF58XFxcXHMrKScgKyBjICsgJyhcXFxccyt8JCknLCAxKVxuICB9XG5cbiAgLy8gbm90IHF1aXRlIGFzIGZhc3QgYXMgaW5saW5lIGxvb3BzIGluIG9sZGVyIGJyb3dzZXJzIHNvIGRvbid0IHVzZSBsaWJlcmFsbHlcbiAgZnVuY3Rpb24gZWFjaChhLCBmbikge1xuICAgIHZhciBpID0gMCwgbCA9IGEubGVuZ3RoXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIGZuKGFbaV0pXG4gIH1cblxuICBmdW5jdGlvbiBmbGF0dGVuKGFyKSB7XG4gICAgZm9yICh2YXIgciA9IFtdLCBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7ICsraSkgYXJyYXlMaWtlKGFyW2ldKSA/IChyID0gci5jb25jYXQoYXJbaV0pKSA6IChyW3IubGVuZ3RoXSA9IGFyW2ldKVxuICAgIHJldHVybiByXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheWlmeShhcikge1xuICAgIHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aCwgciA9IFtdXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHJbaV0gPSBhcltpXVxuICAgIHJldHVybiByXG4gIH1cblxuICBmdW5jdGlvbiBwcmV2aW91cyhuKSB7XG4gICAgd2hpbGUgKG4gPSBuLnByZXZpb3VzU2libGluZykgaWYgKG5bbm9kZVR5cGVdID09IDEpIGJyZWFrO1xuICAgIHJldHVybiBuXG4gIH1cblxuICBmdW5jdGlvbiBxKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lm1hdGNoKGNodW5rZXIpXG4gIH1cblxuICAvLyBjYWxsZWQgdXNpbmcgYHRoaXNgIGFzIGVsZW1lbnQgYW5kIGFyZ3VtZW50cyBmcm9tIHJlZ2V4IGdyb3VwIHJlc3VsdHMuXG4gIC8vIGdpdmVuID0+IGRpdi5oZWxsb1t0aXRsZT1cIndvcmxkXCJdOmZvbygnYmFyJylcbiAgLy8gZGl2LmhlbGxvW3RpdGxlPVwid29ybGRcIl06Zm9vKCdiYXInKSwgZGl2LCAuaGVsbG8sIFt0aXRsZT1cIndvcmxkXCJdLCB0aXRsZSwgPSwgd29ybGQsIDpmb28oJ2JhcicpLCBmb28sICgnYmFyJyksIGJhcl1cbiAgZnVuY3Rpb24gaW50ZXJwcmV0KHdob2xlLCB0YWcsIGlkc0FuZENsYXNzZXMsIHdob2xlQXR0cmlidXRlLCBhdHRyaWJ1dGUsIHF1YWxpZmllciwgdmFsdWUsIHdob2xlUHNldWRvLCBwc2V1ZG8sIHdob2xlUHNldWRvVmFsLCBwc2V1ZG9WYWwpIHtcbiAgICB2YXIgaSwgbSwgaywgbywgY2xhc3Nlc1xuICAgIGlmICh0aGlzW25vZGVUeXBlXSAhPT0gMSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHRhZyAmJiB0YWcgIT09ICcqJyAmJiB0aGlzW3RhZ05hbWVdICYmIHRoaXNbdGFnTmFtZV0udG9Mb3dlckNhc2UoKSAhPT0gdGFnKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoaWRzQW5kQ2xhc3NlcyAmJiAobSA9IGlkc0FuZENsYXNzZXMubWF0Y2goaWQpKSAmJiBtWzFdICE9PSB0aGlzLmlkKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoaWRzQW5kQ2xhc3NlcyAmJiAoY2xhc3NlcyA9IGlkc0FuZENsYXNzZXMubWF0Y2goY2xhcykpKSB7XG4gICAgICBmb3IgKGkgPSBjbGFzc2VzLmxlbmd0aDsgaS0tOykgaWYgKCFjbGFzc1JlZ2V4KGNsYXNzZXNbaV0uc2xpY2UoMSkpLnRlc3QodGhpcy5jbGFzc05hbWUpKSByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKHBzZXVkbyAmJiBxd2VyeS5wc2V1ZG9zW3BzZXVkb10gJiYgIXF3ZXJ5LnBzZXVkb3NbcHNldWRvXSh0aGlzLCBwc2V1ZG9WYWwpKSByZXR1cm4gZmFsc2VcbiAgICBpZiAod2hvbGVBdHRyaWJ1dGUgJiYgIXZhbHVlKSB7IC8vIHNlbGVjdCBpcyBqdXN0IGZvciBleGlzdGFuY2Ugb2YgYXR0cmliXG4gICAgICBvID0gdGhpcy5hdHRyaWJ1dGVzXG4gICAgICBmb3IgKGsgaW4gbykge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspICYmIChvW2tdLm5hbWUgfHwgaykgPT0gYXR0cmlidXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2hvbGVBdHRyaWJ1dGUgJiYgIWNoZWNrQXR0cihxdWFsaWZpZXIsIGdldEF0dHIodGhpcywgYXR0cmlidXRlKSB8fCAnJywgdmFsdWUpKSB7XG4gICAgICAvLyBzZWxlY3QgaXMgZm9yIGF0dHJpYiBlcXVhbGl0eVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbihzKSB7XG4gICAgcmV0dXJuIGNsZWFuQ2FjaGUuZyhzKSB8fCBjbGVhbkNhY2hlLnMocywgcy5yZXBsYWNlKHNwZWNpYWxDaGFycywgJ1xcXFwkMScpKVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBdHRyKHF1YWxpZnksIGFjdHVhbCwgdmFsKSB7XG4gICAgc3dpdGNoIChxdWFsaWZ5KSB7XG4gICAgY2FzZSAnPSc6XG4gICAgICByZXR1cm4gYWN0dWFsID09IHZhbFxuICAgIGNhc2UgJ149JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ149JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ149JyArIHZhbCwgJ14nICsgY2xlYW4odmFsKSwgMSkpXG4gICAgY2FzZSAnJD0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnJD0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnJD0nICsgdmFsLCBjbGVhbih2YWwpICsgJyQnLCAxKSlcbiAgICBjYXNlICcqPSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKHZhbCkgfHwgYXR0ckNhY2hlLnModmFsLCBjbGVhbih2YWwpLCAxKSlcbiAgICBjYXNlICd+PSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCd+PScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCd+PScgKyB2YWwsICcoPzpefFxcXFxzKyknICsgY2xlYW4odmFsKSArICcoPzpcXFxccyt8JCknLCAxKSlcbiAgICBjYXNlICd8PSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCd8PScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCd8PScgKyB2YWwsICdeJyArIGNsZWFuKHZhbCkgKyAnKC18JCknLCAxKSlcbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIC8vIGdpdmVuIGEgc2VsZWN0b3IsIGZpcnN0IGNoZWNrIGZvciBzaW1wbGUgY2FzZXMgdGhlbiBjb2xsZWN0IGFsbCBiYXNlIGNhbmRpZGF0ZSBtYXRjaGVzIGFuZCBmaWx0ZXJcbiAgZnVuY3Rpb24gX3F3ZXJ5KHNlbGVjdG9yLCBfcm9vdCkge1xuICAgIHZhciByID0gW10sIHJldCA9IFtdLCBpLCBsLCBtLCB0b2tlbiwgdGFnLCBlbHMsIGludHIsIGl0ZW0sIHJvb3QgPSBfcm9vdFxuICAgICAgLCB0b2tlbnMgPSB0b2tlbkNhY2hlLmcoc2VsZWN0b3IpIHx8IHRva2VuQ2FjaGUucyhzZWxlY3Rvciwgc2VsZWN0b3Iuc3BsaXQodG9rZW5penIpKVxuICAgICAgLCBkaXZpZGVkVG9rZW5zID0gc2VsZWN0b3IubWF0Y2goZGl2aWRlcnMpXG5cbiAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHJldHVybiByXG5cbiAgICB0b2tlbiA9ICh0b2tlbnMgPSB0b2tlbnMuc2xpY2UoMCkpLnBvcCgpIC8vIGNvcHkgY2FjaGVkIHRva2VucywgdGFrZSB0aGUgbGFzdCBvbmVcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAmJiAobSA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0ubWF0Y2goaWRPbmx5KSkpIHJvb3QgPSBieUlkKF9yb290LCBtWzFdKVxuICAgIGlmICghcm9vdCkgcmV0dXJuIHJcblxuICAgIGludHIgPSBxKHRva2VuKVxuICAgIC8vIGNvbGxlY3QgYmFzZSBjYW5kaWRhdGVzIHRvIGZpbHRlclxuICAgIGVscyA9IHJvb3QgIT09IF9yb290ICYmIHJvb3Rbbm9kZVR5cGVdICE9PSA5ICYmIGRpdmlkZWRUb2tlbnMgJiYgL15bK35dJC8udGVzdChkaXZpZGVkVG9rZW5zW2RpdmlkZWRUb2tlbnMubGVuZ3RoIC0gMV0pID9cbiAgICAgIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHdoaWxlIChyb290ID0gcm9vdC5uZXh0U2libGluZykge1xuICAgICAgICAgIHJvb3Rbbm9kZVR5cGVdID09IDEgJiYgKGludHJbMV0gPyBpbnRyWzFdID09IHJvb3RbdGFnTmFtZV0udG9Mb3dlckNhc2UoKSA6IDEpICYmIChyW3IubGVuZ3RoXSA9IHJvb3QpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJcbiAgICAgIH0oW10pIDpcbiAgICAgIHJvb3RbYnlUYWddKGludHJbMV0gfHwgJyonKVxuICAgIC8vIGZpbHRlciBlbGVtZW50cyBhY2NvcmRpbmcgdG8gdGhlIHJpZ2h0LW1vc3QgcGFydCBvZiB0aGUgc2VsZWN0b3JcbiAgICBmb3IgKGkgPSAwLCBsID0gZWxzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGl0ZW0gPSBpbnRlcnByZXQuYXBwbHkoZWxzW2ldLCBpbnRyKSkgcltyLmxlbmd0aF0gPSBpdGVtXG4gICAgfVxuICAgIGlmICghdG9rZW5zLmxlbmd0aCkgcmV0dXJuIHJcblxuICAgIC8vIGZpbHRlciBmdXJ0aGVyIGFjY29yZGluZyB0byB0aGUgcmVzdCBvZiB0aGUgc2VsZWN0b3IgKHRoZSBsZWZ0IHNpZGUpXG4gICAgZWFjaChyLCBmdW5jdGlvbiAoZSkgeyBpZiAoYW5jZXN0b3JNYXRjaChlLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMpKSByZXRbcmV0Lmxlbmd0aF0gPSBlIH0pXG4gICAgcmV0dXJuIHJldFxuICB9XG5cbiAgLy8gY29tcGFyZSBlbGVtZW50IHRvIGEgc2VsZWN0b3JcbiAgZnVuY3Rpb24gaXMoZWwsIHNlbGVjdG9yLCByb290KSB7XG4gICAgaWYgKGlzTm9kZShzZWxlY3RvcikpIHJldHVybiBlbCA9PSBzZWxlY3RvclxuICAgIGlmIChhcnJheUxpa2Uoc2VsZWN0b3IpKSByZXR1cm4gISF+ZmxhdHRlbihzZWxlY3RvcikuaW5kZXhPZihlbCkgLy8gaWYgc2VsZWN0b3IgaXMgYW4gYXJyYXksIGlzIGVsIGEgbWVtYmVyP1xuXG4gICAgdmFyIHNlbGVjdG9ycyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIHRva2VucywgZGl2aWRlZFRva2Vuc1xuICAgIHdoaWxlIChzZWxlY3RvciA9IHNlbGVjdG9ycy5wb3AoKSkge1xuICAgICAgdG9rZW5zID0gdG9rZW5DYWNoZS5nKHNlbGVjdG9yKSB8fCB0b2tlbkNhY2hlLnMoc2VsZWN0b3IsIHNlbGVjdG9yLnNwbGl0KHRva2VuaXpyKSlcbiAgICAgIGRpdmlkZWRUb2tlbnMgPSBzZWxlY3Rvci5tYXRjaChkaXZpZGVycylcbiAgICAgIHRva2VucyA9IHRva2Vucy5zbGljZSgwKSAvLyBjb3B5IGFycmF5XG4gICAgICBpZiAoaW50ZXJwcmV0LmFwcGx5KGVsLCBxKHRva2Vucy5wb3AoKSkpICYmICghdG9rZW5zLmxlbmd0aCB8fCBhbmNlc3Rvck1hdGNoKGVsLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMsIHJvb3QpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIGdpdmVuIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSByaWdodC1tb3N0IHBhcnQgb2YgYSBzZWxlY3RvciwgZmlsdGVyIG91dCBhbnkgdGhhdCBkb24ndCBtYXRjaCB0aGUgcmVzdFxuICBmdW5jdGlvbiBhbmNlc3Rvck1hdGNoKGVsLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMsIHJvb3QpIHtcbiAgICB2YXIgY2FuZFxuICAgIC8vIHJlY3Vyc2l2ZWx5IHdvcmsgYmFja3dhcmRzIHRocm91Z2ggdGhlIHRva2VucyBhbmQgdXAgdGhlIGRvbSwgY292ZXJpbmcgYWxsIG9wdGlvbnNcbiAgICBmdW5jdGlvbiBjcmF3bChlLCBpLCBwKSB7XG4gICAgICB3aGlsZSAocCA9IHdhbGtlcltkaXZpZGVkVG9rZW5zW2ldXShwLCBlKSkge1xuICAgICAgICBpZiAoaXNOb2RlKHApICYmIChpbnRlcnByZXQuYXBwbHkocCwgcSh0b2tlbnNbaV0pKSkpIHtcbiAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaWYgKGNhbmQgPSBjcmF3bChwLCBpIC0gMSwgcCkpIHJldHVybiBjYW5kXG4gICAgICAgICAgfSBlbHNlIHJldHVybiBwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChjYW5kID0gY3Jhd2woZWwsIHRva2Vucy5sZW5ndGggLSAxLCBlbCkpICYmICghcm9vdCB8fCBpc0FuY2VzdG9yKGNhbmQsIHJvb3QpKVxuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKGVsLCB0KSB7XG4gICAgcmV0dXJuIGVsICYmIHR5cGVvZiBlbCA9PT0gJ29iamVjdCcgJiYgKHQgPSBlbFtub2RlVHlwZV0pICYmICh0ID09IDEgfHwgdCA9PSA5KVxuICB9XG5cbiAgZnVuY3Rpb24gdW5pcShhcikge1xuICAgIHZhciBhID0gW10sIGksIGo7XG4gICAgbzpcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXIubGVuZ3RoOyArK2kpIHtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBhLmxlbmd0aDsgKytqKSBpZiAoYVtqXSA9PSBhcltpXSkgY29udGludWUgb1xuICAgICAgYVthLmxlbmd0aF0gPSBhcltpXVxuICAgIH1cbiAgICByZXR1cm4gYVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlMaWtlKG8pIHtcbiAgICByZXR1cm4gKHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBpc0Zpbml0ZShvLmxlbmd0aCkpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3QpIHtcbiAgICBpZiAoIXJvb3QpIHJldHVybiBkb2NcbiAgICBpZiAodHlwZW9mIHJvb3QgPT0gJ3N0cmluZycpIHJldHVybiBxd2VyeShyb290KVswXVxuICAgIGlmICghcm9vdFtub2RlVHlwZV0gJiYgYXJyYXlMaWtlKHJvb3QpKSByZXR1cm4gcm9vdFswXVxuICAgIHJldHVybiByb290XG4gIH1cblxuICBmdW5jdGlvbiBieUlkKHJvb3QsIGlkLCBlbCkge1xuICAgIC8vIGlmIGRvYywgcXVlcnkgb24gaXQsIGVsc2UgcXVlcnkgdGhlIHBhcmVudCBkb2Mgb3IgaWYgYSBkZXRhY2hlZCBmcmFnbWVudCByZXdyaXRlIHRoZSBxdWVyeSBhbmQgcnVuIG9uIHRoZSBmcmFnbWVudFxuICAgIHJldHVybiByb290W25vZGVUeXBlXSA9PT0gOSA/IHJvb3QuZ2V0RWxlbWVudEJ5SWQoaWQpIDpcbiAgICAgIHJvb3Qub3duZXJEb2N1bWVudCAmJlxuICAgICAgICAoKChlbCA9IHJvb3Qub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpICYmIGlzQW5jZXN0b3IoZWwsIHJvb3QpICYmIGVsKSB8fFxuICAgICAgICAgICghaXNBbmNlc3Rvcihyb290LCByb290Lm93bmVyRG9jdW1lbnQpICYmIHNlbGVjdCgnW2lkPVwiJyArIGlkICsgJ1wiXScsIHJvb3QpWzBdKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHF3ZXJ5KHNlbGVjdG9yLCBfcm9vdCkge1xuICAgIHZhciBtLCBlbCwgcm9vdCA9IG5vcm1hbGl6ZVJvb3QoX3Jvb3QpXG5cbiAgICAvLyBlYXN5LCBmYXN0IGNhc2VzIHRoYXQgd2UgY2FuIGRpc3BhdGNoIHdpdGggc2ltcGxlIERPTSBjYWxsc1xuICAgIGlmICghcm9vdCB8fCAhc2VsZWN0b3IpIHJldHVybiBbXVxuICAgIGlmIChzZWxlY3RvciA9PT0gd2luZG93IHx8IGlzTm9kZShzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiAhX3Jvb3QgfHwgKHNlbGVjdG9yICE9PSB3aW5kb3cgJiYgaXNOb2RlKHJvb3QpICYmIGlzQW5jZXN0b3Ioc2VsZWN0b3IsIHJvb3QpKSA/IFtzZWxlY3Rvcl0gOiBbXVxuICAgIH1cbiAgICBpZiAoc2VsZWN0b3IgJiYgYXJyYXlMaWtlKHNlbGVjdG9yKSkgcmV0dXJuIGZsYXR0ZW4oc2VsZWN0b3IpXG4gICAgaWYgKG0gPSBzZWxlY3Rvci5tYXRjaChlYXN5KSkge1xuICAgICAgaWYgKG1bMV0pIHJldHVybiAoZWwgPSBieUlkKHJvb3QsIG1bMV0pKSA/IFtlbF0gOiBbXVxuICAgICAgaWYgKG1bMl0pIHJldHVybiBhcnJheWlmeShyb290W2J5VGFnXShtWzJdKSlcbiAgICAgIGlmIChoYXNCeUNsYXNzICYmIG1bM10pIHJldHVybiBhcnJheWlmeShyb290W2J5Q2xhc3NdKG1bM10pKVxuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3Qoc2VsZWN0b3IsIHJvb3QpXG4gIH1cblxuICAvLyB3aGVyZSB0aGUgcm9vdCBpcyBub3QgZG9jdW1lbnQgYW5kIGEgcmVsYXRpb25zaGlwIHNlbGVjdG9yIGlzIGZpcnN0IHdlIGhhdmUgdG9cbiAgLy8gZG8gc29tZSBhd2t3YXJkIGFkanVzdG1lbnRzIHRvIGdldCBpdCB0byB3b3JrLCBldmVuIHdpdGggcVNBXG4gIGZ1bmN0aW9uIGNvbGxlY3RTZWxlY3Rvcihyb290LCBjb2xsZWN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHMpIHtcbiAgICAgIHZhciBvaWQsIG5pZFxuICAgICAgaWYgKHNwbGl0dGFibGUudGVzdChzKSkge1xuICAgICAgICBpZiAocm9vdFtub2RlVHlwZV0gIT09IDkpIHtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGVsIGhhcyBhbiBpZCwgcmV3cml0ZSB0aGUgcXVlcnksIHNldCByb290IHRvIGRvYyBhbmQgcnVuIGl0XG4gICAgICAgICAgaWYgKCEobmlkID0gb2lkID0gcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJykpKSByb290LnNldEF0dHJpYnV0ZSgnaWQnLCBuaWQgPSAnX19xd2VyeW1ldXBzY290dHknKVxuICAgICAgICAgIHMgPSAnW2lkPVwiJyArIG5pZCArICdcIl0nICsgcyAvLyBhdm9pZCBieUlkIGFuZCBhbGxvdyB1cyB0byBtYXRjaCBjb250ZXh0IGVsZW1lbnRcbiAgICAgICAgICBjb2xsZWN0b3Iocm9vdC5wYXJlbnROb2RlIHx8IHJvb3QsIHMsIHRydWUpXG4gICAgICAgICAgb2lkIHx8IHJvb3QucmVtb3ZlQXR0cmlidXRlKCdpZCcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcy5sZW5ndGggJiYgY29sbGVjdG9yKHJvb3QsIHMsIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PSAxNlxuICAgIH0gOiAnY29udGFpbnMnIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lcltub2RlVHlwZV0gPT09IDkgfHwgY29udGFpbmVyID09IHdpbmRvdyA/IGh0bWwgOiBjb250YWluZXJcbiAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpXG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHJldHVybiAxXG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgLCBnZXRBdHRyID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZGV0ZWN0IGJ1Z2d5IElFIHNyYy9ocmVmIGdldEF0dHJpYnV0ZSgpIGNhbGxcbiAgICAgIHZhciBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgcmV0dXJuICgoZS5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiN4XCI+eDwvYT4nKSAmJiBlLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCdocmVmJykgIT0gJyN4JykgP1xuICAgICAgICBmdW5jdGlvbiAoZSwgYSkge1xuICAgICAgICAgIHJldHVybiBhID09PSAnY2xhc3MnID8gZS5jbGFzc05hbWUgOiAoYSA9PT0gJ2hyZWYnIHx8IGEgPT09ICdzcmMnKSA/XG4gICAgICAgICAgICBlLmdldEF0dHJpYnV0ZShhLCAyKSA6IGUuZ2V0QXR0cmlidXRlKGEpXG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbiAoZSwgYSkgeyByZXR1cm4gZS5nZXRBdHRyaWJ1dGUoYSkgfVxuICAgIH0oKVxuICAsIGhhc0J5Q2xhc3MgPSAhIWRvY1tieUNsYXNzXVxuICAgIC8vIGhhcyBuYXRpdmUgcVNBIHN1cHBvcnRcbiAgLCBoYXNRU0EgPSBkb2MucXVlcnlTZWxlY3RvciAmJiBkb2NbcVNBXVxuICAgIC8vIHVzZSBuYXRpdmUgcVNBXG4gICwgc2VsZWN0UVNBID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW10sIHNzLCBlXG4gICAgICB0cnkge1xuICAgICAgICBpZiAocm9vdFtub2RlVHlwZV0gPT09IDkgfHwgIXNwbGl0dGFibGUudGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgICAvLyBtb3N0IHdvcmsgaXMgZG9uZSByaWdodCBoZXJlLCBkZWZlciB0byBxU0FcbiAgICAgICAgICByZXR1cm4gYXJyYXlpZnkocm9vdFtxU0FdKHNlbGVjdG9yKSlcbiAgICAgICAgfVxuICAgICAgICAvLyBzcGVjaWFsIGNhc2Ugd2hlcmUgd2UgbmVlZCB0aGUgc2VydmljZXMgb2YgYGNvbGxlY3RTZWxlY3RvcigpYFxuICAgICAgICBlYWNoKHNzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgY29sbGVjdFNlbGVjdG9yKHJvb3QsIGZ1bmN0aW9uIChjdHgsIHMpIHtcbiAgICAgICAgICBlID0gY3R4W3FTQV0ocylcbiAgICAgICAgICBpZiAoZS5sZW5ndGggPT0gMSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gZS5pdGVtKDApXG4gICAgICAgICAgZWxzZSBpZiAoZS5sZW5ndGgpIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoYXJyYXlpZnkoZSkpXG4gICAgICAgIH0pKVxuICAgICAgICByZXR1cm4gc3MubGVuZ3RoID4gMSAmJiByZXN1bHQubGVuZ3RoID4gMSA/IHVuaXEocmVzdWx0KSA6IHJlc3VsdFxuICAgICAgfSBjYXRjaCAoZXgpIHsgfVxuICAgICAgcmV0dXJuIHNlbGVjdE5vbk5hdGl2ZShzZWxlY3Rvciwgcm9vdClcbiAgICB9XG4gICAgLy8gbm8gbmF0aXZlIHNlbGVjdG9yIHN1cHBvcnRcbiAgLCBzZWxlY3ROb25OYXRpdmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHJvb3QpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXSwgaXRlbXMsIG0sIGksIGwsIHIsIHNzXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2Uobm9ybWFsaXpyLCAnJDEnKVxuICAgICAgaWYgKG0gPSBzZWxlY3Rvci5tYXRjaCh0YWdBbmRPckNsYXNzKSkge1xuICAgICAgICByID0gY2xhc3NSZWdleChtWzJdKVxuICAgICAgICBpdGVtcyA9IHJvb3RbYnlUYWddKG1bMV0gfHwgJyonKVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHIudGVzdChpdGVtc1tpXS5jbGFzc05hbWUpKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBpdGVtc1tpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICAgIC8vIG1vcmUgY29tcGxleCBzZWxlY3RvciwgZ2V0IGBfcXdlcnkoKWAgdG8gZG8gdGhlIHdvcmsgZm9yIHVzXG4gICAgICBlYWNoKHNzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgY29sbGVjdFNlbGVjdG9yKHJvb3QsIGZ1bmN0aW9uIChjdHgsIHMsIHJld3JpdGUpIHtcbiAgICAgICAgciA9IF9xd2VyeShzLCBjdHgpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSByLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChjdHhbbm9kZVR5cGVdID09PSA5IHx8IHJld3JpdGUgfHwgaXNBbmNlc3RvcihyW2ldLCByb290KSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcltpXVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICAgIHJldHVybiBzcy5sZW5ndGggPiAxICYmIHJlc3VsdC5sZW5ndGggPiAxID8gdW5pcShyZXN1bHQpIDogcmVzdWx0XG4gICAgfVxuICAsIGNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBjb25maWdOYXRpdmVRU0E6IHVzZSBmdWxseS1pbnRlcm5hbCBzZWxlY3RvciBvciBuYXRpdmUgcVNBIHdoZXJlIHByZXNlbnRcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1t1c2VOYXRpdmVRU0FdICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgc2VsZWN0ID0gIW9wdGlvbnNbdXNlTmF0aXZlUVNBXSA/IHNlbGVjdE5vbk5hdGl2ZSA6IGhhc1FTQSA/IHNlbGVjdFFTQSA6IHNlbGVjdE5vbk5hdGl2ZVxuICAgIH1cblxuICBjb25maWd1cmUoeyB1c2VOYXRpdmVRU0E6IHRydWUgfSlcblxuICBxd2VyeS5jb25maWd1cmUgPSBjb25maWd1cmVcbiAgcXdlcnkudW5pcSA9IHVuaXFcbiAgcXdlcnkuaXMgPSBpc1xuICBxd2VyeS5wc2V1ZG9zID0ge31cblxuICByZXR1cm4gcXdlcnlcbn0pO1xuIiwidmFyIHRvQ2FtZWxDYXNlID0gcmVxdWlyZSgndG8tY2FtZWwtY2FzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlO1xubW9kdWxlLmV4cG9ydHMuaGlkZSA9IGVmZmVjdCgnZGlzcGxheScsICdub25lJyk7XG5tb2R1bGUuZXhwb3J0cy5zaG93ID0gZWZmZWN0KCdkaXNwbGF5JywgJ2luaXRpYWwnKTtcblxuZnVuY3Rpb24gYWxsKGVsZW1lbnQsIGNzcykge1xuICB2YXIgbmFtZTtcbiAgZm9yICggbmFtZSBpbiBjc3MgKSB7XG4gICAgb25lKGVsZW1lbnQsIG5hbWUsIGNzc1tuYW1lXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZWZmZWN0KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZWxlbWVudCwgb3ZlcnJpZGUpIHtcbiAgICBzdHlsZShlbGVtZW50LCBuYW1lLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IG92ZXJyaWRlIDogdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbmUoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgZWxlbWVudC5zdHlsZVt0b0NhbWVsQ2FzZSgobmFtZSA9PSAnZmxvYXQnKSA/ICdjc3NGbG9hdCcgOiBuYW1lKV0gPSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gc3R5bGUoZWxlbWVudCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XG4gICAgcmV0dXJuIG9uZShlbGVtZW50LCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gIH1cblxuICByZXR1cm4gYWxsKGVsZW1lbnQsIGFyZ3VtZW50c1sxXSk7XG59XG4iLCJcbnZhciB0b1NwYWNlID0gcmVxdWlyZSgndG8tc3BhY2UtY2FzZScpO1xuXG5cbi8qKlxuICogRXhwb3NlIGB0b0NhbWVsQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b0NhbWVsQ2FzZTtcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgc3RyaW5nYCB0byBjYW1lbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIHRvU3BhY2Uoc3RyaW5nKS5yZXBsYWNlKC9cXHMoXFx3KS9nLCBmdW5jdGlvbiAobWF0Y2hlcywgbGV0dGVyKSB7XG4gICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn0iLCJcbnZhciBjbGVhbiA9IHJlcXVpcmUoJ3RvLW5vLWNhc2UnKTtcblxuXG4vKipcbiAqIEV4cG9zZSBgdG9TcGFjZUNhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9TcGFjZUNhc2U7XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgYHN0cmluZ2AgdG8gc3BhY2UgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiB0b1NwYWNlQ2FzZSAoc3RyaW5nKSB7XG4gIHJldHVybiBjbGVhbihzdHJpbmcpLnJlcGxhY2UoL1tcXFdfXSsoLnwkKS9nLCBmdW5jdGlvbiAobWF0Y2hlcywgbWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2ggPyAnICcgKyBtYXRjaCA6ICcnO1xuICB9KTtcbn0iLCJcbi8qKlxuICogRXhwb3NlIGB0b05vQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b05vQ2FzZTtcblxuXG4vKipcbiAqIFRlc3Qgd2hldGhlciBhIHN0cmluZyBpcyBjYW1lbC1jYXNlLlxuICovXG5cbnZhciBoYXNTcGFjZSA9IC9cXHMvO1xudmFyIGhhc0NhbWVsID0gL1thLXpdW0EtWl0vO1xudmFyIGhhc1NlcGFyYXRvciA9IC9bXFxXX10vO1xuXG5cbi8qKlxuICogUmVtb3ZlIGFueSBzdGFydGluZyBjYXNlIGZyb20gYSBgc3RyaW5nYCwgbGlrZSBjYW1lbCBvciBzbmFrZSwgYnV0IGtlZXBcbiAqIHNwYWNlcyBhbmQgcHVuY3R1YXRpb24gdGhhdCBtYXkgYmUgaW1wb3J0YW50IG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdG9Ob0Nhc2UgKHN0cmluZykge1xuICBpZiAoaGFzU3BhY2UudGVzdChzdHJpbmcpKSByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCk7XG5cbiAgaWYgKGhhc1NlcGFyYXRvci50ZXN0KHN0cmluZykpIHN0cmluZyA9IHVuc2VwYXJhdGUoc3RyaW5nKTtcbiAgaWYgKGhhc0NhbWVsLnRlc3Qoc3RyaW5nKSkgc3RyaW5nID0gdW5jYW1lbGl6ZShzdHJpbmcpO1xuICByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCk7XG59XG5cblxuLyoqXG4gKiBTZXBhcmF0b3Igc3BsaXR0ZXIuXG4gKi9cblxudmFyIHNlcGFyYXRvclNwbGl0dGVyID0gL1tcXFdfXSsoLnwkKS9nO1xuXG5cbi8qKlxuICogVW4tc2VwYXJhdGUgYSBgc3RyaW5nYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdW5zZXBhcmF0ZSAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShzZXBhcmF0b3JTcGxpdHRlciwgZnVuY3Rpb24gKG0sIG5leHQpIHtcbiAgICByZXR1cm4gbmV4dCA/ICcgJyArIG5leHQgOiAnJztcbiAgfSk7XG59XG5cblxuLyoqXG4gKiBDYW1lbGNhc2Ugc3BsaXR0ZXIuXG4gKi9cblxudmFyIGNhbWVsU3BsaXR0ZXIgPSAvKC4pKFtBLVpdKykvZztcblxuXG4vKipcbiAqIFVuLWNhbWVsY2FzZSBhIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB1bmNhbWVsaXplIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGNhbWVsU3BsaXR0ZXIsIGZ1bmN0aW9uIChtLCBwcmV2aW91cywgdXBwZXJzKSB7XG4gICAgcmV0dXJuIHByZXZpb3VzICsgJyAnICsgdXBwZXJzLnRvTG93ZXJDYXNlKCkuc3BsaXQoJycpLmpvaW4oJyAnKTtcbiAgfSk7XG59IiwidmFyIG5ld0VsZW1lbnQgPSByZXF1aXJlKFwiLi9uZXctZWxlbWVudFwiKTtcbnZhciBzZWxlY3QgPSByZXF1aXJlKCcuL3NlbGVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiB3aXRoQ2hpbGRyZW4oYWRkKSxcbiAgYWRkQWZ0ZXI6IHdpdGhDaGlsZHJlbihhZGRBZnRlciksXG4gIGFkZEJlZm9yZTogd2l0aENoaWxkcmVuKGFkZEJlZm9yZSksXG4gIGluc2VydDogaW5zZXJ0LFxuICByZXBsYWNlOiByZXBsYWNlLFxuICByZW1vdmU6IHJlbW92ZVxufTtcblxuZnVuY3Rpb24gYWRkIChwYXJlbnQsIGNoaWxkLCB2YXJzKSB7XG4gIHNlbGVjdChwYXJlbnQpLmFwcGVuZENoaWxkKG5ld0VsZW1lbnQoY2hpbGQsIHZhcnMpKTtcbn1cblxuZnVuY3Rpb24gYWRkQWZ0ZXIgKHBhcmVudCwgY2hpbGQvKlssIHZhcnNdLCByZWZlcmVuY2UgKi8pIHtcbiAgdmFyIHJlZiA9IHNlbGVjdChhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLCBwYXJlbnQpLm5leHRTaWJsaW5nO1xuICB2YXIgdmFycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuXG4gIGlmIChyZWYgPT0gbnVsbCkge1xuICAgIHJldHVybiBhZGQocGFyZW50LCBjaGlsZCwgdmFycyk7XG4gIH1cblxuICBhZGRCZWZvcmUocGFyZW50LCBjaGlsZCwgdmFycywgcmVmKTtcbn1cblxuZnVuY3Rpb24gYWRkQmVmb3JlIChwYXJlbnQsIGNoaWxkLypbLCB2YXJzXSwgcmVmZXJlbmNlICovKSB7XG4gIHZhciByZWYgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICB2YXIgdmFycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICBzZWxlY3QocGFyZW50KS5pbnNlcnRCZWZvcmUobmV3RWxlbWVudChjaGlsZCwgdmFycyksIHNlbGVjdChyZWYsIHBhcmVudCkpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnQgKGVsZW1lbnQgLypbLHZhcnNdLCBwYXJlbnQgKi8pIHtcbiAgdmFyIHBhcmVudCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gIHZhciB2YXJzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG5cbiAgYWRkKHNlbGVjdChwYXJlbnQpLCBlbGVtZW50LCB2YXJzKTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZSAocGFyZW50LCB0YXJnZXQsIHJlcGwsIHZhcnMpIHtcbiAgc2VsZWN0KHBhcmVudCkucmVwbGFjZUNoaWxkKHNlbGVjdChuZXdFbGVtZW50KHJlcGwsIHZhcnMpKSwgc2VsZWN0KHRhcmdldCwgcGFyZW50KSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSAoZWxlbWVudCwgY2hpbGQpIHtcbiAgdmFyIGksIGFsbDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIHR5cGVvZiBlbGVtZW50ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgfVxuXG4gIGFsbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gc2VsZWN0LmFsbChjaGlsZCwgZWxlbWVudCkgOiBzZWxlY3QuYWxsKGVsZW1lbnQpO1xuICBpID0gYWxsLmxlbmd0aDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgYWxsW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYWxsW2ldKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHdpdGhDaGlsZHJlbiAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChfLCBjaGlsZHJlbikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIGNoaWxkcmVuID0gW2NoaWxkcmVuXTtcblxuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICB2YXIgcGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgIHBhcmFtc1sxXSA9IGNoaWxkcmVuW2ldO1xuICAgICAgZm4uYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMpO1xuICAgIH1cbiAgfTtcbn1cbiIsInZhciBuZXdFbGVtZW50ID0gcmVxdWlyZShcIm5ldy1lbGVtZW50XCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlmTmVjZXNzYXJ5O1xuXG5mdW5jdGlvbiBpZk5lY2Vzc2FyeSAoaHRtbCwgdmFycykge1xuICBpZiAoIWlzSFRNTChodG1sKSkgcmV0dXJuIGh0bWw7XG4gIHJldHVybiBuZXdFbGVtZW50KGh0bWwsIHZhcnMpO1xufVxuXG5mdW5jdGlvbiBpc0hUTUwodGV4dCl7XG4gIHJldHVybiB0eXBlb2YgdGV4dCA9PSAnc3RyaW5nJyAmJiB0ZXh0LmNoYXJBdCgwKSA9PSAnPCc7XG59XG4iLCJ2YXIgc2VsZWN0ID0gcmVxdWlyZSgnZG9tLXNlbGVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlmTmVjZXNzYXJ5O1xubW9kdWxlLmV4cG9ydHMuYWxsID0gaWZOZWNlc3NhcnlBbGw7XG5cbmZ1bmN0aW9uIGlmTmVjZXNzYXJ5IChjaGlsZCwgcGFyZW50KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgIGNoaWxkID0gY2hpbGRbMF07XG4gIH1cblxuICBpZiAoIHR5cGVvZiBjaGlsZCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBjaGlsZDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGFyZW50ID09ICdzdHJpbmcnKSB7XG4gICAgcGFyZW50ID0gc2VsZWN0KHBhcmVudCwgZG9jdW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdChjaGlsZCwgcGFyZW50KTtcbn1cblxuZnVuY3Rpb24gaWZOZWNlc3NhcnlBbGwgKGNoaWxkLCBwYXJlbnQpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgY2hpbGQgPSBjaGlsZFswXTtcbiAgfVxuXG4gIGlmICggdHlwZW9mIGNoaWxkICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIFtjaGlsZF07XG4gIH1cblxuICBpZiAodHlwZW9mIHBhcmVudCA9PSAnc3RyaW5nJykge1xuICAgIHBhcmVudCA9IHNlbGVjdChwYXJlbnQsIGRvY3VtZW50KTtcbiAgfVxuXG4gIHJldHVybiBzZWxlY3QuYWxsKGNoaWxkLCBwYXJlbnQpO1xufVxuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHR5cGVPZiA9IHJlcXVpcmUoJ2NvbXBvbmVudC10eXBlJyk7XG5cbi8qKlxuICogU2V0IG9yIGdldCBgZWxgJ3MnIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWwsIHZhbCl7XG4gIGlmICgyID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzZXQoZWwsIHZhbCk7XG4gIHJldHVybiBnZXQoZWwpO1xufTtcblxuLyoqXG4gKiBHZXQgYGVsYCdzIHZhbHVlLlxuICovXG5cbmZ1bmN0aW9uIGdldChlbCkge1xuICBzd2l0Y2ggKHR5cGUoZWwpKSB7XG4gICAgY2FzZSAnY2hlY2tib3gnOlxuICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgIGlmIChlbC5jaGVja2VkKSB7XG4gICAgICAgIHZhciBhdHRyID0gZWwuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICByZXR1cm4gbnVsbCA9PSBhdHRyID8gdHJ1ZSA6IGF0dHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgY2FzZSAncmFkaW9ncm91cCc6XG4gICAgICBmb3IgKHZhciBpID0gMCwgcmFkaW87IHJhZGlvID0gZWxbaV07IGkrKykge1xuICAgICAgICBpZiAocmFkaW8uY2hlY2tlZCkgcmV0dXJuIHJhZGlvLnZhbHVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCBvcHRpb247IG9wdGlvbiA9IGVsLm9wdGlvbnNbaV07IGkrKykge1xuICAgICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSByZXR1cm4gb3B0aW9uLnZhbHVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBlbC52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFNldCBgZWxgJ3MgdmFsdWUuXG4gKi9cblxuZnVuY3Rpb24gc2V0KGVsLCB2YWwpIHtcbiAgc3dpdGNoICh0eXBlKGVsKSkge1xuICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICBjYXNlICdyYWRpbyc6XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmFkaW9ncm91cCc6XG4gICAgICBmb3IgKHZhciBpID0gMCwgcmFkaW87IHJhZGlvID0gZWxbaV07IGkrKykge1xuICAgICAgICByYWRpby5jaGVja2VkID0gcmFkaW8udmFsdWUgPT09IHZhbDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBmb3IgKHZhciBpID0gMCwgb3B0aW9uOyBvcHRpb24gPSBlbC5vcHRpb25zW2ldOyBpKyspIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gb3B0aW9uLnZhbHVlID09PSB2YWw7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgZWwudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBFbGVtZW50IHR5cGUuXG4gKi9cblxuZnVuY3Rpb24gdHlwZShlbCkge1xuICB2YXIgZ3JvdXAgPSAnYXJyYXknID09IHR5cGVPZihlbCkgfHwgJ29iamVjdCcgPT0gdHlwZU9mKGVsKTtcbiAgaWYgKGdyb3VwKSBlbCA9IGVsWzBdO1xuICB2YXIgbmFtZSA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIHZhciB0eXBlID0gZWwuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG5cbiAgaWYgKGdyb3VwICYmIHR5cGUgJiYgJ3JhZGlvJyA9PSB0eXBlLnRvTG93ZXJDYXNlKCkpIHJldHVybiAncmFkaW9ncm91cCc7XG4gIGlmICgnaW5wdXQnID09IG5hbWUgJiYgdHlwZSAmJiAnY2hlY2tib3gnID09IHR5cGUudG9Mb3dlckNhc2UoKSkgcmV0dXJuICdjaGVja2JveCc7XG4gIGlmICgnaW5wdXQnID09IG5hbWUgJiYgdHlwZSAmJiAncmFkaW8nID09IHR5cGUudG9Mb3dlckNhc2UoKSkgcmV0dXJuICdyYWRpbyc7XG4gIGlmICgnc2VsZWN0JyA9PSBuYW1lKSByZXR1cm4gJ3NlbGVjdCc7XG4gIHJldHVybiBuYW1lO1xufVxuIiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6IHJldHVybiAnc3RyaW5nJztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCc7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsICYmIHZhbC5ub2RlVHlwZSA9PT0gMSkgcmV0dXJuICdlbGVtZW50JztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZvcm1hdDtcblxuZnVuY3Rpb24gZm9ybWF0KHRleHQpIHtcbiAgdmFyIGNvbnRleHQ7XG5cbiAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT0gJ29iamVjdCcgJiYgYXJndW1lbnRzWzFdKSB7XG4gICAgY29udGV4dCA9IGFyZ3VtZW50c1sxXTtcbiAgfSBlbHNlIHtcbiAgICBjb250ZXh0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgfVxuXG4gIHJldHVybiBTdHJpbmcodGV4dCkucmVwbGFjZSgvXFx7P1xceyhbXnt9XSspfX0/L2csIHJlcGxhY2UoY29udGV4dCkpO1xufTtcblxuZnVuY3Rpb24gcmVwbGFjZSAoY29udGV4dCwgbmlsKXtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YWcsIG5hbWUpIHtcbiAgICBpZiAodGFnLnN1YnN0cmluZygwLCAyKSA9PSAne3snICYmIHRhZy5zdWJzdHJpbmcodGFnLmxlbmd0aCAtIDIpID09ICd9fScpIHtcbiAgICAgIHJldHVybiAneycgKyBuYW1lICsgJ30nO1xuICAgIH1cblxuICAgIGlmICghY29udGV4dC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbnRleHRbbmFtZV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNvbnRleHRbbmFtZV0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dFtuYW1lXTtcbiAgfVxufVxuIiwidmFyIGtleW5hbWVPZiA9IHJlcXVpcmUoXCJrZXluYW1lLW9mXCIpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoXCJkb20tZXZlbnRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gb247XG5tb2R1bGUuZXhwb3J0cy5vbiA9IG9uO1xubW9kdWxlLmV4cG9ydHMub2ZmID0gb2ZmO1xuXG5mdW5jdGlvbiBvbiAoZWxlbWVudCwga2V5cywgY2FsbGJhY2spIHtcbiAgdmFyIGV4cGVjdGVkID0gcGFyc2Uoa2V5cyk7XG5cbiAgdmFyIGZuID0gZXZlbnRzLm9uKGVsZW1lbnQsICdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgIGlmICgoZXZlbnQuY3RybEtleSB8fCB1bmRlZmluZWQpID09IGV4cGVjdGVkLmN0cmwgJiZcbiAgICAgICAoZXZlbnQuYWx0S2V5IHx8IHVuZGVmaW5lZCkgPT0gZXhwZWN0ZWQuYWx0ICYmXG4gICAgICAgKGV2ZW50LnNoaWZ0S2V5IHx8IHVuZGVmaW5lZCkgPT0gZXhwZWN0ZWQuc2hpZnQgJiZcbiAgICAgICBrZXluYW1lT2YoZXZlbnQua2V5Q29kZSkgPT0gZXhwZWN0ZWQua2V5KXtcblxuICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgIH1cblxuICB9KTtcblxuXG4gIGNhbGxiYWNrWydjYi0nICsga2V5c10gPSBmbjtcblxuICByZXR1cm4gY2FsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIG9mZiAoZWxlbWVudCwga2V5cywgY2FsbGJhY2spIHtcbiAgZXZlbnRzLm9mZihlbGVtZW50LCAna2V5dXAnLCBjYWxsYmFja1snY2ItJyArIGtleXNdKTtcbn1cblxuZnVuY3Rpb24gcGFyc2UgKGtleXMpe1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGtleXMgPSBrZXlzLnNwbGl0KC9bXlxcd10rLyk7XG5cbiAgdmFyIGkgPSBrZXlzLmxlbmd0aCwgbmFtZTtcbiAgd2hpbGUgKCBpIC0tICl7XG4gICAgbmFtZSA9IGtleXNbaV0udHJpbSgpO1xuXG4gICAgaWYobmFtZSA9PSAnY3RybCcpIHtcbiAgICAgIHJlc3VsdC5jdHJsID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmKG5hbWUgPT0gJ2FsdCcpIHtcbiAgICAgIHJlc3VsdC5hbHQgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYobmFtZSA9PSAnc2hpZnQnKSB7XG4gICAgICByZXN1bHQuc2hpZnQgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzdWx0LmtleSA9IG5hbWUudHJpbSgpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gb247XG5tb2R1bGUuZXhwb3J0cy5vbiA9IG9uO1xubW9kdWxlLmV4cG9ydHMub2ZmID0gb2ZmO1xuXG5mdW5jdGlvbiBvbiAoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG4gIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgfHwgZWxlbWVudC5hdHRhY2hFdmVudCkuY2FsbChlbGVtZW50LCBldmVudCwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuICByZXR1cm4gY2FsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIG9mZiAoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG4gIChlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgfHwgZWxlbWVudC5kZXRhY2hFdmVudCkuY2FsbChlbGVtZW50LCBldmVudCwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuICByZXR1cm4gY2FsbGJhY2s7XG59XG4iLCJ2YXIgbWFwID0gcmVxdWlyZShcImtleW5hbWVzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleW5hbWVPZjtcblxuZnVuY3Rpb24ga2V5bmFtZU9mIChuKSB7XG4gICByZXR1cm4gbWFwW25dIHx8IFN0cmluZy5mcm9tQ2hhckNvZGUobikudG9Mb3dlckNhc2UoKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICA4ICAgOiAnYmFja3NwYWNlJyxcbiAgOSAgIDogJ3RhYicsXG4gIDEzICA6ICdlbnRlcicsXG4gIDE2ICA6ICdzaGlmdCcsXG4gIDE3ICA6ICdjdHJsJyxcbiAgMTggIDogJ2FsdCcsXG4gIDIwICA6ICdjYXBzbG9jaycsXG4gIDI3ICA6ICdlc2MnLFxuICAzMiAgOiAnc3BhY2UnLFxuICAzMyAgOiAncGFnZXVwJyxcbiAgMzQgIDogJ3BhZ2Vkb3duJyxcbiAgMzUgIDogJ2VuZCcsXG4gIDM2ICA6ICdob21lJyxcbiAgMzcgIDogJ2xlZnQnLFxuICAzOCAgOiAndXAnLFxuICAzOSAgOiAncmlnaHQnLFxuICA0MCAgOiAnZG93bicsXG4gIDQ1ICA6ICdpbnMnLFxuICA0NiAgOiAnZGVsJyxcbiAgOTEgIDogJ21ldGEnLFxuICA5MyAgOiAnbWV0YScsXG4gIDIyNCA6ICdtZXRhJ1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gbmV3Q2hhaW47XG5tb2R1bGUuZXhwb3J0cy5mcm9tID0gZnJvbTtcblxuZnVuY3Rpb24gZnJvbShjaGFpbil7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgdmFyIG0sIGk7XG5cbiAgICBtID0gbWV0aG9kcy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgaSAgID0gbS5sZW5ndGg7XG5cbiAgICB3aGlsZSAoIGkgLS0gKSB7XG4gICAgICBjaGFpblsgbVtpXS5uYW1lIF0gPSBtW2ldLmZuO1xuICAgIH1cblxuICAgIG0uZm9yRWFjaChmdW5jdGlvbihtZXRob2Qpe1xuICAgICAgY2hhaW5bIG1ldGhvZC5uYW1lIF0gPSBmdW5jdGlvbigpe1xuICAgICAgICBtZXRob2QuZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjaGFpbjtcbiAgfTtcblxufVxuXG5mdW5jdGlvbiBtZXRob2RzKCl7XG4gIHZhciBhbGwsIGVsLCBpLCBsZW4sIHJlc3VsdCwga2V5O1xuXG4gIGFsbCAgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIHJlc3VsdCA9IFtdO1xuICBpICAgICAgPSBhbGwubGVuZ3RoO1xuXG4gIHdoaWxlICggaSAtLSApIHtcbiAgICBlbCA9IGFsbFtpXTtcblxuICAgIGlmICggdHlwZW9mIGVsID09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXN1bHQucHVzaCh7IG5hbWU6IGVsLm5hbWUsIGZuOiBlbCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGVsICE9ICdvYmplY3QnICkgY29udGludWU7XG5cbiAgICBmb3IgKCBrZXkgaW4gZWwgKSB7XG4gICAgICByZXN1bHQucHVzaCh7IG5hbWU6IGtleSwgZm46IGVsW2tleV0gfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbmV3Q2hhaW4oKXtcbiAgcmV0dXJuIGZyb20oe30pLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbn1cbiIsInZhciBkb21pZnkgPSByZXF1aXJlKFwiZG9taWZ5XCIpO1xudmFyIGZvcm1hdCA9IHJlcXVpcmUoXCJmb3JtYXQtdGV4dFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXdFbGVtZW50O1xuXG5mdW5jdGlvbiBuZXdFbGVtZW50IChodG1sLCB2YXJzKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHJldHVybiBkb21pZnkoaHRtbCk7XG4gIHJldHVybiBkb21pZnkoZm9ybWF0KGh0bWwsIHZhcnMpKTtcbn1cbiIsIlxuLyoqXG4gKiBFeHBvc2UgYHBhcnNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xuXG4vKipcbiAqIFdyYXAgbWFwIGZyb20ganF1ZXJ5LlxuICovXG5cbnZhciBtYXAgPSB7XG4gIG9wdGlvbjogWzEsICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLCAnPC9zZWxlY3Q+J10sXG4gIG9wdGdyb3VwOiBbMSwgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsICc8L3NlbGVjdD4nXSxcbiAgbGVnZW5kOiBbMSwgJzxmaWVsZHNldD4nLCAnPC9maWVsZHNldD4nXSxcbiAgdGhlYWQ6IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddLFxuICB0Ym9keTogWzEsICc8dGFibGU+JywgJzwvdGFibGU+J10sXG4gIHRmb290OiBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXSxcbiAgY29sZ3JvdXA6IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddLFxuICBjYXB0aW9uOiBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXSxcbiAgdHI6IFsyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPiddLFxuICB0ZDogWzMsICc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+J10sXG4gIHRoOiBbMywgJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nXSxcbiAgY29sOiBbMiwgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nXSxcbiAgX2RlZmF1bHQ6IFswLCAnJywgJyddXG59O1xuXG4vKipcbiAqIFBhcnNlIGBodG1sYCBhbmQgcmV0dXJuIHRoZSBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShodG1sKSB7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgaHRtbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignU3RyaW5nIGV4cGVjdGVkJyk7XG5cbiAgLy8gdGFnIG5hbWVcbiAgdmFyIG0gPSAvPChbXFx3Ol0rKS8uZXhlYyhodG1sKTtcbiAgaWYgKCFtKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnRzIHdlcmUgZ2VuZXJhdGVkLicpO1xuICB2YXIgdGFnID0gbVsxXTtcblxuICAvLyBib2R5IHN1cHBvcnRcbiAgaWYgKHRhZyA9PSAnYm9keScpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgfVxuXG4gIC8vIHdyYXAgbWFwXG4gIHZhciB3cmFwID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0O1xuICB2YXIgZGVwdGggPSB3cmFwWzBdO1xuICB2YXIgcHJlZml4ID0gd3JhcFsxXTtcbiAgdmFyIHN1ZmZpeCA9IHdyYXBbMl07XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBlbC5pbm5lckhUTUwgPSBwcmVmaXggKyBodG1sICsgc3VmZml4O1xuICB3aGlsZSAoZGVwdGgtLSkgZWwgPSBlbC5sYXN0Q2hpbGQ7XG5cbiAgdmFyIGVscyA9IGVsLmNoaWxkcmVuO1xuICBpZiAoMSA9PSBlbHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGVsLnJlbW92ZUNoaWxkKGVsc1swXSk7XG4gIH1cblxuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHdoaWxlIChlbHMubGVuZ3RoKSB7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWwucmVtb3ZlQ2hpbGQoZWxzWzBdKSk7XG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59XG4iLCJ2YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICB2YXIgbm9kZSA9IGVsLnBhcmVudE5vZGUuZmlyc3RDaGlsZFxuICB2YXIgc2libGluZ3MgPSBbXVxuICBcbiAgZm9yICggOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZyApIHtcbiAgICBpZiAoIG5vZGUubm9kZVR5cGUgPT09IDEgJiYgbm9kZSAhPT0gZWwgKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yKSBzaWJsaW5ncy5wdXNoKG5vZGUpXG4gICAgICBlbHNlIGlmIChtYXRjaGVzKG5vZGUsIHNlbGVjdG9yKSkgc2libGluZ3MucHVzaChub2RlKVxuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIHNpYmxpbmdzXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgfHwgcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcblxuLyoqXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0iLCJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHRyaW07XG5cbmZ1bmN0aW9uIHRyaW0oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG59XG5cbmV4cG9ydHMubGVmdCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJyk7XG59O1xuXG5leHBvcnRzLnJpZ2h0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn07XG4iLCIoZnVuY3Rpb24gKEJ1ZmZlcil7XG5tb2R1bGUuZXhwb3J0cyA9IExldmVsXG5cbnZhciBJREIgPSByZXF1aXJlKCdpZGItd3JhcHBlcicpXG52YXIgQWJzdHJhY3RMZXZlbERPV04gPSByZXF1aXJlKCdhYnN0cmFjdC1sZXZlbGRvd24nKS5BYnN0cmFjdExldmVsRE9XTlxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbnZhciBJdGVyYXRvciA9IHJlcXVpcmUoJy4vaXRlcmF0b3InKVxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXNidWZmZXInKVxudmFyIHh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxudmFyIHRvQnVmZmVyID0gcmVxdWlyZSgndHlwZWRhcnJheS10by1idWZmZXInKVxuXG5mdW5jdGlvbiBMZXZlbChsb2NhdGlvbikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGV2ZWwpKSByZXR1cm4gbmV3IExldmVsKGxvY2F0aW9uKVxuICBpZiAoIWxvY2F0aW9uKSB0aHJvdyBuZXcgRXJyb3IoXCJjb25zdHJ1Y3RvciByZXF1aXJlcyBhdCBsZWFzdCBhIGxvY2F0aW9uIGFyZ3VtZW50XCIpXG4gIHRoaXMuSURCT3B0aW9ucyA9IHt9XG4gIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvblxufVxuXG51dGlsLmluaGVyaXRzKExldmVsLCBBYnN0cmFjdExldmVsRE9XTilcblxuTGV2ZWwucHJvdG90eXBlLl9vcGVuID0gZnVuY3Rpb24ob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgXG4gIHZhciBpZGJPcHRzID0ge1xuICAgIHN0b3JlTmFtZTogdGhpcy5sb2NhdGlvbixcbiAgICBhdXRvSW5jcmVtZW50OiBmYWxzZSxcbiAgICBrZXlQYXRoOiBudWxsLFxuICAgIG9uU3RvcmVSZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCwgc2VsZi5pZGIpXG4gICAgfSwgXG4gICAgb25FcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhlcnIpXG4gICAgfVxuICB9XG4gIFxuICB4dGVuZChpZGJPcHRzLCBvcHRpb25zKVxuICB0aGlzLklEQk9wdGlvbnMgPSBpZGJPcHRzXG4gIHRoaXMuaWRiID0gbmV3IElEQihpZGJPcHRzKVxufVxuXG5MZXZlbC5wcm90b3R5cGUuX2dldCA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRoaXMuaWRiLmdldChrZXksIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyAnTm90Rm91bmQnIGVycm9yLCBjb25zaXN0ZW50IHdpdGggTGV2ZWxET1dOIEFQSVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignTm90Rm91bmQnKSlcbiAgICB9XG4gICAgLy8gYnkgZGVmYXVsdCByZXR1cm4gYnVmZmVycywgdW5sZXNzIGV4cGxpY2l0bHkgdG9sZCBub3QgdG9cbiAgICB2YXIgYXNCdWZmZXIgPSB0cnVlXG4gICAgaWYgKG9wdGlvbnMuYXNCdWZmZXIgPT09IGZhbHNlKSBhc0J1ZmZlciA9IGZhbHNlXG4gICAgaWYgKG9wdGlvbnMucmF3KSBhc0J1ZmZlciA9IGZhbHNlXG4gICAgaWYgKGFzQnVmZmVyKSB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB2YWx1ZSA9IHRvQnVmZmVyKHZhbHVlKVxuICAgICAgZWxzZSB2YWx1ZSA9IG5ldyBCdWZmZXIoU3RyaW5nKHZhbHVlKSlcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHZhbHVlLCBrZXkpXG4gIH0sIGNhbGxiYWNrKVxufVxuXG5MZXZlbC5wcm90b3R5cGUuX2RlbCA9IGZ1bmN0aW9uKGlkLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0aGlzLmlkYi5yZW1vdmUoaWQsIGNhbGxiYWNrLCBjYWxsYmFjaylcbn1cblxuTGV2ZWwucHJvdG90eXBlLl9wdXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICB2YWx1ZSA9IHRvQnVmZmVyKG5ldyBVaW50OEFycmF5KHZhbHVlKSlcbiAgfVxuICB2YXIgb2JqID0gdGhpcy5jb252ZXJ0RW5jb2Rpbmcoa2V5LCB2YWx1ZSwgb3B0aW9ucylcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmoudmFsdWUpKSB7XG4gICAgb2JqLnZhbHVlID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUudG9BcnJheUJ1ZmZlcigpKVxuICB9XG4gIHRoaXMuaWRiLnB1dChvYmoua2V5LCBvYmoudmFsdWUsIGZ1bmN0aW9uKCkgeyBjYWxsYmFjaygpIH0sIGNhbGxiYWNrKVxufVxuXG5MZXZlbC5wcm90b3R5cGUuY29udmVydEVuY29kaW5nID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5yYXcpIHJldHVybiB7a2V5OiBrZXksIHZhbHVlOiB2YWx1ZX1cbiAgaWYgKHZhbHVlKSB7XG4gICAgdmFyIHN0cmluZ2VkID0gdmFsdWUudG9TdHJpbmcoKVxuICAgIGlmIChzdHJpbmdlZCA9PT0gJ05hTicpIHZhbHVlID0gJ05hTidcbiAgfVxuICB2YXIgdmFsRW5jID0gb3B0aW9ucy52YWx1ZUVuY29kaW5nXG4gIHZhciBvYmogPSB7a2V5OiBrZXksIHZhbHVlOiB2YWx1ZX1cbiAgaWYgKHZhbHVlICYmICghdmFsRW5jIHx8IHZhbEVuYyAhPT0gJ2JpbmFyeScpKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoudmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICBvYmoudmFsdWUgPSBzdHJpbmdlZFxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqXG59XG5cbkxldmVsLnByb3RvdHlwZS5pdGVyYXRvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIG9wdGlvbnMgPSB7fVxuICByZXR1cm4gbmV3IEl0ZXJhdG9yKHRoaXMuaWRiLCBvcHRpb25zKVxufVxuXG5MZXZlbC5wcm90b3R5cGUuX2JhdGNoID0gZnVuY3Rpb24gKGFycmF5LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgb3BcbiAgdmFyIGlcbiAgdmFyIGtcbiAgdmFyIGNvcGllZE9wXG4gIHZhciBjdXJyZW50T3BcbiAgdmFyIG1vZGlmaWVkID0gW11cbiAgXG4gIGlmIChhcnJheS5sZW5ndGggPT09IDApIHJldHVybiBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKVxuICBcbiAgZm9yIChpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29waWVkT3AgPSB7fVxuICAgIGN1cnJlbnRPcCA9IGFycmF5W2ldXG4gICAgbW9kaWZpZWRbaV0gPSBjb3BpZWRPcFxuICAgIFxuICAgIHZhciBjb252ZXJ0ZWQgPSB0aGlzLmNvbnZlcnRFbmNvZGluZyhjdXJyZW50T3Aua2V5LCBjdXJyZW50T3AudmFsdWUsIG9wdGlvbnMpXG4gICAgY3VycmVudE9wLmtleSA9IGNvbnZlcnRlZC5rZXlcbiAgICBjdXJyZW50T3AudmFsdWUgPSBjb252ZXJ0ZWQudmFsdWVcblxuICAgIGZvciAoayBpbiBjdXJyZW50T3ApIHtcbiAgICAgIGlmIChrID09PSAndHlwZScgJiYgY3VycmVudE9wW2tdID09ICdkZWwnKSB7XG4gICAgICAgIGNvcGllZE9wW2tdID0gJ3JlbW92ZSdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvcGllZE9wW2tdID0gY3VycmVudE9wW2tdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuaWRiLmJhdGNoKG1vZGlmaWVkLCBmdW5jdGlvbigpeyBjYWxsYmFjaygpIH0sIGNhbGxiYWNrKVxufVxuXG5MZXZlbC5wcm90b3R5cGUuX2Nsb3NlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMuaWRiLmRiLmNsb3NlKClcbiAgY2FsbGJhY2soKVxufVxuXG5MZXZlbC5wcm90b3R5cGUuX2FwcHJveGltYXRlU2l6ZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCBjYWxsYmFjaykge1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKVxuICBpZiAoY2FsbGJhY2spXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICB0aHJvdyBlcnJcbn1cblxuTGV2ZWwucHJvdG90eXBlLl9pc0J1ZmZlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopXG59XG5cbkxldmVsLmRlc3Ryb3kgPSBmdW5jdGlvbiAoZGIsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgZGIgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIHByZWZpeCA9IGRiLklEQk9wdGlvbnMuc3RvcmVQcmVmaXggfHwgJ0lEQldyYXBwZXItJ1xuICAgIHZhciBkYm5hbWUgPSBkYi5sb2NhdGlvblxuICB9IGVsc2Uge1xuICAgIHZhciBwcmVmaXggPSAnSURCV3JhcHBlci0nXG4gICAgdmFyIGRibmFtZSA9IGRiXG4gIH1cbiAgdmFyIHJlcXVlc3QgPSBpbmRleGVkREIuZGVsZXRlRGF0YWJhc2UocHJlZml4ICsgZGJuYW1lKVxuICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgIGNhbGxiYWNrKClcbiAgfVxuICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgICBjYWxsYmFjayhlcnIpXG4gIH1cbn1cblxudmFyIGNoZWNrS2V5VmFsdWUgPSBMZXZlbC5wcm90b3R5cGUuX2NoZWNrS2V5VmFsdWUgPSBmdW5jdGlvbiAob2JqLCB0eXBlKSB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIG5ldyBFcnJvcih0eXBlICsgJyBjYW5ub3QgYmUgYG51bGxgIG9yIGB1bmRlZmluZWRgJylcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gbmV3IEVycm9yKHR5cGUgKyAnIGNhbm5vdCBiZSBgbnVsbGAgb3IgYHVuZGVmaW5lZGAnKVxuICBpZiAoaXNCdWZmZXIob2JqKSAmJiBvYmouYnl0ZUxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbmV3IEVycm9yKHR5cGUgKyAnIGNhbm5vdCBiZSBhbiBlbXB0eSBBcnJheUJ1ZmZlcicpXG4gIGlmIChTdHJpbmcob2JqKSA9PT0gJycpXG4gICAgcmV0dXJuIG5ldyBFcnJvcih0eXBlICsgJyBjYW5ub3QgYmUgYW4gZW1wdHkgU3RyaW5nJylcbiAgaWYgKG9iai5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG5ldyBFcnJvcih0eXBlICsgJyBjYW5ub3QgYmUgYW4gZW1wdHkgQXJyYXknKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIpIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbnZhciBBYnN0cmFjdEl0ZXJhdG9yICA9IHJlcXVpcmUoJ2Fic3RyYWN0LWxldmVsZG93bicpLkFic3RyYWN0SXRlcmF0b3JcbnZhciBsdGd0ID0gcmVxdWlyZSgnbHRndCcpXG5cbm1vZHVsZS5leHBvcnRzID0gSXRlcmF0b3JcblxuZnVuY3Rpb24gSXRlcmF0b3IgKGRiLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgQWJzdHJhY3RJdGVyYXRvci5jYWxsKHRoaXMsIGRiKVxuICB0aGlzLl9vcmRlciA9IG9wdGlvbnMucmV2ZXJzZSA/ICdERVNDJzogJ0FTQydcbiAgdGhpcy5fbGltaXQgPSBvcHRpb25zLmxpbWl0XG4gIHRoaXMuX2NvdW50ID0gMFxuICB0aGlzLl9kb25lICA9IGZhbHNlXG4gIHZhciBsb3dlciA9IGx0Z3QubG93ZXJCb3VuZChvcHRpb25zKVxuICB2YXIgdXBwZXIgPSBsdGd0LnVwcGVyQm91bmQob3B0aW9ucylcbiAgdGhpcy5fa2V5UmFuZ2UgPSBsb3dlciB8fCB1cHBlciA/IHRoaXMuZGIubWFrZUtleVJhbmdlKHtcbiAgICBsb3dlcjogbG93ZXIsXG4gICAgdXBwZXI6IHVwcGVyLFxuICAgIGV4Y2x1ZGVMb3dlcjogbHRndC5sb3dlckJvdW5kRXhjbHVzaXZlKG9wdGlvbnMpLFxuICAgIGV4Y2x1ZGVVcHBlcjogbHRndC51cHBlckJvdW5kRXhjbHVzaXZlKG9wdGlvbnMpXG4gIH0pIDogbnVsbFxuICB0aGlzLmNhbGxiYWNrID0gbnVsbFxufVxuXG51dGlsLmluaGVyaXRzKEl0ZXJhdG9yLCBBYnN0cmFjdEl0ZXJhdG9yKVxuXG5JdGVyYXRvci5wcm90b3R5cGUuY3JlYXRlSXRlcmF0b3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgc2VsZi5pdGVyYXRvciA9IHNlbGYuZGIuaXRlcmF0ZShmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5vbkl0ZW0uYXBwbHkoc2VsZiwgYXJndW1lbnRzKVxuICB9LCB7XG4gICAga2V5UmFuZ2U6IHNlbGYuX2tleVJhbmdlLFxuICAgIGF1dG9Db250aW51ZTogZmFsc2UsXG4gICAgb3JkZXI6IHNlbGYuX29yZGVyLFxuICAgIG9uRXJyb3I6IGZ1bmN0aW9uKGVycikgeyBjb25zb2xlLmxvZygnaG9ycmlibGUgZXJyb3InLCBlcnIpIH0sXG4gIH0pXG59XG5cbi8vIFRPRE8gdGhlIGxpbWl0IGltcGxlbWVudGF0aW9uIGhlcmUganVzdCBpZ25vcmVzIGFsbCByZWFkcyBhZnRlciBsaW1pdCBoYXMgYmVlbiByZWFjaGVkXG4vLyBpdCBzaG91bGQgY2FuY2VsIHRoZSBpdGVyYXRvciBpbnN0ZWFkIGJ1dCBJIGRvbid0IGtub3cgaG93XG5JdGVyYXRvci5wcm90b3R5cGUub25JdGVtID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJzb3IsIGN1cnNvclRyYW5zYWN0aW9uKSB7XG4gIGlmICghY3Vyc29yICYmIHRoaXMuY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrKClcbiAgICB0aGlzLmNhbGxiYWNrID0gZmFsc2VcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgc2hvdWxkQ2FsbCA9IHRydWVcblxuICBpZiAoISF0aGlzLl9saW1pdCAmJiB0aGlzLl9saW1pdCA+IDAgJiYgdGhpcy5fY291bnQrKyA+PSB0aGlzLl9saW1pdClcbiAgICBzaG91bGRDYWxsID0gZmFsc2VcblxuICBpZiAoc2hvdWxkQ2FsbCkgdGhpcy5jYWxsYmFjayhmYWxzZSwgY3Vyc29yLmtleSwgY3Vyc29yLnZhbHVlKVxuICBpZiAoY3Vyc29yKSBjdXJzb3JbJ2NvbnRpbnVlJ10oKVxufVxuXG5JdGVyYXRvci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYgKCFjYWxsYmFjaykgcmV0dXJuIG5ldyBFcnJvcignbmV4dCgpIHJlcXVpcmVzIGEgY2FsbGJhY2sgYXJndW1lbnQnKVxuICBpZiAoIXRoaXMuX3N0YXJ0ZWQpIHtcbiAgICB0aGlzLmNyZWF0ZUl0ZXJhdG9yKClcbiAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZVxuICB9XG4gIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xufVxuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8qIENvcHlyaWdodCAoYykgMjAxMyBSb2QgVmFnZywgTUlUIExpY2Vuc2UgKi9cblxuZnVuY3Rpb24gQWJzdHJhY3RDaGFpbmVkQmF0Y2ggKGRiKSB7XG4gIHRoaXMuX2RiICAgICAgICAgPSBkYlxuICB0aGlzLl9vcGVyYXRpb25zID0gW11cbiAgdGhpcy5fd3JpdHRlbiAgICA9IGZhbHNlXG59XG5cbkFic3RyYWN0Q2hhaW5lZEJhdGNoLnByb3RvdHlwZS5fY2hlY2tXcml0dGVuID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fd3JpdHRlbilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyaXRlKCkgYWxyZWFkeSBjYWxsZWQgb24gdGhpcyBiYXRjaCcpXG59XG5cbkFic3RyYWN0Q2hhaW5lZEJhdGNoLnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0aGlzLl9jaGVja1dyaXR0ZW4oKVxuXG4gIHZhciBlcnIgPSB0aGlzLl9kYi5fY2hlY2tLZXlWYWx1ZShrZXksICdrZXknLCB0aGlzLl9kYi5faXNCdWZmZXIpXG4gIGlmIChlcnIpIHRocm93IGVyclxuICBlcnIgPSB0aGlzLl9kYi5fY2hlY2tLZXlWYWx1ZSh2YWx1ZSwgJ3ZhbHVlJywgdGhpcy5fZGIuX2lzQnVmZmVyKVxuICBpZiAoZXJyKSB0aHJvdyBlcnJcblxuICBpZiAoIXRoaXMuX2RiLl9pc0J1ZmZlcihrZXkpKSBrZXkgPSBTdHJpbmcoa2V5KVxuICBpZiAoIXRoaXMuX2RiLl9pc0J1ZmZlcih2YWx1ZSkpIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuXG4gIGlmICh0eXBlb2YgdGhpcy5fcHV0ID09ICdmdW5jdGlvbicgKVxuICAgIHRoaXMuX3B1dChrZXksIHZhbHVlKVxuICBlbHNlXG4gICAgdGhpcy5fb3BlcmF0aW9ucy5wdXNoKHsgdHlwZTogJ3B1dCcsIGtleToga2V5LCB2YWx1ZTogdmFsdWUgfSlcblxuICByZXR1cm4gdGhpc1xufVxuXG5BYnN0cmFjdENoYWluZWRCYXRjaC5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24gKGtleSkge1xuICB0aGlzLl9jaGVja1dyaXR0ZW4oKVxuXG4gIHZhciBlcnIgPSB0aGlzLl9kYi5fY2hlY2tLZXlWYWx1ZShrZXksICdrZXknLCB0aGlzLl9kYi5faXNCdWZmZXIpXG4gIGlmIChlcnIpIHRocm93IGVyclxuXG4gIGlmICghdGhpcy5fZGIuX2lzQnVmZmVyKGtleSkpIGtleSA9IFN0cmluZyhrZXkpXG5cbiAgaWYgKHR5cGVvZiB0aGlzLl9kZWwgPT0gJ2Z1bmN0aW9uJyApXG4gICAgdGhpcy5fZGVsKGtleSlcbiAgZWxzZVxuICAgIHRoaXMuX29wZXJhdGlvbnMucHVzaCh7IHR5cGU6ICdkZWwnLCBrZXk6IGtleSB9KVxuXG4gIHJldHVybiB0aGlzXG59XG5cbkFic3RyYWN0Q2hhaW5lZEJhdGNoLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fY2hlY2tXcml0dGVuKClcblxuICB0aGlzLl9vcGVyYXRpb25zID0gW11cblxuICBpZiAodHlwZW9mIHRoaXMuX2NsZWFyID09ICdmdW5jdGlvbicgKVxuICAgIHRoaXMuX2NsZWFyKClcblxuICByZXR1cm4gdGhpc1xufVxuXG5BYnN0cmFjdENoYWluZWRCYXRjaC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdGhpcy5fY2hlY2tXcml0dGVuKClcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ2Z1bmN0aW9uJylcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBFcnJvcignd3JpdGUoKSByZXF1aXJlcyBhIGNhbGxiYWNrIGFyZ3VtZW50JylcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9ICdvYmplY3QnKVxuICAgIG9wdGlvbnMgPSB7fVxuXG4gIHRoaXMuX3dyaXR0ZW4gPSB0cnVlXG5cbiAgaWYgKHR5cGVvZiB0aGlzLl93cml0ZSA9PSAnZnVuY3Rpb24nIClcbiAgICByZXR1cm4gdGhpcy5fd3JpdGUoY2FsbGJhY2spXG5cbiAgaWYgKHR5cGVvZiB0aGlzLl9kYi5fYmF0Y2ggPT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdGhpcy5fZGIuX2JhdGNoKHRoaXMuX29wZXJhdGlvbnMsIG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWJzdHJhY3RDaGFpbmVkQmF0Y2hcbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpKSIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKiBDb3B5cmlnaHQgKGMpIDIwMTMgUm9kIFZhZ2csIE1JVCBMaWNlbnNlICovXG5cbmZ1bmN0aW9uIEFic3RyYWN0SXRlcmF0b3IgKGRiKSB7XG4gIHRoaXMuZGIgPSBkYlxuICB0aGlzLl9lbmRlZCA9IGZhbHNlXG4gIHRoaXMuX25leHRpbmcgPSBmYWxzZVxufVxuXG5BYnN0cmFjdEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25leHQoKSByZXF1aXJlcyBhIGNhbGxiYWNrIGFyZ3VtZW50JylcblxuICBpZiAoc2VsZi5fZW5kZWQpXG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignY2Fubm90IGNhbGwgbmV4dCgpIGFmdGVyIGVuZCgpJykpXG4gIGlmIChzZWxmLl9uZXh0aW5nKVxuICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ2Nhbm5vdCBjYWxsIG5leHQoKSBiZWZvcmUgcHJldmlvdXMgbmV4dCgpIGhhcyBjb21wbGV0ZWQnKSlcblxuICBzZWxmLl9uZXh0aW5nID0gdHJ1ZVxuICBpZiAodHlwZW9mIHNlbGYuX25leHQgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzZWxmLl9uZXh0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX25leHRpbmcgPSBmYWxzZVxuICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgIH0pXG4gIH1cblxuICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9uZXh0aW5nID0gZmFsc2VcbiAgICBjYWxsYmFjaygpXG4gIH0pXG59XG5cbkFic3RyYWN0SXRlcmF0b3IucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdlbmQoKSByZXF1aXJlcyBhIGNhbGxiYWNrIGFyZ3VtZW50JylcblxuICBpZiAodGhpcy5fZW5kZWQpXG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignZW5kKCkgYWxyZWFkeSBjYWxsZWQgb24gaXRlcmF0b3InKSlcblxuICB0aGlzLl9lbmRlZCA9IHRydWVcblxuICBpZiAodHlwZW9mIHRoaXMuX2VuZCA9PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0aGlzLl9lbmQoY2FsbGJhY2spXG5cbiAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjaylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdEl0ZXJhdG9yXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpKSIsIihmdW5jdGlvbiAocHJvY2VzcyxCdWZmZXIpe1xuLyogQ29weXJpZ2h0IChjKSAyMDEzIFJvZCBWYWdnLCBNSVQgTGljZW5zZSAqL1xuXG52YXIgeHRlbmQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCd4dGVuZCcpXG4gICwgQWJzdHJhY3RJdGVyYXRvciAgICAgPSByZXF1aXJlKCcuL2Fic3RyYWN0LWl0ZXJhdG9yJylcbiAgLCBBYnN0cmFjdENoYWluZWRCYXRjaCA9IHJlcXVpcmUoJy4vYWJzdHJhY3QtY2hhaW5lZC1iYXRjaCcpXG5cbmZ1bmN0aW9uIEFic3RyYWN0TGV2ZWxET1dOIChsb2NhdGlvbikge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGggfHwgbG9jYXRpb24gPT09IHVuZGVmaW5lZClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbnN0cnVjdG9yIHJlcXVpcmVzIGF0IGxlYXN0IGEgbG9jYXRpb24gYXJndW1lbnQnKVxuXG4gIGlmICh0eXBlb2YgbG9jYXRpb24gIT0gJ3N0cmluZycpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjb25zdHJ1Y3RvciByZXF1aXJlcyBhIGxvY2F0aW9uIHN0cmluZyBhcmd1bWVudCcpXG5cbiAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uXG59XG5cbkFic3RyYWN0TGV2ZWxET1dOLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnZnVuY3Rpb24nKVxuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29wZW4oKSByZXF1aXJlcyBhIGNhbGxiYWNrIGFyZ3VtZW50JylcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgIT0gJ29iamVjdCcpXG4gICAgb3B0aW9ucyA9IHt9XG5cbiAgaWYgKHR5cGVvZiB0aGlzLl9vcGVuID09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHRoaXMuX29wZW4ob3B0aW9ucywgY2FsbGJhY2spXG5cbiAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjaylcbn1cblxuQWJzdHJhY3RMZXZlbERPV04ucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nsb3NlKCkgcmVxdWlyZXMgYSBjYWxsYmFjayBhcmd1bWVudCcpXG5cbiAgaWYgKHR5cGVvZiB0aGlzLl9jbG9zZSA9PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0aGlzLl9jbG9zZShjYWxsYmFjaylcblxuICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKVxufVxuXG5BYnN0cmFjdExldmVsRE9XTi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGVyclxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnZnVuY3Rpb24nKVxuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldCgpIHJlcXVpcmVzIGEgY2FsbGJhY2sgYXJndW1lbnQnKVxuXG4gIGlmIChlcnIgPSB0aGlzLl9jaGVja0tleVZhbHVlKGtleSwgJ2tleScsIHRoaXMuX2lzQnVmZmVyKSlcbiAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuXG4gIGlmICghdGhpcy5faXNCdWZmZXIoa2V5KSlcbiAgICBrZXkgPSBTdHJpbmcoa2V5KVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPSAnb2JqZWN0JylcbiAgICBvcHRpb25zID0ge31cblxuICBpZiAodHlwZW9mIHRoaXMuX2dldCA9PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0aGlzLl9nZXQoa2V5LCBvcHRpb25zLCBjYWxsYmFjaylcblxuICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgY2FsbGJhY2sobmV3IEVycm9yKCdOb3RGb3VuZCcpKSB9KVxufVxuXG5BYnN0cmFjdExldmVsRE9XTi5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBlcnJcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ2Z1bmN0aW9uJylcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdwdXQoKSByZXF1aXJlcyBhIGNhbGxiYWNrIGFyZ3VtZW50JylcblxuICBpZiAoZXJyID0gdGhpcy5fY2hlY2tLZXlWYWx1ZShrZXksICdrZXknLCB0aGlzLl9pc0J1ZmZlcikpXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICBpZiAoZXJyID0gdGhpcy5fY2hlY2tLZXlWYWx1ZSh2YWx1ZSwgJ3ZhbHVlJywgdGhpcy5faXNCdWZmZXIpKVxuICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG5cbiAgaWYgKCF0aGlzLl9pc0J1ZmZlcihrZXkpKVxuICAgIGtleSA9IFN0cmluZyhrZXkpXG5cbiAgLy8gY29lcmNlIHZhbHVlIHRvIHN0cmluZyBpbiBub2RlLCBkb24ndCB0b3VjaCBpdCBpbiBicm93c2VyXG4gIC8vIChpbmRleGVkZGIgY2FuIHN0b3JlIGFueSBKUyB0eXBlKVxuICBpZiAoIXRoaXMuX2lzQnVmZmVyKHZhbHVlKSAmJiAhcHJvY2Vzcy5icm93c2VyKVxuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPSAnb2JqZWN0JylcbiAgICBvcHRpb25zID0ge31cblxuICBpZiAodHlwZW9mIHRoaXMuX3B1dCA9PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0aGlzLl9wdXQoa2V5LCB2YWx1ZSwgb3B0aW9ucywgY2FsbGJhY2spXG5cbiAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjaylcbn1cblxuQWJzdHJhY3RMZXZlbERPV04ucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBlcnJcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ2Z1bmN0aW9uJylcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdkZWwoKSByZXF1aXJlcyBhIGNhbGxiYWNrIGFyZ3VtZW50JylcblxuICBpZiAoZXJyID0gdGhpcy5fY2hlY2tLZXlWYWx1ZShrZXksICdrZXknLCB0aGlzLl9pc0J1ZmZlcikpXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICBpZiAoIXRoaXMuX2lzQnVmZmVyKGtleSkpXG4gICAga2V5ID0gU3RyaW5nKGtleSlcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgIT0gJ29iamVjdCcpXG4gICAgb3B0aW9ucyA9IHt9XG5cbiAgaWYgKHR5cGVvZiB0aGlzLl9kZWwgPT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdGhpcy5fZGVsKGtleSwgb3B0aW9ucywgY2FsbGJhY2spXG5cbiAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjaylcbn1cblxuQWJzdHJhY3RMZXZlbERPV04ucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKGFycmF5LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpXG4gICAgcmV0dXJuIHRoaXMuX2NoYWluZWRCYXRjaCgpXG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09ICdmdW5jdGlvbicpXG4gICAgY2FsbGJhY2sgPSBvcHRpb25zXG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBFcnJvcignYmF0Y2goYXJyYXkpIHJlcXVpcmVzIGEgY2FsbGJhY2sgYXJndW1lbnQnKVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpXG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignYmF0Y2goYXJyYXkpIHJlcXVpcmVzIGFuIGFycmF5IGFyZ3VtZW50JykpXG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9ICdvYmplY3QnKVxuICAgIG9wdGlvbnMgPSB7fVxuXG4gIHZhciBpID0gMFxuICAgICwgbCA9IGFycmF5Lmxlbmd0aFxuICAgICwgZVxuICAgICwgZXJyXG5cbiAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICBlID0gYXJyYXlbaV1cbiAgICBpZiAodHlwZW9mIGUgIT0gJ29iamVjdCcpXG4gICAgICBjb250aW51ZVxuXG4gICAgaWYgKGVyciA9IHRoaXMuX2NoZWNrS2V5VmFsdWUoZS50eXBlLCAndHlwZScsIHRoaXMuX2lzQnVmZmVyKSlcbiAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG5cbiAgICBpZiAoZXJyID0gdGhpcy5fY2hlY2tLZXlWYWx1ZShlLmtleSwgJ2tleScsIHRoaXMuX2lzQnVmZmVyKSlcbiAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG5cbiAgICBpZiAoZS50eXBlID09ICdwdXQnKSB7XG4gICAgICBpZiAoZXJyID0gdGhpcy5fY2hlY2tLZXlWYWx1ZShlLnZhbHVlLCAndmFsdWUnLCB0aGlzLl9pc0J1ZmZlcikpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0aGlzLl9iYXRjaCA9PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0aGlzLl9iYXRjaChhcnJheSwgb3B0aW9ucywgY2FsbGJhY2spXG5cbiAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjaylcbn1cblxuLy9UT0RPOiByZW1vdmUgZnJvbSBoZXJlLCBub3QgYSBuZWNlc3NhcnkgcHJpbWl0aXZlXG5BYnN0cmFjdExldmVsRE9XTi5wcm90b3R5cGUuYXBwcm94aW1hdGVTaXplID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGNhbGxiYWNrKSB7XG4gIGlmICggICBzdGFydCA9PSBudWxsXG4gICAgICB8fCBlbmQgPT0gbnVsbFxuICAgICAgfHwgdHlwZW9mIHN0YXJ0ID09ICdmdW5jdGlvbidcbiAgICAgIHx8IHR5cGVvZiBlbmQgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignYXBwcm94aW1hdGVTaXplKCkgcmVxdWlyZXMgdmFsaWQgYHN0YXJ0YCwgYGVuZGAgYW5kIGBjYWxsYmFja2AgYXJndW1lbnRzJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcHJveGltYXRlU2l6ZSgpIHJlcXVpcmVzIGEgY2FsbGJhY2sgYXJndW1lbnQnKVxuXG4gIGlmICghdGhpcy5faXNCdWZmZXIoc3RhcnQpKVxuICAgIHN0YXJ0ID0gU3RyaW5nKHN0YXJ0KVxuXG4gIGlmICghdGhpcy5faXNCdWZmZXIoZW5kKSlcbiAgICBlbmQgPSBTdHJpbmcoZW5kKVxuXG4gIGlmICh0eXBlb2YgdGhpcy5fYXBwcm94aW1hdGVTaXplID09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHRoaXMuX2FwcHJveGltYXRlU2l6ZShzdGFydCwgZW5kLCBjYWxsYmFjaylcblxuICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBjYWxsYmFjayhudWxsLCAwKVxuICB9KVxufVxuXG5BYnN0cmFjdExldmVsRE9XTi5wcm90b3R5cGUuX3NldHVwSXRlcmF0b3JPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgb3B0aW9ucyA9IHh0ZW5kKG9wdGlvbnMpXG5cbiAgO1sgJ3N0YXJ0JywgJ2VuZCcsICdndCcsICdndGUnLCAnbHQnLCAnbHRlJyBdLmZvckVhY2goZnVuY3Rpb24gKG8pIHtcbiAgICBpZiAob3B0aW9uc1tvXSAmJiBzZWxmLl9pc0J1ZmZlcihvcHRpb25zW29dKSAmJiBvcHRpb25zW29dLmxlbmd0aCA9PT0gMClcbiAgICAgIGRlbGV0ZSBvcHRpb25zW29dXG4gIH0pXG5cbiAgb3B0aW9ucy5yZXZlcnNlID0gISFvcHRpb25zLnJldmVyc2VcblxuICAvLyBmaXggYHN0YXJ0YCBzbyBpdCB0YWtlcyBpbnRvIGFjY291bnQgZ3QsIGd0ZSwgbHQsIGx0ZSBhcyBhcHByb3ByaWF0ZVxuICBpZiAob3B0aW9ucy5yZXZlcnNlICYmIG9wdGlvbnMubHQpXG4gICAgb3B0aW9ucy5zdGFydCA9IG9wdGlvbnMubHRcbiAgaWYgKG9wdGlvbnMucmV2ZXJzZSAmJiBvcHRpb25zLmx0ZSlcbiAgICBvcHRpb25zLnN0YXJ0ID0gb3B0aW9ucy5sdGVcbiAgaWYgKCFvcHRpb25zLnJldmVyc2UgJiYgb3B0aW9ucy5ndClcbiAgICBvcHRpb25zLnN0YXJ0ID0gb3B0aW9ucy5ndFxuICBpZiAoIW9wdGlvbnMucmV2ZXJzZSAmJiBvcHRpb25zLmd0ZSlcbiAgICBvcHRpb25zLnN0YXJ0ID0gb3B0aW9ucy5ndGVcblxuICBpZiAoKG9wdGlvbnMucmV2ZXJzZSAmJiBvcHRpb25zLmx0ICYmICFvcHRpb25zLmx0ZSlcbiAgICB8fCAoIW9wdGlvbnMucmV2ZXJzZSAmJiBvcHRpb25zLmd0ICYmICFvcHRpb25zLmd0ZSkpXG4gICAgb3B0aW9ucy5leGNsdXNpdmVTdGFydCA9IHRydWUgLy8gc3RhcnQgc2hvdWxkICpub3QqIGluY2x1ZGUgbWF0Y2hpbmcga2V5XG5cbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuQWJzdHJhY3RMZXZlbERPV04ucHJvdG90eXBlLml0ZXJhdG9yID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9ICdvYmplY3QnKVxuICAgIG9wdGlvbnMgPSB7fVxuXG4gIG9wdGlvbnMgPSB0aGlzLl9zZXR1cEl0ZXJhdG9yT3B0aW9ucyhvcHRpb25zKVxuXG4gIGlmICh0eXBlb2YgdGhpcy5faXRlcmF0b3IgPT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdGhpcy5faXRlcmF0b3Iob3B0aW9ucylcblxuICByZXR1cm4gbmV3IEFic3RyYWN0SXRlcmF0b3IodGhpcylcbn1cblxuQWJzdHJhY3RMZXZlbERPV04ucHJvdG90eXBlLl9jaGFpbmVkQmF0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgQWJzdHJhY3RDaGFpbmVkQmF0Y2godGhpcylcbn1cblxuQWJzdHJhY3RMZXZlbERPV04ucHJvdG90eXBlLl9pc0J1ZmZlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopXG59XG5cbkFic3RyYWN0TGV2ZWxET1dOLnByb3RvdHlwZS5fY2hlY2tLZXlWYWx1ZSA9IGZ1bmN0aW9uIChvYmosIHR5cGUpIHtcblxuICBpZiAob2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBuZXcgRXJyb3IodHlwZSArICcgY2Fubm90IGJlIGBudWxsYCBvciBgdW5kZWZpbmVkYCcpXG5cbiAgaWYgKHRoaXMuX2lzQnVmZmVyKG9iaikpIHtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBuZXcgRXJyb3IodHlwZSArICcgY2Fubm90IGJlIGFuIGVtcHR5IEJ1ZmZlcicpXG4gIH0gZWxzZSBpZiAoU3RyaW5nKG9iaikgPT09ICcnKVxuICAgIHJldHVybiBuZXcgRXJyb3IodHlwZSArICcgY2Fubm90IGJlIGFuIGVtcHR5IFN0cmluZycpXG59XG5cbm1vZHVsZS5leHBvcnRzLkFic3RyYWN0TGV2ZWxET1dOICAgID0gQWJzdHJhY3RMZXZlbERPV05cbm1vZHVsZS5leHBvcnRzLkFic3RyYWN0SXRlcmF0b3IgICAgID0gQWJzdHJhY3RJdGVyYXRvclxubW9kdWxlLmV4cG9ydHMuQWJzdHJhY3RDaGFpbmVkQmF0Y2ggPSBBYnN0cmFjdENoYWluZWRCYXRjaFxuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcikiLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwiLypnbG9iYWwgd2luZG93OmZhbHNlLCBzZWxmOmZhbHNlLCBkZWZpbmU6ZmFsc2UsIG1vZHVsZTpmYWxzZSAqL1xuXG4vKipcbiAqIEBsaWNlbnNlIElEQldyYXBwZXIgLSBBIGNyb3NzLWJyb3dzZXIgd3JhcHBlciBmb3IgSW5kZXhlZERCXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgLSAyMDEzIEplbnMgQXJwc1xuICogaHR0cDovL2plbnNhcnBzLmRlL1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgKFgxMSkgbGljZW5zZVxuICovXG5cbihmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbiwgZ2xvYmFsKSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsW25hbWVdID0gZGVmaW5pdGlvbigpO1xuICB9XG59KSgnSURCU3RvcmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBkZWZhdWx0RXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH07XG5cbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIHN0b3JlTmFtZTogJ1N0b3JlJyxcbiAgICBzdG9yZVByZWZpeDogJ0lEQldyYXBwZXItJyxcbiAgICBkYlZlcnNpb246IDEsXG4gICAga2V5UGF0aDogJ2lkJyxcbiAgICBhdXRvSW5jcmVtZW50OiB0cnVlLFxuICAgIG9uU3RvcmVSZWFkeTogZnVuY3Rpb24gKCkge1xuICAgIH0sXG4gICAgb25FcnJvcjogZGVmYXVsdEVycm9ySGFuZGxlcixcbiAgICBpbmRleGVzOiBbXVxuICB9O1xuXG4gIC8qKlxuICAgKlxuICAgKiBUaGUgSURCU3RvcmUgY29uc3RydWN0b3JcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBuYW1lIElEQlN0b3JlXG4gICAqIEB2ZXJzaW9uIDEuNC4xXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBba3dBcmdzXSBBbiBvcHRpb25zIG9iamVjdCB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgc3RvcmUgYW5kXG4gICAqICBzZXQgY2FsbGJhY2tzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBba3dBcmdzLnN0b3JlTmFtZT0nU3RvcmUnXSBUaGUgbmFtZSBvZiB0aGUgc3RvcmVcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtrd0FyZ3Muc3RvcmVQcmVmaXg9J0lEQldyYXBwZXItJ10gQSBwcmVmaXggdGhhdCBpc1xuICAgKiAgaW50ZXJuYWxseSB1c2VkIHRvIGNvbnN0cnVjdCB0aGUgbmFtZSBvZiB0aGUgZGF0YWJhc2UsIHdoaWNoIHdpbGwgYmVcbiAgICogIGt3QXJncy5zdG9yZVByZWZpeCArIGt3QXJncy5zdG9yZU5hbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtrd0FyZ3MuZGJWZXJzaW9uPTFdIFRoZSB2ZXJzaW9uIG9mIHRoZSBzdG9yZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2t3QXJncy5rZXlQYXRoPSdpZCddIFRoZSBrZXkgcGF0aCB0byB1c2UuIElmIHlvdSB3YW50IHRvXG4gICAqICBzZXR1cCBJREJXcmFwcGVyIHRvIHdvcmsgd2l0aCBvdXQtb2YtbGluZSBrZXlzLCB5b3UgbmVlZCB0byBzZXQgdGhpcyB0b1xuICAgKiAgYG51bGxgXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2t3QXJncy5hdXRvSW5jcmVtZW50PXRydWVdIElmIHNldCB0byB0cnVlLCBJREJTdG9yZSB3aWxsXG4gICAqICBhdXRvbWF0aWNhbGx5IG1ha2Ugc3VyZSBhIHVuaXF1ZSBrZXlQYXRoIHZhbHVlIGlzIHByZXNlbnQgb24gZWFjaCBvYmplY3RcbiAgICogIHRoYXQgaXMgc3RvcmVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBba3dBcmdzLm9uU3RvcmVSZWFkeV0gQSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGVcbiAgICogIHN0b3JlIGlzIHJlYWR5IHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtrd0FyZ3Mub25FcnJvcj10aHJvd10gQSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiBhblxuICAgKiAgZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGluc3RhbnRpYXRpb24gb2YgdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBba3dBcmdzLmluZGV4ZXM9W11dIEFuIGFycmF5IG9mIGluZGV4RGF0YSBvYmplY3RzXG4gICAqICBkZWZpbmluZyB0aGUgaW5kZXhlcyB0byB1c2Ugd2l0aCB0aGUgc3RvcmUuIEZvciBldmVyeSBpbmRleCB0byBiZSB1c2VkXG4gICAqICBvbmUgaW5kZXhEYXRhIG9iamVjdCBuZWVkcyB0byBiZSBwYXNzZWQgaW4gdGhlIGFycmF5LlxuICAgKiAgQW4gaW5kZXhEYXRhIG9iamVjdCBpcyBkZWZpbmVkIGFzIGZvbGxvd3M6XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBba3dBcmdzLmluZGV4ZXMuaW5kZXhEYXRhXSBBbiBvYmplY3QgZGVmaW5pbmcgdGhlIGluZGV4IHRvXG4gICAqICB1c2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGt3QXJncy5pbmRleGVzLmluZGV4RGF0YS5uYW1lIFRoZSBuYW1lIG9mIHRoZSBpbmRleFxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2t3QXJncy5pbmRleGVzLmluZGV4RGF0YS5rZXlQYXRoXSBUaGUga2V5IHBhdGggb2YgdGhlIGluZGV4XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2t3QXJncy5pbmRleGVzLmluZGV4RGF0YS51bmlxdWVdIFdoZXRoZXIgdGhlIGluZGV4IGlzIHVuaXF1ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtrd0FyZ3MuaW5kZXhlcy5pbmRleERhdGEubXVsdGlFbnRyeV0gV2hldGhlciB0aGUgaW5kZXggaXMgbXVsdGkgZW50cnlcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uU3RvcmVSZWFkeV0gQSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgc3RvcmVcbiAgICogaXMgcmVhZHkgdG8gYmUgdXNlZC5cbiAgICogQGV4YW1wbGVcbiAgICAgIC8vIGNyZWF0ZSBhIHN0b3JlIGZvciBjdXN0b21lcnMgd2l0aCBhbiBhZGRpdGlvbmFsIGluZGV4IG92ZXIgdGhlXG4gICAgICAvLyBgbGFzdG5hbWVgIHByb3BlcnR5LlxuICAgICAgdmFyIG15Q3VzdG9tZXJTdG9yZSA9IG5ldyBJREJTdG9yZSh7XG4gICAgICAgIGRiVmVyc2lvbjogMSxcbiAgICAgICAgc3RvcmVOYW1lOiAnY3VzdG9tZXItaW5kZXgnLFxuICAgICAgICBrZXlQYXRoOiAnY3VzdG9tZXJpZCcsXG4gICAgICAgIGF1dG9JbmNyZW1lbnQ6IHRydWUsXG4gICAgICAgIG9uU3RvcmVSZWFkeTogcG9wdWxhdGVUYWJsZSxcbiAgICAgICAgaW5kZXhlczogW1xuICAgICAgICAgIHsgbmFtZTogJ2xhc3RuYW1lJywga2V5UGF0aDogJ2xhc3RuYW1lJywgdW5pcXVlOiBmYWxzZSwgbXVsdGlFbnRyeTogZmFsc2UgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICogQGV4YW1wbGVcbiAgICAgIC8vIGNyZWF0ZSBhIGdlbmVyaWMgc3RvcmVcbiAgICAgIHZhciBteUN1c3RvbWVyU3RvcmUgPSBuZXcgSURCU3RvcmUoe1xuICAgICAgICBzdG9yZU5hbWU6ICdteS1kYXRhLXN0b3JlJyxcbiAgICAgICAgb25TdG9yZVJlYWR5OiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHN0YXJ0IHdvcmtpbmcgd2l0aCB0aGUgc3RvcmUuXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgKi9cbiAgdmFyIElEQlN0b3JlID0gZnVuY3Rpb24gKGt3QXJncywgb25TdG9yZVJlYWR5KSB7XG5cbiAgICBpZiAodHlwZW9mIG9uU3RvcmVSZWFkeSA9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Yga3dBcmdzID09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9uU3RvcmVSZWFkeSA9IGt3QXJncztcbiAgICB9XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrd0FyZ3MpICE9ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICBrd0FyZ3MgPSB7fTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHRoaXNba2V5XSA9IHR5cGVvZiBrd0FyZ3Nba2V5XSAhPSAndW5kZWZpbmVkJyA/IGt3QXJnc1trZXldIDogZGVmYXVsdHNba2V5XTtcbiAgICB9XG5cbiAgICB0aGlzLmRiTmFtZSA9IHRoaXMuc3RvcmVQcmVmaXggKyB0aGlzLnN0b3JlTmFtZTtcbiAgICB0aGlzLmRiVmVyc2lvbiA9IHBhcnNlSW50KHRoaXMuZGJWZXJzaW9uLCAxMCkgfHwgMTtcblxuICAgIG9uU3RvcmVSZWFkeSAmJiAodGhpcy5vblN0b3JlUmVhZHkgPSBvblN0b3JlUmVhZHkpO1xuXG4gICAgdmFyIGVudiA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgPyB3aW5kb3cgOiBzZWxmO1xuICAgIHRoaXMuaWRiID0gZW52LmluZGV4ZWREQiB8fCBlbnYud2Via2l0SW5kZXhlZERCIHx8IGVudi5tb3pJbmRleGVkREI7XG4gICAgdGhpcy5rZXlSYW5nZSA9IGVudi5JREJLZXlSYW5nZSB8fCBlbnYud2Via2l0SURCS2V5UmFuZ2UgfHwgZW52Lm1veklEQktleVJhbmdlO1xuXG4gICAgdGhpcy5mZWF0dXJlcyA9IHtcbiAgICAgIGhhc0F1dG9JbmNyZW1lbnQ6ICFlbnYubW96SW5kZXhlZERCXG4gICAgfTtcblxuICAgIHRoaXMuY29uc3RzID0ge1xuICAgICAgJ1JFQURfT05MWSc6ICAgICAgICAgJ3JlYWRvbmx5JyxcbiAgICAgICdSRUFEX1dSSVRFJzogICAgICAgICdyZWFkd3JpdGUnLFxuICAgICAgJ1ZFUlNJT05fQ0hBTkdFJzogICAgJ3ZlcnNpb25jaGFuZ2UnLFxuICAgICAgJ05FWFQnOiAgICAgICAgICAgICAgJ25leHQnLFxuICAgICAgJ05FWFRfTk9fRFVQTElDQVRFJzogJ25leHR1bmlxdWUnLFxuICAgICAgJ1BSRVYnOiAgICAgICAgICAgICAgJ3ByZXYnLFxuICAgICAgJ1BSRVZfTk9fRFVQTElDQVRFJzogJ3ByZXZ1bmlxdWUnXG4gICAgfTtcblxuICAgIHRoaXMub3BlbkRCKCk7XG4gIH07XG5cbiAgSURCU3RvcmUucHJvdG90eXBlID0gLyoqIEBsZW5kcyBJREJTdG9yZSAqLyB7XG5cbiAgICAvKipcbiAgICAgKiBBIHBvaW50ZXIgdG8gdGhlIElEQlN0b3JlIGN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIElEQlN0b3JlXG4gICAgICovXG4gICAgY29uc3RydWN0b3I6IElEQlN0b3JlLFxuXG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gb2YgSURCU3RvcmVcbiAgICAgKlxuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqL1xuICAgIHZlcnNpb246ICcxLjQuMScsXG5cbiAgICAvKipcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgSW5kZXhlZERCIG9iamVjdFxuICAgICAqXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgZGI6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnVsbCBuYW1lIG9mIHRoZSBJbmRleGVkREIgdXNlZCBieSBJREJTdG9yZSwgY29tcG9zZWQgb2ZcbiAgICAgKiB0aGlzLnN0b3JlUHJlZml4ICsgdGhpcy5zdG9yZU5hbWVcbiAgICAgKlxuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqL1xuICAgIGRiTmFtZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBJbmRleGVkREIgdXNlZCBieSBJREJTdG9yZVxuICAgICAqXG4gICAgICogQHR5cGUgTnVtYmVyXG4gICAgICovXG4gICAgZGJWZXJzaW9uOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogQSByZWZlcmVuY2UgdG8gdGhlIG9iamVjdFN0b3JlIHVzZWQgYnkgSURCU3RvcmVcbiAgICAgKlxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHN0b3JlOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogVGhlIHN0b3JlIG5hbWVcbiAgICAgKlxuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqL1xuICAgIHN0b3JlTmFtZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIFRoZSBrZXkgcGF0aFxuICAgICAqXG4gICAgICogQHR5cGUgU3RyaW5nXG4gICAgICovXG4gICAga2V5UGF0aDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgSURCU3RvcmUgdXNlcyBhdXRvSW5jcmVtZW50XG4gICAgICpcbiAgICAgKiBAdHlwZSBCb29sZWFuXG4gICAgICovXG4gICAgYXV0b0luY3JlbWVudDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIFRoZSBpbmRleGVzIHVzZWQgYnkgSURCU3RvcmVcbiAgICAgKlxuICAgICAqIEB0eXBlIEFycmF5XG4gICAgICovXG4gICAgaW5kZXhlczogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIEEgaGFzaG1hcCBvZiBmZWF0dXJlcyBvZiB0aGUgdXNlZCBJREIgaW1wbGVtZW50YXRpb25cbiAgICAgKlxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqIEBwcm9wcnR5IHtCb29sZWFufSBhdXRvSW5jcmVtZW50IElmIHRoZSBpbXBsZW1lbnRhdGlvbiBzdXBwb3J0c1xuICAgICAqICBuYXRpdmUgYXV0byBpbmNyZW1lbnRcbiAgICAgKi9cbiAgICBmZWF0dXJlczogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgc3RvcmUgaXMgcmVhZHkgdG8gYmUgdXNlZFxuICAgICAqXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKi9cbiAgICBvblN0b3JlUmVhZHk6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGlmIGFuIGVycm9yIG9jY3VycmVkIGR1cmluZyBpbnN0YW50aWF0aW9uXG4gICAgICogb2YgdGhlIHN0b3JlXG4gICAgICpcbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqL1xuICAgIG9uRXJyb3I6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJuYWwgaW5zZXJ0SUQgY291bnRlclxuICAgICAqXG4gICAgICogQHR5cGUgTnVtYmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5zZXJ0SWRDb3VudDogMCxcblxuICAgIC8qKlxuICAgICAqIE9wZW5zIGFuIEluZGV4ZWREQjsgY2FsbGVkIGJ5IHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIFdpbGwgY2hlY2sgaWYgdmVyc2lvbnMgbWF0Y2ggYW5kIGNvbXBhcmUgcHJvdmlkZWQgaW5kZXggY29uZmlndXJhdGlvblxuICAgICAqIHdpdGggZXhpc3Rpbmcgb25lcywgYW5kIHVwZGF0ZSBpbmRleGVzIGlmIG5lY2Vzc2FyeS5cbiAgICAgKlxuICAgICAqIFdpbGwgY2FsbCB0aGlzLm9uU3RvcmVSZWFkeSgpIGlmIGV2ZXJ5dGhpbmcgd2VudCB3ZWxsIGFuZCB0aGUgc3RvcmVcbiAgICAgKiBpcyByZWFkeSB0byB1c2UsIGFuZCB0aGlzLm9uRXJyb3IoKSBpcyBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKi9cbiAgICBvcGVuREI6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdmFyIG9wZW5SZXF1ZXN0ID0gdGhpcy5pZGIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xuICAgICAgdmFyIHByZXZlbnRTdWNjZXNzQ2FsbGJhY2sgPSBmYWxzZTtcblxuICAgICAgb3BlblJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuXG4gICAgICAgIHZhciBnb3RWZXJzaW9uRXJyID0gZmFsc2U7XG4gICAgICAgIGlmICgnZXJyb3InIGluIGVycm9yLnRhcmdldCkge1xuICAgICAgICAgIGdvdFZlcnNpb25FcnIgPSBlcnJvci50YXJnZXQuZXJyb3IubmFtZSA9PSAnVmVyc2lvbkVycm9yJztcbiAgICAgICAgfSBlbHNlIGlmICgnZXJyb3JDb2RlJyBpbiBlcnJvci50YXJnZXQpIHtcbiAgICAgICAgICBnb3RWZXJzaW9uRXJyID0gZXJyb3IudGFyZ2V0LmVycm9yQ29kZSA9PSAxMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnb3RWZXJzaW9uRXJyKSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yKG5ldyBFcnJvcignVGhlIHZlcnNpb24gbnVtYmVyIHByb3ZpZGVkIGlzIGxvd2VyIHRoYW4gdGhlIGV4aXN0aW5nIG9uZS4nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICBvcGVuUmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICBpZiAocHJldmVudFN1Y2Nlc3NDYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuZGIpe1xuICAgICAgICAgIHRoaXMub25TdG9yZVJlYWR5KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMuZGIudmVyc2lvbiA9PSAnc3RyaW5nJyl7XG4gICAgICAgICAgdGhpcy5vbkVycm9yKG5ldyBFcnJvcignVGhlIEluZGV4ZWREQiBpbXBsZW1lbnRhdGlvbiBpbiB0aGlzIGJyb3dzZXIgaXMgb3V0ZGF0ZWQuIFBsZWFzZSB1cGdyYWRlIHlvdXIgYnJvd3Nlci4nKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMuZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyh0aGlzLnN0b3JlTmFtZSkpe1xuICAgICAgICAgIC8vIFdlIHNob3VsZCBuZXZlciBldmVyIGdldCBoZXJlLlxuICAgICAgICAgIC8vIExldHMgbm90aWZ5IHRoZSB1c2VyIGFueXdheS5cbiAgICAgICAgICB0aGlzLm9uRXJyb3IobmV3IEVycm9yKCdTb21ldGhpbmcgaXMgd3Jvbmcgd2l0aCB0aGUgSW5kZXhlZERCIGltcGxlbWVudGF0aW9uIGluIHRoaXMgYnJvd3Nlci4gUGxlYXNlIHVwZ3JhZGUgeW91ciBicm93c2VyLicpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW1wdHlUcmFuc2FjdGlvbiA9IHRoaXMuZGIudHJhbnNhY3Rpb24oW3RoaXMuc3RvcmVOYW1lXSwgdGhpcy5jb25zdHMuUkVBRF9PTkxZKTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IGVtcHR5VHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWUpO1xuXG4gICAgICAgIC8vIGNoZWNrIGluZGV4ZXNcbiAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXhlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuZ2V0SW5kZXhMaXN0KCkpO1xuICAgICAgICB0aGlzLmluZGV4ZXMuZm9yRWFjaChmdW5jdGlvbihpbmRleERhdGEpe1xuICAgICAgICAgIHZhciBpbmRleE5hbWUgPSBpbmRleERhdGEubmFtZTtcblxuICAgICAgICAgIGlmKCFpbmRleE5hbWUpe1xuICAgICAgICAgICAgcHJldmVudFN1Y2Nlc3NDYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IobmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGluZGV4OiBObyBpbmRleCBuYW1lIGdpdmVuLicpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm5vcm1hbGl6ZUluZGV4RGF0YShpbmRleERhdGEpO1xuXG4gICAgICAgICAgaWYodGhpcy5oYXNJbmRleChpbmRleE5hbWUpKXtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IGNvbXBsaWVzXG4gICAgICAgICAgICB2YXIgYWN0dWFsSW5kZXggPSB0aGlzLnN0b3JlLmluZGV4KGluZGV4TmFtZSk7XG4gICAgICAgICAgICB2YXIgY29tcGxpZXMgPSB0aGlzLmluZGV4Q29tcGxpZXMoYWN0dWFsSW5kZXgsIGluZGV4RGF0YSk7XG4gICAgICAgICAgICBpZighY29tcGxpZXMpe1xuICAgICAgICAgICAgICBwcmV2ZW50U3VjY2Vzc0NhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKG5ldyBFcnJvcignQ2Fubm90IG1vZGlmeSBpbmRleCBcIicgKyBpbmRleE5hbWUgKyAnXCIgZm9yIGN1cnJlbnQgdmVyc2lvbi4gUGxlYXNlIGJ1bXAgdmVyc2lvbiBudW1iZXIgdG8gJyArICggdGhpcy5kYlZlcnNpb24gKyAxICkgKyAnLicpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdJbmRleGVzLnNwbGljZShleGlzdGluZ0luZGV4ZXMuaW5kZXhPZihpbmRleE5hbWUpLCAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldmVudFN1Y2Nlc3NDYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IobmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIG5ldyBpbmRleCBcIicgKyBpbmRleE5hbWUgKyAnXCIgZm9yIGN1cnJlbnQgdmVyc2lvbi4gUGxlYXNlIGJ1bXAgdmVyc2lvbiBudW1iZXIgdG8gJyArICggdGhpcy5kYlZlcnNpb24gKyAxICkgKyAnLicpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXhlcy5sZW5ndGgpIHtcbiAgICAgICAgICBwcmV2ZW50U3VjY2Vzc0NhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLm9uRXJyb3IobmV3IEVycm9yKCdDYW5ub3QgZGVsZXRlIGluZGV4KGVzKSBcIicgKyBleGlzdGluZ0luZGV4ZXMudG9TdHJpbmcoKSArICdcIiBmb3IgY3VycmVudCB2ZXJzaW9uLiBQbGVhc2UgYnVtcCB2ZXJzaW9uIG51bWJlciB0byAnICsgKCB0aGlzLmRiVmVyc2lvbiArIDEgKSArICcuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmVudFN1Y2Nlc3NDYWxsYmFjayB8fCB0aGlzLm9uU3RvcmVSZWFkeSgpO1xuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICBvcGVuUmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbigvKiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQgKi8gZXZlbnQpe1xuXG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXG4gICAgICAgIGlmKHRoaXMuZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyh0aGlzLnN0b3JlTmFtZSkpe1xuICAgICAgICAgIHRoaXMuc3RvcmUgPSBldmVudC50YXJnZXQudHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBvcHRpb25hbFBhcmFtZXRlcnMgPSB7IGF1dG9JbmNyZW1lbnQ6IHRoaXMuYXV0b0luY3JlbWVudCB9O1xuICAgICAgICAgIGlmICh0aGlzLmtleVBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgIG9wdGlvbmFsUGFyYW1ldGVycy5rZXlQYXRoID0gdGhpcy5rZXlQYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnN0b3JlID0gdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSwgb3B0aW9uYWxQYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBleGlzdGluZ0luZGV4ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmdldEluZGV4TGlzdCgpKTtcbiAgICAgICAgdGhpcy5pbmRleGVzLmZvckVhY2goZnVuY3Rpb24oaW5kZXhEYXRhKXtcbiAgICAgICAgICB2YXIgaW5kZXhOYW1lID0gaW5kZXhEYXRhLm5hbWU7XG5cbiAgICAgICAgICBpZighaW5kZXhOYW1lKXtcbiAgICAgICAgICAgIHByZXZlbnRTdWNjZXNzQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbkVycm9yKG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBpbmRleDogTm8gaW5kZXggbmFtZSBnaXZlbi4nKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5ub3JtYWxpemVJbmRleERhdGEoaW5kZXhEYXRhKTtcblxuICAgICAgICAgIGlmKHRoaXMuaGFzSW5kZXgoaW5kZXhOYW1lKSl7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpdCBjb21wbGllc1xuICAgICAgICAgICAgdmFyIGFjdHVhbEluZGV4ID0gdGhpcy5zdG9yZS5pbmRleChpbmRleE5hbWUpO1xuICAgICAgICAgICAgdmFyIGNvbXBsaWVzID0gdGhpcy5pbmRleENvbXBsaWVzKGFjdHVhbEluZGV4LCBpbmRleERhdGEpO1xuICAgICAgICAgICAgaWYoIWNvbXBsaWVzKXtcbiAgICAgICAgICAgICAgLy8gaW5kZXggZGlmZmVycywgbmVlZCB0byBkZWxldGUgYW5kIHJlLWNyZWF0ZVxuICAgICAgICAgICAgICB0aGlzLnN0b3JlLmRlbGV0ZUluZGV4KGluZGV4TmFtZSk7XG4gICAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlSW5kZXgoaW5kZXhOYW1lLCBpbmRleERhdGEua2V5UGF0aCwgeyB1bmlxdWU6IGluZGV4RGF0YS51bmlxdWUsIG11bHRpRW50cnk6IGluZGV4RGF0YS5tdWx0aUVudHJ5IH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleGlzdGluZ0luZGV4ZXMuc3BsaWNlKGV4aXN0aW5nSW5kZXhlcy5pbmRleE9mKGluZGV4TmFtZSksIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZUluZGV4KGluZGV4TmFtZSwgaW5kZXhEYXRhLmtleVBhdGgsIHsgdW5pcXVlOiBpbmRleERhdGEudW5pcXVlLCBtdWx0aUVudHJ5OiBpbmRleERhdGEubXVsdGlFbnRyeSB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXhlcy5sZW5ndGgpIHtcbiAgICAgICAgICBleGlzdGluZ0luZGV4ZXMuZm9yRWFjaChmdW5jdGlvbihfaW5kZXhOYW1lKXtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZGVsZXRlSW5kZXgoX2luZGV4TmFtZSk7XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIHRoZSBkYXRhYmFzZSB1c2VkIGZvciB0aGlzIHN0b3JlIGlmIHRoZSBJREIgaW1wbGVtZW50YXRpb25zXG4gICAgICogcHJvdmlkZXMgdGhhdCBmdW5jdGlvbmFsaXR5LlxuICAgICAqL1xuICAgIGRlbGV0ZURhdGFiYXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pZGIuZGVsZXRlRGF0YWJhc2UpIHtcbiAgICAgICAgdGhpcy5pZGIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogZGF0YSBtYW5pcHVsYXRpb24gKlxuICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBQdXRzIGFuIG9iamVjdCBpbnRvIHRoZSBzdG9yZS4gSWYgYW4gZW50cnkgd2l0aCB0aGUgZ2l2ZW4gaWQgZXhpc3RzLFxuICAgICAqIGl0IHdpbGwgYmUgb3ZlcndyaXR0ZW4uIFRoaXMgbWV0aG9kIGhhcyBhIGRpZmZlcmVudCBzaWduYXR1cmUgZm9yIGlubGluZVxuICAgICAqIGtleXMgYW5kIG91dC1vZi1saW5lIGtleXM7IHBsZWFzZSBzZWUgdGhlIGV4YW1wbGVzIGJlbG93LlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBba2V5XSBUaGUga2V5IHRvIHN0b3JlLiBUaGlzIGlzIG9ubHkgbmVlZGVkIGlmIElEQldyYXBwZXJcbiAgICAgKiAgaXMgc2V0IHRvIHVzZSBvdXQtb2YtbGluZSBrZXlzLiBGb3IgaW5saW5lIGtleXMgLSB0aGUgZGVmYXVsdCBzY2VuYXJpbyAtXG4gICAgICogIHRoaXMgY2FuIGJlIG9taXR0ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSBkYXRhIG9iamVjdCB0byBzdG9yZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25TdWNjZXNzXSBBIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGlmIGluc2VydGlvblxuICAgICAqICB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25FcnJvcl0gQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBpZiBpbnNlcnRpb25cbiAgICAgKiAgZmFpbGVkLlxuICAgICAqIEByZXR1cm5zIHtJREJUcmFuc2FjdGlvbn0gVGhlIHRyYW5zYWN0aW9uIHVzZWQgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICAgIC8vIFN0b3JpbmcgYW4gb2JqZWN0LCB1c2luZyBpbmxpbmUga2V5cyAodGhlIGRlZmF1bHQgc2NlbmFyaW8pOlxuICAgICAgICB2YXIgbXlDdXN0b21lciA9IHtcbiAgICAgICAgICBjdXN0b21lcmlkOiAyMzQ2MjIzLFxuICAgICAgICAgIGxhc3RuYW1lOiAnRG9lJyxcbiAgICAgICAgICBmaXJzdG5hbWU6ICdKb2huJ1xuICAgICAgICB9O1xuICAgICAgICBteUN1c3RvbWVyU3RvcmUucHV0KG15Q3VzdG9tZXIsIG15U3VjY2Vzc0hhbmRsZXIsIG15RXJyb3JIYW5kbGVyKTtcbiAgICAgICAgLy8gTm90ZSB0aGF0IHBhc3Npbmcgc3VjY2Vzcy0gYW5kIGVycm9yLWhhbmRsZXJzIGlzIG9wdGlvbmFsLlxuICAgICAqIEBleGFtcGxlXG4gICAgICAgIC8vIFN0b3JpbmcgYW4gb2JqZWN0LCB1c2luZyBvdXQtb2YtbGluZSBrZXlzOlxuICAgICAgIHZhciBteUN1c3RvbWVyID0ge1xuICAgICAgICAgbGFzdG5hbWU6ICdEb2UnLFxuICAgICAgICAgZmlyc3RuYW1lOiAnSm9obidcbiAgICAgICB9O1xuICAgICAgIG15Q3VzdG9tZXJTdG9yZS5wdXQoMjM0NjIyMywgbXlDdXN0b21lciwgbXlTdWNjZXNzSGFuZGxlciwgbXlFcnJvckhhbmRsZXIpO1xuICAgICAgLy8gTm90ZSB0aGF0IHBhc3Npbmcgc3VjY2Vzcy0gYW5kIGVycm9yLWhhbmRsZXJzIGlzIG9wdGlvbmFsLlxuICAgICAqL1xuICAgIHB1dDogZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgaWYgKHRoaXMua2V5UGF0aCAhPT0gbnVsbCkge1xuICAgICAgICBvbkVycm9yID0gb25TdWNjZXNzO1xuICAgICAgICBvblN1Y2Nlc3MgPSB2YWx1ZTtcbiAgICAgICAgdmFsdWUgPSBrZXk7XG4gICAgICB9XG4gICAgICBvbkVycm9yIHx8IChvbkVycm9yID0gZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgICBvblN1Y2Nlc3MgfHwgKG9uU3VjY2VzcyA9IG5vb3ApO1xuXG4gICAgICB2YXIgaGFzU3VjY2VzcyA9IGZhbHNlLFxuICAgICAgICAgIHJlc3VsdCA9IG51bGwsXG4gICAgICAgICAgcHV0UmVxdWVzdDtcblxuICAgICAgdmFyIHB1dFRyYW5zYWN0aW9uID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGhpcy5zdG9yZU5hbWVdLCB0aGlzLmNvbnN0cy5SRUFEX1dSSVRFKTtcbiAgICAgIHB1dFRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGhhc1N1Y2Nlc3MgPyBvblN1Y2Nlc3MgOiBvbkVycm9yO1xuICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHB1dFRyYW5zYWN0aW9uLm9uYWJvcnQgPSBvbkVycm9yO1xuICAgICAgcHV0VHJhbnNhY3Rpb24ub25lcnJvciA9IG9uRXJyb3I7XG5cbiAgICAgIGlmICh0aGlzLmtleVBhdGggIT09IG51bGwpIHsgLy8gaW4tbGluZSBrZXlzXG4gICAgICAgIHRoaXMuX2FkZElkUHJvcGVydHlJZk5lZWRlZCh2YWx1ZSk7XG4gICAgICAgIHB1dFJlcXVlc3QgPSBwdXRUcmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSkucHV0KHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7IC8vIG91dC1vZi1saW5lIGtleXNcbiAgICAgICAgcHV0UmVxdWVzdCA9IHB1dFRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKS5wdXQodmFsdWUsIGtleSk7XG4gICAgICB9XG4gICAgICBwdXRSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgIH07XG4gICAgICBwdXRSZXF1ZXN0Lm9uZXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICByZXR1cm4gcHV0VHJhbnNhY3Rpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhbiBvYmplY3QgZnJvbSB0aGUgc3RvcmUuIElmIG5vIGVudHJ5IGV4aXN0cyB3aXRoIHRoZSBnaXZlbiBpZCxcbiAgICAgKiB0aGUgc3VjY2VzcyBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdpdGggbnVsbCBhcyBmaXJzdCBhbmQgb25seSBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBpZCBvZiB0aGUgb2JqZWN0IHRvIGZldGNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblN1Y2Nlc3NdIEEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgaWYgZmV0Y2hpbmdcbiAgICAgKiAgd2FzIHN1Y2Nlc3NmdWwuIFdpbGwgcmVjZWl2ZSB0aGUgb2JqZWN0IGFzIG9ubHkgYXJndW1lbnQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRXJyb3JdIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCBpZiBhbiBlcnJvclxuICAgICAqICBvY2N1cnJlZCBkdXJpbmcgdGhlIG9wZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7SURCVHJhbnNhY3Rpb259IFRoZSB0cmFuc2FjdGlvbiB1c2VkIGZvciB0aGlzIG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uIChrZXksIG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgb25FcnJvciB8fCAob25FcnJvciA9IGRlZmF1bHRFcnJvckhhbmRsZXIpO1xuICAgICAgb25TdWNjZXNzIHx8IChvblN1Y2Nlc3MgPSBub29wKTtcblxuICAgICAgdmFyIGhhc1N1Y2Nlc3MgPSBmYWxzZSxcbiAgICAgICAgICByZXN1bHQgPSBudWxsO1xuICAgICAgXG4gICAgICB2YXIgZ2V0VHJhbnNhY3Rpb24gPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0aGlzLnN0b3JlTmFtZV0sIHRoaXMuY29uc3RzLlJFQURfT05MWSk7XG4gICAgICBnZXRUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBoYXNTdWNjZXNzID8gb25TdWNjZXNzIDogb25FcnJvcjtcbiAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgIH07XG4gICAgICBnZXRUcmFuc2FjdGlvbi5vbmFib3J0ID0gb25FcnJvcjtcbiAgICAgIGdldFRyYW5zYWN0aW9uLm9uZXJyb3IgPSBvbkVycm9yO1xuICAgICAgdmFyIGdldFJlcXVlc3QgPSBnZXRUcmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSkuZ2V0KGtleSk7XG4gICAgICBnZXRSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgIH07XG4gICAgICBnZXRSZXF1ZXN0Lm9uZXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICByZXR1cm4gZ2V0VHJhbnNhY3Rpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYW4gb2JqZWN0IGZyb20gdGhlIHN0b3JlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBrZXkgVGhlIGlkIG9mIHRoZSBvYmplY3QgdG8gcmVtb3ZlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvblN1Y2Nlc3NdIEEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgaWYgdGhlIHJlbW92YWxcbiAgICAgKiAgd2FzIHN1Y2Nlc3NmdWwuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRXJyb3JdIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCBpZiBhbiBlcnJvclxuICAgICAqICBvY2N1cnJlZCBkdXJpbmcgdGhlIG9wZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7SURCVHJhbnNhY3Rpb259IFRoZSB0cmFuc2FjdGlvbiB1c2VkIGZvciB0aGlzIG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXksIG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgb25FcnJvciB8fCAob25FcnJvciA9IGRlZmF1bHRFcnJvckhhbmRsZXIpO1xuICAgICAgb25TdWNjZXNzIHx8IChvblN1Y2Nlc3MgPSBub29wKTtcblxuICAgICAgdmFyIGhhc1N1Y2Nlc3MgPSBmYWxzZSxcbiAgICAgICAgICByZXN1bHQgPSBudWxsO1xuXG4gICAgICB2YXIgcmVtb3ZlVHJhbnNhY3Rpb24gPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0aGlzLnN0b3JlTmFtZV0sIHRoaXMuY29uc3RzLlJFQURfV1JJVEUpO1xuICAgICAgcmVtb3ZlVHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gaGFzU3VjY2VzcyA/IG9uU3VjY2VzcyA6IG9uRXJyb3I7XG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgcmVtb3ZlVHJhbnNhY3Rpb24ub25hYm9ydCA9IG9uRXJyb3I7XG4gICAgICByZW1vdmVUcmFuc2FjdGlvbi5vbmVycm9yID0gb25FcnJvcjtcblxuICAgICAgdmFyIGRlbGV0ZVJlcXVlc3QgPSByZW1vdmVUcmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSlbJ2RlbGV0ZSddKGtleSk7XG4gICAgICBkZWxldGVSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgIH07XG4gICAgICBkZWxldGVSZXF1ZXN0Lm9uZXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICByZXR1cm4gcmVtb3ZlVHJhbnNhY3Rpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1bnMgYSBiYXRjaCBvZiBwdXQgYW5kL29yIHJlbW92ZSBvcGVyYXRpb25zIG9uIHRoZSBzdG9yZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFBcnJheSBBbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIG9wZXJhdGlvbiB0byBydW5cbiAgICAgKiAgYW5kIHRoZSBkYXRhIG9iamVjdCAoZm9yIHB1dCBvcGVyYXRpb25zKS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25TdWNjZXNzXSBBIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGlmIGFsbCBvcGVyYXRpb25zXG4gICAgICogIHdlcmUgc3VjY2Vzc2Z1bC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25FcnJvcl0gQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBpZiBhbiBlcnJvclxuICAgICAqICBvY2N1cnJlZCBkdXJpbmcgb25lIG9mIHRoZSBvcGVyYXRpb25zLlxuICAgICAqIEByZXR1cm5zIHtJREJUcmFuc2FjdGlvbn0gVGhlIHRyYW5zYWN0aW9uIHVzZWQgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgICAqL1xuICAgIGJhdGNoOiBmdW5jdGlvbiAoZGF0YUFycmF5LCBvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgIG9uRXJyb3IgfHwgKG9uRXJyb3IgPSBkZWZhdWx0RXJyb3JIYW5kbGVyKTtcbiAgICAgIG9uU3VjY2VzcyB8fCAob25TdWNjZXNzID0gbm9vcCk7XG5cbiAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhQXJyYXkpICE9ICdbb2JqZWN0IEFycmF5XScpe1xuICAgICAgICBvbkVycm9yKG5ldyBFcnJvcignZGF0YUFycmF5IGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBBcnJheS4nKSk7XG4gICAgICB9XG4gICAgICB2YXIgYmF0Y2hUcmFuc2FjdGlvbiA9IHRoaXMuZGIudHJhbnNhY3Rpb24oW3RoaXMuc3RvcmVOYW1lXSAsIHRoaXMuY29uc3RzLlJFQURfV1JJVEUpO1xuICAgICAgYmF0Y2hUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBoYXNTdWNjZXNzID8gb25TdWNjZXNzIDogb25FcnJvcjtcbiAgICAgICAgY2FsbGJhY2soaGFzU3VjY2Vzcyk7XG4gICAgICB9O1xuICAgICAgYmF0Y2hUcmFuc2FjdGlvbi5vbmFib3J0ID0gb25FcnJvcjtcbiAgICAgIGJhdGNoVHJhbnNhY3Rpb24ub25lcnJvciA9IG9uRXJyb3I7XG4gICAgICBcbiAgICAgIHZhciBjb3VudCA9IGRhdGFBcnJheS5sZW5ndGg7XG4gICAgICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gICAgICB2YXIgaGFzU3VjY2VzcyA9IGZhbHNlO1xuXG4gICAgICB2YXIgb25JdGVtU3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY291bnQtLTtcbiAgICAgICAgaWYgKGNvdW50ID09PSAwICYmICFjYWxsZWQpIHtcbiAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIGhhc1N1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBkYXRhQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAob3BlcmF0aW9uKSB7XG4gICAgICAgIHZhciB0eXBlID0gb3BlcmF0aW9uLnR5cGU7XG4gICAgICAgIHZhciBrZXkgPSBvcGVyYXRpb24ua2V5O1xuICAgICAgICB2YXIgdmFsdWUgPSBvcGVyYXRpb24udmFsdWU7XG5cbiAgICAgICAgdmFyIG9uSXRlbUVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGJhdGNoVHJhbnNhY3Rpb24uYWJvcnQoKTtcbiAgICAgICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9uRXJyb3IoZXJyLCB0eXBlLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZSA9PSAncmVtb3ZlJykge1xuICAgICAgICAgIHZhciBkZWxldGVSZXF1ZXN0ID0gYmF0Y2hUcmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSlbJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgICAgZGVsZXRlUmVxdWVzdC5vbnN1Y2Nlc3MgPSBvbkl0ZW1TdWNjZXNzO1xuICAgICAgICAgIGRlbGV0ZVJlcXVlc3Qub25lcnJvciA9IG9uSXRlbUVycm9yO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3B1dCcpIHtcbiAgICAgICAgICB2YXIgcHV0UmVxdWVzdDtcbiAgICAgICAgICBpZiAodGhpcy5rZXlQYXRoICE9PSBudWxsKSB7IC8vIGluLWxpbmUga2V5c1xuICAgICAgICAgICAgdGhpcy5fYWRkSWRQcm9wZXJ0eUlmTmVlZGVkKHZhbHVlKTtcbiAgICAgICAgICAgIHB1dFJlcXVlc3QgPSBiYXRjaFRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKS5wdXQodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIG91dC1vZi1saW5lIGtleXNcbiAgICAgICAgICAgIHB1dFJlcXVlc3QgPSBiYXRjaFRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKS5wdXQodmFsdWUsIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHB1dFJlcXVlc3Qub25zdWNjZXNzID0gb25JdGVtU3VjY2VzcztcbiAgICAgICAgICBwdXRSZXF1ZXN0Lm9uZXJyb3IgPSBvbkl0ZW1FcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG5cbiAgICAgIHJldHVybiBiYXRjaFRyYW5zYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhbiBhcnJheSBvZiBvYmplY3RzIGFuZCBzdG9yZXMgdGhlbSBpbiBhIHNpbmdsZSB0cmFuc2FjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFBcnJheSBBbiBhcnJheSBvZiBvYmplY3RzIHRvIHN0b3JlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uU3VjY2Vzc10gQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBpZiBhbGwgb3BlcmF0aW9uc1xuICAgICAqICB3ZXJlIHN1Y2Nlc3NmdWwuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRXJyb3JdIEEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgaWYgYW4gZXJyb3JcbiAgICAgKiAgb2NjdXJyZWQgZHVyaW5nIG9uZSBvZiB0aGUgb3BlcmF0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7SURCVHJhbnNhY3Rpb259IFRoZSB0cmFuc2FjdGlvbiB1c2VkIGZvciB0aGlzIG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICBwdXRCYXRjaDogZnVuY3Rpb24gKGRhdGFBcnJheSwgb25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICB2YXIgYmF0Y2hEYXRhID0gZGF0YUFycmF5Lm1hcChmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3B1dCcsIHZhbHVlOiBpdGVtIH07XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuYmF0Y2goYmF0Y2hEYXRhLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhbiBhcnJheSBvZiBrZXlzIGFuZCByZW1vdmVzIG1hdGNoaW5nIG9iamVjdHMgaW4gYSBzaW5nbGVcbiAgICAgKiB0cmFuc2FjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleUFycmF5IEFuIGFycmF5IG9mIGtleXMgdG8gcmVtb3ZlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uU3VjY2Vzc10gQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBpZiBhbGwgb3BlcmF0aW9uc1xuICAgICAqICB3ZXJlIHN1Y2Nlc3NmdWwuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRXJyb3JdIEEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgaWYgYW4gZXJyb3JcbiAgICAgKiAgb2NjdXJyZWQgZHVyaW5nIG9uZSBvZiB0aGUgb3BlcmF0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7SURCVHJhbnNhY3Rpb259IFRoZSB0cmFuc2FjdGlvbiB1c2VkIGZvciB0aGlzIG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICByZW1vdmVCYXRjaDogZnVuY3Rpb24gKGtleUFycmF5LCBvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgIHZhciBiYXRjaERhdGEgPSBrZXlBcnJheS5tYXAoZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3JlbW92ZScsIGtleToga2V5IH07XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuYmF0Y2goYmF0Y2hEYXRhLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhbiBhcnJheSBvZiBrZXlzIGFuZCBmZXRjaGVzIG1hdGNoaW5nIG9iamVjdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleUFycmF5IEFuIGFycmF5IG9mIGtleXMgaWRlbnRpZnlpbmcgdGhlIG9iamVjdHMgdG8gZmV0Y2hcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25TdWNjZXNzXSBBIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGlmIGFsbCBvcGVyYXRpb25zXG4gICAgICogIHdlcmUgc3VjY2Vzc2Z1bC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25FcnJvcl0gQSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBpZiBhbiBlcnJvclxuICAgICAqICBvY2N1cnJlZCBkdXJpbmcgb25lIG9mIHRoZSBvcGVyYXRpb25zLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbYXJyYXlUeXBlPSdzcGFyc2UnXSBUaGUgdHlwZSBvZiBhcnJheSB0byBwYXNzIHRvIHRoZVxuICAgICAqICBzdWNjZXNzIGhhbmRsZXIuIE1heSBiZSBvbmUgb2YgJ3NwYXJzZScsICdkZW5zZScgb3IgJ3NraXAnLiBEZWZhdWx0cyB0b1xuICAgICAqICAnc3BhcnNlJy4gVGhpcyBwYXJhbWV0ZXIgc3BlY2lmaWVzIGhvdyB0byBoYW5kbGUgdGhlIHNpdHVhdGlvbiBpZiBhIGdldFxuICAgICAqICBvcGVyYXRpb24gZGlkIG5vdCB0aHJvdyBhbiBlcnJvciwgYnV0IHRoZXJlIHdhcyBubyBtYXRjaGluZyBvYmplY3QgaW5cbiAgICAgKiAgdGhlIGRhdGFiYXNlLiBJbiBtb3N0IGNhc2VzLCAnc3BhcnNlJyBwcm92aWRlcyB0aGUgbW9zdCBkZXNpcmVkXG4gICAgICogIGJlaGF2aW9yLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBkZXRhaWxzLlxuICAgICAqIEByZXR1cm5zIHtJREJUcmFuc2FjdGlvbn0gVGhlIHRyYW5zYWN0aW9uIHVzZWQgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgIC8vIGdpdmVuIHRoYXQgdGhlcmUgYXJlIHR3byBvYmplY3RzIGluIHRoZSBkYXRhYmFzZSB3aXRoIHRoZSBrZXlwYXRoXG4gICAgIC8vIHZhbHVlcyAxIGFuZCAyLCBhbmQgdGhlIGNhbGwgbG9va3MgbGlrZSB0aGlzOlxuICAgICBteVN0b3JlLmdldEJhdGNoKFsxLCA1LCAyXSwgb25FcnJvciwgZnVuY3Rpb24gKGRhdGEpIHsg4oCmIH0sIGFycmF5VHlwZSk7XG5cbiAgICAgLy8gdGhpcyBpcyB3aGF0IHRoZSBgZGF0YWAgYXJyYXkgd2lsbCBiZSBsaWtlOlxuXG4gICAgIC8vIGFycmF5VHlwZSA9PSAnc3BhcnNlJzpcbiAgICAgLy8gZGF0YSBpcyBhIHNwYXJzZSBhcnJheSBjb250YWluaW5nIHR3byBlbnRyaWVzIGFuZCBoYXZpbmcgYSBsZW5ndGggb2YgMzpcbiAgICAgICBbT2JqZWN0LCAyOiBPYmplY3RdXG4gICAgICAgICAwOiBPYmplY3RcbiAgICAgICAgIDI6IE9iamVjdFxuICAgICAgICAgbGVuZ3RoOiAzXG4gICAgICAgICBfX3Byb3RvX186IEFycmF5WzBdXG4gICAgIC8vIGNhbGxpbmcgZm9yRWFjaCBvbiBkYXRhIHdpbGwgcmVzdWx0IGluIHRoZSBjYWxsYmFjayBiZWluZyBjYWxsZWQgdHdvXG4gICAgIC8vIHRpbWVzLCB3aXRoIHRoZSBpbmRleCBwYXJhbWV0ZXIgbWF0Y2hpbmcgdGhlIGluZGV4IG9mIHRoZSBrZXkgaW4gdGhlXG4gICAgIC8vIGtleUFycmF5LlxuXG4gICAgIC8vIGFycmF5VHlwZSA9PSAnZGVuc2UnOlxuICAgICAvLyBkYXRhIGlzIGEgZGVuc2UgYXJyYXkgY29udGFpbmluZyB0aHJlZSBlbnRyaWVzIGFuZCBoYXZpbmcgYSBsZW5ndGggb2YgMyxcbiAgICAgLy8gd2hlcmUgZGF0YVsxXSBpcyBvZiB0eXBlIHVuZGVmaW5lZDpcbiAgICAgICBbT2JqZWN0LCB1bmRlZmluZWQsIE9iamVjdF1cbiAgICAgICAgIDA6IE9iamVjdFxuICAgICAgICAgMTogdW5kZWZpbmVkXG4gICAgICAgICAyOiBPYmplY3RcbiAgICAgICAgIGxlbmd0aDogM1xuICAgICAgICAgX19wcm90b19fOiBBcnJheVswXVxuICAgICAvLyBjYWxsaW5nIGZvckVhY2ggb24gZGF0YSB3aWxsIHJlc3VsdCBpbiB0aGUgY2FsbGJhY2sgYmVpbmcgY2FsbGVkIHRocmVlXG4gICAgIC8vIHRpbWVzLCB3aXRoIHRoZSBpbmRleCBwYXJhbWV0ZXIgbWF0Y2hpbmcgdGhlIGluZGV4IG9mIHRoZSBrZXkgaW4gdGhlXG4gICAgIC8vIGtleUFycmF5LCBidXQgdGhlIHNlY29uZCBjYWxsIHdpbGwgaGF2ZSB1bmRlZmluZWQgYXMgZmlyc3QgYXJndW1lbnQuXG5cbiAgICAgLy8gYXJyYXlUeXBlID09ICdza2lwJzpcbiAgICAgLy8gZGF0YSBpcyBhIGRlbnNlIGFycmF5IGNvbnRhaW5pbmcgdHdvIGVudHJpZXMgYW5kIGhhdmluZyBhIGxlbmd0aCBvZiAyOlxuICAgICAgIFtPYmplY3QsIE9iamVjdF1cbiAgICAgICAgIDA6IE9iamVjdFxuICAgICAgICAgMTogT2JqZWN0XG4gICAgICAgICBsZW5ndGg6IDJcbiAgICAgICAgIF9fcHJvdG9fXzogQXJyYXlbMF1cbiAgICAgLy8gY2FsbGluZyBmb3JFYWNoIG9uIGRhdGEgd2lsbCByZXN1bHQgaW4gdGhlIGNhbGxiYWNrIGJlaW5nIGNhbGxlZCB0d29cbiAgICAgLy8gdGltZXMsIHdpdGggdGhlIGluZGV4IHBhcmFtZXRlciBub3QgbWF0Y2hpbmcgdGhlIGluZGV4IG9mIHRoZSBrZXkgaW4gdGhlXG4gICAgIC8vIGtleUFycmF5LlxuICAgICAqL1xuICAgIGdldEJhdGNoOiBmdW5jdGlvbiAoa2V5QXJyYXksIG9uU3VjY2Vzcywgb25FcnJvciwgYXJyYXlUeXBlKSB7XG4gICAgICBvbkVycm9yIHx8IChvbkVycm9yID0gZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgICBvblN1Y2Nlc3MgfHwgKG9uU3VjY2VzcyA9IG5vb3ApO1xuICAgICAgYXJyYXlUeXBlIHx8IChhcnJheVR5cGUgPSAnc3BhcnNlJyk7XG5cbiAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrZXlBcnJheSkgIT0gJ1tvYmplY3QgQXJyYXldJyl7XG4gICAgICAgIG9uRXJyb3IobmV3IEVycm9yKCdrZXlBcnJheSBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgQXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgdmFyIGJhdGNoVHJhbnNhY3Rpb24gPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0aGlzLnN0b3JlTmFtZV0gLCB0aGlzLmNvbnN0cy5SRUFEX09OTFkpO1xuICAgICAgYmF0Y2hUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBoYXNTdWNjZXNzID8gb25TdWNjZXNzIDogb25FcnJvcjtcbiAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgIH07XG4gICAgICBiYXRjaFRyYW5zYWN0aW9uLm9uYWJvcnQgPSBvbkVycm9yO1xuICAgICAgYmF0Y2hUcmFuc2FjdGlvbi5vbmVycm9yID0gb25FcnJvcjtcblxuICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgIHZhciBjb3VudCA9IGtleUFycmF5Lmxlbmd0aDtcbiAgICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgICAgIHZhciBoYXNTdWNjZXNzID0gZmFsc2U7XG4gICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgdmFyIG9uSXRlbVN1Y2Nlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5yZXN1bHQgfHwgYXJyYXlUeXBlID09ICdkZW5zZScpIHtcbiAgICAgICAgICBkYXRhLnB1c2goZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJyYXlUeXBlID09ICdzcGFyc2UnKSB7XG4gICAgICAgICAgZGF0YS5sZW5ndGgrKztcbiAgICAgICAgfVxuICAgICAgICBjb3VudC0tO1xuICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIGhhc1N1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGtleUFycmF5LmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXG4gICAgICAgIHZhciBvbkl0ZW1FcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGVycjtcbiAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgYmF0Y2hUcmFuc2FjdGlvbi5hYm9ydCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBnZXRSZXF1ZXN0ID0gYmF0Y2hUcmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSkuZ2V0KGtleSk7XG4gICAgICAgIGdldFJlcXVlc3Qub25zdWNjZXNzID0gb25JdGVtU3VjY2VzcztcbiAgICAgICAgZ2V0UmVxdWVzdC5vbmVycm9yID0gb25JdGVtRXJyb3I7XG5cbiAgICAgIH0sIHRoaXMpO1xuXG4gICAgICByZXR1cm4gYmF0Y2hUcmFuc2FjdGlvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBhbGwgZW50cmllcyBpbiB0aGUgc3RvcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25TdWNjZXNzXSBBIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGlmIHRoZSBvcGVyYXRpb25cbiAgICAgKiAgd2FzIHN1Y2Nlc3NmdWwuIFdpbGwgcmVjZWl2ZSBhbiBhcnJheSBvZiBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkVycm9yXSBBIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgaWYgYW4gZXJyb3JcbiAgICAgKiAgb2NjdXJyZWQgZHVyaW5nIHRoZSBvcGVyYXRpb24uXG4gICAgICogQHJldHVybnMge0lEQlRyYW5zYWN0aW9ufSBUaGUgdHJhbnNhY3Rpb24gdXNlZCBmb3IgdGhpcyBvcGVyYXRpb24uXG4gICAgICovXG4gICAgZ2V0QWxsOiBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICBvbkVycm9yIHx8IChvbkVycm9yID0gZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgICBvblN1Y2Nlc3MgfHwgKG9uU3VjY2VzcyA9IG5vb3ApO1xuICAgICAgdmFyIGdldEFsbFRyYW5zYWN0aW9uID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGhpcy5zdG9yZU5hbWVdLCB0aGlzLmNvbnN0cy5SRUFEX09OTFkpO1xuICAgICAgdmFyIHN0b3JlID0gZ2V0QWxsVHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWUpO1xuICAgICAgaWYgKHN0b3JlLmdldEFsbCkge1xuICAgICAgICB0aGlzLl9nZXRBbGxOYXRpdmUoZ2V0QWxsVHJhbnNhY3Rpb24sIHN0b3JlLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0QWxsQ3Vyc29yKGdldEFsbFRyYW5zYWN0aW9uLCBzdG9yZSwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGdldEFsbFRyYW5zYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRzIGdldEFsbCBmb3IgSURCIGltcGxlbWVudGF0aW9ucyB0aGF0IGhhdmUgYSBub24tc3RhbmRhcmRcbiAgICAgKiBnZXRBbGwoKSBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZ2V0QWxsVHJhbnNhY3Rpb24gQW4gb3BlbiBSRUFEIHRyYW5zYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdG9yZSBBIHJlZmVyZW5jZSB0byB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25TdWNjZXNzIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCBpZiB0aGVcbiAgICAgKiAgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRXJyb3IgQSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIGlmIGFuXG4gICAgICogIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgb3BlcmF0aW9uLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldEFsbE5hdGl2ZTogZnVuY3Rpb24gKGdldEFsbFRyYW5zYWN0aW9uLCBzdG9yZSwgb25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICB2YXIgaGFzU3VjY2VzcyA9IGZhbHNlLFxuICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgIGdldEFsbFRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGhhc1N1Y2Nlc3MgPyBvblN1Y2Nlc3MgOiBvbkVycm9yO1xuICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIGdldEFsbFRyYW5zYWN0aW9uLm9uYWJvcnQgPSBvbkVycm9yO1xuICAgICAgZ2V0QWxsVHJhbnNhY3Rpb24ub25lcnJvciA9IG9uRXJyb3I7XG5cbiAgICAgIHZhciBnZXRBbGxSZXF1ZXN0ID0gc3RvcmUuZ2V0QWxsKCk7XG4gICAgICBnZXRBbGxSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgIH07XG4gICAgICBnZXRBbGxSZXF1ZXN0Lm9uZXJyb3IgPSBvbkVycm9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRzIGdldEFsbCBmb3IgSURCIGltcGxlbWVudGF0aW9ucyB0aGF0IGRvIG5vdCBoYXZlIGEgZ2V0QWxsKClcbiAgICAgKiBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZ2V0QWxsVHJhbnNhY3Rpb24gQW4gb3BlbiBSRUFEIHRyYW5zYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdG9yZSBBIHJlZmVyZW5jZSB0byB0aGUgc3RvcmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25TdWNjZXNzIEEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCBpZiB0aGVcbiAgICAgKiAgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRXJyb3IgQSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIGlmIGFuXG4gICAgICogIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgb3BlcmF0aW9uLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldEFsbEN1cnNvcjogZnVuY3Rpb24gKGdldEFsbFRyYW5zYWN0aW9uLCBzdG9yZSwgb25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICB2YXIgYWxsID0gW10sXG4gICAgICAgICAgaGFzU3VjY2VzcyA9IGZhbHNlLFxuICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgIGdldEFsbFRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGhhc1N1Y2Nlc3MgPyBvblN1Y2Nlc3MgOiBvbkVycm9yO1xuICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIGdldEFsbFRyYW5zYWN0aW9uLm9uYWJvcnQgPSBvbkVycm9yO1xuICAgICAgZ2V0QWxsVHJhbnNhY3Rpb24ub25lcnJvciA9IG9uRXJyb3I7XG5cbiAgICAgIHZhciBjdXJzb3JSZXF1ZXN0ID0gc3RvcmUub3BlbkN1cnNvcigpO1xuICAgICAgY3Vyc29yUmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICBhbGwucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIGN1cnNvclsnY29udGludWUnXSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGhhc1N1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGFsbDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGN1cnNvclJlcXVlc3Qub25FcnJvciA9IG9uRXJyb3I7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFycyB0aGUgc3RvcmUsIGkuZS4gZGVsZXRlcyBhbGwgZW50cmllcyBpbiB0aGUgc3RvcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25TdWNjZXNzXSBBIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgaWYgdGhlXG4gICAgICogIG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25FcnJvcl0gQSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIGlmIGFuXG4gICAgICogIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgb3BlcmF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtJREJUcmFuc2FjdGlvbn0gVGhlIHRyYW5zYWN0aW9uIHVzZWQgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgICAqL1xuICAgIGNsZWFyOiBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICBvbkVycm9yIHx8IChvbkVycm9yID0gZGVmYXVsdEVycm9ySGFuZGxlcik7XG4gICAgICBvblN1Y2Nlc3MgfHwgKG9uU3VjY2VzcyA9IG5vb3ApO1xuXG4gICAgICB2YXIgaGFzU3VjY2VzcyA9IGZhbHNlLFxuICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgIHZhciBjbGVhclRyYW5zYWN0aW9uID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGhpcy5zdG9yZU5hbWVdLCB0aGlzLmNvbnN0cy5SRUFEX1dSSVRFKTtcbiAgICAgIGNsZWFyVHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gaGFzU3VjY2VzcyA/IG9uU3VjY2VzcyA6IG9uRXJyb3I7XG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgY2xlYXJUcmFuc2FjdGlvbi5vbmFib3J0ID0gb25FcnJvcjtcbiAgICAgIGNsZWFyVHJhbnNhY3Rpb24ub25lcnJvciA9IG9uRXJyb3I7XG5cbiAgICAgIHZhciBjbGVhclJlcXVlc3QgPSBjbGVhclRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKS5jbGVhcigpO1xuICAgICAgY2xlYXJSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgIH07XG4gICAgICBjbGVhclJlcXVlc3Qub25lcnJvciA9IG9uRXJyb3I7XG5cbiAgICAgIHJldHVybiBjbGVhclRyYW5zYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYW4gaWQgcHJvcGVydHkgbmVlZHMgdG8gcHJlc2VudCBvbiBhIG9iamVjdCBhbmQgYWRkcyBvbmUgaWZcbiAgICAgKiBuZWNlc3NhcnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YU9iaiBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBhYm91dCB0byBiZSBzdG9yZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hZGRJZFByb3BlcnR5SWZOZWVkZWQ6IGZ1bmN0aW9uIChkYXRhT2JqKSB7XG4gICAgICBpZiAoIXRoaXMuZmVhdHVyZXMuaGFzQXV0b0luY3JlbWVudCAmJiB0eXBlb2YgZGF0YU9ialt0aGlzLmtleVBhdGhdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRhdGFPYmpbdGhpcy5rZXlQYXRoXSA9IHRoaXMuX2luc2VydElkQ291bnQrKyArIERhdGUubm93KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKioqKioqKioqKipcbiAgICAgKiBpbmRleGluZyAqXG4gICAgICoqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBET01TdHJpbmdMaXN0IG9mIGluZGV4IG5hbWVzIG9mIHRoZSBzdG9yZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0RPTVN0cmluZ0xpc3R9IFRoZSBsaXN0IG9mIGluZGV4IG5hbWVzXG4gICAgICovXG4gICAgZ2V0SW5kZXhMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZS5pbmRleE5hbWVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYW4gaW5kZXggd2l0aCB0aGUgZ2l2ZW4gbmFtZSBleGlzdHMgaW4gdGhlIHN0b3JlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGluZGV4TmFtZSBUaGUgbmFtZSBvZiB0aGUgaW5kZXggdG8gbG9vayBmb3JcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBzdG9yZSBjb250YWlucyBhbiBpbmRleCB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAgICovXG4gICAgaGFzSW5kZXg6IGZ1bmN0aW9uIChpbmRleE5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmluZGV4TmFtZXMuY29udGFpbnMoaW5kZXhOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTm9ybWFsaXplcyBhbiBvYmplY3QgY29udGFpbmluZyBpbmRleCBkYXRhIGFuZCBhc3N1cmVzIHRoYXQgYWxsXG4gICAgICogcHJvcGVydGllcyBhcmUgc2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGluZGV4RGF0YSBUaGUgaW5kZXggZGF0YSBvYmplY3QgdG8gbm9ybWFsaXplXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGluZGV4RGF0YS5uYW1lIFRoZSBuYW1lIG9mIHRoZSBpbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbaW5kZXhEYXRhLmtleVBhdGhdIFRoZSBrZXkgcGF0aCBvZiB0aGUgaW5kZXhcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpbmRleERhdGEudW5pcXVlXSBXaGV0aGVyIHRoZSBpbmRleCBpcyB1bmlxdWVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpbmRleERhdGEubXVsdGlFbnRyeV0gV2hldGhlciB0aGUgaW5kZXggaXMgbXVsdGkgZW50cnlcbiAgICAgKi9cbiAgICBub3JtYWxpemVJbmRleERhdGE6IGZ1bmN0aW9uIChpbmRleERhdGEpIHtcbiAgICAgIGluZGV4RGF0YS5rZXlQYXRoID0gaW5kZXhEYXRhLmtleVBhdGggfHwgaW5kZXhEYXRhLm5hbWU7XG4gICAgICBpbmRleERhdGEudW5pcXVlID0gISFpbmRleERhdGEudW5pcXVlO1xuICAgICAgaW5kZXhEYXRhLm11bHRpRW50cnkgPSAhIWluZGV4RGF0YS5tdWx0aUVudHJ5O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYW4gYWN0dWFsIGluZGV4IGNvbXBsaWVzIHdpdGggYW4gZXhwZWN0ZWQgaW5kZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYWN0dWFsIFRoZSBhY3R1YWwgaW5kZXggZm91bmQgaW4gdGhlIHN0b3JlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4cGVjdGVkIEFuIE9iamVjdCBkZXNjcmliaW5nIGFuIGV4cGVjdGVkIGluZGV4XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciBib3RoIGluZGV4IGRlZmluaXRpb25zIGFyZSBpZGVudGljYWxcbiAgICAgKi9cbiAgICBpbmRleENvbXBsaWVzOiBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCkge1xuICAgICAgdmFyIGNvbXBsaWVzID0gWydrZXlQYXRoJywgJ3VuaXF1ZScsICdtdWx0aUVudHJ5J10uZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAvLyBJRTEwIHJldHVybnMgdW5kZWZpbmVkIGZvciBubyBtdWx0aUVudHJ5XG4gICAgICAgIGlmIChrZXkgPT0gJ211bHRpRW50cnknICYmIGFjdHVhbFtrZXldID09PSB1bmRlZmluZWQgJiYgZXhwZWN0ZWRba2V5XSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb21wb3VuZCBrZXlzXG4gICAgICAgIGlmIChrZXkgPT0gJ2tleVBhdGgnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZFtrZXldKSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgdmFyIGV4cCA9IGV4cGVjdGVkLmtleVBhdGg7XG4gICAgICAgICAgdmFyIGFjdCA9IGFjdHVhbC5rZXlQYXRoO1xuXG4gICAgICAgICAgLy8gSUUxMCBjYW4ndCBoYW5kbGUga2V5UGF0aCBzZXF1ZW5jZXMgYW5kIHN0b3JlcyB0aGVtIGFzIGEgc3RyaW5nLlxuICAgICAgICAgIC8vIFRoZSBpbmRleCB3aWxsIGJlIHVudXNhYmxlIHRoZXJlLCBidXQgbGV0J3Mgc3RpbGwgcmV0dXJuIHRydWUgaWZcbiAgICAgICAgICAvLyB0aGUga2V5UGF0aCBzZXF1ZW5jZSBtYXRjaGVzLlxuICAgICAgICAgIGlmICh0eXBlb2YgYWN0ID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwLnRvU3RyaW5nKCkgPT0gYWN0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENocm9tZS9PcGVyYSBzdG9yZXMga2V5UGF0aCBzcXVlbmNlcyBhcyBET01TdHJpbmdMaXN0LCBGaXJlZm94XG4gICAgICAgICAgLy8gYXMgQXJyYXlcbiAgICAgICAgICBpZiAoICEgKHR5cGVvZiBhY3QuY29udGFpbnMgPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgYWN0LmluZGV4T2YgPT0gJ2Z1bmN0aW9uJykgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFjdC5sZW5ndGggIT09IGV4cC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbSA9IGV4cC5sZW5ndGg7IGk8bTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoICEgKCAoYWN0LmNvbnRhaW5zICYmIGFjdC5jb250YWlucyhleHBbaV0pKSB8fCBhY3QuaW5kZXhPZihleHBbaV0gIT09IC0xKSApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4cGVjdGVkW2tleV0gPT0gYWN0dWFsW2tleV07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjb21wbGllcztcbiAgICB9LFxuXG4gICAgLyoqKioqKioqKipcbiAgICAgKiBjdXJzb3IgKlxuICAgICAqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciB0aGUgc3RvcmUgdXNpbmcgdGhlIGdpdmVuIG9wdGlvbnMgYW5kIGNhbGxpbmcgb25JdGVtXG4gICAgICogZm9yIGVhY2ggZW50cnkgbWF0Y2hpbmcgdGhlIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkl0ZW0gQSBjYWxsYmFjayB0byBiZSBjYWxsZWQgZm9yIGVhY2ggbWF0Y2hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEFuIG9iamVjdCBkZWZpbmluZyBzcGVjaWZpYyBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmluZGV4PW51bGxdIEFuIElEQkluZGV4IHRvIG9wZXJhdGUgb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMub3JkZXI9QVNDXSBUaGUgb3JkZXIgaW4gd2hpY2ggdG8gcHJvdmlkZSB0aGVcbiAgICAgKiAgcmVzdWx0cywgY2FuIGJlICdERVNDJyBvciAnQVNDJ1xuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYXV0b0NvbnRpbnVlPXRydWVdIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseVxuICAgICAqICBpdGVyYXRlIHRoZSBjdXJzb3IgdG8gdGhlIG5leHQgcmVzdWx0XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maWx0ZXJEdXBsaWNhdGVzPWZhbHNlXSBXaGV0aGVyIHRvIGV4Y2x1ZGVcbiAgICAgKiAgZHVwbGljYXRlIG1hdGNoZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMua2V5UmFuZ2U9bnVsbF0gQW4gSURCS2V5UmFuZ2UgdG8gdXNlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy53cml0ZUFjY2Vzcz1mYWxzZV0gV2hldGhlciBncmFudCB3cml0ZSBhY2Nlc3NcbiAgICAgKiAgdG8gdGhlIHN0b3JlIGluIHRoZSBvbkl0ZW0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkVuZD1udWxsXSBBIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBhZnRlclxuICAgICAqICBpdGVyYXRpb24gaGFzIGVuZGVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25FcnJvcj10aHJvd10gQSBjYWxsYmFjayB0byBiZSBjYWxsZWRcbiAgICAgKiAgaWYgYW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIHRoZSBvcGVyYXRpb24uXG4gICAgICogQHJldHVybnMge0lEQlRyYW5zYWN0aW9ufSBUaGUgdHJhbnNhY3Rpb24gdXNlZCBmb3IgdGhpcyBvcGVyYXRpb24uXG4gICAgICovXG4gICAgaXRlcmF0ZTogZnVuY3Rpb24gKG9uSXRlbSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG1peGluKHtcbiAgICAgICAgaW5kZXg6IG51bGwsXG4gICAgICAgIG9yZGVyOiAnQVNDJyxcbiAgICAgICAgYXV0b0NvbnRpbnVlOiB0cnVlLFxuICAgICAgICBmaWx0ZXJEdXBsaWNhdGVzOiBmYWxzZSxcbiAgICAgICAga2V5UmFuZ2U6IG51bGwsXG4gICAgICAgIHdyaXRlQWNjZXNzOiBmYWxzZSxcbiAgICAgICAgb25FbmQ6IG51bGwsXG4gICAgICAgIG9uRXJyb3I6IGRlZmF1bHRFcnJvckhhbmRsZXJcbiAgICAgIH0sIG9wdGlvbnMgfHwge30pO1xuXG4gICAgICB2YXIgZGlyZWN0aW9uVHlwZSA9IG9wdGlvbnMub3JkZXIudG9Mb3dlckNhc2UoKSA9PSAnZGVzYycgPyAnUFJFVicgOiAnTkVYVCc7XG4gICAgICBpZiAob3B0aW9ucy5maWx0ZXJEdXBsaWNhdGVzKSB7XG4gICAgICAgIGRpcmVjdGlvblR5cGUgKz0gJ19OT19EVVBMSUNBVEUnO1xuICAgICAgfVxuXG4gICAgICB2YXIgaGFzU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgdmFyIGN1cnNvclRyYW5zYWN0aW9uID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGhpcy5zdG9yZU5hbWVdLCB0aGlzLmNvbnN0c1tvcHRpb25zLndyaXRlQWNjZXNzID8gJ1JFQURfV1JJVEUnIDogJ1JFQURfT05MWSddKTtcbiAgICAgIHZhciBjdXJzb3JUYXJnZXQgPSBjdXJzb3JUcmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZSk7XG4gICAgICBpZiAob3B0aW9ucy5pbmRleCkge1xuICAgICAgICBjdXJzb3JUYXJnZXQgPSBjdXJzb3JUYXJnZXQuaW5kZXgob3B0aW9ucy5pbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGN1cnNvclRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaGFzU3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMub25FcnJvcihudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMub25FbmQpIHtcbiAgICAgICAgICBvcHRpb25zLm9uRW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb25JdGVtKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY3Vyc29yVHJhbnNhY3Rpb24ub25hYm9ydCA9IG9wdGlvbnMub25FcnJvcjtcbiAgICAgIGN1cnNvclRyYW5zYWN0aW9uLm9uZXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cbiAgICAgIHZhciBjdXJzb3JSZXF1ZXN0ID0gY3Vyc29yVGFyZ2V0Lm9wZW5DdXJzb3Iob3B0aW9ucy5rZXlSYW5nZSwgdGhpcy5jb25zdHNbZGlyZWN0aW9uVHlwZV0pO1xuICAgICAgY3Vyc29yUmVxdWVzdC5vbmVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuICAgICAgY3Vyc29yUmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICBvbkl0ZW0oY3Vyc29yLnZhbHVlLCBjdXJzb3IsIGN1cnNvclRyYW5zYWN0aW9uKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy5hdXRvQ29udGludWUpIHtcbiAgICAgICAgICAgIGN1cnNvclsnY29udGludWUnXSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGN1cnNvclRyYW5zYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW5zIGEgcXVlcnkgYWdhaW5zdCB0aGUgc3RvcmUgYW5kIHBhc3NlcyBhbiBhcnJheSBjb250YWluaW5nIG1hdGNoZWRcbiAgICAgKiBvYmplY3RzIHRvIHRoZSBzdWNjZXNzIGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblN1Y2Nlc3MgQSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgb3BlcmF0aW9uXG4gICAgICogIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQW4gb2JqZWN0IGRlZmluaW5nIHNwZWNpZmljIHF1ZXJ5IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaW5kZXg9bnVsbF0gQW4gSURCSW5kZXggdG8gb3BlcmF0ZSBvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5vcmRlcj1BU0NdIFRoZSBvcmRlciBpbiB3aGljaCB0byBwcm92aWRlIHRoZVxuICAgICAqICByZXN1bHRzLCBjYW4gYmUgJ0RFU0MnIG9yICdBU0MnXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maWx0ZXJEdXBsaWNhdGVzPWZhbHNlXSBXaGV0aGVyIHRvIGV4Y2x1ZGVcbiAgICAgKiAgZHVwbGljYXRlIG1hdGNoZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMua2V5UmFuZ2U9bnVsbF0gQW4gSURCS2V5UmFuZ2UgdG8gdXNlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25FcnJvcj10aHJvd10gQSBjYWxsYmFjayB0byBiZSBjYWxsZWQgaWYgYW4gZXJyb3JcbiAgICAgKiAgb2NjdXJyZWQgZHVyaW5nIHRoZSBvcGVyYXRpb24uXG4gICAgICogQHJldHVybnMge0lEQlRyYW5zYWN0aW9ufSBUaGUgdHJhbnNhY3Rpb24gdXNlZCBmb3IgdGhpcyBvcGVyYXRpb24uXG4gICAgICovXG4gICAgcXVlcnk6IGZ1bmN0aW9uIChvblN1Y2Nlc3MsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgb3B0aW9ucy5vbkVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb25TdWNjZXNzKHJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0ZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH0sIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJ1bnMgYSBxdWVyeSBhZ2FpbnN0IHRoZSBzdG9yZSwgYnV0IG9ubHkgcmV0dXJucyB0aGUgbnVtYmVyIG9mIG1hdGNoZXNcbiAgICAgKiBpbnN0ZWFkIG9mIHRoZSBtYXRjaGVzIGl0c2VsZi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uU3VjY2VzcyBBIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBpZiB0aGUgb3ByYXRpb25cbiAgICAgKiAgd2FzIHN1Y2Nlc3NmdWwuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBbiBvYmplY3QgZGVmaW5pbmcgc3BlY2lmaWMgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pbmRleD1udWxsXSBBbiBJREJJbmRleCB0byBvcGVyYXRlIG9uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmtleVJhbmdlPW51bGxdIEFuIElEQktleVJhbmdlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRXJyb3I9dGhyb3ddIEEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGlmIGFuIGVycm9yXG4gICAgICogIG9jY3VycmVkIGR1cmluZyB0aGUgb3BlcmF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtJREJUcmFuc2FjdGlvbn0gVGhlIHRyYW5zYWN0aW9uIHVzZWQgZm9yIHRoaXMgb3BlcmF0aW9uLlxuICAgICAqL1xuICAgIGNvdW50OiBmdW5jdGlvbiAob25TdWNjZXNzLCBvcHRpb25zKSB7XG5cbiAgICAgIG9wdGlvbnMgPSBtaXhpbih7XG4gICAgICAgIGluZGV4OiBudWxsLFxuICAgICAgICBrZXlSYW5nZTogbnVsbFxuICAgICAgfSwgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICAgIHZhciBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yIHx8IGRlZmF1bHRFcnJvckhhbmRsZXI7XG5cbiAgICAgIHZhciBoYXNTdWNjZXNzID0gZmFsc2UsXG4gICAgICAgICAgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgdmFyIGN1cnNvclRyYW5zYWN0aW9uID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGhpcy5zdG9yZU5hbWVdLCB0aGlzLmNvbnN0cy5SRUFEX09OTFkpO1xuICAgICAgY3Vyc29yVHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gaGFzU3VjY2VzcyA/IG9uU3VjY2VzcyA6IG9uRXJyb3I7XG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgY3Vyc29yVHJhbnNhY3Rpb24ub25hYm9ydCA9IG9uRXJyb3I7XG4gICAgICBjdXJzb3JUcmFuc2FjdGlvbi5vbmVycm9yID0gb25FcnJvcjtcblxuICAgICAgdmFyIGN1cnNvclRhcmdldCA9IGN1cnNvclRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKTtcbiAgICAgIGlmIChvcHRpb25zLmluZGV4KSB7XG4gICAgICAgIGN1cnNvclRhcmdldCA9IGN1cnNvclRhcmdldC5pbmRleChvcHRpb25zLmluZGV4KTtcbiAgICAgIH1cbiAgICAgIHZhciBjb3VudFJlcXVlc3QgPSBjdXJzb3JUYXJnZXQuY291bnQob3B0aW9ucy5rZXlSYW5nZSk7XG4gICAgICBjb3VudFJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBoYXNTdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZXZ0LnRhcmdldC5yZXN1bHQ7XG4gICAgICB9O1xuICAgICAgY291bnRSZXF1ZXN0Lm9uRXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICByZXR1cm4gY3Vyc29yVHJhbnNhY3Rpb247XG4gICAgfSxcblxuICAgIC8qKioqKioqKioqKioqKi9cbiAgICAvKiBrZXkgcmFuZ2VzICovXG4gICAgLyoqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGtleSByYW5nZSB1c2luZyBzcGVjaWZpZWQgb3B0aW9ucy4gVGhpcyBrZXkgcmFuZ2UgY2FuIGJlXG4gICAgICogaGFuZGVkIG92ZXIgdG8gdGhlIGNvdW50KCkgYW5kIGl0ZXJhdGUoKSBtZXRob2RzLlxuICAgICAqXG4gICAgICogTm90ZTogWW91IG11c3QgcHJvdmlkZSBhdCBsZWFzdCBvbmUgb3IgYm90aCBvZiBcImxvd2VyXCIgb3IgXCJ1cHBlclwiIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBrZXkgcmFuZ2UgdG8gY3JlYXRlXG4gICAgICogQHBhcmFtIHsqfSBbb3B0aW9ucy5sb3dlcl0gVGhlIGxvd2VyIGJvdW5kXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5leGNsdWRlTG93ZXJdIFdoZXRoZXIgdG8gZXhjbHVkZSB0aGUgbG93ZXJcbiAgICAgKiAgYm91bmQgcGFzc2VkIGluIG9wdGlvbnMubG93ZXIgZnJvbSB0aGUga2V5IHJhbmdlXG4gICAgICogQHBhcmFtIHsqfSBbb3B0aW9ucy51cHBlcl0gVGhlIHVwcGVyIGJvdW5kXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5leGNsdWRlVXBwZXJdIFdoZXRoZXIgdG8gZXhjbHVkZSB0aGUgdXBwZXJcbiAgICAgKiAgYm91bmQgcGFzc2VkIGluIG9wdGlvbnMudXBwZXIgZnJvbSB0aGUga2V5IHJhbmdlXG4gICAgICogQHBhcmFtIHsqfSBbb3B0aW9ucy5vbmx5XSBBIHNpbmdsZSBrZXkgdmFsdWUuIFVzZSB0aGlzIGlmIHlvdSBuZWVkIGEga2V5XG4gICAgICogIHJhbmdlIHRoYXQgb25seSBpbmNsdWRlcyBvbmUgdmFsdWUgZm9yIGEga2V5LiBQcm92aWRpbmcgdGhpc1xuICAgICAqICBwcm9wZXJ0eSBpbnZhbGlkYXRlcyBhbGwgb3RoZXIgcHJvcGVydGllcy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBJREJLZXlSYW5nZSByZXByZXNlbnRpbmcgdGhlIHNwZWNpZmllZCBvcHRpb25zXG4gICAgICovXG4gICAgbWFrZUtleVJhbmdlOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgIC8qanNoaW50IG9uZWNhc2U6dHJ1ZSAqL1xuICAgICAgdmFyIGtleVJhbmdlLFxuICAgICAgICAgIGhhc0xvd2VyID0gdHlwZW9mIG9wdGlvbnMubG93ZXIgIT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICAgaGFzVXBwZXIgPSB0eXBlb2Ygb3B0aW9ucy51cHBlciAhPSAndW5kZWZpbmVkJyxcbiAgICAgICAgICBpc09ubHkgPSB0eXBlb2Ygb3B0aW9ucy5vbmx5ICE9ICd1bmRlZmluZWQnO1xuXG4gICAgICBzd2l0Y2godHJ1ZSl7XG4gICAgICAgIGNhc2UgaXNPbmx5OlxuICAgICAgICAgIGtleVJhbmdlID0gdGhpcy5rZXlSYW5nZS5vbmx5KG9wdGlvbnMub25seSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaGFzTG93ZXIgJiYgaGFzVXBwZXI6XG4gICAgICAgICAga2V5UmFuZ2UgPSB0aGlzLmtleVJhbmdlLmJvdW5kKG9wdGlvbnMubG93ZXIsIG9wdGlvbnMudXBwZXIsIG9wdGlvbnMuZXhjbHVkZUxvd2VyLCBvcHRpb25zLmV4Y2x1ZGVVcHBlcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaGFzTG93ZXI6XG4gICAgICAgICAga2V5UmFuZ2UgPSB0aGlzLmtleVJhbmdlLmxvd2VyQm91bmQob3B0aW9ucy5sb3dlciwgb3B0aW9ucy5leGNsdWRlTG93ZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGhhc1VwcGVyOlxuICAgICAgICAgIGtleVJhbmdlID0gdGhpcy5rZXlSYW5nZS51cHBlckJvdW5kKG9wdGlvbnMudXBwZXIsIG9wdGlvbnMuZXhjbHVkZVVwcGVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgS2V5UmFuZ2UuIFByb3ZpZGUgb25lIG9yIGJvdGggb2YgXCJsb3dlclwiIG9yIFwidXBwZXJcIiB2YWx1ZSwgb3IgYW4gXCJvbmx5XCIgdmFsdWUuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXlSYW5nZTtcblxuICAgIH1cblxuICB9O1xuXG4gIC8qKiBoZWxwZXJzICoqL1xuXG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge1xuICB9O1xuICB2YXIgZW1wdHkgPSB7fTtcbiAgdmFyIG1peGluID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgdmFyIG5hbWUsIHM7XG4gICAgZm9yIChuYW1lIGluIHNvdXJjZSkge1xuICAgICAgcyA9IHNvdXJjZVtuYW1lXTtcbiAgICAgIGlmIChzICE9PSBlbXB0eVtuYW1lXSAmJiBzICE9PSB0YXJnZXRbbmFtZV0pIHtcbiAgICAgICAgdGFyZ2V0W25hbWVdID0gcztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICBJREJTdG9yZS52ZXJzaW9uID0gSURCU3RvcmUucHJvdG90eXBlLnZlcnNpb247XG5cbiAgcmV0dXJuIElEQlN0b3JlO1xuXG59LCB0aGlzKTtcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvKSB7XG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIobylcbiAgICB8fCAvXFxbb2JqZWN0ICguK0FycmF5fEFycmF5LispXFxdLy50ZXN0KE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSk7XG59XG4iLCIoZnVuY3Rpb24gKEJ1ZmZlcil7XG5cbmV4cG9ydHMuY29tcGFyZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG5cbiAgaWYoQnVmZmVyLmlzQnVmZmVyKGEpKSB7XG4gICAgdmFyIGwgPSBNYXRoLm1pbihhLmxlbmd0aCwgYi5sZW5ndGgpXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGNtcCA9IGFbaV0gLSBiW2ldXG4gICAgICBpZihjbXApIHJldHVybiBjbXBcbiAgICB9XG4gICAgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGhcbiAgfVxuXG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMFxufVxuXG5mdW5jdGlvbiBoYXMob2JqLCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxufVxuXG4vLyB0byBiZSBjb21wYXRpYmxlIHdpdGggdGhlIGN1cnJlbnQgYWJzdHJhY3QtbGV2ZWxkb3duIHRlc3RzXG4vLyBudWxsaXNoIG9yIGVtcHR5IHN0cmluZ3MuXG4vLyBJIGNvdWxkIHVzZSAhIXZhbCBidXQgSSB3YW50IHRvIHBlcm1pdCBudW1iZXJzIGFuZCBib29sZWFucyxcbi8vIGlmIHBvc3NpYmxlLlxuXG5mdW5jdGlvbiBpc0RlZiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09ICcnXG59XG5cbmZ1bmN0aW9uIGhhcyAocmFuZ2UsIG5hbWUpIHtcbiAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJhbmdlLCBuYW1lKVxufVxuXG5mdW5jdGlvbiBoYXNLZXkocmFuZ2UsIG5hbWUpIHtcbiAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJhbmdlLCBuYW1lKSAmJiBuYW1lXG59XG5cbnZhciBsb3dlckJvdW5kS2V5ID0gZXhwb3J0cy5sb3dlckJvdW5kS2V5ID0gZnVuY3Rpb24gKHJhbmdlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICBoYXNLZXkocmFuZ2UsICdndCcpXG4gICAgfHwgaGFzS2V5KHJhbmdlLCAnZ3RlJylcbiAgICB8fCBoYXNLZXkocmFuZ2UsICdtaW4nKVxuICAgIHx8IChyYW5nZS5yZXZlcnNlID8gaGFzS2V5KHJhbmdlLCAnZW5kJykgOiBoYXNLZXkocmFuZ2UsICdzdGFydCcpKVxuICAgIHx8IHVuZGVmaW5lZFxuICAgIClcbn1cblxudmFyIGxvd2VyQm91bmQgPSBleHBvcnRzLmxvd2VyQm91bmQgPSBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgdmFyIGsgPSBsb3dlckJvdW5kS2V5KHJhbmdlKVxuICByZXR1cm4gayAmJiByYW5nZVtrXVxuICByZXR1cm4gKFxuICAgICAgaGFzKHJhbmdlLCAnZ3QnKSAgICAgICAgICAgICAgICAgICAgICA/IHJhbmdlLmd0XG4gICAgOiBoYXMocmFuZ2UsICdndGUnKSAgICAgICAgICAgICAgICAgICAgID8gcmFuZ2UuZ3RlXG4gICAgOiBoYXMocmFuZ2UsICdtaW4nKSAgICAgICAgICAgICAgICAgICAgID8gcmFuZ2UubWluXG4gICAgOiBoYXMocmFuZ2UsICdzdGFydCcpICYmICFyYW5nZS5yZXZlcnNlID8gcmFuZ2Uuc3RhcnRcbiAgICA6IGhhcyhyYW5nZSwgJ2VuZCcpICAgJiYgcmFuZ2UucmV2ZXJzZSAgPyByYW5nZS5lbmRcbiAgICA6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRcbiAgKVxufVxuXG5leHBvcnRzLmxvd2VyQm91bmRJbmNsdXNpdmUgPSBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgcmV0dXJuIGhhcyhyYW5nZSwgJ2d0JykgPyBmYWxzZSA6IHRydWVcbn1cblxuZXhwb3J0cy51cHBlckJvdW5kSW5jbHVzaXZlID1cbiAgZnVuY3Rpb24gKHJhbmdlKSB7XG4gICAgcmV0dXJuIGhhcyhyYW5nZSwgJ2x0JykgfHwgIXJhbmdlLm1pbkV4ID8gZmFsc2UgOiB0cnVlXG4gIH1cblxudmFyIGxvd2VyQm91bmRFeGNsdXNpdmUgPSBleHBvcnRzLmxvd2VyQm91bmRFeGNsdXNpdmUgPVxuICBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgICByZXR1cm4gaGFzKHJhbmdlLCAnZ3QnKSB8fCByYW5nZS5taW5FeCA/IHRydWUgOiBmYWxzZVxuICB9XG5cbnZhciB1cHBlckJvdW5kRXhjbHVzaXZlID0gZXhwb3J0cy51cHBlckJvdW5kRXhjbHVzaXZlID1cbiAgZnVuY3Rpb24gKHJhbmdlKSB7XG4gICAgcmV0dXJuIGhhcyhyYW5nZSwgJ2x0JykgPyB0cnVlIDogZmFsc2VcbiAgfVxuXG52YXIgdXBwZXJCb3VuZEtleSA9IGV4cG9ydHMudXBwZXJCb3VuZEtleSA9IGZ1bmN0aW9uIChyYW5nZSkge1xuICAgIHJldHVybiAoXG4gICAgICAgaGFzS2V5KHJhbmdlLCAnbHQnKVxuICAgIHx8IGhhc0tleShyYW5nZSwgJ2x0ZScpXG4gICAgfHwgaGFzS2V5KHJhbmdlLCAnbWF4JylcbiAgICB8fCAocmFuZ2UucmV2ZXJzZSA/IGhhc0tleShyYW5nZSwgJ3N0YXJ0JykgOiBoYXNLZXkocmFuZ2UsICdlbmQnKSlcbiAgICB8fCB1bmRlZmluZWRcbiAgICApXG59XG5cbnZhciB1cHBlckJvdW5kID0gZXhwb3J0cy51cHBlckJvdW5kID0gZnVuY3Rpb24gKHJhbmdlKSB7XG4gIHZhciBrID0gdXBwZXJCb3VuZEtleShyYW5nZSlcbiAgcmV0dXJuIGsgJiYgcmFuZ2Vba11cbn1cblxuZnVuY3Rpb24gaWQgKGUpIHsgcmV0dXJuIGUgfVxuXG5leHBvcnRzLnRvTHRndCA9IGZ1bmN0aW9uIChyYW5nZSwgX3JhbmdlLCBtYXAsIGxvd2VyLCB1cHBlcikge1xuICBfcmFuZ2UgPSBfcmFuZ2UgfHwge31cbiAgbWFwID0gbWFwIHx8IGlkXG4gIHZhciBkZWZhdWx0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzXG4gIHZhciBsYiA9IGV4cG9ydHMubG93ZXJCb3VuZEtleShyYW5nZSlcbiAgdmFyIHViID0gZXhwb3J0cy51cHBlckJvdW5kS2V5KHJhbmdlKVxuICBpZihsYikge1xuICAgIGlmKGxiID09PSAnZ3QnKSBfcmFuZ2UuZ3QgPSBtYXAocmFuZ2UuZ3QpXG4gICAgZWxzZSAgICAgICAgICAgIF9yYW5nZS5ndGUgPSBtYXAocmFuZ2VbbGJdKVxuICB9XG4gIGVsc2UgaWYoZGVmYXVsdHMpXG4gICAgX3JhbmdlLmd0ZSA9IGxvd2VyXG5cbiAgaWYodWIpIHtcbiAgICBpZih1YiA9PT0gJ2x0JykgX3JhbmdlLmx0ID0gbWFwKHJhbmdlLmx0KVxuICAgIGVsc2UgICAgICAgICAgICBfcmFuZ2UubHRlID0gbWFwKHJhbmdlW3ViXSlcbiAgfVxuICBlbHNlIGlmKGRlZmF1bHRzKVxuICAgIF9yYW5nZS5sdGUgPSB1cHBlclxuXG4gIF9yYW5nZS5yZXZlcnNlID0gISFyYW5nZS5yZXZlcnNlXG5cbiAgcmV0dXJuIF9yYW5nZVxufVxuXG5leHBvcnRzLmNvbnRhaW5zID0gZnVuY3Rpb24gKHJhbmdlLCBrZXksIGNvbXBhcmUpIHtcbiAgY29tcGFyZSA9IGNvbXBhcmUgfHwgZXhwb3J0cy5jb21wYXJlXG5cbiAgdmFyIGxiID0gbG93ZXJCb3VuZChyYW5nZSlcbiAgaWYoaXNEZWYobGIpKSB7XG4gICAgdmFyIGNtcCA9IGNvbXBhcmUoa2V5LCBsYilcbiAgICBpZihjbXAgPCAwIHx8IChjbXAgPT09IDAgJiYgbG93ZXJCb3VuZEV4Y2x1c2l2ZShyYW5nZSkpKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB2YXIgdWIgPSB1cHBlckJvdW5kKHJhbmdlKVxuICBpZihpc0RlZih1YikpIHtcbiAgICB2YXIgY21wID0gY29tcGFyZShrZXksIHViKVxuICAgIGlmKGNtcCA+IDAgfHwgKGNtcCA9PT0gMCkgJiYgdXBwZXJCb3VuZEV4Y2x1c2l2ZShyYW5nZSkpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydHMuZmlsdGVyID0gZnVuY3Rpb24gKHJhbmdlLCBjb21wYXJlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY29udGFpbnMocmFuZ2UsIGtleSwgY29tcGFyZSlcbiAgfVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIpIiwiKGZ1bmN0aW9uIChCdWZmZXIpe1xuLyoqXG4gKiBDb252ZXJ0IGEgdHlwZWQgYXJyYXkgdG8gYSBCdWZmZXIgd2l0aG91dCBhIGNvcHlcbiAqXG4gKiBBdXRob3I6ICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIExpY2Vuc2U6ICBNSVRcbiAqXG4gKiBgbnBtIGluc3RhbGwgdHlwZWRhcnJheS10by1idWZmZXJgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmICh0eXBlb2YgQnVmZmVyLl9hdWdtZW50ID09PSAnZnVuY3Rpb24nICYmIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gSWYgYEJ1ZmZlcmAgaXMgZnJvbSB0aGUgYGJ1ZmZlcmAgbW9kdWxlIGFuZCB0aGlzIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLFxuICAgIC8vIHRoZW4gYXVnbWVudCBpdCB3aXRoIGFsbCB0aGUgYEJ1ZmZlcmAgbWV0aG9kcy5cbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KGFycilcbiAgfSBlbHNlIHtcbiAgICAvLyBPdGhlcndpc2UsIGZhbGxiYWNrIHRvIGNyZWF0aW5nIGEgYEJ1ZmZlcmAgd2l0aCBhIGNvcHkuXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJyKVxuICB9XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcikiLCJtb2R1bGUuZXhwb3J0cyA9IGhhc0tleXNcblxuZnVuY3Rpb24gaGFzS2V5cyhzb3VyY2UpIHtcbiAgICByZXR1cm4gc291cmNlICE9PSBudWxsICYmXG4gICAgICAgICh0eXBlb2Ygc291cmNlID09PSBcIm9iamVjdFwiIHx8XG4gICAgICAgIHR5cGVvZiBzb3VyY2UgPT09IFwiZnVuY3Rpb25cIilcbn1cbiIsInZhciBLZXlzID0gcmVxdWlyZShcIm9iamVjdC1rZXlzXCIpXG52YXIgaGFzS2V5cyA9IHJlcXVpcmUoXCIuL2hhcy1rZXlzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBpZiAoIWhhc0tleXMoc291cmNlKSkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gS2V5cyhzb3VyY2UpXG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtleXNbal1cbiAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IHNvdXJjZVtuYW1lXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgaXNGdW5jID0gKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyAmJiAhKGZuIGluc3RhbmNlb2YgUmVnRXhwKSkgfHwgdG9TdHJpbmcuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdGlmICghaXNGdW5jICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0aXNGdW5jID0gZm4gPT09IHdpbmRvdy5zZXRUaW1lb3V0IHx8IGZuID09PSB3aW5kb3cuYWxlcnQgfHwgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8IGZuID09PSB3aW5kb3cucHJvbXB0O1xuXHR9XG5cdHJldHVybiBpc0Z1bmM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuXHRpZiAoIWlzRnVuY3Rpb24oZm4pKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdH1cblx0dmFyIGksIGssXG5cdFx0aXNTdHJpbmcgPSB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyxcblx0XHRsID0gb2JqLmxlbmd0aCxcblx0XHRjb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXHRpZiAobCA9PT0gK2wpIHtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRpZiAoY29udGV4dCA9PT0gbnVsbCkge1xuXHRcdFx0XHRmbihpc1N0cmluZyA/IG9iai5jaGFyQXQoaSkgOiBvYmpbaV0sIGksIG9iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmbi5jYWxsKGNvbnRleHQsIGlzU3RyaW5nID8gb2JqLmNoYXJBdChpKSA6IG9ialtpXSwgaSwgb2JqKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yIChrIGluIG9iaikge1xuXHRcdFx0aWYgKGhhc093bi5jYWxsKG9iaiwgaykpIHtcblx0XHRcdFx0aWYgKGNvbnRleHQgPT09IG51bGwpIHtcblx0XHRcdFx0XHRmbihvYmpba10sIGssIG9iaik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm4uY2FsbChjb250ZXh0LCBvYmpba10sIGssIG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgcmVxdWlyZSgnLi9zaGltJyk7XG5cbiIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcblx0dmFyIHN0ciA9IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXHR2YXIgaXNBcmd1bWVudHMgPSBzdHIgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXHRpZiAoIWlzQXJndW1lbnRzKSB7XG5cdFx0aXNBcmd1bWVudHMgPSBzdHIgIT09ICdbb2JqZWN0IEFycmF5XSdcblx0XHRcdCYmIHZhbHVlICE9PSBudWxsXG5cdFx0XHQmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG5cdFx0XHQmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJ1xuXHRcdFx0JiYgdmFsdWUubGVuZ3RoID49IDBcblx0XHRcdCYmIHRvU3RyaW5nLmNhbGwodmFsdWUuY2FsbGVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXHRyZXR1cm4gaXNBcmd1bWVudHM7XG59O1xuXG4iLCIoZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvLyBtb2RpZmllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW1cblx0dmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRcdGZvckVhY2ggPSByZXF1aXJlKCcuL2ZvcmVhY2gnKSxcblx0XHRpc0FyZ3MgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG5cdFx0aGFzRG9udEVudW1CdWcgPSAhKHsndG9TdHJpbmcnOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyksXG5cdFx0aGFzUHJvdG9FbnVtQnVnID0gKGZ1bmN0aW9uICgpIHt9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgncHJvdG90eXBlJyksXG5cdFx0ZG9udEVudW1zID0gW1xuXHRcdFx0XCJ0b1N0cmluZ1wiLFxuXHRcdFx0XCJ0b0xvY2FsZVN0cmluZ1wiLFxuXHRcdFx0XCJ2YWx1ZU9mXCIsXG5cdFx0XHRcImhhc093blByb3BlcnR5XCIsXG5cdFx0XHRcImlzUHJvdG90eXBlT2ZcIixcblx0XHRcdFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcblx0XHRcdFwiY29uc3RydWN0b3JcIlxuXHRcdF0sXG5cdFx0a2V5c1NoaW07XG5cblx0a2V5c1NoaW0gPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXHRcdHZhciBpc09iamVjdCA9IG9iamVjdCAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0Jyxcblx0XHRcdGlzRnVuY3Rpb24gPSB0b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG5cdFx0XHRpc0FyZ3VtZW50cyA9IGlzQXJncyhvYmplY3QpLFxuXHRcdFx0dGhlS2V5cyA9IFtdO1xuXG5cdFx0aWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbiAmJiAhaXNBcmd1bWVudHMpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0XCIpO1xuXHRcdH1cblxuXHRcdGlmIChpc0FyZ3VtZW50cykge1xuXHRcdFx0Zm9yRWFjaChvYmplY3QsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2godmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBuYW1lLFxuXHRcdFx0XHRza2lwUHJvdG8gPSBoYXNQcm90b0VudW1CdWcgJiYgaXNGdW5jdGlvbjtcblxuXHRcdFx0Zm9yIChuYW1lIGluIG9iamVjdCkge1xuXHRcdFx0XHRpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIGhhcy5jYWxsKG9iamVjdCwgbmFtZSkpIHtcblx0XHRcdFx0XHR0aGVLZXlzLnB1c2gobmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoaGFzRG9udEVudW1CdWcpIHtcblx0XHRcdHZhciBjdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuXHRcdFx0XHRza2lwQ29uc3RydWN0b3IgPSBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvYmplY3Q7XG5cblx0XHRcdGZvckVhY2goZG9udEVudW1zLCBmdW5jdGlvbiAoZG9udEVudW0pIHtcblx0XHRcdFx0aWYgKCEoc2tpcENvbnN0cnVjdG9yICYmIGRvbnRFbnVtID09PSAnY29uc3RydWN0b3InKSAmJiBoYXMuY2FsbChvYmplY3QsIGRvbnRFbnVtKSkge1xuXHRcdFx0XHRcdHRoZUtleXMucHVzaChkb250RW51bSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhlS2V5cztcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGtleXNTaGltO1xufSgpKTtcblxuIiwiLyogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgTGV2ZWxVUCBjb250cmlidXRvcnNcbiAqIFNlZSBsaXN0IGF0IDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwI2NvbnRyaWJ1dGluZz5cbiAqIE1JVCBMaWNlbnNlXG4gKiA8aHR0cHM6Ly9naXRodWIuY29tL3J2YWdnL25vZGUtbGV2ZWx1cC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kPlxuICovXG5cbnZhciB1dGlsICAgICAgICAgID0gcmVxdWlyZSgnLi91dGlsJylcbiAgLCBXcml0ZUVycm9yICAgID0gcmVxdWlyZSgnLi9lcnJvcnMnKS5Xcml0ZUVycm9yXG5cbiAgLCBnZXRPcHRpb25zICAgID0gdXRpbC5nZXRPcHRpb25zXG4gICwgZGlzcGF0Y2hFcnJvciA9IHV0aWwuZGlzcGF0Y2hFcnJvclxuXG5mdW5jdGlvbiBCYXRjaCAobGV2ZWx1cCwgY29kZWMpIHtcbiAgdGhpcy5fbGV2ZWx1cCA9IGxldmVsdXBcbiAgdGhpcy5fY29kZWMgPSBjb2RlY1xuICB0aGlzLmJhdGNoID0gbGV2ZWx1cC5kYi5iYXRjaCgpXG4gIHRoaXMub3BzID0gW11cbn1cblxuQmF0Y2gucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uIChrZXlfLCB2YWx1ZV8sIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGdldE9wdGlvbnModGhpcy5fbGV2ZWx1cCwgb3B0aW9ucylcblxuICB2YXIga2V5ICAgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkoa2V5Xywgb3B0aW9ucylcbiAgICAsIHZhbHVlID0gdGhpcy5fY29kZWMuZW5jb2RlVmFsdWUodmFsdWVfLCBvcHRpb25zKVxuXG4gIHRyeSB7XG4gICAgdGhpcy5iYXRjaC5wdXQoa2V5LCB2YWx1ZSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBXcml0ZUVycm9yKGUpXG4gIH1cbiAgdGhpcy5vcHMucHVzaCh7IHR5cGUgOiAncHV0Jywga2V5IDoga2V5LCB2YWx1ZSA6IHZhbHVlIH0pXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuQmF0Y2gucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIChrZXlfLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBnZXRPcHRpb25zKHRoaXMuX2xldmVsdXAsIG9wdGlvbnMpXG5cbiAgdmFyIGtleSA9IHRoaXMuX2NvZGVjLmVuY29kZUtleShrZXlfLCBvcHRpb25zKVxuXG4gIHRyeSB7XG4gICAgdGhpcy5iYXRjaC5kZWwoa2V5KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgV3JpdGVFcnJvcihlcnIpXG4gIH1cbiAgdGhpcy5vcHMucHVzaCh7IHR5cGUgOiAnZGVsJywga2V5IDoga2V5IH0pXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuQmF0Y2gucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIHRoaXMuYmF0Y2guY2xlYXIoKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgV3JpdGVFcnJvcihlcnIpXG4gIH1cblxuICB0aGlzLm9wcyA9IFtdXG4gIHJldHVybiB0aGlzXG59XG5cbkJhdGNoLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgbGV2ZWx1cCA9IHRoaXMuX2xldmVsdXBcbiAgICAsIG9wcyAgICAgPSB0aGlzLm9wc1xuXG4gIHRyeSB7XG4gICAgdGhpcy5iYXRjaC53cml0ZShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKVxuICAgICAgICByZXR1cm4gZGlzcGF0Y2hFcnJvcihsZXZlbHVwLCBuZXcgV3JpdGVFcnJvcihlcnIpLCBjYWxsYmFjaylcbiAgICAgIGxldmVsdXAuZW1pdCgnYmF0Y2gnLCBvcHMpXG4gICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgV3JpdGVFcnJvcihlcnIpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXRjaFxuIiwiLyogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgTGV2ZWxVUCBjb250cmlidXRvcnNcbiAqIFNlZSBsaXN0IGF0IDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwI2NvbnRyaWJ1dGluZz5cbiAqIE1JVCBMaWNlbnNlXG4gKiA8aHR0cHM6Ly9naXRodWIuY29tL3J2YWdnL25vZGUtbGV2ZWx1cC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kPlxuICovXG5cbnZhciBlbmNvZGluZ3MgPSByZXF1aXJlKCcuL2VuY29kaW5ncycpXG5cbmZ1bmN0aW9uIGdldEtleUVuY29kZXIgKG9wdGlvbnMsIG9wKSB7XG4gIHZhciB0eXBlID0gKChvcCAmJiBvcC5rZXlFbmNvZGluZykgfHwgb3B0aW9ucy5rZXlFbmNvZGluZykgfHwgJ3V0ZjgnXG4gIHJldHVybiBlbmNvZGluZ3NbdHlwZV0gfHwgdHlwZVxufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZUVuY29kZXIgKG9wdGlvbnMsIG9wKSB7XG4gIHZhciB0eXBlID0gKCgob3AgJiYgKG9wLnZhbHVlRW5jb2RpbmcgfHwgb3AuZW5jb2RpbmcpKVxuICAgICAgfHwgb3B0aW9ucy52YWx1ZUVuY29kaW5nIHx8IG9wdGlvbnMuZW5jb2RpbmcpKSB8fCAndXRmOCdcbiAgcmV0dXJuIGVuY29kaW5nc1t0eXBlXSB8fCB0eXBlXG59XG5cbi8qXG4gIEVuY29kZSBhIGtleS5cbiAgVGhpcyBtZXRob2QgdGFrZXMgdHdvIG9wdGlvbnMsIGJlY2F1c2UgdGhlIGxldmVsZGIgaW5zdGFuY2VcbiAgaGFzIG9wdGlvbnMsIGFuZCB0aGlzIG9wZXJhdGlvbiAoYSBwdXQsIGRlbCwgb3IgYmF0Y2gpXG4gIGFsc28gaGFzIG9wdGlvbnMgdGhhdCBtYXkgb3ZlcnJpZGUgdGhlIGxldmVsZGIncyBvcHRpb25zLlxuKi9cblxuZnVuY3Rpb24gZW5jb2RlS2V5IChrZXksIG9wdGlvbnMsIG9wKSB7XG4gIHJldHVybiBnZXRLZXlFbmNvZGVyKG9wdGlvbnMsIG9wKS5lbmNvZGUoa2V5KVxufVxuXG4vKlxuICBFbmNvZGUgYSB2YWx1ZS5cbiAgVGFrZXMgMiBvcHRpb25zLCBmb3IgdGhlIHNhbWUgcmVhc29uIGFzIGVuY29kZUtleVxuKi9cblxuZnVuY3Rpb24gZW5jb2RlVmFsdWUgKHZhbHVlLCBvcHRpb25zLCBvcCkge1xuICByZXR1cm4gZ2V0VmFsdWVFbmNvZGVyKG9wdGlvbnMsIG9wKS5lbmNvZGUodmFsdWUpXG59XG5cbi8qXG4gIERlY29kZSBhbiBlbmNvZGVkIGtleVxuKi9cblxuZnVuY3Rpb24gZGVjb2RlS2V5IChrZXksIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGdldEtleUVuY29kZXIob3B0aW9ucykuZGVjb2RlKGtleSlcbn1cblxuLypcbiAgRGVjb2RlIGFuIGVuY29kZWQgdmFsdWVcbiovXG5cbmZ1bmN0aW9uIGRlY29kZVZhbHVlICh2YWx1ZSwgb3B0aW9ucykge1xuICByZXR1cm4gZ2V0VmFsdWVFbmNvZGVyKG9wdGlvbnMpLmRlY29kZSh2YWx1ZSlcbn1cblxuLypcbiAgY2hlY2sgd2hldGhlciB0aGlzIHZhbHVlIHNob3VsZCBiZSByZXF1ZXN0ZWQgYXMgYSBidWZmZXJcbiAgKGlmIGZhbHNlLCB0aGVuIGl0IHdpbGwgYmUgYSBzdHJpbmcpXG4gIHRoaXMgYWxsb3dzIGFuIG9wdGltaXphdGlvbiBpbiBsZXZlbGRvd24gd2hlcmUgbGV2ZWxkb3duXG4gIHJldHJpdmVzIGEgc3RyaW5nIGRpcmVjdGx5LCBhbmQgdGh1cyBhdm9pZHMgYSBtZW1vcnkgY29weS5cbiovXG5cbmZ1bmN0aW9uIGlzVmFsdWVBc0J1ZmZlciAob3B0aW9ucywgb3ApIHtcbiAgcmV0dXJuIGdldFZhbHVlRW5jb2RlcihvcHRpb25zLCBvcCkuYnVmZmVyXG59XG5cbi8qXG4gIGNoZWNrIHdoZXRoZXIgYSBnaXZlbiBrZXkgc2hvdWxkIGJlIHJlcXVlc3RlZCBhcyBhIGJ1ZmZlci5cbiovXG5cbmZ1bmN0aW9uIGlzS2V5QXNCdWZmZXIgKG9wdGlvbnMsIG9wKSB7XG4gIHJldHVybiBnZXRLZXlFbmNvZGVyKG9wdGlvbnMsIG9wKS5idWZmZXJcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBlbmNvZGVLZXkgICAgICAgOiBlbmNvZGVLZXlcbiAgLCBlbmNvZGVWYWx1ZSAgICAgOiBlbmNvZGVWYWx1ZVxuICAsIGlzVmFsdWVBc0J1ZmZlciA6IGlzVmFsdWVBc0J1ZmZlclxuICAsIGlzS2V5QXNCdWZmZXIgICA6IGlzS2V5QXNCdWZmZXJcbiAgLCBkZWNvZGVWYWx1ZSAgICAgOiBkZWNvZGVWYWx1ZVxuICAsIGRlY29kZUtleSAgICAgICA6IGRlY29kZUtleVxufVxuIiwiKGZ1bmN0aW9uIChCdWZmZXIpe1xuLyogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgTGV2ZWxVUCBjb250cmlidXRvcnNcbiAqIFNlZSBsaXN0IGF0IDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwI2NvbnRyaWJ1dGluZz5cbiAqIE1JVCBMaWNlbnNlXG4gKiA8aHR0cHM6Ly9naXRodWIuY29tL3J2YWdnL25vZGUtbGV2ZWx1cC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kPlxuICovXG5cbnZhciBlbmNvZGluZ05hbWVzID0gW1xuICAgICAgICAnaGV4J1xuICAgICAgLCAndXRmOCdcbiAgICAgICwgJ3V0Zi04J1xuICAgICAgLCAnYXNjaWknXG4gICAgICAsICdiaW5hcnknXG4gICAgICAsICdiYXNlNjQnXG4gICAgICAsICd1Y3MyJ1xuICAgICAgLCAndWNzLTInXG4gICAgICAsICd1dGYxNmxlJ1xuICAgICAgLCAndXRmLTE2bGUnXG4gICAgXVxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGlzQmluYXJ5IChkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEgPT09IHVuZGVmaW5lZCB8fCBkYXRhID09PSBudWxsIHx8IEJ1ZmZlci5pc0J1ZmZlcihkYXRhKVxuICB9XG5cbiAgdmFyIGVuY29kaW5ncyA9IHt9XG5cbiAgZW5jb2RpbmdzLnV0ZjggPSBlbmNvZGluZ3NbJ3V0Zi04J10gPSB7XG4gICAgICBlbmNvZGUgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gaXNCaW5hcnkoZGF0YSkgPyBkYXRhIDogU3RyaW5nKGRhdGEpXG4gICAgICB9XG4gICAgLCBkZWNvZGUgOiBmdW5jdGlvbiAoZGF0YSkgeyByZXR1cm4gZGF0YSB9XG4gICAgLCBidWZmZXIgOiBmYWxzZVxuICAgICwgdHlwZSAgIDogJ3V0ZjgnXG4gIH1cblxuICBlbmNvZGluZ3MuanNvbiA9IHtcbiAgICAgIGVuY29kZSA6IEpTT04uc3RyaW5naWZ5XG4gICAgLCBkZWNvZGUgOiBKU09OLnBhcnNlXG4gICAgLCBidWZmZXIgOiBmYWxzZVxuICAgICwgdHlwZSAgIDogJ2pzb24nXG4gIH1cblxuICBlbmNvZGluZ3MuYmluYXJ5ID0ge1xuICAgICAgZW5jb2RlIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGlzQmluYXJ5KGRhdGEpID8gZGF0YSA6IG5ldyBCdWZmZXIoZGF0YSlcbiAgICAgIH1cbiAgICAsIGRlY29kZSA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9XG4gICAgLCBidWZmZXIgOiB0cnVlXG4gICAgLCB0eXBlICAgOiAnYmluYXJ5J1xuICB9XG5cbiAgZW5jb2RpbmdOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKGVuY29kaW5nc1t0eXBlXSlcbiAgICAgIHJldHVyblxuXG4gICAgZW5jb2RpbmdzW3R5cGVdID0ge1xuICAgICAgICBlbmNvZGUgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJldHVybiBpc0JpbmFyeShkYXRhKSA/IGRhdGEgOiBuZXcgQnVmZmVyKGRhdGEsIHR5cGUpXG4gICAgICAgIH1cbiAgICAgICwgZGVjb2RlIDogZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBidWZmZXIudG9TdHJpbmcodHlwZSlcbiAgICAgICAgfVxuICAgICAgLCBidWZmZXIgOiB0cnVlXG4gICAgICAsIHR5cGUgICA6IHR5cGUgLy8gdXNlZnVsIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXNcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGVuY29kaW5nc1xufSkoKVxuXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcikiLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTItMjAxNCBMZXZlbFVQIGNvbnRyaWJ1dG9yc1xuICogU2VlIGxpc3QgYXQgPGh0dHBzOi8vZ2l0aHViLmNvbS9ydmFnZy9ub2RlLWxldmVsdXAjY29udHJpYnV0aW5nPlxuICogTUlUIExpY2Vuc2VcbiAqIDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQ+XG4gKi9cblxudmFyIGNyZWF0ZUVycm9yICAgPSByZXF1aXJlKCdlcnJubycpLmNyZWF0ZVxuICAsIExldmVsVVBFcnJvciAgPSBjcmVhdGVFcnJvcignTGV2ZWxVUEVycm9yJylcbiAgLCBOb3RGb3VuZEVycm9yID0gY3JlYXRlRXJyb3IoJ05vdEZvdW5kRXJyb3InLCBMZXZlbFVQRXJyb3IpXG5cbk5vdEZvdW5kRXJyb3IucHJvdG90eXBlLm5vdEZvdW5kID0gdHJ1ZVxuTm90Rm91bmRFcnJvci5wcm90b3R5cGUuc3RhdHVzICAgPSA0MDRcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTGV2ZWxVUEVycm9yICAgICAgICA6IExldmVsVVBFcnJvclxuICAsIEluaXRpYWxpemF0aW9uRXJyb3IgOiBjcmVhdGVFcnJvcignSW5pdGlhbGl6YXRpb25FcnJvcicsIExldmVsVVBFcnJvcilcbiAgLCBPcGVuRXJyb3IgICAgICAgICAgIDogY3JlYXRlRXJyb3IoJ09wZW5FcnJvcicsIExldmVsVVBFcnJvcilcbiAgLCBSZWFkRXJyb3IgICAgICAgICAgIDogY3JlYXRlRXJyb3IoJ1JlYWRFcnJvcicsIExldmVsVVBFcnJvcilcbiAgLCBXcml0ZUVycm9yICAgICAgICAgIDogY3JlYXRlRXJyb3IoJ1dyaXRlRXJyb3InLCBMZXZlbFVQRXJyb3IpXG4gICwgTm90Rm91bmRFcnJvciAgICAgICA6IE5vdEZvdW5kRXJyb3JcbiAgLCBFbmNvZGluZ0Vycm9yICAgICAgIDogY3JlYXRlRXJyb3IoJ0VuY29kaW5nRXJyb3InLCBMZXZlbFVQRXJyb3IpXG59XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLyogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgTGV2ZWxVUCBjb250cmlidXRvcnNcbiAqIFNlZSBsaXN0IGF0IDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwI2NvbnRyaWJ1dGluZz5cbiAqIE1JVCBMaWNlbnNlXG4gKiA8aHR0cHM6Ly9naXRodWIuY29tL3J2YWdnL25vZGUtbGV2ZWx1cC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kPlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgICA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuICAsIGluaGVyaXRzICAgICAgID0gcmVxdWlyZSgndXRpbCcpLmluaGVyaXRzXG4gICwgZXh0ZW5kICAgICAgICAgPSByZXF1aXJlKCd4dGVuZCcpXG4gICwgcHJyICAgICAgICAgICAgPSByZXF1aXJlKCdwcnInKVxuICAsIERlZmVycmVkTGV2ZWxET1dOID0gcmVxdWlyZSgnZGVmZXJyZWQtbGV2ZWxkb3duJylcblxuICAsIFdyaXRlRXJyb3IgICAgID0gcmVxdWlyZSgnLi9lcnJvcnMnKS5Xcml0ZUVycm9yXG4gICwgUmVhZEVycm9yICAgICAgPSByZXF1aXJlKCcuL2Vycm9ycycpLlJlYWRFcnJvclxuICAsIE5vdEZvdW5kRXJyb3IgID0gcmVxdWlyZSgnLi9lcnJvcnMnKS5Ob3RGb3VuZEVycm9yXG4gICwgT3BlbkVycm9yICAgICAgPSByZXF1aXJlKCcuL2Vycm9ycycpLk9wZW5FcnJvclxuICAsIEVuY29kaW5nRXJyb3IgID0gcmVxdWlyZSgnLi9lcnJvcnMnKS5FbmNvZGluZ0Vycm9yXG4gICwgSW5pdGlhbGl6YXRpb25FcnJvciA9IHJlcXVpcmUoJy4vZXJyb3JzJykuSW5pdGlhbGl6YXRpb25FcnJvclxuXG4gICwgUmVhZFN0cmVhbSAgICAgPSByZXF1aXJlKCcuL3JlYWQtc3RyZWFtJylcbiAgLCBXcml0ZVN0cmVhbSAgICA9IHJlcXVpcmUoJy4vd3JpdGUtc3RyZWFtJylcbiAgLCB1dGlsICAgICAgICAgICA9IHJlcXVpcmUoJy4vdXRpbCcpXG4gICwgQmF0Y2ggICAgICAgICAgPSByZXF1aXJlKCcuL2JhdGNoJylcbiAgLCBjb2RlYyAgICAgICAgICA9IHJlcXVpcmUoJy4vY29kZWMnKVxuXG4gICwgZ2V0T3B0aW9ucyAgICAgPSB1dGlsLmdldE9wdGlvbnNcbiAgLCBkZWZhdWx0T3B0aW9ucyA9IHV0aWwuZGVmYXVsdE9wdGlvbnNcbiAgLCBnZXRMZXZlbERPV04gICA9IHV0aWwuZ2V0TGV2ZWxET1dOXG4gICwgZGlzcGF0Y2hFcnJvciAgPSB1dGlsLmRpc3BhdGNoRXJyb3JcbiAgLCBpc0RlZmluZWQgICAgICA9IHV0aWwuaXNEZWZpbmVkXG5cbmZ1bmN0aW9uIGdldENhbGxiYWNrIChvcHRpb25zLCBjYWxsYmFjaykge1xuICByZXR1cm4gdHlwZW9mIG9wdGlvbnMgPT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMgOiBjYWxsYmFja1xufVxuXG4vLyBQb3NzaWJsZSBMZXZlbFVQI19zdGF0dXMgdmFsdWVzOlxuLy8gIC0gJ25ldycgICAgIC0gbmV3bHkgY3JlYXRlZCwgbm90IG9wZW5lZCBvciBjbG9zZWRcbi8vICAtICdvcGVuaW5nJyAtIHdhaXRpbmcgZm9yIHRoZSBkYXRhYmFzZSB0byBiZSBvcGVuZWQsIHBvc3Qgb3BlbigpXG4vLyAgLSAnb3BlbicgICAgLSBzdWNjZXNzZnVsbHkgb3BlbmVkIHRoZSBkYXRhYmFzZSwgYXZhaWxhYmxlIGZvciB1c2Vcbi8vICAtICdjbG9zaW5nJyAtIHdhaXRpbmcgZm9yIHRoZSBkYXRhYmFzZSB0byBiZSBjbG9zZWQsIHBvc3QgY2xvc2UoKVxuLy8gIC0gJ2Nsb3NlZCcgIC0gZGF0YWJhc2UgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNsb3NlZCwgc2hvdWxkIG5vdCBiZVxuLy8gICAgICAgICAgICAgICAgIHVzZWQgZXhjZXB0IGZvciBhbm90aGVyIG9wZW4oKSBvcGVyYXRpb25cblxuZnVuY3Rpb24gTGV2ZWxVUCAobG9jYXRpb24sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBMZXZlbFVQKSlcbiAgICByZXR1cm4gbmV3IExldmVsVVAobG9jYXRpb24sIG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIHZhciBlcnJvclxuXG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpXG4gIHRoaXMuc2V0TWF4TGlzdGVuZXJzKEluZmluaXR5KVxuXG4gIGlmICh0eXBlb2YgbG9jYXRpb24gPT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyA9PSAnb2JqZWN0JyA/IG9wdGlvbnMgOiB7fVxuICAgIG9wdGlvbnMuZGIgPSBsb2NhdGlvblxuICAgIGxvY2F0aW9uID0gbnVsbFxuICB9IGVsc2UgaWYgKHR5cGVvZiBsb2NhdGlvbiA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgbG9jYXRpb24uZGIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMgPSBsb2NhdGlvblxuICAgIGxvY2F0aW9uID0gbnVsbFxuICB9XG5cblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgID0ge31cbiAgfVxuXG4gIGlmICgoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMuZGIgIT0gJ2Z1bmN0aW9uJykgJiYgdHlwZW9mIGxvY2F0aW9uICE9ICdzdHJpbmcnKSB7XG4gICAgZXJyb3IgPSBuZXcgSW5pdGlhbGl6YXRpb25FcnJvcihcbiAgICAgICAgJ011c3QgcHJvdmlkZSBhIGxvY2F0aW9uIGZvciB0aGUgZGF0YWJhc2UnKVxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBjYWxsYmFjayhlcnJvcilcbiAgICAgIH0pXG4gICAgfVxuICAgIHRocm93IGVycm9yXG4gIH1cblxuICBvcHRpb25zICAgICAgPSBnZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpXG4gIHRoaXMub3B0aW9ucyA9IGV4dGVuZChkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcbiAgdGhpcy5fY29kZWMgPSBvcHRpb25zLmNvZGVjIHx8IGNvZGVjXG4gIHRoaXMuX3N0YXR1cyA9ICduZXcnXG4gIC8vIHNldCB0aGlzLmxvY2F0aW9uIGFzIGVudW1lcmFibGUgYnV0IG5vdCBjb25maWd1cmFibGUgb3Igd3JpdGFibGVcbiAgcHJyKHRoaXMsICdsb2NhdGlvbicsIGxvY2F0aW9uLCAnZScpXG5cbiAgdGhpcy5vcGVuKGNhbGxiYWNrKVxufVxuXG5pbmhlcml0cyhMZXZlbFVQLCBFdmVudEVtaXR0ZXIpXG5cbkxldmVsVVAucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBkYkZhY3RvcnlcbiAgICAsIGRiXG5cbiAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICBpZiAoY2FsbGJhY2spXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgY2FsbGJhY2sobnVsbCwgc2VsZikgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgaWYgKHRoaXMuX2lzT3BlbmluZygpKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrICYmIHRoaXMub25jZShcbiAgICAgICAgJ29wZW4nXG4gICAgICAsIGZ1bmN0aW9uICgpIHsgY2FsbGJhY2sobnVsbCwgc2VsZikgfVxuICAgIClcbiAgfVxuXG4gIHRoaXMuZW1pdCgnb3BlbmluZycpXG5cbiAgdGhpcy5fc3RhdHVzID0gJ29wZW5pbmcnXG4gIHRoaXMuZGIgICAgICA9IG5ldyBEZWZlcnJlZExldmVsRE9XTih0aGlzLmxvY2F0aW9uKVxuICBkYkZhY3RvcnkgICAgPSB0aGlzLm9wdGlvbnMuZGIgfHwgZ2V0TGV2ZWxET1dOKClcbiAgZGIgICAgICAgICAgID0gZGJGYWN0b3J5KHRoaXMubG9jYXRpb24pXG5cbiAgZGIub3Blbih0aGlzLm9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gZGlzcGF0Y2hFcnJvcihzZWxmLCBuZXcgT3BlbkVycm9yKGVyciksIGNhbGxiYWNrKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmRiLnNldERiKGRiKVxuICAgICAgc2VsZi5kYiA9IGRiXG4gICAgICBzZWxmLl9zdGF0dXMgPSAnb3BlbidcbiAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgc2VsZilcbiAgICAgIHNlbGYuZW1pdCgnb3BlbicpXG4gICAgICBzZWxmLmVtaXQoJ3JlYWR5JylcbiAgICB9XG4gIH0pXG59XG5cbkxldmVsVVAucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgdGhpcy5fc3RhdHVzID0gJ2Nsb3NpbmcnXG4gICAgdGhpcy5kYi5jbG9zZShmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9zdGF0dXMgPSAnY2xvc2VkJ1xuICAgICAgc2VsZi5lbWl0KCdjbG9zZWQnKVxuICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgfSlcbiAgICB0aGlzLmVtaXQoJ2Nsb3NpbmcnKVxuICAgIHRoaXMuZGIgPSBudWxsXG4gIH0gZWxzZSBpZiAodGhpcy5fc3RhdHVzID09ICdjbG9zZWQnICYmIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spXG4gIH0gZWxzZSBpZiAodGhpcy5fc3RhdHVzID09ICdjbG9zaW5nJyAmJiBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZSgnY2xvc2VkJywgY2FsbGJhY2spXG4gIH0gZWxzZSBpZiAodGhpcy5faXNPcGVuaW5nKCkpIHtcbiAgICB0aGlzLm9uY2UoJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmNsb3NlKGNhbGxiYWNrKVxuICAgIH0pXG4gIH1cbn1cblxuTGV2ZWxVUC5wcm90b3R5cGUuaXNPcGVuID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc3RhdHVzID09ICdvcGVuJ1xufVxuXG5MZXZlbFVQLnByb3RvdHlwZS5faXNPcGVuaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc3RhdHVzID09ICdvcGVuaW5nJ1xufVxuXG5MZXZlbFVQLnByb3RvdHlwZS5pc0Nsb3NlZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICgvXmNsb3MvKS50ZXN0KHRoaXMuX3N0YXR1cylcbn1cblxuZnVuY3Rpb24gbWF5YmVFcnJvcihkYiwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKCFkYi5faXNPcGVuaW5nKCkgJiYgIWRiLmlzT3BlbigpKSB7XG4gICAgZGlzcGF0Y2hFcnJvcihcbiAgICAgICAgZGJcbiAgICAgICwgbmV3IFJlYWRFcnJvcignRGF0YWJhc2UgaXMgbm90IG9wZW4nKVxuICAgICAgLCBjYWxsYmFja1xuICAgIClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmZ1bmN0aW9uIHdyaXRlRXJyb3IgKGRiLCBtZXNzYWdlLCBjYWxsYmFjaykge1xuICBkaXNwYXRjaEVycm9yKFxuICAgICAgZGJcbiAgICAgLCBuZXcgV3JpdGVFcnJvcihtZXNzYWdlKVxuICAgICAsIGNhbGxiYWNrXG4gIClcbn1cblxuZnVuY3Rpb24gcmVhZEVycm9yIChkYiwgbWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgZGlzcGF0Y2hFcnJvcihcbiAgICAgIGRiXG4gICAgICwgbmV3IFJlYWRFcnJvcihtZXNzYWdlKVxuICAgICAsIGNhbGxiYWNrXG4gIClcbiAgcmV0dXJuIHRydWVcbn1cblxuXG5MZXZlbFVQLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5Xywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBrZXlcblxuICBjYWxsYmFjayA9IGdldENhbGxiYWNrKG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIGlmIChtYXliZUVycm9yKHRoaXMsIG9wdGlvbnMsIGNhbGxiYWNrKSlcbiAgICByZXR1cm5cblxuICBpZiAoa2V5XyA9PT0gbnVsbCB8fCBrZXlfID09PSB1bmRlZmluZWQgfHwgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNhbGxiYWNrKVxuICAgIHJldHVybiByZWFkRXJyb3IodGhpc1xuICAgICAgLCAnZ2V0KCkgcmVxdWlyZXMga2V5IGFuZCBjYWxsYmFjayBhcmd1bWVudHMnLCBjYWxsYmFjaylcblxuICBvcHRpb25zID0gdXRpbC5nZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpXG4gIGtleSA9IHRoaXMuX2NvZGVjLmVuY29kZUtleShrZXlfLCBvcHRpb25zKVxuXG4gIG9wdGlvbnMuYXNCdWZmZXIgPSB0aGlzLl9jb2RlYy5pc1ZhbHVlQXNCdWZmZXIob3B0aW9ucylcblxuICB0aGlzLmRiLmdldChrZXksIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIHZhbHVlKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgaWYgKCgvbm90Zm91bmQvaSkudGVzdChlcnIpKSB7XG4gICAgICAgIGVyciA9IG5ldyBOb3RGb3VuZEVycm9yKFxuICAgICAgICAgICAgJ0tleSBub3QgZm91bmQgaW4gZGF0YWJhc2UgWycgKyBrZXlfICsgJ10nLCBlcnIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnIgPSBuZXcgUmVhZEVycm9yKGVycilcbiAgICAgIH1cbiAgICAgIHJldHVybiBkaXNwYXRjaEVycm9yKHNlbGYsIGVyciwgY2FsbGJhY2spXG4gICAgfVxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBzZWxmLl9jb2RlYy5kZWNvZGVWYWx1ZSh2YWx1ZSwgb3B0aW9ucylcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFbmNvZGluZ0Vycm9yKGUpKVxuICAgICAgfVxuICAgICAgY2FsbGJhY2sobnVsbCwgdmFsdWUpXG4gICAgfVxuICB9KVxufVxuXG5MZXZlbFVQLnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiAoa2V5XywgdmFsdWVfLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIGtleVxuICAgICwgdmFsdWVcblxuICBjYWxsYmFjayA9IGdldENhbGxiYWNrKG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIGlmIChrZXlfID09PSBudWxsIHx8IGtleV8gPT09IHVuZGVmaW5lZFxuICAgICAgICB8fCB2YWx1ZV8gPT09IG51bGwgfHwgdmFsdWVfID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIHdyaXRlRXJyb3IodGhpcywgJ3B1dCgpIHJlcXVpcmVzIGtleSBhbmQgdmFsdWUgYXJndW1lbnRzJywgY2FsbGJhY2spXG5cbiAgaWYgKG1heWJlRXJyb3IodGhpcywgb3B0aW9ucywgY2FsbGJhY2spKVxuICAgIHJldHVyblxuXG4gIG9wdGlvbnMgPSBnZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpXG4gIGtleSAgICAgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkoa2V5Xywgb3B0aW9ucylcbiAgdmFsdWUgICA9IHRoaXMuX2NvZGVjLmVuY29kZVZhbHVlKHZhbHVlXywgb3B0aW9ucylcblxuICB0aGlzLmRiLnB1dChrZXksIHZhbHVlLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoRXJyb3Ioc2VsZiwgbmV3IFdyaXRlRXJyb3IoZXJyKSwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW1pdCgncHV0Jywga2V5XywgdmFsdWVfKVxuICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9KVxufVxuXG5MZXZlbFVQLnByb3RvdHlwZS5kZWwgPSBmdW5jdGlvbiAoa2V5Xywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBrZXlcblxuICBjYWxsYmFjayA9IGdldENhbGxiYWNrKG9wdGlvbnMsIGNhbGxiYWNrKVxuXG4gIGlmIChrZXlfID09PSBudWxsIHx8IGtleV8gPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gd3JpdGVFcnJvcih0aGlzLCAnZGVsKCkgcmVxdWlyZXMgYSBrZXkgYXJndW1lbnQnLCBjYWxsYmFjaylcblxuICBpZiAobWF5YmVFcnJvcih0aGlzLCBvcHRpb25zLCBjYWxsYmFjaykpXG4gICAgcmV0dXJuXG5cbiAgb3B0aW9ucyA9IGdldE9wdGlvbnModGhpcywgb3B0aW9ucylcbiAga2V5ICAgICA9IHRoaXMuX2NvZGVjLmVuY29kZUtleShrZXlfLCBvcHRpb25zKVxuXG4gIHRoaXMuZGIuZGVsKGtleSwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBkaXNwYXRjaEVycm9yKHNlbGYsIG5ldyBXcml0ZUVycm9yKGVyciksIGNhbGxiYWNrKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVtaXQoJ2RlbCcsIGtleV8pXG4gICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH0pXG59XG5cbkxldmVsVVAucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKGFycl8sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwga2V5RW5jXG4gICAgLCB2YWx1ZUVuY1xuICAgICwgYXJyXG5cbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKVxuICAgIHJldHVybiBuZXcgQmF0Y2godGhpcywgY29kZWMpXG5cbiAgY2FsbGJhY2sgPSBnZXRDYWxsYmFjayhvcHRpb25zLCBjYWxsYmFjaylcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyXykpXG4gICAgcmV0dXJuIHdyaXRlRXJyb3IodGhpcywgJ2JhdGNoKCkgcmVxdWlyZXMgYW4gYXJyYXkgYXJndW1lbnQnLCBjYWxsYmFjaylcblxuICBpZiAobWF5YmVFcnJvcih0aGlzLCBvcHRpb25zLCBjYWxsYmFjaykpXG4gICAgcmV0dXJuXG5cbiAgb3B0aW9ucyAgPSBnZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpXG4gIGtleUVuYyAgID0gb3B0aW9ucy5rZXlFbmNvZGluZ1xuICB2YWx1ZUVuYyA9IG9wdGlvbnMudmFsdWVFbmNvZGluZ1xuXG4gIGFyciA9IGFycl8ubWFwKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUudHlwZSA9PT0gdW5kZWZpbmVkIHx8IGUua2V5ID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4ge31cblxuICAgIC8vIGluaGVyaXQgZW5jb2RpbmdcbiAgICB2YXIga0VuYyA9IGUua2V5RW5jb2RpbmcgfHwga2V5RW5jXG4gICAgICAsIHZFbmMgPSBlLnZhbHVlRW5jb2RpbmcgfHwgZS5lbmNvZGluZyB8fCB2YWx1ZUVuY1xuICAgICAgLCBvXG5cbiAgICAvLyBJZiB3ZSdyZSBub3QgZGVhbGluZyB3aXRoIHBsYWluIHV0Zjggc3RyaW5ncyBvciBwbGFpblxuICAgIC8vIEJ1ZmZlcnMgdGhlbiB3ZSBoYXZlIHRvIGRvIHNvbWUgd29yayBvbiB0aGUgYXJyYXkgdG9cbiAgICAvLyBlbmNvZGUgdGhlIGtleXMgYW5kL29yIHZhbHVlcy4gVGhpcyBpbmNsdWRlcyBKU09OIHR5cGVzLlxuXG4gICAgaWYgKGtFbmMgIT0gJ3V0ZjgnICYmIGtFbmMgIT0gJ2JpbmFyeSdcbiAgICAgICAgfHwgdkVuYyAhPSAndXRmOCcgJiYgdkVuYyAhPSAnYmluYXJ5Jykge1xuICAgICAgbyA9IHtcbiAgICAgICAgICB0eXBlOiBlLnR5cGVcbiAgICAgICAgLCBrZXk6IHNlbGYuX2NvZGVjLmVuY29kZUtleShlLmtleSwgb3B0aW9ucywgZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGUudmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgby52YWx1ZSA9IHNlbGYuX2NvZGVjLmVuY29kZVZhbHVlKGUudmFsdWUsIG9wdGlvbnMsIGUpXG5cbiAgICAgIHJldHVybiBvXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlXG4gICAgfVxuICB9KVxuXG4gIHRoaXMuZGIuYmF0Y2goYXJyLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoRXJyb3Ioc2VsZiwgbmV3IFdyaXRlRXJyb3IoZXJyKSwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW1pdCgnYmF0Y2gnLCBhcnJfKVxuICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9KVxufVxuXG4vLyBERVBSRUNBVEVEOiBwcmVmZXIgYWNjZXNzaW5nIExldmVsRE9XTiBmb3IgdGhpczogZGIuZGIuYXBwcm94aW1hdGVTaXplKClcbkxldmVsVVAucHJvdG90eXBlLmFwcHJveGltYXRlU2l6ZSA9IGZ1bmN0aW9uIChzdGFydF8sIGVuZF8sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgc3RhcnRcbiAgICAsIGVuZFxuXG4gIGNhbGxiYWNrID0gZ2V0Q2FsbGJhY2sob3B0aW9ucywgY2FsbGJhY2spXG5cbiAgb3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9ucywgY2FsbGJhY2spXG5cbiAgaWYgKHN0YXJ0XyA9PT0gbnVsbCB8fCBzdGFydF8gPT09IHVuZGVmaW5lZFxuICAgICAgICB8fCBlbmRfID09PSBudWxsIHx8IGVuZF8gPT09IHVuZGVmaW5lZCB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2FsbGJhY2spXG4gICAgcmV0dXJuIHJlYWRFcnJvcih0aGlzLCAnYXBwcm94aW1hdGVTaXplKCkgcmVxdWlyZXMgc3RhcnQsIGVuZCBhbmQgY2FsbGJhY2sgYXJndW1lbnRzJywgY2FsbGJhY2spXG5cbiAgc3RhcnQgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkoc3RhcnRfLCB0aGlzLm9wdGlvbnMpXG4gIGVuZCAgID0gdGhpcy5fY29kZWMuZW5jb2RlS2V5KGVuZF8sIHRoaXMub3B0aW9ucylcblxuICB0aGlzLmRiLmFwcHJveGltYXRlU2l6ZShzdGFydCwgZW5kLCBmdW5jdGlvbiAoZXJyLCBzaXplKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoRXJyb3Ioc2VsZiwgbmV3IE9wZW5FcnJvcihlcnIpLCBjYWxsYmFjaylcbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBzaXplKVxuICAgIH1cbiAgfSlcbn1cblxuTGV2ZWxVUC5wcm90b3R5cGUucmVhZFN0cmVhbSA9XG5MZXZlbFVQLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIG9wdGlvbnMgPSBleHRlbmQoIHtrZXlzOiB0cnVlLCB2YWx1ZXM6IHRydWV9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpXG5cbiAgb3B0aW9ucy5rZXlFbmNvZGluZyAgID0gb3B0aW9ucy5rZXlFbmNvZGluZyAgIHx8IG9wdGlvbnMuZW5jb2RpbmdcbiAgb3B0aW9ucy52YWx1ZUVuY29kaW5nID0gb3B0aW9ucy52YWx1ZUVuY29kaW5nIHx8IG9wdGlvbnMuZW5jb2RpbmdcblxuICBpZiAoaXNEZWZpbmVkKG9wdGlvbnMuc3RhcnQpKVxuICAgIG9wdGlvbnMuc3RhcnQgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkob3B0aW9ucy5zdGFydCwgb3B0aW9ucylcbiAgaWYgKGlzRGVmaW5lZChvcHRpb25zLmVuZCkpXG4gICAgb3B0aW9ucy5lbmQgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkob3B0aW9ucy5lbmQsIG9wdGlvbnMpXG4gIGlmIChpc0RlZmluZWQob3B0aW9ucy5ndGUpKVxuICAgIG9wdGlvbnMuZ3RlID0gdGhpcy5fY29kZWMuZW5jb2RlS2V5KG9wdGlvbnMuZ3RlLCBvcHRpb25zKVxuICBpZiAoaXNEZWZpbmVkKG9wdGlvbnMuZ3QpKVxuICAgIG9wdGlvbnMuZ3QgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkob3B0aW9ucy5ndCwgb3B0aW9ucylcbiAgaWYgKGlzRGVmaW5lZChvcHRpb25zLmx0ZSkpXG4gICAgb3B0aW9ucy5sdGUgPSB0aGlzLl9jb2RlYy5lbmNvZGVLZXkob3B0aW9ucy5sdGUsIG9wdGlvbnMpXG4gIGlmIChpc0RlZmluZWQob3B0aW9ucy5sdCkpXG4gICAgb3B0aW9ucy5sdCA9IHRoaXMuX2NvZGVjLmVuY29kZUtleShvcHRpb25zLmx0LCBvcHRpb25zKVxuICBpZiAoJ251bWJlcicgIT09IHR5cGVvZiBvcHRpb25zLmxpbWl0KVxuICAgIG9wdGlvbnMubGltaXQgPSAtMVxuXG4gIG9wdGlvbnMua2V5QXNCdWZmZXIgICA9IHRoaXMuX2NvZGVjLmlzS2V5QXNCdWZmZXIob3B0aW9ucylcbiAgb3B0aW9ucy52YWx1ZUFzQnVmZmVyID0gdGhpcy5fY29kZWMuaXNWYWx1ZUFzQnVmZmVyKG9wdGlvbnMpXG5cbiAgdmFyIG1ha2VEYXRhID0gb3B0aW9ucy5rZXlzICYmIG9wdGlvbnMudmFsdWVzXG4gICAgPyBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBzZWxmLl9jb2RlYy5kZWNvZGVLZXkoa2V5LCBvcHRpb25zKVxuICAgICAgICAgICwgdmFsdWU6IHNlbGYuX2NvZGVjLmRlY29kZVZhbHVlKHZhbHVlLCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgOiBvcHRpb25zLmtleXNcbiAgICA/IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2NvZGVjLmRlY29kZUtleShrZXksIG9wdGlvbnMpXG4gICAgICB9XG4gICAgOiBvcHRpb25zLnZhbHVlc1xuICAgID8gZnVuY3Rpb24gKF8sIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9jb2RlYy5kZWNvZGVWYWx1ZSh2YWx1ZSwgb3B0aW9ucylcbiAgICAgIH1cbiAgICA6IGZ1bmN0aW9uICgpIHt9XG5cbiAgdmFyIHN0cmVhbSA9IG5ldyBSZWFkU3RyZWFtKG9wdGlvbnMsIG1ha2VEYXRhKVxuXG4gIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgc3RyZWFtLnNldEl0ZXJhdG9yKHNlbGYuZGIuaXRlcmF0b3Iob3B0aW9ucykpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vbmNlKCdyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0cmVhbS5zZXRJdGVyYXRvcihzZWxmLmRiLml0ZXJhdG9yKG9wdGlvbnMpKVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gc3RyZWFtXG59XG5cbkxldmVsVVAucHJvdG90eXBlLmtleVN0cmVhbSA9XG5MZXZlbFVQLnByb3RvdHlwZS5jcmVhdGVLZXlTdHJlYW0gPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gdGhpcy5jcmVhdGVSZWFkU3RyZWFtKGV4dGVuZChvcHRpb25zLCB7IGtleXM6IHRydWUsIHZhbHVlczogZmFsc2UgfSkpXG59XG5cbkxldmVsVVAucHJvdG90eXBlLnZhbHVlU3RyZWFtID1cbkxldmVsVVAucHJvdG90eXBlLmNyZWF0ZVZhbHVlU3RyZWFtID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIHRoaXMuY3JlYXRlUmVhZFN0cmVhbShleHRlbmQob3B0aW9ucywgeyBrZXlzOiBmYWxzZSwgdmFsdWVzOiB0cnVlIH0pKVxufVxuXG5MZXZlbFVQLnByb3RvdHlwZS53cml0ZVN0cmVhbSA9XG5MZXZlbFVQLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIC8vWFhYIGlzIGV4dGVuZCBuZWVkZWQgaGVyZT9cbiAgcmV0dXJuIG5ldyBXcml0ZVN0cmVhbShleHRlbmQob3B0aW9ucyksIHRoaXMpXG59XG5cbkxldmVsVVAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJ0xldmVsVVAnXG59XG5cbmZ1bmN0aW9uIHV0aWxTdGF0aWMgKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChsb2NhdGlvbiwgY2FsbGJhY2spIHtcbiAgICBnZXRMZXZlbERPV04oKVtuYW1lXShsb2NhdGlvbiwgY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge30pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgICAgICAgICA9IExldmVsVVBcbm1vZHVsZS5leHBvcnRzLmNvcHkgICAgPSB1dGlsLmNvcHlcbi8vIERFUFJFQ0FURUQ6IHByZWZlciBhY2Nlc3NpbmcgTGV2ZWxET1dOIGZvciB0aGlzOiByZXF1aXJlKCdsZXZlbGRvd24nKS5kZXN0cm95KClcbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSB1dGlsU3RhdGljKCdkZXN0cm95Jylcbi8vIERFUFJFQ0FURUQ6IHByZWZlciBhY2Nlc3NpbmcgTGV2ZWxET1dOIGZvciB0aGlzOiByZXF1aXJlKCdsZXZlbGRvd24nKS5yZXBhaXIoKVxubW9kdWxlLmV4cG9ydHMucmVwYWlyICA9IHV0aWxTdGF0aWMoJ3JlcGFpcicpXG5cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpIiwiLyogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgTGV2ZWxVUCBjb250cmlidXRvcnNcbiAqIFNlZSBsaXN0IGF0IDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwI2NvbnRyaWJ1dGluZz5cbiAqIE1JVCBMaWNlbnNlIDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQ+XG4gKi9cblxuLy8gTk9URTogd2UgYXJlIGZpeGVkIHRvIHJlYWRhYmxlLXN0cmVhbUAxLjAueCBmb3Igbm93XG4vLyBmb3IgcHVyZSBTdHJlYW1zMiBhY3Jvc3MgTm9kZSB2ZXJzaW9uc1xudmFyIFJlYWRhYmxlICAgICAgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0nKS5SZWFkYWJsZVxuICAsIGluaGVyaXRzICAgICAgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHNcbiAgLCBleHRlbmQgICAgICAgID0gcmVxdWlyZSgneHRlbmQnKVxuICAsIEVuY29kaW5nRXJyb3IgPSByZXF1aXJlKCcuL2Vycm9ycycpLkVuY29kaW5nRXJyb3JcbiAgLCB1dGlsICAgICAgICAgID0gcmVxdWlyZSgnLi91dGlsJylcblxuXG5cbmZ1bmN0aW9uIFJlYWRTdHJlYW0gKG9wdGlvbnMsIG1ha2VEYXRhKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZWFkU3RyZWFtKSlcbiAgICByZXR1cm4gbmV3IFJlYWRTdHJlYW0ob3B0aW9ucywgbWFrZURhdGEpXG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCB7IG9iamVjdE1vZGU6IHRydWUsIGhpZ2hXYXRlck1hcms6IG9wdGlvbnMuaGlnaFdhdGVyTWFyayB9KVxuXG4gIC8vIHB1cmVseSB0byBrZWVwIGBkYmAgYXJvdW5kIHVudGlsIHdlJ3JlIGRvbmUgc28gaXQncyBub3QgR0NlZCBpZiB0aGUgdXNlciBkb2Vzbid0IGtlZXAgYSByZWZcblxuICB0aGlzLl93YWl0aW5nID0gZmFsc2VcbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnNcbiAgdGhpcy5fbWFrZURhdGEgPSBtYWtlRGF0YVxufVxuXG5pbmhlcml0cyhSZWFkU3RyZWFtLCBSZWFkYWJsZSlcblxuUmVhZFN0cmVhbS5wcm90b3R5cGUuc2V0SXRlcmF0b3IgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHRoaXMuX2l0ZXJhdG9yID0gaXRcbiAgaWYodGhpcy5fZGVzdHJveWVkKSByZXR1cm4gaXQuZW5kKGZ1bmN0aW9uICgpIHt9KVxuICBpZih0aGlzLl93YWl0aW5nKSB7XG4gICAgdGhpcy5fd2FpdGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXMuX3JlYWQoKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cblJlYWRTdHJlYW0ucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24gcmVhZCAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoc2VsZi5fZGVzdHJveWVkKVxuICAgIHJldHVyblxuICBpZighc2VsZi5faXRlcmF0b3IpXG4gICAgcmV0dXJuIHRoaXMuX3dhaXRpbmcgPSB0cnVlXG5cbiAgc2VsZi5faXRlcmF0b3IubmV4dChmdW5jdGlvbihlcnIsIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoZXJyIHx8IChrZXkgPT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgaWYgKCFlcnIgJiYgIXNlbGYuX2Rlc3Ryb3llZClcbiAgICAgICAgc2VsZi5wdXNoKG51bGwpXG4gICAgICByZXR1cm4gc2VsZi5fY2xlYW51cChlcnIpXG4gICAgfVxuXG5cbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBzZWxmLl9tYWtlRGF0YShrZXksIHZhbHVlKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBzZWxmLl9jbGVhbnVwKG5ldyBFbmNvZGluZ0Vycm9yKGUpKVxuICAgIH1cbiAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZClcbiAgICAgIHNlbGYucHVzaCh2YWx1ZSlcbiAgfSlcbn1cblxuUmVhZFN0cmVhbS5wcm90b3R5cGUuX2NsZWFudXAgPSBmdW5jdGlvbiAoZXJyKSB7XG4gIGlmICh0aGlzLl9kZXN0cm95ZWQpXG4gICAgcmV0dXJuXG5cbiAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZVxuXG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoZXJyKVxuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXG5cbiAgaWYgKHNlbGYuX2l0ZXJhdG9yKSB7XG4gICAgc2VsZi5faXRlcmF0b3IuZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2l0ZXJhdG9yID0gbnVsbFxuICAgICAgc2VsZi5lbWl0KCdjbG9zZScpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmVtaXQoJ2Nsb3NlJylcbiAgfVxufVxuXG5SZWFkU3RyZWFtLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9jbGVhbnVwKClcbn1cblxuUmVhZFN0cmVhbS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnTGV2ZWxVUC5SZWFkU3RyZWFtJ1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZFN0cmVhbVxuXG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTItMjAxNCBMZXZlbFVQIGNvbnRyaWJ1dG9yc1xuICogU2VlIGxpc3QgYXQgPGh0dHBzOi8vZ2l0aHViLmNvbS9ydmFnZy9ub2RlLWxldmVsdXAjY29udHJpYnV0aW5nPlxuICogTUlUIExpY2Vuc2VcbiAqIDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQ+XG4gKi9cblxudmFyIGV4dGVuZCAgICAgICAgPSByZXF1aXJlKCd4dGVuZCcpXG4gICwgTGV2ZWxVUEVycm9yICA9IHJlcXVpcmUoJy4vZXJyb3JzJykuTGV2ZWxVUEVycm9yXG4gICwgZW5jb2RpbmdzICAgICA9IHJlcXVpcmUoJy4vZW5jb2RpbmdzJylcbiAgLCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgY3JlYXRlSWZNaXNzaW5nIDogdHJ1ZVxuICAgICAgLCBlcnJvcklmRXhpc3RzICAgOiBmYWxzZVxuICAgICAgLCBrZXlFbmNvZGluZyAgICAgOiAndXRmOCdcbiAgICAgICwgdmFsdWVFbmNvZGluZyAgIDogJ3V0ZjgnXG4gICAgICAsIGNvbXByZXNzaW9uICAgICA6IHRydWVcbiAgICB9XG5cbiAgLCBsZXZlbGRvd25cbiAgLCBlbmNvZGluZ09wdHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVvID0ge31cbiAgICAgIGZvcih2YXIgZSBpbiBlbmNvZGluZ3MpXG4gICAgICAgIGVvW2VdID0ge3ZhbHVlRW5jb2Rpbmc6IGVuY29kaW5nc1tlXX1cbiAgICAgIHJldHVybiBlb1xuICAgIH0oKSlcblxuZnVuY3Rpb24gY29weSAoc3JjZGIsIGRzdGRiLCBjYWxsYmFjaykge1xuICBzcmNkYi5yZWFkU3RyZWFtKClcbiAgICAucGlwZShkc3RkYi53cml0ZVN0cmVhbSgpKVxuICAgIC5vbignY2xvc2UnLCBjYWxsYmFjayA/IGNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pXG4gICAgLm9uKCdlcnJvcicsIGNhbGxiYWNrID8gY2FsbGJhY2sgOiBmdW5jdGlvbiAoZXJyKSB7IHRocm93IGVyciB9KVxufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25zIChsZXZlbHVwLCBvcHRpb25zKSB7XG4gIHZhciBzID0gdHlwZW9mIG9wdGlvbnMgPT0gJ3N0cmluZycgLy8ganVzdCBhbiBlbmNvZGluZ1xuICBpZiAoIXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmVuY29kaW5nICYmICFvcHRpb25zLnZhbHVlRW5jb2RpbmcpXG4gICAgb3B0aW9ucy52YWx1ZUVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZ1xuICByZXR1cm4gZXh0ZW5kKFxuICAgICAgKGxldmVsdXAgJiYgbGV2ZWx1cC5vcHRpb25zKSB8fCB7fVxuICAgICwgcyA/IGVuY29kaW5nT3B0c1tvcHRpb25zXSB8fCBlbmNvZGluZ09wdHNbZGVmYXVsdE9wdGlvbnMudmFsdWVFbmNvZGluZ11cbiAgICAgICAgOiBvcHRpb25zXG4gIClcbn1cblxuZnVuY3Rpb24gZ2V0TGV2ZWxET1dOICgpIHtcbiAgaWYgKGxldmVsZG93bilcbiAgICByZXR1cm4gbGV2ZWxkb3duXG5cbiAgdmFyIHJlcXVpcmVkVmVyc2lvbiAgICAgICA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLmRldkRlcGVuZGVuY2llcy5sZXZlbGRvd25cbiAgICAsIG1pc3NpbmdMZXZlbERPV05FcnJvciA9ICdDb3VsZCBub3QgbG9jYXRlIExldmVsRE9XTiwgdHJ5IGBucG0gaW5zdGFsbCBsZXZlbGRvd25gJ1xuICAgICwgbGV2ZWxkb3duVmVyc2lvblxuXG4gIHRyeSB7XG4gICAgbGV2ZWxkb3duVmVyc2lvbiA9IHJlcXVpcmUoJ2xldmVsZG93bi9wYWNrYWdlJykudmVyc2lvblxuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IExldmVsVVBFcnJvcihtaXNzaW5nTGV2ZWxET1dORXJyb3IpXG4gIH1cblxuICBpZiAoIXJlcXVpcmUoJ3NlbXZlcicpLnNhdGlzZmllcyhsZXZlbGRvd25WZXJzaW9uLCByZXF1aXJlZFZlcnNpb24pKSB7XG4gICAgdGhyb3cgbmV3IExldmVsVVBFcnJvcihcbiAgICAgICAgJ0luc3RhbGxlZCB2ZXJzaW9uIG9mIExldmVsRE9XTiAoJ1xuICAgICAgKyBsZXZlbGRvd25WZXJzaW9uXG4gICAgICArICcpIGRvZXMgbm90IG1hdGNoIHJlcXVpcmVkIHZlcnNpb24gKCdcbiAgICAgICsgcmVxdWlyZWRWZXJzaW9uXG4gICAgICArICcpJ1xuICAgIClcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGxldmVsZG93biA9IHJlcXVpcmUoJ2xldmVsZG93bicpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgTGV2ZWxVUEVycm9yKG1pc3NpbmdMZXZlbERPV05FcnJvcilcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEVycm9yIChsZXZlbHVwLCBlcnJvciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nXG4gICAgPyBjYWxsYmFjayhlcnJvcilcbiAgICA6IGxldmVsdXAuZW1pdCgnZXJyb3InLCBlcnJvcilcbn1cblxuZnVuY3Rpb24gaXNEZWZpbmVkICh2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCdcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGVmYXVsdE9wdGlvbnMgIDogZGVmYXVsdE9wdGlvbnNcbiAgLCBjb3B5ICAgICAgICAgICAgOiBjb3B5XG4gICwgZ2V0T3B0aW9ucyAgICAgIDogZ2V0T3B0aW9uc1xuICAsIGdldExldmVsRE9XTiAgICA6IGdldExldmVsRE9XTlxuICAsIGRpc3BhdGNoRXJyb3IgICA6IGRpc3BhdGNoRXJyb3JcbiAgLCBpc0RlZmluZWQgICAgICAgOiBpc0RlZmluZWRcbn1cbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuLyogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgTGV2ZWxVUCBjb250cmlidXRvcnNcbiAqIFNlZSBsaXN0IGF0IDxodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwI2NvbnRyaWJ1dGluZz5cbiAqIE1JVCBMaWNlbnNlXG4gKiA8aHR0cHM6Ly9naXRodWIuY29tL3J2YWdnL25vZGUtbGV2ZWx1cC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kPlxuICovXG5cbnZhciBTdHJlYW0gICAgICAgPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW1cbiAgLCBpbmhlcml0cyAgICAgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHNcbiAgLCBleHRlbmQgICAgICAgPSByZXF1aXJlKCd4dGVuZCcpXG4gICwgYmwgICAgICAgICAgID0gcmVxdWlyZSgnYmwnKVxuXG4gICwgc2V0SW1tZWRpYXRlID0gZ2xvYmFsLnNldEltbWVkaWF0ZSB8fCBwcm9jZXNzLm5leHRUaWNrXG5cbiAgLCBnZXRPcHRpb25zICAgPSByZXF1aXJlKCcuL3V0aWwnKS5nZXRPcHRpb25zXG5cbiAgLCBkZWZhdWx0T3B0aW9ucyA9IHsgdHlwZTogJ3B1dCcgfVxuXG5mdW5jdGlvbiBXcml0ZVN0cmVhbSAob3B0aW9ucywgZGIpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFdyaXRlU3RyZWFtKSlcbiAgICByZXR1cm4gbmV3IFdyaXRlU3RyZWFtKG9wdGlvbnMsIGRiKVxuXG4gIFN0cmVhbS5jYWxsKHRoaXMpXG4gIHRoaXMuX29wdGlvbnMgPSBleHRlbmQoZGVmYXVsdE9wdGlvbnMsIGdldE9wdGlvbnMoZGIsIG9wdGlvbnMpKVxuICB0aGlzLl9kYiAgICAgID0gZGJcbiAgdGhpcy5fYnVmZmVyICA9IFtdXG4gIHRoaXMuX3N0YXR1cyAgPSAnaW5pdCdcbiAgdGhpcy5fZW5kICAgICA9IGZhbHNlXG4gIHRoaXMud3JpdGFibGUgPSB0cnVlXG4gIHRoaXMucmVhZGFibGUgPSBmYWxzZVxuXG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgcmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2VsZi53cml0YWJsZSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgc2VsZi5fc3RhdHVzID0gJ3JlYWR5J1xuICAgICAgICBzZWxmLmVtaXQoJ3JlYWR5JylcbiAgICAgICAgc2VsZi5fcHJvY2VzcygpXG4gICAgICB9XG5cbiAgaWYgKGRiLmlzT3BlbigpKVxuICAgIHNldEltbWVkaWF0ZShyZWFkeSlcbiAgZWxzZVxuICAgIGRiLm9uY2UoJ3JlYWR5JywgcmVhZHkpXG59XG5cbmluaGVyaXRzKFdyaXRlU3RyZWFtLCBTdHJlYW0pXG5cbldyaXRlU3RyZWFtLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIGlmICghdGhpcy53cml0YWJsZSlcbiAgICByZXR1cm4gZmFsc2VcbiAgdGhpcy5fYnVmZmVyLnB1c2goZGF0YSlcbiAgaWYgKHRoaXMuX3N0YXR1cyAhPSAnaW5pdCcpXG4gICAgdGhpcy5fcHJvY2Vzc0RlbGF5ZWQoKVxuICBpZiAodGhpcy5fb3B0aW9ucy5tYXhCdWZmZXJMZW5ndGggJiZcbiAgICAgIHRoaXMuX2J1ZmZlci5sZW5ndGggPiB0aGlzLl9vcHRpb25zLm1heEJ1ZmZlckxlbmd0aCkge1xuICAgIHRoaXMuX3dyaXRlQmxvY2sgPSB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuV3JpdGVTdHJlYW0ucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoZGF0YSlcbiAgICB0aGlzLndyaXRlKGRhdGEpXG4gIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fZW5kID0gdHJ1ZVxuICAgIHNlbGYuX3Byb2Nlc3MoKVxuICB9KVxufVxuXG5Xcml0ZVN0cmVhbS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy53cml0YWJsZSA9IGZhbHNlXG4gIHRoaXMuZW5kKClcbn1cblxuV3JpdGVTdHJlYW0ucHJvdG90eXBlLmRlc3Ryb3lTb29uID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmVuZCgpXG59XG5cbldyaXRlU3RyZWFtLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgaWYgKCFlbnRyeS5wcm9wcylcbiAgICByZXR1cm5cbiAgaWYgKGVudHJ5LnByb3BzLkRpcmVjdG9yeSlcbiAgICBlbnRyeS5waXBlKHRoaXMuX2RiLndyaXRlU3RyZWFtKHRoaXMuX29wdGlvbnMpKVxuICBlbHNlIGlmIChlbnRyeS5wcm9wcy5GaWxlIHx8IGVudHJ5LkZpbGUgfHwgZW50cnkudHlwZSA9PSAnRmlsZScpXG4gICAgdGhpcy5fd3JpdGUoZW50cnkpXG4gIHJldHVybiB0cnVlXG59XG5cbldyaXRlU3RyZWFtLnByb3RvdHlwZS5fcHJvY2Vzc0RlbGF5ZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3Byb2Nlc3MoKVxuICB9KVxufVxuXG5Xcml0ZVN0cmVhbS5wcm90b3R5cGUuX3Byb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBidWZmZXJcbiAgICAsIHNlbGYgPSB0aGlzXG5cbiAgICAsIGNiID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoIXNlbGYud3JpdGFibGUpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGlmIChzZWxmLl9zdGF0dXMgIT0gJ2Nsb3NlZCcpXG4gICAgICAgICAgc2VsZi5fc3RhdHVzID0gJ3JlYWR5J1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgc2VsZi53cml0YWJsZSA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fcHJvY2VzcygpXG4gICAgICB9XG5cbiAgaWYgKHNlbGYuX3N0YXR1cyAhPSAncmVhZHknICYmIHNlbGYud3JpdGFibGUpIHtcbiAgICBpZiAoc2VsZi5fYnVmZmVyLmxlbmd0aCAmJiBzZWxmLl9zdGF0dXMgIT0gJ2Nsb3NlZCcpXG4gICAgICBzZWxmLl9wcm9jZXNzRGVsYXllZCgpXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoc2VsZi5fYnVmZmVyLmxlbmd0aCAmJiBzZWxmLndyaXRhYmxlKSB7XG4gICAgc2VsZi5fc3RhdHVzID0gJ3dyaXRpbmcnXG4gICAgYnVmZmVyICAgICAgID0gc2VsZi5fYnVmZmVyXG4gICAgc2VsZi5fYnVmZmVyID0gW11cblxuICAgIHNlbGYuX2RiLmJhdGNoKGJ1ZmZlci5tYXAoZnVuY3Rpb24gKGQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZSAgICAgICAgICA6IGQudHlwZSB8fCBzZWxmLl9vcHRpb25zLnR5cGVcbiAgICAgICAgLCBrZXkgICAgICAgICAgIDogZC5rZXlcbiAgICAgICAgLCB2YWx1ZSAgICAgICAgIDogZC52YWx1ZVxuICAgICAgICAsIGtleUVuY29kaW5nICAgOiBkLmtleUVuY29kaW5nIHx8IHNlbGYuX29wdGlvbnMua2V5RW5jb2RpbmdcbiAgICAgICAgLCB2YWx1ZUVuY29kaW5nIDogZC52YWx1ZUVuY29kaW5nXG4gICAgICAgICAgICB8fCBkLmVuY29kaW5nXG4gICAgICAgICAgICB8fCBzZWxmLl9vcHRpb25zLnZhbHVlRW5jb2RpbmdcbiAgICAgIH1cbiAgICB9KSwgY2IpXG5cbiAgICBpZiAoc2VsZi5fd3JpdGVCbG9jaykge1xuICAgICAgc2VsZi5fd3JpdGVCbG9jayA9IGZhbHNlXG4gICAgICBzZWxmLmVtaXQoJ2RyYWluJylcbiAgICB9XG5cbiAgICAvLyBkb24ndCBhbGxvdyBjbG9zZSB1bnRpbCBjYWxsYmFjayBoYXMgcmV0dXJuZWRcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChzZWxmLl9lbmQgJiYgc2VsZi5fc3RhdHVzICE9ICdjbG9zZWQnKSB7XG4gICAgc2VsZi5fc3RhdHVzICA9ICdjbG9zZWQnXG4gICAgc2VsZi53cml0YWJsZSA9IGZhbHNlXG4gICAgc2VsZi5lbWl0KCdjbG9zZScpXG4gIH1cbn1cblxuV3JpdGVTdHJlYW0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICB2YXIga2V5ID0gZW50cnkucGF0aCB8fCBlbnRyeS5wcm9wcy5wYXRoXG4gICAgLCBzZWxmID0gdGhpc1xuXG4gIGlmICgha2V5KVxuICAgIHJldHVyblxuXG4gIGVudHJ5LnBpcGUoYmwoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHNlbGYud3JpdGFibGUgPSBmYWxzZVxuICAgICAgcmV0dXJuIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgfVxuXG4gICAgaWYgKHNlbGYuX29wdGlvbnMuZnN0cmVhbVJvb3QgJiZcbiAgICAgICAga2V5LmluZGV4T2Yoc2VsZi5fb3B0aW9ucy5mc3RyZWFtUm9vdCkgPiAtMSlcbiAgICAgIGtleSA9IGtleS5zdWJzdHIoc2VsZi5fb3B0aW9ucy5mc3RyZWFtUm9vdC5sZW5ndGggKyAxKVxuXG4gICAgc2VsZi53cml0ZSh7IGtleToga2V5LCB2YWx1ZTogZGF0YS5zbGljZSgwKSB9KVxuICB9KSlcbn1cblxuV3JpdGVTdHJlYW0ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJ0xldmVsVVAuV3JpdGVTdHJlYW0nXG59XG5cbm1vZHVsZS5leHBvcnRzID0gV3JpdGVTdHJlYW1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKEJ1ZmZlcil7XG52YXIgRHVwbGV4U3RyZWFtID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtJykuRHVwbGV4XG4gICwgdXRpbCAgICAgICAgID0gcmVxdWlyZSgndXRpbCcpXG5cbmZ1bmN0aW9uIEJ1ZmZlckxpc3QgKGNhbGxiYWNrKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXJMaXN0KSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlckxpc3QoY2FsbGJhY2spXG5cbiAgdGhpcy5fYnVmcyAgPSBbXVxuICB0aGlzLmxlbmd0aCA9IDBcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrXG5cbiAgICB2YXIgcGlwZXIgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soZXJyKVxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IG51bGxcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcylcblxuICAgIHRoaXMub24oJ3BpcGUnLCBmdW5jdGlvbiAoc3JjKSB7XG4gICAgICBzcmMub24oJ2Vycm9yJywgcGlwZXIpXG4gICAgfSlcbiAgICB0aGlzLm9uKCd1bnBpcGUnLCBmdW5jdGlvbiAoc3JjKSB7XG4gICAgICBzcmMucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgcGlwZXIpXG4gICAgfSlcbiAgfVxuICBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoY2FsbGJhY2spKVxuICAgIHRoaXMuYXBwZW5kKGNhbGxiYWNrKVxuICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrLmZvckVhY2goZnVuY3Rpb24gKGIpIHtcbiAgICAgIEJ1ZmZlci5pc0J1ZmZlcihiKSAmJiB0aGlzLmFwcGVuZChiKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIER1cGxleFN0cmVhbS5jYWxsKHRoaXMpXG59XG5cbnV0aWwuaW5oZXJpdHMoQnVmZmVyTGlzdCwgRHVwbGV4U3RyZWFtKVxuXG5CdWZmZXJMaXN0LnByb3RvdHlwZS5fb2Zmc2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICB2YXIgdG90ID0gMCwgaSA9IDAsIF90XG4gIGZvciAoOyBpIDwgdGhpcy5fYnVmcy5sZW5ndGg7IGkrKykge1xuICAgIF90ID0gdG90ICsgdGhpcy5fYnVmc1tpXS5sZW5ndGhcbiAgICBpZiAob2Zmc2V0IDwgX3QpXG4gICAgICByZXR1cm4gWyBpLCBvZmZzZXQgLSB0b3QgXVxuICAgIHRvdCA9IF90XG4gIH1cbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGJ1Zikge1xuICB0aGlzLl9idWZzLnB1c2goQnVmZmVyLmlzQnVmZmVyKGJ1ZikgPyBidWYgOiBuZXcgQnVmZmVyKGJ1ZikpXG4gIHRoaXMubGVuZ3RoICs9IGJ1Zi5sZW5ndGhcbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gKGJ1ZiwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gIHRoaXMuYXBwZW5kKGJ1ZilcbiAgaWYgKGNhbGxiYWNrKVxuICAgIGNhbGxiYWNrKClcbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICBpZiAoIXRoaXMubGVuZ3RoKVxuICAgIHJldHVybiB0aGlzLnB1c2gobnVsbClcbiAgc2l6ZSA9IE1hdGgubWluKHNpemUsIHRoaXMubGVuZ3RoKVxuICB0aGlzLnB1c2godGhpcy5zbGljZSgwLCBzaXplKSlcbiAgdGhpcy5jb25zdW1lKHNpemUpXG59XG5cbkJ1ZmZlckxpc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICBEdXBsZXhTdHJlYW0ucHJvdG90eXBlLmVuZC5jYWxsKHRoaXMsIGNodW5rKVxuXG4gIGlmICh0aGlzLl9jYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrKG51bGwsIHRoaXMuc2xpY2UoKSlcbiAgICB0aGlzLl9jYWxsYmFjayA9IG51bGxcbiAgfVxufVxuXG5CdWZmZXJMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgcmV0dXJuIHRoaXMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMSlbMF1cbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gdGhpcy5jb3B5KG51bGwsIDAsIHN0YXJ0LCBlbmQpXG59XG5cbkJ1ZmZlckxpc3QucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoZHN0LCBkc3RTdGFydCwgc3JjU3RhcnQsIHNyY0VuZCkge1xuICBpZiAodHlwZW9mIHNyY1N0YXJ0ICE9ICdudW1iZXInIHx8IHNyY1N0YXJ0IDwgMClcbiAgICBzcmNTdGFydCA9IDBcbiAgaWYgKHR5cGVvZiBzcmNFbmQgIT0gJ251bWJlcicgfHwgc3JjRW5kID4gdGhpcy5sZW5ndGgpXG4gICAgc3JjRW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHNyY1N0YXJ0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVybiBkc3QgfHwgbmV3IEJ1ZmZlcigwKVxuICBpZiAoc3JjRW5kIDw9IDApXG4gICAgcmV0dXJuIGRzdCB8fCBuZXcgQnVmZmVyKDApXG5cbiAgdmFyIGNvcHkgICA9ICEhZHN0XG4gICAgLCBvZmYgICAgPSB0aGlzLl9vZmZzZXQoc3JjU3RhcnQpXG4gICAgLCBsZW4gICAgPSBzcmNFbmQgLSBzcmNTdGFydFxuICAgICwgYnl0ZXMgID0gbGVuXG4gICAgLCBidWZvZmYgPSAoY29weSAmJiBkc3RTdGFydCkgfHwgMFxuICAgICwgc3RhcnQgID0gb2ZmWzFdXG4gICAgLCBsXG4gICAgLCBpXG5cbiAgLy8gY29weS9zbGljZSBldmVyeXRoaW5nXG4gIGlmIChzcmNTdGFydCA9PT0gMCAmJiBzcmNFbmQgPT0gdGhpcy5sZW5ndGgpIHtcbiAgICBpZiAoIWNvcHkpIC8vIHNsaWNlLCBqdXN0IHJldHVybiBhIGZ1bGwgY29uY2F0XG4gICAgICByZXR1cm4gQnVmZmVyLmNvbmNhdCh0aGlzLl9idWZzKVxuXG4gICAgLy8gY29weSwgbmVlZCB0byBjb3B5IGluZGl2aWR1YWwgYnVmZmVyc1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9idWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9idWZzW2ldLmNvcHkoZHN0LCBidWZvZmYpXG4gICAgICBidWZvZmYgKz0gdGhpcy5fYnVmc1tpXS5sZW5ndGhcbiAgICB9XG5cbiAgICByZXR1cm4gZHN0XG4gIH1cblxuICAvLyBlYXN5LCBjaGVhcCBjYXNlIHdoZXJlIGl0J3MgYSBzdWJzZXQgb2Ygb25lIG9mIHRoZSBidWZmZXJzXG4gIGlmIChieXRlcyA8PSB0aGlzLl9idWZzW29mZlswXV0ubGVuZ3RoIC0gc3RhcnQpIHtcbiAgICByZXR1cm4gY29weVxuICAgICAgPyB0aGlzLl9idWZzW29mZlswXV0uY29weShkc3QsIGRzdFN0YXJ0LCBzdGFydCwgc3RhcnQgKyBieXRlcylcbiAgICAgIDogdGhpcy5fYnVmc1tvZmZbMF1dLnNsaWNlKHN0YXJ0LCBzdGFydCArIGJ5dGVzKVxuICB9XG5cbiAgaWYgKCFjb3B5KSAvLyBhIHNsaWNlLCB3ZSBuZWVkIHNvbWV0aGluZyB0byBjb3B5IGluIHRvXG4gICAgZHN0ID0gbmV3IEJ1ZmZlcihsZW4pXG5cbiAgZm9yIChpID0gb2ZmWzBdOyBpIDwgdGhpcy5fYnVmcy5sZW5ndGg7IGkrKykge1xuICAgIGwgPSB0aGlzLl9idWZzW2ldLmxlbmd0aCAtIHN0YXJ0XG5cbiAgICBpZiAoYnl0ZXMgPiBsKSB7XG4gICAgICB0aGlzLl9idWZzW2ldLmNvcHkoZHN0LCBidWZvZmYsIHN0YXJ0KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9idWZzW2ldLmNvcHkoZHN0LCBidWZvZmYsIHN0YXJ0LCBzdGFydCArIGJ5dGVzKVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBidWZvZmYgKz0gbFxuICAgIGJ5dGVzIC09IGxcblxuICAgIGlmIChzdGFydClcbiAgICAgIHN0YXJ0ID0gMFxuICB9XG5cbiAgcmV0dXJuIGRzdFxufVxuXG5CdWZmZXJMaXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gdGhpcy5zbGljZShzdGFydCwgZW5kKS50b1N0cmluZyhlbmNvZGluZylcbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuY29uc3VtZSA9IGZ1bmN0aW9uIChieXRlcykge1xuICB3aGlsZSAodGhpcy5fYnVmcy5sZW5ndGgpIHtcbiAgICBpZiAoYnl0ZXMgPiB0aGlzLl9idWZzWzBdLmxlbmd0aCkge1xuICAgICAgYnl0ZXMgLT0gdGhpcy5fYnVmc1swXS5sZW5ndGhcbiAgICAgIHRoaXMubGVuZ3RoIC09IHRoaXMuX2J1ZnNbMF0ubGVuZ3RoXG4gICAgICB0aGlzLl9idWZzLnNoaWZ0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnVmc1swXSA9IHRoaXMuX2J1ZnNbMF0uc2xpY2UoYnl0ZXMpXG4gICAgICB0aGlzLmxlbmd0aCAtPSBieXRlc1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuZHVwbGljYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSA9IDBcbiAgICAsIGNvcHkgPSBuZXcgQnVmZmVyTGlzdCgpXG5cbiAgZm9yICg7IGkgPCB0aGlzLl9idWZzLmxlbmd0aDsgaSsrKVxuICAgIGNvcHkuYXBwZW5kKHRoaXMuX2J1ZnNbaV0pXG5cbiAgcmV0dXJuIGNvcHlcbn1cblxuQnVmZmVyTGlzdC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYnVmcy5sZW5ndGggPSAwO1xuICB0aGlzLmxlbmd0aCA9IDA7XG4gIHRoaXMucHVzaChudWxsKTtcbn1cblxuOyhmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRob2RzID0ge1xuICAgICAgJ3JlYWREb3VibGVCRScgOiA4XG4gICAgLCAncmVhZERvdWJsZUxFJyA6IDhcbiAgICAsICdyZWFkRmxvYXRCRScgIDogNFxuICAgICwgJ3JlYWRGbG9hdExFJyAgOiA0XG4gICAgLCAncmVhZEludDMyQkUnICA6IDRcbiAgICAsICdyZWFkSW50MzJMRScgIDogNFxuICAgICwgJ3JlYWRVSW50MzJCRScgOiA0XG4gICAgLCAncmVhZFVJbnQzMkxFJyA6IDRcbiAgICAsICdyZWFkSW50MTZCRScgIDogMlxuICAgICwgJ3JlYWRJbnQxNkxFJyAgOiAyXG4gICAgLCAncmVhZFVJbnQxNkJFJyA6IDJcbiAgICAsICdyZWFkVUludDE2TEUnIDogMlxuICAgICwgJ3JlYWRJbnQ4JyAgICAgOiAxXG4gICAgLCAncmVhZFVJbnQ4JyAgICA6IDFcbiAgfVxuXG4gIGZvciAodmFyIG0gaW4gbWV0aG9kcykge1xuICAgIChmdW5jdGlvbiAobSkge1xuICAgICAgQnVmZmVyTGlzdC5wcm90b3R5cGVbbV0gPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgbWV0aG9kc1ttXSlbbV0oMClcbiAgICAgIH1cbiAgICB9KG0pKVxuICB9XG59KCkpXG5cbm1vZHVsZS5leHBvcnRzID0gQnVmZmVyTGlzdFxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLEJ1ZmZlcil7XG52YXIgdXRpbCAgICAgICAgICAgICAgPSByZXF1aXJlKCd1dGlsJylcbiAgLCBBYnN0cmFjdExldmVsRE9XTiA9IHJlcXVpcmUoJ2Fic3RyYWN0LWxldmVsZG93bicpLkFic3RyYWN0TGV2ZWxET1dOXG5cbmZ1bmN0aW9uIERlZmVycmVkTGV2ZWxET1dOIChsb2NhdGlvbikge1xuICBBYnN0cmFjdExldmVsRE9XTi5jYWxsKHRoaXMsIHR5cGVvZiBsb2NhdGlvbiA9PSAnc3RyaW5nJyA/IGxvY2F0aW9uIDogJycpIC8vIG9wdGlvbmFsIGxvY2F0aW9uLCB3aG8gY2FyZXM/XG4gIHRoaXMuX2RiICAgICAgICAgPSB1bmRlZmluZWRcbiAgdGhpcy5fb3BlcmF0aW9ucyA9IFtdXG59XG5cbnV0aWwuaW5oZXJpdHMoRGVmZXJyZWRMZXZlbERPV04sIEFic3RyYWN0TGV2ZWxET1dOKVxuXG4vLyBjYWxsZWQgYnkgTGV2ZWxVUCB3aGVuIHdlIGhhdmUgYSByZWFsIERCIHRvIHRha2UgaXRzIHBsYWNlXG5EZWZlcnJlZExldmVsRE9XTi5wcm90b3R5cGUuc2V0RGIgPSBmdW5jdGlvbiAoZGIpIHtcbiAgdGhpcy5fZGIgPSBkYlxuICB0aGlzLl9vcGVyYXRpb25zLmZvckVhY2goZnVuY3Rpb24gKG9wKSB7XG4gICAgZGJbb3AubWV0aG9kXS5hcHBseShkYiwgb3AuYXJncylcbiAgfSlcbn1cblxuRGVmZXJyZWRMZXZlbERPV04ucHJvdG90eXBlLl9vcGVuID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKVxufVxuXG4vLyBxdWV1ZSBhIG5ldyBkZWZlcnJlZCBvcGVyYXRpb25cbkRlZmVycmVkTGV2ZWxET1dOLnByb3RvdHlwZS5fb3BlcmF0aW9uID0gZnVuY3Rpb24gKG1ldGhvZCwgYXJncykge1xuICBpZiAodGhpcy5fZGIpXG4gICAgcmV0dXJuIHRoaXMuX2RiW21ldGhvZF0uYXBwbHkodGhpcy5fZGIsIGFyZ3MpXG4gIHRoaXMuX29wZXJhdGlvbnMucHVzaCh7IG1ldGhvZDogbWV0aG9kLCBhcmdzOiBhcmdzIH0pXG59XG5cbi8vIGRlZmVycmFibGVzXG4ncHV0IGdldCBkZWwgYmF0Y2ggYXBwcm94aW1hdGVTaXplJy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgRGVmZXJyZWRMZXZlbERPV04ucHJvdG90eXBlWydfJyArIG1dID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29wZXJhdGlvbihtLCBhcmd1bWVudHMpXG4gIH1cbn0pXG5cbkRlZmVycmVkTGV2ZWxET1dOLnByb3RvdHlwZS5faXNCdWZmZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBkb24ndCBuZWVkIHRvIGltcGxlbWVudCB0aGlzIGFzIExldmVsVVAncyBSZWFkU3RyZWFtIGNoZWNrcyBmb3IgJ3JlYWR5JyBzdGF0ZVxuRGVmZXJyZWRMZXZlbERPV04ucHJvdG90eXBlLl9pdGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGltcGxlbWVudGVkJylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZWZlcnJlZExldmVsRE9XTlxuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcikiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKFwiL1VzZXJzL3NldGh2aW5jZW50L3dvcmtzcGFjZS9tb3NzeW93bC9waXp6YS1jbGlja2VyL25vZGVfbW9kdWxlcy9sZXZlbC1qcy9ub2RlX21vZHVsZXMvYWJzdHJhY3QtbGV2ZWxkb3duL2Fic3RyYWN0LWxldmVsZG93bi5qc1wiKSIsInZhciBwcnIgPSByZXF1aXJlKCdwcnInKVxuXG5mdW5jdGlvbiBpbml0ICh0eXBlLCBtZXNzYWdlLCBjYXVzZSkge1xuICBwcnIodGhpcywge1xuICAgICAgdHlwZSAgICA6IHR5cGVcbiAgICAsIG5hbWUgICAgOiB0eXBlXG4gICAgICAvLyBjYW4gYmUgcGFzc2VkIGp1c3QgYSAnY2F1c2UnXG4gICAgLCBjYXVzZSAgIDogdHlwZW9mIG1lc3NhZ2UgIT0gJ3N0cmluZycgPyBtZXNzYWdlIDogY2F1c2VcbiAgICAsIG1lc3NhZ2UgOiAhIW1lc3NhZ2UgJiYgdHlwZW9mIG1lc3NhZ2UgIT0gJ3N0cmluZycgPyBtZXNzYWdlLm1lc3NhZ2UgOiBtZXNzYWdlXG5cbiAgfSwgJ2V3cicpXG59XG5cbi8vIGdlbmVyaWMgcHJvdG90eXBlLCBub3QgaW50ZW5kZWQgdG8gYmUgYWN0dWFsbHkgdXNlZCAtIGhlbHBmdWwgZm9yIGBpbnN0YW5jZW9mYFxuZnVuY3Rpb24gQ3VzdG9tRXJyb3IgKG1lc3NhZ2UsIGNhdXNlKSB7XG4gIEVycm9yLmNhbGwodGhpcylcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGFyZ3VtZW50cy5jYWxsZWUpXG4gIGluaXQuY2FsbCh0aGlzLCAnQ3VzdG9tRXJyb3InLCBtZXNzYWdlLCBjYXVzZSlcbn1cblxuQ3VzdG9tRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yKClcblxuZnVuY3Rpb24gY3JlYXRlRXJyb3IgKGVycm5vLCB0eXBlLCBwcm90bykge1xuICB2YXIgZXJyID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGNhdXNlKSB7XG4gICAgaW5pdC5jYWxsKHRoaXMsIHR5cGUsIG1lc3NhZ2UsIGNhdXNlKVxuICAgIC8vVE9ETzogdGhlIHNwZWNpZmljaXR5IGhlcmUgaXMgc3R1cGlkLCBlcnJubyBzaG91bGQgYmUgYXZhaWxhYmxlIGV2ZXJ5d2hlcmVcbiAgICBpZiAodHlwZSA9PSAnRmlsZXN5c3RlbUVycm9yJykge1xuICAgICAgdGhpcy5jb2RlICAgID0gdGhpcy5jYXVzZS5jb2RlXG4gICAgICB0aGlzLnBhdGggICAgPSB0aGlzLmNhdXNlLnBhdGhcbiAgICAgIHRoaXMuZXJybm8gICA9IHRoaXMuY2F1c2UuZXJybm9cbiAgICAgIHRoaXMubWVzc2FnZSA9XG4gICAgICAgIChlcnJuby5lcnJub1t0aGlzLmNhdXNlLmVycm5vXVxuICAgICAgICAgID8gZXJybm8uZXJybm9bdGhpcy5jYXVzZS5lcnJub10uZGVzY3JpcHRpb25cbiAgICAgICAgICA6IHRoaXMuY2F1c2UubWVzc2FnZSlcbiAgICAgICAgKyAodGhpcy5jYXVzZS5wYXRoID8gJyBbJyArIHRoaXMuY2F1c2UucGF0aCArICddJyA6ICcnKVxuICAgIH1cbiAgICBFcnJvci5jYWxsKHRoaXMpXG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgYXJndW1lbnRzLmNhbGxlZSlcbiAgfVxuICBlcnIucHJvdG90eXBlID0gISFwcm90byA/IG5ldyBwcm90bygpIDogbmV3IEN1c3RvbUVycm9yKClcbiAgcmV0dXJuIGVyclxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlcnJubykge1xuICB2YXIgY2UgPSBmdW5jdGlvbiAodHlwZSwgcHJvdG8pIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoZXJybm8sIHR5cGUsIHByb3RvKVxuICB9XG4gIHJldHVybiB7XG4gICAgICBDdXN0b21FcnJvciAgICAgOiBDdXN0b21FcnJvclxuICAgICwgRmlsZXN5c3RlbUVycm9yIDogY2UoJ0ZpbGVzeXN0ZW1FcnJvcicpXG4gICAgLCBjcmVhdGVFcnJvciAgICAgOiBjZVxuICB9XG59XG4iLCJ2YXIgYWxsID0gbW9kdWxlLmV4cG9ydHMuYWxsID0gW1xuIHtcbiAgXCJlcnJub1wiOiAtMSxcbiAgXCJjb2RlXCI6IFwiVU5LTk9XTlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwidW5rbm93biBlcnJvclwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMCxcbiAgXCJjb2RlXCI6IFwiT0tcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcInN1Y2Nlc3NcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDEsXG4gIFwiY29kZVwiOiBcIkVPRlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZW5kIG9mIGZpbGVcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDIsXG4gIFwiY29kZVwiOiBcIkVBRERSSU5GT1wiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZ2V0YWRkcmluZm8gZXJyb3JcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDMsXG4gIFwiY29kZVwiOiBcIkVBQ0NFU1wiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwicGVybWlzc2lvbiBkZW5pZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDQsXG4gIFwiY29kZVwiOiBcIkVBR0FJTlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwicmVzb3VyY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGVcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDUsXG4gIFwiY29kZVwiOiBcIkVBRERSSU5VU0VcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImFkZHJlc3MgYWxyZWFkeSBpbiB1c2VcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDYsXG4gIFwiY29kZVwiOiBcIkVBRERSTk9UQVZBSUxcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImFkZHJlc3Mgbm90IGF2YWlsYWJsZVwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNyxcbiAgXCJjb2RlXCI6IFwiRUFGTk9TVVBQT1JUXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJhZGRyZXNzIGZhbWlseSBub3Qgc3VwcG9ydGVkXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiA4LFxuICBcImNvZGVcIjogXCJFQUxSRUFEWVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiY29ubmVjdGlvbiBhbHJlYWR5IGluIHByb2dyZXNzXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiA5LFxuICBcImNvZGVcIjogXCJFQkFERlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiYmFkIGZpbGUgZGVzY3JpcHRvclwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMTAsXG4gIFwiY29kZVwiOiBcIkVCVVNZXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJyZXNvdXJjZSBidXN5IG9yIGxvY2tlZFwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMTEsXG4gIFwiY29kZVwiOiBcIkVDT05OQUJPUlRFRFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwic29mdHdhcmUgY2F1c2VkIGNvbm5lY3Rpb24gYWJvcnRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDEyLFxuICBcImNvZGVcIjogXCJFQ09OTlJFRlVTRURcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImNvbm5lY3Rpb24gcmVmdXNlZFwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMTMsXG4gIFwiY29kZVwiOiBcIkVDT05OUkVTRVRcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImNvbm5lY3Rpb24gcmVzZXQgYnkgcGVlclwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMTQsXG4gIFwiY29kZVwiOiBcIkVERVNUQUREUlJFUVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZFwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMTUsXG4gIFwiY29kZVwiOiBcIkVGQVVMVFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiYmFkIGFkZHJlc3MgaW4gc3lzdGVtIGNhbGwgYXJndW1lbnRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDE2LFxuICBcImNvZGVcIjogXCJFSE9TVFVOUkVBQ0hcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImhvc3QgaXMgdW5yZWFjaGFibGVcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDE3LFxuICBcImNvZGVcIjogXCJFSU5UUlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiaW50ZXJydXB0ZWQgc3lzdGVtIGNhbGxcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDE4LFxuICBcImNvZGVcIjogXCJFSU5WQUxcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImludmFsaWQgYXJndW1lbnRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDE5LFxuICBcImNvZGVcIjogXCJFSVNDT05OXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJzb2NrZXQgaXMgYWxyZWFkeSBjb25uZWN0ZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDIwLFxuICBcImNvZGVcIjogXCJFTUZJTEVcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcInRvbyBtYW55IG9wZW4gZmlsZXNcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDIxLFxuICBcImNvZGVcIjogXCJFTVNHU0laRVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwibWVzc2FnZSB0b28gbG9uZ1wiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMjIsXG4gIFwiY29kZVwiOiBcIkVORVRET1dOXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJuZXR3b3JrIGlzIGRvd25cIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDIzLFxuICBcImNvZGVcIjogXCJFTkVUVU5SRUFDSFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwibmV0d29yayBpcyB1bnJlYWNoYWJsZVwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMjQsXG4gIFwiY29kZVwiOiBcIkVORklMRVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZmlsZSB0YWJsZSBvdmVyZmxvd1wiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMjUsXG4gIFwiY29kZVwiOiBcIkVOT0JVRlNcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIm5vIGJ1ZmZlciBzcGFjZSBhdmFpbGFibGVcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDI2LFxuICBcImNvZGVcIjogXCJFTk9NRU1cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIm5vdCBlbm91Z2ggbWVtb3J5XCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAyNyxcbiAgXCJjb2RlXCI6IFwiRU5PVERJUlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwibm90IGEgZGlyZWN0b3J5XCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAyOCxcbiAgXCJjb2RlXCI6IFwiRUlTRElSXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJpbGxlZ2FsIG9wZXJhdGlvbiBvbiBhIGRpcmVjdG9yeVwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogMjksXG4gIFwiY29kZVwiOiBcIkVOT05FVFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwibWFjaGluZSBpcyBub3Qgb24gdGhlIG5ldHdvcmtcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDMxLFxuICBcImNvZGVcIjogXCJFTk9UQ09OTlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwic29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDMyLFxuICBcImNvZGVcIjogXCJFTk9UU09DS1wiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwic29ja2V0IG9wZXJhdGlvbiBvbiBub24tc29ja2V0XCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAzMyxcbiAgXCJjb2RlXCI6IFwiRU5PVFNVUFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwib3BlcmF0aW9uIG5vdCBzdXBwb3J0ZWQgb24gc29ja2V0XCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAzNCxcbiAgXCJjb2RlXCI6IFwiRU5PRU5UXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJubyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5XCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAzNSxcbiAgXCJjb2RlXCI6IFwiRU5PU1lTXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJmdW5jdGlvbiBub3QgaW1wbGVtZW50ZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDM2LFxuICBcImNvZGVcIjogXCJFUElQRVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiYnJva2VuIHBpcGVcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDM3LFxuICBcImNvZGVcIjogXCJFUFJPVE9cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcInByb3RvY29sIGVycm9yXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAzOCxcbiAgXCJjb2RlXCI6IFwiRVBST1RPTk9TVVBQT1JUXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJwcm90b2NvbCBub3Qgc3VwcG9ydGVkXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiAzOSxcbiAgXCJjb2RlXCI6IFwiRVBST1RPVFlQRVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwicHJvdG9jb2wgd3JvbmcgdHlwZSBmb3Igc29ja2V0XCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiA0MCxcbiAgXCJjb2RlXCI6IFwiRVRJTUVET1VUXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJjb25uZWN0aW9uIHRpbWVkIG91dFwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNDEsXG4gIFwiY29kZVwiOiBcIkVDSEFSU0VUXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJpbnZhbGlkIFVuaWNvZGUgY2hhcmFjdGVyXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiA0MixcbiAgXCJjb2RlXCI6IFwiRUFJRkFNTk9TVVBQT1JUXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJhZGRyZXNzIGZhbWlseSBmb3IgaG9zdG5hbWUgbm90IHN1cHBvcnRlZFwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNDQsXG4gIFwiY29kZVwiOiBcIkVBSVNFUlZJQ0VcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcInNlcnZuYW1lIG5vdCBzdXBwb3J0ZWQgZm9yIGFpX3NvY2t0eXBlXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiA0NSxcbiAgXCJjb2RlXCI6IFwiRUFJU09DS1RZUEVcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImFpX3NvY2t0eXBlIG5vdCBzdXBwb3J0ZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDQ2LFxuICBcImNvZGVcIjogXCJFU0hVVERPV05cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImNhbm5vdCBzZW5kIGFmdGVyIHRyYW5zcG9ydCBlbmRwb2ludCBzaHV0ZG93blwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNDcsXG4gIFwiY29kZVwiOiBcIkVFWElTVFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZmlsZSBhbHJlYWR5IGV4aXN0c1wiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNDgsXG4gIFwiY29kZVwiOiBcIkVTUkNIXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJubyBzdWNoIHByb2Nlc3NcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDQ5LFxuICBcImNvZGVcIjogXCJFTkFNRVRPT0xPTkdcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIm5hbWUgdG9vIGxvbmdcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDUwLFxuICBcImNvZGVcIjogXCJFUEVSTVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwib3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDUxLFxuICBcImNvZGVcIjogXCJFTE9PUFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwidG9vIG1hbnkgc3ltYm9saWMgbGlua3MgZW5jb3VudGVyZWRcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDUyLFxuICBcImNvZGVcIjogXCJFWERFVlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiY3Jvc3MtZGV2aWNlIGxpbmsgbm90IHBlcm1pdHRlZFwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNTMsXG4gIFwiY29kZVwiOiBcIkVOT1RFTVBUWVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZGlyZWN0b3J5IG5vdCBlbXB0eVwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNTQsXG4gIFwiY29kZVwiOiBcIkVOT1NQQ1wiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwibm8gc3BhY2UgbGVmdCBvbiBkZXZpY2VcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDU1LFxuICBcImNvZGVcIjogXCJFSU9cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImkvbyBlcnJvclwiXG4gfSxcbiB7XG4gIFwiZXJybm9cIjogNTYsXG4gIFwiY29kZVwiOiBcIkVST0ZTXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJyZWFkLW9ubHkgZmlsZSBzeXN0ZW1cIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDU3LFxuICBcImNvZGVcIjogXCJFTk9ERVZcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIm5vIHN1Y2ggZGV2aWNlXCJcbiB9LFxuIHtcbiAgXCJlcnJub1wiOiA1OCxcbiAgXCJjb2RlXCI6IFwiRVNQSVBFXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJpbnZhbGlkIHNlZWtcIlxuIH0sXG4ge1xuICBcImVycm5vXCI6IDU5LFxuICBcImNvZGVcIjogXCJFQ0FOQ0VMRURcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIm9wZXJhdGlvbiBjYW5jZWxlZFwiXG4gfVxuXVxuXG5cbm1vZHVsZS5leHBvcnRzLmVycm5vID0ge1xuICAgICctMSc6IGFsbFswXVxuICAsICcwJzogYWxsWzFdXG4gICwgJzEnOiBhbGxbMl1cbiAgLCAnMic6IGFsbFszXVxuICAsICczJzogYWxsWzRdXG4gICwgJzQnOiBhbGxbNV1cbiAgLCAnNSc6IGFsbFs2XVxuICAsICc2JzogYWxsWzddXG4gICwgJzcnOiBhbGxbOF1cbiAgLCAnOCc6IGFsbFs5XVxuICAsICc5JzogYWxsWzEwXVxuICAsICcxMCc6IGFsbFsxMV1cbiAgLCAnMTEnOiBhbGxbMTJdXG4gICwgJzEyJzogYWxsWzEzXVxuICAsICcxMyc6IGFsbFsxNF1cbiAgLCAnMTQnOiBhbGxbMTVdXG4gICwgJzE1JzogYWxsWzE2XVxuICAsICcxNic6IGFsbFsxN11cbiAgLCAnMTcnOiBhbGxbMThdXG4gICwgJzE4JzogYWxsWzE5XVxuICAsICcxOSc6IGFsbFsyMF1cbiAgLCAnMjAnOiBhbGxbMjFdXG4gICwgJzIxJzogYWxsWzIyXVxuICAsICcyMic6IGFsbFsyM11cbiAgLCAnMjMnOiBhbGxbMjRdXG4gICwgJzI0JzogYWxsWzI1XVxuICAsICcyNSc6IGFsbFsyNl1cbiAgLCAnMjYnOiBhbGxbMjddXG4gICwgJzI3JzogYWxsWzI4XVxuICAsICcyOCc6IGFsbFsyOV1cbiAgLCAnMjknOiBhbGxbMzBdXG4gICwgJzMxJzogYWxsWzMxXVxuICAsICczMic6IGFsbFszMl1cbiAgLCAnMzMnOiBhbGxbMzNdXG4gICwgJzM0JzogYWxsWzM0XVxuICAsICczNSc6IGFsbFszNV1cbiAgLCAnMzYnOiBhbGxbMzZdXG4gICwgJzM3JzogYWxsWzM3XVxuICAsICczOCc6IGFsbFszOF1cbiAgLCAnMzknOiBhbGxbMzldXG4gICwgJzQwJzogYWxsWzQwXVxuICAsICc0MSc6IGFsbFs0MV1cbiAgLCAnNDInOiBhbGxbNDJdXG4gICwgJzQ0JzogYWxsWzQzXVxuICAsICc0NSc6IGFsbFs0NF1cbiAgLCAnNDYnOiBhbGxbNDVdXG4gICwgJzQ3JzogYWxsWzQ2XVxuICAsICc0OCc6IGFsbFs0N11cbiAgLCAnNDknOiBhbGxbNDhdXG4gICwgJzUwJzogYWxsWzQ5XVxuICAsICc1MSc6IGFsbFs1MF1cbiAgLCAnNTInOiBhbGxbNTFdXG4gICwgJzUzJzogYWxsWzUyXVxuICAsICc1NCc6IGFsbFs1M11cbiAgLCAnNTUnOiBhbGxbNTRdXG4gICwgJzU2JzogYWxsWzU1XVxuICAsICc1Nyc6IGFsbFs1Nl1cbiAgLCAnNTgnOiBhbGxbNTddXG4gICwgJzU5JzogYWxsWzU4XVxufVxuXG5cbm1vZHVsZS5leHBvcnRzLmNvZGUgPSB7XG4gICAgJ1VOS05PV04nOiBhbGxbMF1cbiAgLCAnT0snOiBhbGxbMV1cbiAgLCAnRU9GJzogYWxsWzJdXG4gICwgJ0VBRERSSU5GTyc6IGFsbFszXVxuICAsICdFQUNDRVMnOiBhbGxbNF1cbiAgLCAnRUFHQUlOJzogYWxsWzVdXG4gICwgJ0VBRERSSU5VU0UnOiBhbGxbNl1cbiAgLCAnRUFERFJOT1RBVkFJTCc6IGFsbFs3XVxuICAsICdFQUZOT1NVUFBPUlQnOiBhbGxbOF1cbiAgLCAnRUFMUkVBRFknOiBhbGxbOV1cbiAgLCAnRUJBREYnOiBhbGxbMTBdXG4gICwgJ0VCVVNZJzogYWxsWzExXVxuICAsICdFQ09OTkFCT1JURUQnOiBhbGxbMTJdXG4gICwgJ0VDT05OUkVGVVNFRCc6IGFsbFsxM11cbiAgLCAnRUNPTk5SRVNFVCc6IGFsbFsxNF1cbiAgLCAnRURFU1RBRERSUkVRJzogYWxsWzE1XVxuICAsICdFRkFVTFQnOiBhbGxbMTZdXG4gICwgJ0VIT1NUVU5SRUFDSCc6IGFsbFsxN11cbiAgLCAnRUlOVFInOiBhbGxbMThdXG4gICwgJ0VJTlZBTCc6IGFsbFsxOV1cbiAgLCAnRUlTQ09OTic6IGFsbFsyMF1cbiAgLCAnRU1GSUxFJzogYWxsWzIxXVxuICAsICdFTVNHU0laRSc6IGFsbFsyMl1cbiAgLCAnRU5FVERPV04nOiBhbGxbMjNdXG4gICwgJ0VORVRVTlJFQUNIJzogYWxsWzI0XVxuICAsICdFTkZJTEUnOiBhbGxbMjVdXG4gICwgJ0VOT0JVRlMnOiBhbGxbMjZdXG4gICwgJ0VOT01FTSc6IGFsbFsyN11cbiAgLCAnRU5PVERJUic6IGFsbFsyOF1cbiAgLCAnRUlTRElSJzogYWxsWzI5XVxuICAsICdFTk9ORVQnOiBhbGxbMzBdXG4gICwgJ0VOT1RDT05OJzogYWxsWzMxXVxuICAsICdFTk9UU09DSyc6IGFsbFszMl1cbiAgLCAnRU5PVFNVUCc6IGFsbFszM11cbiAgLCAnRU5PRU5UJzogYWxsWzM0XVxuICAsICdFTk9TWVMnOiBhbGxbMzVdXG4gICwgJ0VQSVBFJzogYWxsWzM2XVxuICAsICdFUFJPVE8nOiBhbGxbMzddXG4gICwgJ0VQUk9UT05PU1VQUE9SVCc6IGFsbFszOF1cbiAgLCAnRVBST1RPVFlQRSc6IGFsbFszOV1cbiAgLCAnRVRJTUVET1VUJzogYWxsWzQwXVxuICAsICdFQ0hBUlNFVCc6IGFsbFs0MV1cbiAgLCAnRUFJRkFNTk9TVVBQT1JUJzogYWxsWzQyXVxuICAsICdFQUlTRVJWSUNFJzogYWxsWzQzXVxuICAsICdFQUlTT0NLVFlQRSc6IGFsbFs0NF1cbiAgLCAnRVNIVVRET1dOJzogYWxsWzQ1XVxuICAsICdFRVhJU1QnOiBhbGxbNDZdXG4gICwgJ0VTUkNIJzogYWxsWzQ3XVxuICAsICdFTkFNRVRPT0xPTkcnOiBhbGxbNDhdXG4gICwgJ0VQRVJNJzogYWxsWzQ5XVxuICAsICdFTE9PUCc6IGFsbFs1MF1cbiAgLCAnRVhERVYnOiBhbGxbNTFdXG4gICwgJ0VOT1RFTVBUWSc6IGFsbFs1Ml1cbiAgLCAnRU5PU1BDJzogYWxsWzUzXVxuICAsICdFSU8nOiBhbGxbNTRdXG4gICwgJ0VST0ZTJzogYWxsWzU1XVxuICAsICdFTk9ERVYnOiBhbGxbNTZdXG4gICwgJ0VTUElQRSc6IGFsbFs1N11cbiAgLCAnRUNBTkNFTEVEJzogYWxsWzU4XVxufVxuXG5cbm1vZHVsZS5leHBvcnRzLmN1c3RvbSA9IHJlcXVpcmUoXCIuL2N1c3RvbVwiKShtb2R1bGUuZXhwb3J0cylcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZSA9IG1vZHVsZS5leHBvcnRzLmN1c3RvbS5jcmVhdGVFcnJvciIsIi8qIVxuICAqIHByclxuICAqIChjKSAyMDEzIFJvZCBWYWdnIDxyb2RAdmFnZy5vcmc+XG4gICogaHR0cHM6Ly9naXRodWIuY29tL3J2YWdnL3ByclxuICAqIExpY2Vuc2U6IE1JVFxuICAqL1xuXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZVxuICAgIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdwcnInLCB0aGlzLCBmdW5jdGlvbigpIHtcblxuICB2YXIgc2V0UHJvcGVydHkgPSB0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09ICdmdW5jdGlvbidcbiAgICAgID8gZnVuY3Rpb24gKG9iaiwga2V5LCBvcHRpb25zKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCBvcHRpb25zKVxuICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiAob2JqLCBrZXksIG9wdGlvbnMpIHsgLy8gPCBlczVcbiAgICAgICAgICBvYmpba2V5XSA9IG9wdGlvbnMudmFsdWVcbiAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgIH1cblxuICAgICwgbWFrZU9wdGlvbnMgPSBmdW5jdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9vID0gdHlwZW9mIG9wdGlvbnMgPT0gJ29iamVjdCdcbiAgICAgICAgICAsIG9zID0gIW9vICYmIHR5cGVvZiBvcHRpb25zID09ICdzdHJpbmcnXG4gICAgICAgICAgLCBvcCA9IGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvb1xuICAgICAgICAgICAgICAgID8gISFvcHRpb25zW3BdXG4gICAgICAgICAgICAgICAgOiBvc1xuICAgICAgICAgICAgICAgICAgPyBvcHRpb25zLmluZGV4T2YocFswXSkgPiAtMVxuICAgICAgICAgICAgICAgICAgOiBmYWxzZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlICAgOiBvcCgnZW51bWVyYWJsZScpXG4gICAgICAgICAgLCBjb25maWd1cmFibGUgOiBvcCgnY29uZmlndXJhYmxlJylcbiAgICAgICAgICAsIHdyaXRhYmxlICAgICA6IG9wKCd3cml0YWJsZScpXG4gICAgICAgICAgLCB2YWx1ZSAgICAgICAgOiB2YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHByciA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGtcblxuICAgICAgICBvcHRpb25zID0gbWFrZU9wdGlvbnModmFsdWUsIG9wdGlvbnMpXG5cbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBmb3IgKGsgaW4ga2V5KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoa2V5LCBrKSkge1xuICAgICAgICAgICAgICBvcHRpb25zLnZhbHVlID0ga2V5W2tdXG4gICAgICAgICAgICAgIHNldFByb3BlcnR5KG9iaiwgaywgb3B0aW9ucylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldFByb3BlcnR5KG9iaiwga2V5LCBvcHRpb25zKVxuICAgICAgfVxuXG4gIHJldHVybiBwcnJcbn0pIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBhIGR1cGxleCBzdHJlYW0gaXMganVzdCBhIHN0cmVhbSB0aGF0IGlzIGJvdGggcmVhZGFibGUgYW5kIHdyaXRhYmxlLlxuLy8gU2luY2UgSlMgZG9lc24ndCBoYXZlIG11bHRpcGxlIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UsIHRoaXMgY2xhc3Ncbi8vIHByb3RvdHlwYWxseSBpbmhlcml0cyBmcm9tIFJlYWRhYmxlLCBhbmQgdGhlbiBwYXJhc2l0aWNhbGx5IGZyb21cbi8vIFdyaXRhYmxlLlxuXG5tb2R1bGUuZXhwb3J0cyA9IER1cGxleDtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgcmV0dXJuIGtleXM7XG59XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBSZWFkYWJsZSA9IHJlcXVpcmUoJy4vX3N0cmVhbV9yZWFkYWJsZScpO1xudmFyIFdyaXRhYmxlID0gcmVxdWlyZSgnLi9fc3RyZWFtX3dyaXRhYmxlJyk7XG5cbnV0aWwuaW5oZXJpdHMoRHVwbGV4LCBSZWFkYWJsZSk7XG5cbmZvckVhY2gob2JqZWN0S2V5cyhXcml0YWJsZS5wcm90b3R5cGUpLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgaWYgKCFEdXBsZXgucHJvdG90eXBlW21ldGhvZF0pXG4gICAgRHVwbGV4LnByb3RvdHlwZVttZXRob2RdID0gV3JpdGFibGUucHJvdG90eXBlW21ldGhvZF07XG59KTtcblxuZnVuY3Rpb24gRHVwbGV4KG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIER1cGxleCkpXG4gICAgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRhYmxlID09PSBmYWxzZSlcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy53cml0YWJsZSA9PT0gZmFsc2UpXG4gICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuXG4gIHRoaXMuYWxsb3dIYWxmT3BlbiA9IHRydWU7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYWxsb3dIYWxmT3BlbiA9PT0gZmFsc2UpXG4gICAgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG59XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBpZiB3ZSBhbGxvdyBoYWxmLW9wZW4gc3RhdGUsIG9yIGlmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLFxuICAvLyB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5hbGxvd0hhbGZPcGVuIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpXG4gICAgcmV0dXJuO1xuXG4gIC8vIG5vIG1vcmUgZGF0YSBjYW4gYmUgd3JpdHRlbi5cbiAgLy8gQnV0IGFsbG93IG1vcmUgd3JpdGVzIHRvIGhhcHBlbiBpbiB0aGlzIHRpY2suXG4gIHByb2Nlc3MubmV4dFRpY2sodGhpcy5lbmQuYmluZCh0aGlzKSk7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2ggKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIGEgcGFzc3Rocm91Z2ggc3RyZWFtLlxuLy8gYmFzaWNhbGx5IGp1c3QgdGhlIG1vc3QgbWluaW1hbCBzb3J0IG9mIFRyYW5zZm9ybSBzdHJlYW0uXG4vLyBFdmVyeSB3cml0dGVuIGNodW5rIGdldHMgb3V0cHV0IGFzLWlzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhc3NUaHJvdWdoO1xuXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9fc3RyZWFtX3RyYW5zZm9ybScpO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnV0aWwuaW5oZXJpdHMoUGFzc1Rocm91Z2gsIFRyYW5zZm9ybSk7XG5cbmZ1bmN0aW9uIFBhc3NUaHJvdWdoKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBhc3NUaHJvdWdoKSlcbiAgICByZXR1cm4gbmV3IFBhc3NUaHJvdWdoKG9wdGlvbnMpO1xuXG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xufVxuXG5QYXNzVGhyb3VnaC5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgY2IobnVsbCwgY2h1bmspO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFkYWJsZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuUmVhZGFibGUuUmVhZGFibGVTdGF0ZSA9IFJlYWRhYmxlU3RhdGU7XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbmlmICghRUUubGlzdGVuZXJDb3VudCkgRUUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJzKHR5cGUpLmxlbmd0aDtcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBTdHJpbmdEZWNvZGVyO1xuXG51dGlsLmluaGVyaXRzKFJlYWRhYmxlLCBTdHJlYW0pO1xuXG5mdW5jdGlvbiBSZWFkYWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggaXQgc3RvcHMgY2FsbGluZyBfcmVhZCgpIHRvIGZpbGwgdGhlIGJ1ZmZlclxuICAvLyBOb3RlOiAwIGlzIGEgdmFsaWQgdmFsdWUsIG1lYW5zIFwiZG9uJ3QgY2FsbCBfcmVhZCBwcmVlbXB0aXZlbHkgZXZlclwiXG4gIHZhciBod20gPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IChod20gfHwgaHdtID09PSAwKSA/IGh3bSA6IDE2ICogMTAyNDtcblxuICAvLyBjYXN0IHRvIGludHMuXG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IH5+dGhpcy5oaWdoV2F0ZXJNYXJrO1xuXG4gIHRoaXMuYnVmZmVyID0gW107XG4gIHRoaXMubGVuZ3RoID0gMDtcbiAgdGhpcy5waXBlcyA9IG51bGw7XG4gIHRoaXMucGlwZXNDb3VudCA9IDA7XG4gIHRoaXMuZmxvd2luZyA9IGZhbHNlO1xuICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gIHRoaXMuZW5kRW1pdHRlZCA9IGZhbHNlO1xuICB0aGlzLnJlYWRpbmcgPSBmYWxzZTtcblxuICAvLyBJbiBzdHJlYW1zIHRoYXQgbmV2ZXIgaGF2ZSBhbnkgZGF0YSwgYW5kIGRvIHB1c2gobnVsbCkgcmlnaHQgYXdheSxcbiAgLy8gdGhlIGNvbnN1bWVyIGNhbiBtaXNzIHRoZSAnZW5kJyBldmVudCBpZiB0aGV5IGRvIHNvbWUgSS9PIGJlZm9yZVxuICAvLyBjb25zdW1pbmcgdGhlIHN0cmVhbS4gIFNvLCB3ZSBkb24ndCBlbWl0KCdlbmQnKSB1bnRpbCBzb21lIHJlYWRpbmdcbiAgLy8gaGFwcGVucy5cbiAgdGhpcy5jYWxsZWRSZWFkID0gZmFsc2U7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgb253cml0ZSBjYiBpcyBjYWxsZWQgaW1tZWRpYXRlbHksXG4gIC8vIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY3Vhc2UgYW55XG4gIC8vIGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHdyaXRlIGNhbGwuXG4gIHRoaXMuc3luYyA9IHRydWU7XG5cbiAgLy8gd2hlbmV2ZXIgd2UgcmV0dXJuIG51bGwsIHRoZW4gd2Ugc2V0IGEgZmxhZyB0byBzYXlcbiAgLy8gdGhhdCB3ZSdyZSBhd2FpdGluZyBhICdyZWFkYWJsZScgZXZlbnQgZW1pc3Npb24uXG4gIHRoaXMubmVlZFJlYWRhYmxlID0gZmFsc2U7XG4gIHRoaXMuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG4gIHRoaXMucmVhZGFibGVMaXN0ZW5pbmcgPSBmYWxzZTtcblxuXG4gIC8vIG9iamVjdCBzdHJlYW0gZmxhZy4gVXNlZCB0byBtYWtlIHJlYWQobikgaWdub3JlIG4gYW5kIHRvXG4gIC8vIG1ha2UgYWxsIHRoZSBidWZmZXIgbWVyZ2luZyBhbmQgbGVuZ3RoIGNoZWNrcyBnbyBhd2F5XG4gIHRoaXMub2JqZWN0TW9kZSA9ICEhb3B0aW9ucy5vYmplY3RNb2RlO1xuXG4gIC8vIENyeXB0byBpcyBraW5kIG9mIG9sZCBhbmQgY3J1c3R5LiAgSGlzdG9yaWNhbGx5LCBpdHMgZGVmYXVsdCBzdHJpbmdcbiAgLy8gZW5jb2RpbmcgaXMgJ2JpbmFyeScgc28gd2UgaGF2ZSB0byBtYWtlIHRoaXMgY29uZmlndXJhYmxlLlxuICAvLyBFdmVyeXRoaW5nIGVsc2UgaW4gdGhlIHVuaXZlcnNlIHVzZXMgJ3V0ZjgnLCB0aG91Z2guXG4gIHRoaXMuZGVmYXVsdEVuY29kaW5nID0gb3B0aW9ucy5kZWZhdWx0RW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIC8vIHdoZW4gcGlwaW5nLCB3ZSBvbmx5IGNhcmUgYWJvdXQgJ3JlYWRhYmxlJyBldmVudHMgdGhhdCBoYXBwZW5cbiAgLy8gYWZ0ZXIgcmVhZCgpaW5nIGFsbCB0aGUgYnl0ZXMgYW5kIG5vdCBnZXR0aW5nIGFueSBwdXNoYmFjay5cbiAgdGhpcy5yYW5PdXQgPSBmYWxzZTtcblxuICAvLyB0aGUgbnVtYmVyIG9mIHdyaXRlcnMgdGhhdCBhcmUgYXdhaXRpbmcgYSBkcmFpbiBldmVudCBpbiAucGlwZSgpc1xuICB0aGlzLmF3YWl0RHJhaW4gPSAwO1xuXG4gIC8vIGlmIHRydWUsIGEgbWF5YmVSZWFkTW9yZSBoYXMgYmVlbiBzY2hlZHVsZWRcbiAgdGhpcy5yZWFkaW5nTW9yZSA9IGZhbHNlO1xuXG4gIHRoaXMuZGVjb2RlciA9IG51bGw7XG4gIHRoaXMuZW5jb2RpbmcgPSBudWxsO1xuICBpZiAob3B0aW9ucy5lbmNvZGluZykge1xuICAgIGlmICghU3RyaW5nRGVjb2RlcilcbiAgICAgIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2Rlci8nKS5TdHJpbmdEZWNvZGVyO1xuICAgIHRoaXMuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIHRoaXMuZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSlcbiAgICByZXR1cm4gbmV3IFJlYWRhYmxlKG9wdGlvbnMpO1xuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUgPSBuZXcgUmVhZGFibGVTdGF0ZShvcHRpb25zLCB0aGlzKTtcblxuICAvLyBsZWdhY3lcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG5cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5cbi8vIE1hbnVhbGx5IHNob3ZlIHNvbWV0aGluZyBpbnRvIHRoZSByZWFkKCkgYnVmZmVyLlxuLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIGhpZ2hXYXRlck1hcmsgaGFzIG5vdCBiZWVuIGhpdCB5ZXQsXG4vLyBzaW1pbGFyIHRvIGhvdyBXcml0YWJsZS53cml0ZSgpIHJldHVybnMgdHJ1ZSBpZiB5b3Ugc2hvdWxkXG4vLyB3cml0ZSgpIHNvbWUgbW9yZS5cblJlYWRhYmxlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ3N0cmluZycgJiYgIXN0YXRlLm9iamVjdE1vZGUpIHtcbiAgICBlbmNvZGluZyA9IGVuY29kaW5nIHx8IHN0YXRlLmRlZmF1bHRFbmNvZGluZztcbiAgICBpZiAoZW5jb2RpbmcgIT09IHN0YXRlLmVuY29kaW5nKSB7XG4gICAgICBjaHVuayA9IG5ldyBCdWZmZXIoY2h1bmssIGVuY29kaW5nKTtcbiAgICAgIGVuY29kaW5nID0gJyc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcywgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgZmFsc2UpO1xufTtcblxuLy8gVW5zaGlmdCBzaG91bGQgKmFsd2F5cyogYmUgc29tZXRoaW5nIGRpcmVjdGx5IG91dCBvZiByZWFkKClcblJlYWRhYmxlLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgcmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcywgc3RhdGUsIGNodW5rLCAnJywgdHJ1ZSk7XG59O1xuXG5mdW5jdGlvbiByZWFkYWJsZUFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgYWRkVG9Gcm9udCkge1xuICB2YXIgZXIgPSBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKTtcbiAgaWYgKGVyKSB7XG4gICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICB9IGVsc2UgaWYgKGNodW5rID09PSBudWxsIHx8IGNodW5rID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgaWYgKCFzdGF0ZS5lbmRlZClcbiAgICAgIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSk7XG4gIH0gZWxzZSBpZiAoc3RhdGUub2JqZWN0TW9kZSB8fCBjaHVuayAmJiBjaHVuay5sZW5ndGggPiAwKSB7XG4gICAgaWYgKHN0YXRlLmVuZGVkICYmICFhZGRUb0Zyb250KSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcignc3RyZWFtLnB1c2goKSBhZnRlciBFT0YnKTtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGUpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUuZW5kRW1pdHRlZCAmJiBhZGRUb0Zyb250KSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcignc3RyZWFtLnVuc2hpZnQoKSBhZnRlciBlbmQgZXZlbnQnKTtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhYWRkVG9Gcm9udCAmJiAhZW5jb2RpbmcpXG4gICAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgYnVmZmVyIGluZm8uXG4gICAgICBzdGF0ZS5sZW5ndGggKz0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG4gICAgICBpZiAoYWRkVG9Gcm9udCkge1xuICAgICAgICBzdGF0ZS5idWZmZXIudW5zaGlmdChjaHVuayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLm5lZWRSZWFkYWJsZSlcbiAgICAgICAgZW1pdFJlYWRhYmxlKHN0cmVhbSk7XG5cbiAgICAgIG1heWJlUmVhZE1vcmUoc3RyZWFtLCBzdGF0ZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCFhZGRUb0Zyb250KSB7XG4gICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG5lZWRNb3JlRGF0YShzdGF0ZSk7XG59XG5cblxuXG4vLyBpZiBpdCdzIHBhc3QgdGhlIGhpZ2ggd2F0ZXIgbWFyaywgd2UgY2FuIHB1c2ggaW4gc29tZSBtb3JlLlxuLy8gQWxzbywgaWYgd2UgaGF2ZSBubyBkYXRhIHlldCwgd2UgY2FuIHN0YW5kIHNvbWVcbi8vIG1vcmUgYnl0ZXMuICBUaGlzIGlzIHRvIHdvcmsgYXJvdW5kIGNhc2VzIHdoZXJlIGh3bT0wLFxuLy8gc3VjaCBhcyB0aGUgcmVwbC4gIEFsc28sIGlmIHRoZSBwdXNoKCkgdHJpZ2dlcmVkIGFcbi8vIHJlYWRhYmxlIGV2ZW50LCBhbmQgdGhlIHVzZXIgY2FsbGVkIHJlYWQobGFyZ2VOdW1iZXIpIHN1Y2ggdGhhdFxuLy8gbmVlZFJlYWRhYmxlIHdhcyBzZXQsIHRoZW4gd2Ugb3VnaHQgdG8gcHVzaCBtb3JlLCBzbyB0aGF0IGFub3RoZXJcbi8vICdyZWFkYWJsZScgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQuXG5mdW5jdGlvbiBuZWVkTW9yZURhdGEoc3RhdGUpIHtcbiAgcmV0dXJuICFzdGF0ZS5lbmRlZCAmJlxuICAgICAgICAgKHN0YXRlLm5lZWRSZWFkYWJsZSB8fFxuICAgICAgICAgIHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmsgfHxcbiAgICAgICAgICBzdGF0ZS5sZW5ndGggPT09IDApO1xufVxuXG4vLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cblJlYWRhYmxlLnByb3RvdHlwZS5zZXRFbmNvZGluZyA9IGZ1bmN0aW9uKGVuYykge1xuICBpZiAoIVN0cmluZ0RlY29kZXIpXG4gICAgU3RyaW5nRGVjb2RlciA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyLycpLlN0cmluZ0RlY29kZXI7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5jb2RpbmcgPSBlbmM7XG59O1xuXG4vLyBEb24ndCByYWlzZSB0aGUgaHdtID4gMTI4TUJcbnZhciBNQVhfSFdNID0gMHg4MDAwMDA7XG5mdW5jdGlvbiByb3VuZFVwVG9OZXh0UG93ZXJPZjIobikge1xuICBpZiAobiA+PSBNQVhfSFdNKSB7XG4gICAgbiA9IE1BWF9IV007XG4gIH0gZWxzZSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgMlxuICAgIG4tLTtcbiAgICBmb3IgKHZhciBwID0gMTsgcCA8IDMyOyBwIDw8PSAxKSBuIHw9IG4gPj4gcDtcbiAgICBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGhvd011Y2hUb1JlYWQobiwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZClcbiAgICByZXR1cm4gMDtcblxuICBpZiAoc3RhdGUub2JqZWN0TW9kZSlcbiAgICByZXR1cm4gbiA9PT0gMCA/IDAgOiAxO1xuXG4gIGlmIChuID09PSBudWxsIHx8IGlzTmFOKG4pKSB7XG4gICAgLy8gb25seSBmbG93IG9uZSBidWZmZXIgYXQgYSB0aW1lXG4gICAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIHJldHVybiBzdGF0ZS5idWZmZXJbMF0ubGVuZ3RoO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gIH1cblxuICBpZiAobiA8PSAwKVxuICAgIHJldHVybiAwO1xuXG4gIC8vIElmIHdlJ3JlIGFza2luZyBmb3IgbW9yZSB0aGFuIHRoZSB0YXJnZXQgYnVmZmVyIGxldmVsLFxuICAvLyB0aGVuIHJhaXNlIHRoZSB3YXRlciBtYXJrLiAgQnVtcCB1cCB0byB0aGUgbmV4dCBoaWdoZXN0XG4gIC8vIHBvd2VyIG9mIDIsIHRvIHByZXZlbnQgaW5jcmVhc2luZyBpdCBleGNlc3NpdmVseSBpbiB0aW55XG4gIC8vIGFtb3VudHMuXG4gIGlmIChuID4gc3RhdGUuaGlnaFdhdGVyTWFyaylcbiAgICBzdGF0ZS5oaWdoV2F0ZXJNYXJrID0gcm91bmRVcFRvTmV4dFBvd2VyT2YyKG4pO1xuXG4gIC8vIGRvbid0IGhhdmUgdGhhdCBtdWNoLiAgcmV0dXJuIG51bGwsIHVubGVzcyB3ZSd2ZSBlbmRlZC5cbiAgaWYgKG4gPiBzdGF0ZS5sZW5ndGgpIHtcbiAgICBpZiAoIXN0YXRlLmVuZGVkKSB7XG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gc3RhdGUubGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIG47XG59XG5cbi8vIHlvdSBjYW4gb3ZlcnJpZGUgZWl0aGVyIHRoaXMgbWV0aG9kLCBvciB0aGUgYXN5bmMgX3JlYWQobikgYmVsb3cuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKG4pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgc3RhdGUuY2FsbGVkUmVhZCA9IHRydWU7XG4gIHZhciBuT3JpZyA9IG47XG4gIHZhciByZXQ7XG5cbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuID4gMClcbiAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcblxuICAvLyBpZiB3ZSdyZSBkb2luZyByZWFkKDApIHRvIHRyaWdnZXIgYSByZWFkYWJsZSBldmVudCwgYnV0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhIGJ1bmNoIG9mIGRhdGEgaW4gdGhlIGJ1ZmZlciwgdGhlbiBqdXN0IHRyaWdnZXJcbiAgLy8gdGhlICdyZWFkYWJsZScgZXZlbnQgYW5kIG1vdmUgb24uXG4gIGlmIChuID09PSAwICYmXG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgJiZcbiAgICAgIChzdGF0ZS5sZW5ndGggPj0gc3RhdGUuaGlnaFdhdGVyTWFyayB8fCBzdGF0ZS5lbmRlZCkpIHtcbiAgICBlbWl0UmVhZGFibGUodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBuID0gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSk7XG5cbiAgLy8gaWYgd2UndmUgZW5kZWQsIGFuZCB3ZSdyZSBub3cgY2xlYXIsIHRoZW4gZmluaXNoIGl0IHVwLlxuICBpZiAobiA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkge1xuICAgIHJldCA9IG51bGw7XG5cbiAgICAvLyBJbiBjYXNlcyB3aGVyZSB0aGUgZGVjb2RlciBkaWQgbm90IHJlY2VpdmUgZW5vdWdoIGRhdGFcbiAgICAvLyB0byBwcm9kdWNlIGEgZnVsbCBjaHVuaywgdGhlbiBpbW1lZGlhdGVseSByZWNlaXZlZCBhblxuICAgIC8vIEVPRiwgc3RhdGUuYnVmZmVyIHdpbGwgY29udGFpbiBbPEJ1ZmZlciA+LCA8QnVmZmVyIDAwIC4uLj5dLlxuICAgIC8vIGhvd011Y2hUb1JlYWQgd2lsbCBzZWUgdGhpcyBhbmQgY29lcmNlIHRoZSBhbW91bnQgdG9cbiAgICAvLyByZWFkIHRvIHplcm8gKGJlY2F1c2UgaXQncyBsb29raW5nIGF0IHRoZSBsZW5ndGggb2YgdGhlXG4gICAgLy8gZmlyc3QgPEJ1ZmZlciA+IGluIHN0YXRlLmJ1ZmZlciksIGFuZCB3ZSdsbCBlbmQgdXAgaGVyZS5cbiAgICAvL1xuICAgIC8vIFRoaXMgY2FuIG9ubHkgaGFwcGVuIHZpYSBzdGF0ZS5kZWNvZGVyIC0tIG5vIG90aGVyIHZlbnVlXG4gICAgLy8gZXhpc3RzIGZvciBwdXNoaW5nIGEgemVyby1sZW5ndGggY2h1bmsgaW50byBzdGF0ZS5idWZmZXJcbiAgICAvLyBhbmQgdHJpZ2dlcmluZyB0aGlzIGJlaGF2aW9yLiBJbiB0aGlzIGNhc2UsIHdlIHJldHVybiBvdXJcbiAgICAvLyByZW1haW5pbmcgZGF0YSBhbmQgZW5kIHRoZSBzdHJlYW0sIGlmIGFwcHJvcHJpYXRlLlxuICAgIGlmIChzdGF0ZS5sZW5ndGggPiAwICYmIHN0YXRlLmRlY29kZXIpIHtcbiAgICAgIHJldCA9IGZyb21MaXN0KG4sIHN0YXRlKTtcbiAgICAgIHN0YXRlLmxlbmd0aCAtPSByZXQubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDApXG4gICAgICBlbmRSZWFkYWJsZSh0aGlzKTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBBbGwgdGhlIGFjdHVhbCBjaHVuayBnZW5lcmF0aW9uIGxvZ2ljIG5lZWRzIHRvIGJlXG4gIC8vICpiZWxvdyogdGhlIGNhbGwgdG8gX3JlYWQuICBUaGUgcmVhc29uIGlzIHRoYXQgaW4gY2VydGFpblxuICAvLyBzeW50aGV0aWMgc3RyZWFtIGNhc2VzLCBzdWNoIGFzIHBhc3N0aHJvdWdoIHN0cmVhbXMsIF9yZWFkXG4gIC8vIG1heSBiZSBhIGNvbXBsZXRlbHkgc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoaWNoIG1heSBjaGFuZ2VcbiAgLy8gdGhlIHN0YXRlIG9mIHRoZSByZWFkIGJ1ZmZlciwgcHJvdmlkaW5nIGVub3VnaCBkYXRhIHdoZW5cbiAgLy8gYmVmb3JlIHRoZXJlIHdhcyAqbm90KiBlbm91Z2guXG4gIC8vXG4gIC8vIFNvLCB0aGUgc3RlcHMgYXJlOlxuICAvLyAxLiBGaWd1cmUgb3V0IHdoYXQgdGhlIHN0YXRlIG9mIHRoaW5ncyB3aWxsIGJlIGFmdGVyIHdlIGRvXG4gIC8vIGEgcmVhZCBmcm9tIHRoZSBidWZmZXIuXG4gIC8vXG4gIC8vIDIuIElmIHRoYXQgcmVzdWx0aW5nIHN0YXRlIHdpbGwgdHJpZ2dlciBhIF9yZWFkLCB0aGVuIGNhbGwgX3JlYWQuXG4gIC8vIE5vdGUgdGhhdCB0aGlzIG1heSBiZSBhc3luY2hyb25vdXMsIG9yIHN5bmNocm9ub3VzLiAgWWVzLCBpdCBpc1xuICAvLyBkZWVwbHkgdWdseSB0byB3cml0ZSBBUElzIHRoaXMgd2F5LCBidXQgdGhhdCBzdGlsbCBkb2Vzbid0IG1lYW5cbiAgLy8gdGhhdCB0aGUgUmVhZGFibGUgY2xhc3Mgc2hvdWxkIGJlaGF2ZSBpbXByb3Blcmx5LCBhcyBzdHJlYW1zIGFyZVxuICAvLyBkZXNpZ25lZCB0byBiZSBzeW5jL2FzeW5jIGFnbm9zdGljLlxuICAvLyBUYWtlIG5vdGUgaWYgdGhlIF9yZWFkIGNhbGwgaXMgc3luYyBvciBhc3luYyAoaWUsIGlmIHRoZSByZWFkIGNhbGxcbiAgLy8gaGFzIHJldHVybmVkIHlldCksIHNvIHRoYXQgd2Uga25vdyB3aGV0aGVyIG9yIG5vdCBpdCdzIHNhZmUgdG8gZW1pdFxuICAvLyAncmVhZGFibGUnIGV0Yy5cbiAgLy9cbiAgLy8gMy4gQWN0dWFsbHkgcHVsbCB0aGUgcmVxdWVzdGVkIGNodW5rcyBvdXQgb2YgdGhlIGJ1ZmZlciBhbmQgcmV0dXJuLlxuXG4gIC8vIGlmIHdlIG5lZWQgYSByZWFkYWJsZSBldmVudCwgdGhlbiB3ZSBuZWVkIHRvIGRvIHNvbWUgcmVhZGluZy5cbiAgdmFyIGRvUmVhZCA9IHN0YXRlLm5lZWRSZWFkYWJsZTtcblxuICAvLyBpZiB3ZSBjdXJyZW50bHkgaGF2ZSBsZXNzIHRoYW4gdGhlIGhpZ2hXYXRlck1hcmssIHRoZW4gYWxzbyByZWFkIHNvbWVcbiAgaWYgKHN0YXRlLmxlbmd0aCAtIG4gPD0gc3RhdGUuaGlnaFdhdGVyTWFyaylcbiAgICBkb1JlYWQgPSB0cnVlO1xuXG4gIC8vIGhvd2V2ZXIsIGlmIHdlJ3ZlIGVuZGVkLCB0aGVuIHRoZXJlJ3Mgbm8gcG9pbnQsIGFuZCBpZiB3ZSdyZSBhbHJlYWR5XG4gIC8vIHJlYWRpbmcsIHRoZW4gaXQncyB1bm5lY2Vzc2FyeS5cbiAgaWYgKHN0YXRlLmVuZGVkIHx8IHN0YXRlLnJlYWRpbmcpXG4gICAgZG9SZWFkID0gZmFsc2U7XG5cbiAgaWYgKGRvUmVhZCkge1xuICAgIHN0YXRlLnJlYWRpbmcgPSB0cnVlO1xuICAgIHN0YXRlLnN5bmMgPSB0cnVlO1xuICAgIC8vIGlmIHRoZSBsZW5ndGggaXMgY3VycmVudGx5IHplcm8sIHRoZW4gd2UgKm5lZWQqIGEgcmVhZGFibGUgZXZlbnQuXG4gICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMClcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgLy8gY2FsbCBpbnRlcm5hbCByZWFkIG1ldGhvZFxuICAgIHRoaXMuX3JlYWQoc3RhdGUuaGlnaFdhdGVyTWFyayk7XG4gICAgc3RhdGUuc3luYyA9IGZhbHNlO1xuICB9XG5cbiAgLy8gSWYgX3JlYWQgY2FsbGVkIGl0cyBjYWxsYmFjayBzeW5jaHJvbm91c2x5LCB0aGVuIGByZWFkaW5nYFxuICAvLyB3aWxsIGJlIGZhbHNlLCBhbmQgd2UgbmVlZCB0byByZS1ldmFsdWF0ZSBob3cgbXVjaCBkYXRhIHdlXG4gIC8vIGNhbiByZXR1cm4gdG8gdGhlIHVzZXIuXG4gIGlmIChkb1JlYWQgJiYgIXN0YXRlLnJlYWRpbmcpXG4gICAgbiA9IGhvd011Y2hUb1JlYWQobk9yaWcsIHN0YXRlKTtcblxuICBpZiAobiA+IDApXG4gICAgcmV0ID0gZnJvbUxpc3Qobiwgc3RhdGUpO1xuICBlbHNlXG4gICAgcmV0ID0gbnVsbDtcblxuICBpZiAocmV0ID09PSBudWxsKSB7XG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICBuID0gMDtcbiAgfVxuXG4gIHN0YXRlLmxlbmd0aCAtPSBuO1xuXG4gIC8vIElmIHdlIGhhdmUgbm90aGluZyBpbiB0aGUgYnVmZmVyLCB0aGVuIHdlIHdhbnQgdG8ga25vd1xuICAvLyBhcyBzb29uIGFzIHdlICpkbyogZ2V0IHNvbWV0aGluZyBpbnRvIHRoZSBidWZmZXIuXG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgIXN0YXRlLmVuZGVkKVxuICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG5cbiAgLy8gSWYgd2UgaGFwcGVuZWQgdG8gcmVhZCgpIGV4YWN0bHkgdGhlIHJlbWFpbmluZyBhbW91bnQgaW4gdGhlXG4gIC8vIGJ1ZmZlciwgYW5kIHRoZSBFT0YgaGFzIGJlZW4gc2VlbiBhdCB0aGlzIHBvaW50LCB0aGVuIG1ha2Ugc3VyZVxuICAvLyB0aGF0IHdlIGVtaXQgJ2VuZCcgb24gdGhlIHZlcnkgbmV4dCB0aWNrLlxuICBpZiAoc3RhdGUuZW5kZWQgJiYgIXN0YXRlLmVuZEVtaXR0ZWQgJiYgc3RhdGUubGVuZ3RoID09PSAwKVxuICAgIGVuZFJlYWRhYmxlKHRoaXMpO1xuXG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKSB7XG4gIHZhciBlciA9IG51bGw7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGNodW5rKSAmJlxuICAgICAgJ3N0cmluZycgIT09IHR5cGVvZiBjaHVuayAmJlxuICAgICAgY2h1bmsgIT09IG51bGwgJiZcbiAgICAgIGNodW5rICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgZXIgPSBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rJyk7XG4gIH1cbiAgcmV0dXJuIGVyO1xufVxuXG5cbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuXG4gIC8vIGlmIHdlJ3ZlIGVuZGVkIGFuZCB3ZSBoYXZlIHNvbWUgZGF0YSBsZWZ0LCB0aGVuIGVtaXRcbiAgLy8gJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICBpZiAoc3RhdGUubGVuZ3RoID4gMClcbiAgICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbiAgZWxzZVxuICAgIGVuZFJlYWRhYmxlKHN0cmVhbSk7XG59XG5cbi8vIERvbid0IGVtaXQgcmVhZGFibGUgcmlnaHQgYXdheSBpbiBzeW5jIG1vZGUsIGJlY2F1c2UgdGhpcyBjYW4gdHJpZ2dlclxuLy8gYW5vdGhlciByZWFkKCkgY2FsbCA9PiBzdGFjayBvdmVyZmxvdy4gIFRoaXMgd2F5LCBpdCBtaWdodCB0cmlnZ2VyXG4vLyBhIG5leHRUaWNrIHJlY3Vyc2lvbiB3YXJuaW5nLCBidXQgdGhhdCdzIG5vdCBzbyBiYWQuXG5mdW5jdGlvbiBlbWl0UmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgc3RhdGUubmVlZFJlYWRhYmxlID0gZmFsc2U7XG4gIGlmIChzdGF0ZS5lbWl0dGVkUmVhZGFibGUpXG4gICAgcmV0dXJuO1xuXG4gIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IHRydWU7XG4gIGlmIChzdGF0ZS5zeW5jKVxuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICBlbWl0UmVhZGFibGVfKHN0cmVhbSk7XG4gICAgfSk7XG4gIGVsc2VcbiAgICBlbWl0UmVhZGFibGVfKHN0cmVhbSk7XG59XG5cbmZ1bmN0aW9uIGVtaXRSZWFkYWJsZV8oc3RyZWFtKSB7XG4gIHN0cmVhbS5lbWl0KCdyZWFkYWJsZScpO1xufVxuXG5cbi8vIGF0IHRoaXMgcG9pbnQsIHRoZSB1c2VyIGhhcyBwcmVzdW1hYmx5IHNlZW4gdGhlICdyZWFkYWJsZScgZXZlbnQsXG4vLyBhbmQgY2FsbGVkIHJlYWQoKSB0byBjb25zdW1lIHNvbWUgZGF0YS4gIHRoYXQgbWF5IGhhdmUgdHJpZ2dlcmVkXG4vLyBpbiB0dXJuIGFub3RoZXIgX3JlYWQobikgY2FsbCwgaW4gd2hpY2ggY2FzZSByZWFkaW5nID0gdHJ1ZSBpZlxuLy8gaXQncyBpbiBwcm9ncmVzcy5cbi8vIEhvd2V2ZXIsIGlmIHdlJ3JlIG5vdCBlbmRlZCwgb3IgcmVhZGluZywgYW5kIHRoZSBsZW5ndGggPCBod20sXG4vLyB0aGVuIGdvIGFoZWFkIGFuZCB0cnkgdG8gcmVhZCBzb21lIG1vcmUgcHJlZW1wdGl2ZWx5LlxuZnVuY3Rpb24gbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucmVhZGluZ01vcmUpIHtcbiAgICBzdGF0ZS5yZWFkaW5nTW9yZSA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIGxlbiA9IHN0YXRlLmxlbmd0aDtcbiAgd2hpbGUgKCFzdGF0ZS5yZWFkaW5nICYmICFzdGF0ZS5mbG93aW5nICYmICFzdGF0ZS5lbmRlZCAmJlxuICAgICAgICAgc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyaykge1xuICAgIHN0cmVhbS5yZWFkKDApO1xuICAgIGlmIChsZW4gPT09IHN0YXRlLmxlbmd0aClcbiAgICAgIC8vIGRpZG4ndCBnZXQgYW55IGRhdGEsIHN0b3Agc3Bpbm5pbmcuXG4gICAgICBicmVhaztcbiAgICBlbHNlXG4gICAgICBsZW4gPSBzdGF0ZS5sZW5ndGg7XG4gIH1cbiAgc3RhdGUucmVhZGluZ01vcmUgPSBmYWxzZTtcbn1cblxuLy8gYWJzdHJhY3QgbWV0aG9kLiAgdG8gYmUgb3ZlcnJpZGRlbiBpbiBzcGVjaWZpYyBpbXBsZW1lbnRhdGlvbiBjbGFzc2VzLlxuLy8gY2FsbCBjYihlciwgZGF0YSkgd2hlcmUgZGF0YSBpcyA8PSBuIGluIGxlbmd0aC5cbi8vIGZvciB2aXJ0dWFsIChub24tc3RyaW5nLCBub24tYnVmZmVyKSBzdHJlYW1zLCBcImxlbmd0aFwiIGlzIHNvbWV3aGF0XG4vLyBhcmJpdHJhcnksIGFuZCBwZXJoYXBzIG5vdCB2ZXJ5IG1lYW5pbmdmdWwuXG5SZWFkYWJsZS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpKTtcbn07XG5cblJlYWRhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgcGlwZU9wdHMpIHtcbiAgdmFyIHNyYyA9IHRoaXM7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgc3dpdGNoIChzdGF0ZS5waXBlc0NvdW50KSB7XG4gICAgY2FzZSAwOlxuICAgICAgc3RhdGUucGlwZXMgPSBkZXN0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAxOlxuICAgICAgc3RhdGUucGlwZXMgPSBbc3RhdGUucGlwZXMsIGRlc3RdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXRlLnBpcGVzLnB1c2goZGVzdCk7XG4gICAgICBicmVhaztcbiAgfVxuICBzdGF0ZS5waXBlc0NvdW50ICs9IDE7XG5cbiAgdmFyIGRvRW5kID0gKCFwaXBlT3B0cyB8fCBwaXBlT3B0cy5lbmQgIT09IGZhbHNlKSAmJlxuICAgICAgICAgICAgICBkZXN0ICE9PSBwcm9jZXNzLnN0ZG91dCAmJlxuICAgICAgICAgICAgICBkZXN0ICE9PSBwcm9jZXNzLnN0ZGVycjtcblxuICB2YXIgZW5kRm4gPSBkb0VuZCA/IG9uZW5kIDogY2xlYW51cDtcbiAgaWYgKHN0YXRlLmVuZEVtaXR0ZWQpXG4gICAgcHJvY2Vzcy5uZXh0VGljayhlbmRGbik7XG4gIGVsc2VcbiAgICBzcmMub25jZSgnZW5kJywgZW5kRm4pO1xuXG4gIGRlc3Qub24oJ3VucGlwZScsIG9udW5waXBlKTtcbiAgZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUpIHtcbiAgICBpZiAocmVhZGFibGUgIT09IHNyYykgcmV0dXJuO1xuICAgIGNsZWFudXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgLy8gY2xlYW51cCBldmVudCBoYW5kbGVycyBvbmNlIHRoZSBwaXBlIGlzIGJyb2tlblxuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgb25maW5pc2gpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2RyYWluJywgb25kcmFpbik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCd1bnBpcGUnLCBvbnVucGlwZSk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGVhbnVwKTtcblxuICAgIC8vIGlmIHRoZSByZWFkZXIgaXMgd2FpdGluZyBmb3IgYSBkcmFpbiBldmVudCBmcm9tIHRoaXNcbiAgICAvLyBzcGVjaWZpYyB3cml0ZXIsIHRoZW4gaXQgd291bGQgY2F1c2UgaXQgdG8gbmV2ZXIgc3RhcnRcbiAgICAvLyBmbG93aW5nIGFnYWluLlxuICAgIC8vIFNvLCBpZiB0aGlzIGlzIGF3YWl0aW5nIGEgZHJhaW4sIHRoZW4gd2UganVzdCBjYWxsIGl0IG5vdy5cbiAgICAvLyBJZiB3ZSBkb24ndCBrbm93LCB0aGVuIGFzc3VtZSB0aGF0IHdlIGFyZSB3YWl0aW5nIGZvciBvbmUuXG4gICAgaWYgKCFkZXN0Ll93cml0YWJsZVN0YXRlIHx8IGRlc3QuX3dyaXRhYmxlU3RhdGUubmVlZERyYWluKVxuICAgICAgb25kcmFpbigpO1xuICB9XG5cbiAgLy8gaWYgdGhlIGRlc3QgaGFzIGFuIGVycm9yLCB0aGVuIHN0b3AgcGlwaW5nIGludG8gaXQuXG4gIC8vIGhvd2V2ZXIsIGRvbid0IHN1cHByZXNzIHRoZSB0aHJvd2luZyBiZWhhdmlvciBmb3IgdGhpcy5cbiAgZnVuY3Rpb24gb25lcnJvcihlcikge1xuICAgIHVucGlwZSgpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgaWYgKEVFLmxpc3RlbmVyQ291bnQoZGVzdCwgJ2Vycm9yJykgPT09IDApXG4gICAgICBkZXN0LmVtaXQoJ2Vycm9yJywgZXIpO1xuICB9XG4gIC8vIFRoaXMgaXMgYSBicnV0YWxseSB1Z2x5IGhhY2sgdG8gbWFrZSBzdXJlIHRoYXQgb3VyIGVycm9yIGhhbmRsZXJcbiAgLy8gaXMgYXR0YWNoZWQgYmVmb3JlIGFueSB1c2VybGFuZCBvbmVzLiAgTkVWRVIgRE8gVEhJUy5cbiAgaWYgKCFkZXN0Ll9ldmVudHMgfHwgIWRlc3QuX2V2ZW50cy5lcnJvcilcbiAgICBkZXN0Lm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuICBlbHNlIGlmIChpc0FycmF5KGRlc3QuX2V2ZW50cy5lcnJvcikpXG4gICAgZGVzdC5fZXZlbnRzLmVycm9yLnVuc2hpZnQob25lcnJvcik7XG4gIGVsc2VcbiAgICBkZXN0Ll9ldmVudHMuZXJyb3IgPSBbb25lcnJvciwgZGVzdC5fZXZlbnRzLmVycm9yXTtcblxuXG5cbiAgLy8gQm90aCBjbG9zZSBhbmQgZmluaXNoIHNob3VsZCB0cmlnZ2VyIHVucGlwZSwgYnV0IG9ubHkgb25jZS5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdjbG9zZScsIG9uY2xvc2UpO1xuICBmdW5jdGlvbiBvbmZpbmlzaCgpIHtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIHVucGlwZSgpO1xuICB9XG4gIGRlc3Qub25jZSgnZmluaXNoJywgb25maW5pc2gpO1xuXG4gIGZ1bmN0aW9uIHVucGlwZSgpIHtcbiAgICBzcmMudW5waXBlKGRlc3QpO1xuICB9XG5cbiAgLy8gdGVsbCB0aGUgZGVzdCB0aGF0IGl0J3MgYmVpbmcgcGlwZWQgdG9cbiAgZGVzdC5lbWl0KCdwaXBlJywgc3JjKTtcblxuICAvLyBzdGFydCB0aGUgZmxvdyBpZiBpdCBoYXNuJ3QgYmVlbiBzdGFydGVkIGFscmVhZHkuXG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIC8vIHRoZSBoYW5kbGVyIHRoYXQgd2FpdHMgZm9yIHJlYWRhYmxlIGV2ZW50cyBhZnRlciBhbGxcbiAgICAvLyB0aGUgZGF0YSBnZXRzIHN1Y2tlZCBvdXQgaW4gZmxvdy5cbiAgICAvLyBUaGlzIHdvdWxkIGJlIGVhc2llciB0byBmb2xsb3cgd2l0aCBhIC5vbmNlKCkgaGFuZGxlclxuICAgIC8vIGluIGZsb3coKSwgYnV0IHRoYXQgaXMgdG9vIHNsb3cuXG4gICAgdGhpcy5vbigncmVhZGFibGUnLCBwaXBlT25SZWFkYWJsZSk7XG5cbiAgICBzdGF0ZS5mbG93aW5nID0gdHJ1ZTtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgZmxvdyhzcmMpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG5mdW5jdGlvbiBwaXBlT25EcmFpbihzcmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZXN0ID0gdGhpcztcbiAgICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gICAgc3RhdGUuYXdhaXREcmFpbi0tO1xuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluID09PSAwKVxuICAgICAgZmxvdyhzcmMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmbG93KHNyYykge1xuICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBjaHVuaztcbiAgc3RhdGUuYXdhaXREcmFpbiA9IDA7XG5cbiAgZnVuY3Rpb24gd3JpdGUoZGVzdCwgaSwgbGlzdCkge1xuICAgIHZhciB3cml0dGVuID0gZGVzdC53cml0ZShjaHVuayk7XG4gICAgaWYgKGZhbHNlID09PSB3cml0dGVuKSB7XG4gICAgICBzdGF0ZS5hd2FpdERyYWluKys7XG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKHN0YXRlLnBpcGVzQ291bnQgJiYgbnVsbCAhPT0gKGNodW5rID0gc3JjLnJlYWQoKSkpIHtcblxuICAgIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKVxuICAgICAgd3JpdGUoc3RhdGUucGlwZXMsIDAsIG51bGwpO1xuICAgIGVsc2VcbiAgICAgIGZvckVhY2goc3RhdGUucGlwZXMsIHdyaXRlKTtcblxuICAgIHNyYy5lbWl0KCdkYXRhJywgY2h1bmspO1xuXG4gICAgLy8gaWYgYW55b25lIG5lZWRzIGEgZHJhaW4sIHRoZW4gd2UgaGF2ZSB0byB3YWl0IGZvciB0aGF0LlxuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluID4gMClcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGlmIGV2ZXJ5IGRlc3RpbmF0aW9uIHdhcyB1bnBpcGVkLCBlaXRoZXIgYmVmb3JlIGVudGVyaW5nIHRoaXNcbiAgLy8gZnVuY3Rpb24sIG9yIGluIHRoZSB3aGlsZSBsb29wLCB0aGVuIHN0b3AgZmxvd2luZy5cbiAgLy9cbiAgLy8gTkI6IFRoaXMgaXMgYSBwcmV0dHkgcmFyZSBlZGdlIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAwKSB7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuXG4gICAgLy8gaWYgdGhlcmUgd2VyZSBkYXRhIGV2ZW50IGxpc3RlbmVycyBhZGRlZCwgdGhlbiBzd2l0Y2ggdG8gb2xkIG1vZGUuXG4gICAgaWYgKEVFLmxpc3RlbmVyQ291bnQoc3JjLCAnZGF0YScpID4gMClcbiAgICAgIGVtaXREYXRhRXZlbnRzKHNyYyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gYXQgdGhpcyBwb2ludCwgbm8gb25lIG5lZWRlZCBhIGRyYWluLCBzbyB3ZSBqdXN0IHJhbiBvdXQgb2YgZGF0YVxuICAvLyBvbiB0aGUgbmV4dCByZWFkYWJsZSBldmVudCwgc3RhcnQgaXQgb3ZlciBhZ2Fpbi5cbiAgc3RhdGUucmFuT3V0ID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcGlwZU9uUmVhZGFibGUoKSB7XG4gIGlmICh0aGlzLl9yZWFkYWJsZVN0YXRlLnJhbk91dCkge1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUucmFuT3V0ID0gZmFsc2U7XG4gICAgZmxvdyh0aGlzKTtcbiAgfVxufVxuXG5cblJlYWRhYmxlLnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbihkZXN0KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgLy8gaWYgd2UncmUgbm90IHBpcGluZyBhbnl3aGVyZSwgdGhlbiBkbyBub3RoaW5nLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMClcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBqdXN0IG9uZSBkZXN0aW5hdGlvbi4gIG1vc3QgY29tbW9uIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKSB7XG4gICAgLy8gcGFzc2VkIGluIG9uZSwgYnV0IGl0J3Mgbm90IHRoZSByaWdodCBvbmUuXG4gICAgaWYgKGRlc3QgJiYgZGVzdCAhPT0gc3RhdGUucGlwZXMpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmICghZGVzdClcbiAgICAgIGRlc3QgPSBzdGF0ZS5waXBlcztcblxuICAgIC8vIGdvdCBhIG1hdGNoLlxuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIHBpcGVPblJlYWRhYmxlKTtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG4gICAgaWYgKGRlc3QpXG4gICAgICBkZXN0LmVtaXQoJ3VucGlwZScsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc2xvdyBjYXNlLiBtdWx0aXBsZSBwaXBlIGRlc3RpbmF0aW9ucy5cblxuICBpZiAoIWRlc3QpIHtcbiAgICAvLyByZW1vdmUgYWxsLlxuICAgIHZhciBkZXN0cyA9IHN0YXRlLnBpcGVzO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5waXBlc0NvdW50O1xuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIHBpcGVPblJlYWRhYmxlKTtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgZGVzdHNbaV0uZW1pdCgndW5waXBlJywgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB0cnkgdG8gZmluZCB0aGUgcmlnaHQgb25lLlxuICB2YXIgaSA9IGluZGV4T2Yoc3RhdGUucGlwZXMsIGRlc3QpO1xuICBpZiAoaSA9PT0gLTEpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgc3RhdGUucGlwZXMuc3BsaWNlKGksIDEpO1xuICBzdGF0ZS5waXBlc0NvdW50IC09IDE7XG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKVxuICAgIHN0YXRlLnBpcGVzID0gc3RhdGUucGlwZXNbMF07XG5cbiAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIHNldCB1cCBkYXRhIGV2ZW50cyBpZiB0aGV5IGFyZSBhc2tlZCBmb3Jcbi8vIEVuc3VyZSByZWFkYWJsZSBsaXN0ZW5lcnMgZXZlbnR1YWxseSBnZXQgc29tZXRoaW5nXG5SZWFkYWJsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldiwgZm4pIHtcbiAgdmFyIHJlcyA9IFN0cmVhbS5wcm90b3R5cGUub24uY2FsbCh0aGlzLCBldiwgZm4pO1xuXG4gIGlmIChldiA9PT0gJ2RhdGEnICYmICF0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpXG4gICAgZW1pdERhdGFFdmVudHModGhpcyk7XG5cbiAgaWYgKGV2ID09PSAncmVhZGFibGUnICYmIHRoaXMucmVhZGFibGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICghc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcpIHtcbiAgICAgIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAgIGlmICghc3RhdGUucmVhZGluZykge1xuICAgICAgICB0aGlzLnJlYWQoMCk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICBlbWl0UmVhZGFibGUodGhpcywgc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuUmVhZGFibGUucHJvdG90eXBlLmFkZExpc3RlbmVyID0gUmVhZGFibGUucHJvdG90eXBlLm9uO1xuXG4vLyBwYXVzZSgpIGFuZCByZXN1bWUoKSBhcmUgcmVtbmFudHMgb2YgdGhlIGxlZ2FjeSByZWFkYWJsZSBzdHJlYW0gQVBJXG4vLyBJZiB0aGUgdXNlciB1c2VzIHRoZW0sIHRoZW4gc3dpdGNoIGludG8gb2xkIG1vZGUuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gIGVtaXREYXRhRXZlbnRzKHRoaXMpO1xuICB0aGlzLnJlYWQoMCk7XG4gIHRoaXMuZW1pdCgncmVzdW1lJyk7XG59O1xuXG5SZWFkYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgZW1pdERhdGFFdmVudHModGhpcywgdHJ1ZSk7XG4gIHRoaXMuZW1pdCgncGF1c2UnKTtcbn07XG5cbmZ1bmN0aW9uIGVtaXREYXRhRXZlbnRzKHN0cmVhbSwgc3RhcnRQYXVzZWQpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuXG4gIGlmIChzdGF0ZS5mbG93aW5nKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9yZWFkYWJsZS1zdHJlYW0vaXNzdWVzLzE2XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3dpdGNoIHRvIG9sZCBtb2RlIG5vdy4nKTtcbiAgfVxuXG4gIHZhciBwYXVzZWQgPSBzdGFydFBhdXNlZCB8fCBmYWxzZTtcbiAgdmFyIHJlYWRhYmxlID0gZmFsc2U7XG5cbiAgLy8gY29udmVydCB0byBhbiBvbGQtc3R5bGUgc3RyZWFtLlxuICBzdHJlYW0ucmVhZGFibGUgPSB0cnVlO1xuICBzdHJlYW0ucGlwZSA9IFN0cmVhbS5wcm90b3R5cGUucGlwZTtcbiAgc3RyZWFtLm9uID0gc3RyZWFtLmFkZExpc3RlbmVyID0gU3RyZWFtLnByb3RvdHlwZS5vbjtcblxuICBzdHJlYW0ub24oJ3JlYWRhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgcmVhZGFibGUgPSB0cnVlO1xuXG4gICAgdmFyIGM7XG4gICAgd2hpbGUgKCFwYXVzZWQgJiYgKG51bGwgIT09IChjID0gc3RyZWFtLnJlYWQoKSkpKVxuICAgICAgc3RyZWFtLmVtaXQoJ2RhdGEnLCBjKTtcblxuICAgIGlmIChjID09PSBudWxsKSB7XG4gICAgICByZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RyZWFtLl9yZWFkYWJsZVN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBzdHJlYW0ucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICBwYXVzZWQgPSB0cnVlO1xuICAgIHRoaXMuZW1pdCgncGF1c2UnKTtcbiAgfTtcblxuICBzdHJlYW0ucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gICAgcGF1c2VkID0gZmFsc2U7XG4gICAgaWYgKHJlYWRhYmxlKVxuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG4gICAgICB9KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnJlYWQoMCk7XG4gICAgdGhpcy5lbWl0KCdyZXN1bWUnKTtcbiAgfTtcblxuICAvLyBub3cgbWFrZSBpdCBzdGFydCwganVzdCBpbiBjYXNlIGl0IGhhZG4ndCBhbHJlYWR5LlxuICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbn1cblxuLy8gd3JhcCBhbiBvbGQtc3R5bGUgc3RyZWFtIGFzIHRoZSBhc3luYyBkYXRhIHNvdXJjZS5cbi8vIFRoaXMgaXMgKm5vdCogcGFydCBvZiB0aGUgcmVhZGFibGUgc3RyZWFtIGludGVyZmFjZS5cbi8vIEl0IGlzIGFuIHVnbHkgdW5mb3J0dW5hdGUgbWVzcyBvZiBoaXN0b3J5LlxuUmVhZGFibGUucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHBhdXNlZCA9IGZhbHNlO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICAgIHZhciBjaHVuayA9IHN0YXRlLmRlY29kZXIuZW5kKCk7XG4gICAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKVxuICAgICAgICBzZWxmLnB1c2goY2h1bmspO1xuICAgIH1cblxuICAgIHNlbGYucHVzaChudWxsKTtcbiAgfSk7XG5cbiAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICBpZiAoc3RhdGUuZGVjb2RlcilcbiAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG5cbiAgICAvLyBkb24ndCBza2lwIG92ZXIgZmFsc3kgdmFsdWVzIGluIG9iamVjdE1vZGVcbiAgICAvL2lmIChzdGF0ZS5vYmplY3RNb2RlICYmIHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoY2h1bmspKVxuICAgIGlmIChzdGF0ZS5vYmplY3RNb2RlICYmIChjaHVuayA9PT0gbnVsbCB8fCBjaHVuayA9PT0gdW5kZWZpbmVkKSlcbiAgICAgIHJldHVybjtcbiAgICBlbHNlIGlmICghc3RhdGUub2JqZWN0TW9kZSAmJiAoIWNodW5rIHx8ICFjaHVuay5sZW5ndGgpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIHJldCA9IHNlbGYucHVzaChjaHVuayk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb3h5IGFsbCB0aGUgb3RoZXIgbWV0aG9kcy5cbiAgLy8gaW1wb3J0YW50IHdoZW4gd3JhcHBpbmcgZmlsdGVycyBhbmQgZHVwbGV4ZXMuXG4gIGZvciAodmFyIGkgaW4gc3RyZWFtKSB7XG4gICAgaWYgKHR5cGVvZiBzdHJlYW1baV0gPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdHlwZW9mIHRoaXNbaV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzW2ldID0gZnVuY3Rpb24obWV0aG9kKSB7IHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0cmVhbVttZXRob2RdLmFwcGx5KHN0cmVhbSwgYXJndW1lbnRzKTtcbiAgICAgIH19KGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb3h5IGNlcnRhaW4gaW1wb3J0YW50IGV2ZW50cy5cbiAgdmFyIGV2ZW50cyA9IFsnZXJyb3InLCAnY2xvc2UnLCAnZGVzdHJveScsICdwYXVzZScsICdyZXN1bWUnXTtcbiAgZm9yRWFjaChldmVudHMsIGZ1bmN0aW9uKGV2KSB7XG4gICAgc3RyZWFtLm9uKGV2LCBzZWxmLmVtaXQuYmluZChzZWxmLCBldikpO1xuICB9KTtcblxuICAvLyB3aGVuIHdlIHRyeSB0byBjb25zdW1lIHNvbWUgbW9yZSBieXRlcywgc2ltcGx5IHVucGF1c2UgdGhlXG4gIC8vIHVuZGVybHlpbmcgc3RyZWFtLlxuICBzZWxmLl9yZWFkID0gZnVuY3Rpb24obikge1xuICAgIGlmIChwYXVzZWQpIHtcbiAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgc3RyZWFtLnJlc3VtZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gc2VsZjtcbn07XG5cblxuXG4vLyBleHBvc2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuXG5SZWFkYWJsZS5fZnJvbUxpc3QgPSBmcm9tTGlzdDtcblxuLy8gUGx1Y2sgb2ZmIG4gYnl0ZXMgZnJvbSBhbiBhcnJheSBvZiBidWZmZXJzLlxuLy8gTGVuZ3RoIGlzIHRoZSBjb21iaW5lZCBsZW5ndGhzIG9mIGFsbCB0aGUgYnVmZmVycyBpbiB0aGUgbGlzdC5cbmZ1bmN0aW9uIGZyb21MaXN0KG4sIHN0YXRlKSB7XG4gIHZhciBsaXN0ID0gc3RhdGUuYnVmZmVyO1xuICB2YXIgbGVuZ3RoID0gc3RhdGUubGVuZ3RoO1xuICB2YXIgc3RyaW5nTW9kZSA9ICEhc3RhdGUuZGVjb2RlcjtcbiAgdmFyIG9iamVjdE1vZGUgPSAhIXN0YXRlLm9iamVjdE1vZGU7XG4gIHZhciByZXQ7XG5cbiAgLy8gbm90aGluZyBpbiB0aGUgbGlzdCwgZGVmaW5pdGVseSBlbXB0eS5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmIChsZW5ndGggPT09IDApXG4gICAgcmV0ID0gbnVsbDtcbiAgZWxzZSBpZiAob2JqZWN0TW9kZSlcbiAgICByZXQgPSBsaXN0LnNoaWZ0KCk7XG4gIGVsc2UgaWYgKCFuIHx8IG4gPj0gbGVuZ3RoKSB7XG4gICAgLy8gcmVhZCBpdCBhbGwsIHRydW5jYXRlIHRoZSBhcnJheS5cbiAgICBpZiAoc3RyaW5nTW9kZSlcbiAgICAgIHJldCA9IGxpc3Quam9pbignJyk7XG4gICAgZWxzZVxuICAgICAgcmV0ID0gQnVmZmVyLmNvbmNhdChsaXN0LCBsZW5ndGgpO1xuICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyByZWFkIGp1c3Qgc29tZSBvZiBpdC5cbiAgICBpZiAobiA8IGxpc3RbMF0ubGVuZ3RoKSB7XG4gICAgICAvLyBqdXN0IHRha2UgYSBwYXJ0IG9mIHRoZSBmaXJzdCBsaXN0IGl0ZW0uXG4gICAgICAvLyBzbGljZSBpcyB0aGUgc2FtZSBmb3IgYnVmZmVycyBhbmQgc3RyaW5ncy5cbiAgICAgIHZhciBidWYgPSBsaXN0WzBdO1xuICAgICAgcmV0ID0gYnVmLnNsaWNlKDAsIG4pO1xuICAgICAgbGlzdFswXSA9IGJ1Zi5zbGljZShuKTtcbiAgICB9IGVsc2UgaWYgKG4gPT09IGxpc3RbMF0ubGVuZ3RoKSB7XG4gICAgICAvLyBmaXJzdCBsaXN0IGlzIGEgcGVyZmVjdCBtYXRjaFxuICAgICAgcmV0ID0gbGlzdC5zaGlmdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb21wbGV4IGNhc2UuXG4gICAgICAvLyB3ZSBoYXZlIGVub3VnaCB0byBjb3ZlciBpdCwgYnV0IGl0IHNwYW5zIHBhc3QgdGhlIGZpcnN0IGJ1ZmZlci5cbiAgICAgIGlmIChzdHJpbmdNb2RlKVxuICAgICAgICByZXQgPSAnJztcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0ID0gbmV3IEJ1ZmZlcihuKTtcblxuICAgICAgdmFyIGMgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGwgJiYgYyA8IG47IGkrKykge1xuICAgICAgICB2YXIgYnVmID0gbGlzdFswXTtcbiAgICAgICAgdmFyIGNweSA9IE1hdGgubWluKG4gLSBjLCBidWYubGVuZ3RoKTtcblxuICAgICAgICBpZiAoc3RyaW5nTW9kZSlcbiAgICAgICAgICByZXQgKz0gYnVmLnNsaWNlKDAsIGNweSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBidWYuY29weShyZXQsIGMsIDAsIGNweSk7XG5cbiAgICAgICAgaWYgKGNweSA8IGJ1Zi5sZW5ndGgpXG4gICAgICAgICAgbGlzdFswXSA9IGJ1Zi5zbGljZShjcHkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbGlzdC5zaGlmdCgpO1xuXG4gICAgICAgIGMgKz0gY3B5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGVuZFJlYWRhYmxlKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG5cbiAgLy8gSWYgd2UgZ2V0IGhlcmUgYmVmb3JlIGNvbnN1bWluZyBhbGwgdGhlIGJ5dGVzLCB0aGVuIHRoYXQgaXMgYVxuICAvLyBidWcgaW4gbm9kZS4gIFNob3VsZCBuZXZlciBoYXBwZW4uXG4gIGlmIChzdGF0ZS5sZW5ndGggPiAwKVxuICAgIHRocm93IG5ldyBFcnJvcignZW5kUmVhZGFibGUgY2FsbGVkIG9uIG5vbi1lbXB0eSBzdHJlYW0nKTtcblxuICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQgJiYgc3RhdGUuY2FsbGVkUmVhZCkge1xuICAgIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gQ2hlY2sgdGhhdCB3ZSBkaWRuJ3QgZ2V0IG9uZSBsYXN0IHVuc2hpZnQuXG4gICAgICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQgJiYgc3RhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHN0YXRlLmVuZEVtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBzdHJlYW0ucmVhZGFibGUgPSBmYWxzZTtcbiAgICAgICAgc3RyZWFtLmVtaXQoJ2VuZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2ggKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB4cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoeHNbaV0gPT09IHgpIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cblxuLy8gYSB0cmFuc2Zvcm0gc3RyZWFtIGlzIGEgcmVhZGFibGUvd3JpdGFibGUgc3RyZWFtIHdoZXJlIHlvdSBkb1xuLy8gc29tZXRoaW5nIHdpdGggdGhlIGRhdGEuICBTb21ldGltZXMgaXQncyBjYWxsZWQgYSBcImZpbHRlclwiLFxuLy8gYnV0IHRoYXQncyBub3QgYSBncmVhdCBuYW1lIGZvciBpdCwgc2luY2UgdGhhdCBpbXBsaWVzIGEgdGhpbmcgd2hlcmVcbi8vIHNvbWUgYml0cyBwYXNzIHRocm91Z2gsIGFuZCBvdGhlcnMgYXJlIHNpbXBseSBpZ25vcmVkLiAgKFRoYXQgd291bGRcbi8vIGJlIGEgdmFsaWQgZXhhbXBsZSBvZiBhIHRyYW5zZm9ybSwgb2YgY291cnNlLilcbi8vXG4vLyBXaGlsZSB0aGUgb3V0cHV0IGlzIGNhdXNhbGx5IHJlbGF0ZWQgdG8gdGhlIGlucHV0LCBpdCdzIG5vdCBhXG4vLyBuZWNlc3NhcmlseSBzeW1tZXRyaWMgb3Igc3luY2hyb25vdXMgdHJhbnNmb3JtYXRpb24uICBGb3IgZXhhbXBsZSxcbi8vIGEgemxpYiBzdHJlYW0gbWlnaHQgdGFrZSBtdWx0aXBsZSBwbGFpbi10ZXh0IHdyaXRlcygpLCBhbmQgdGhlblxuLy8gZW1pdCBhIHNpbmdsZSBjb21wcmVzc2VkIGNodW5rIHNvbWUgdGltZSBpbiB0aGUgZnV0dXJlLlxuLy9cbi8vIEhlcmUncyBob3cgdGhpcyB3b3Jrczpcbi8vXG4vLyBUaGUgVHJhbnNmb3JtIHN0cmVhbSBoYXMgYWxsIHRoZSBhc3BlY3RzIG9mIHRoZSByZWFkYWJsZSBhbmQgd3JpdGFibGVcbi8vIHN0cmVhbSBjbGFzc2VzLiAgV2hlbiB5b3Ugd3JpdGUoY2h1bmspLCB0aGF0IGNhbGxzIF93cml0ZShjaHVuayxjYilcbi8vIGludGVybmFsbHksIGFuZCByZXR1cm5zIGZhbHNlIGlmIHRoZXJlJ3MgYSBsb3Qgb2YgcGVuZGluZyB3cml0ZXNcbi8vIGJ1ZmZlcmVkIHVwLiAgV2hlbiB5b3UgY2FsbCByZWFkKCksIHRoYXQgY2FsbHMgX3JlYWQobikgdW50aWxcbi8vIHRoZXJlJ3MgZW5vdWdoIHBlbmRpbmcgcmVhZGFibGUgZGF0YSBidWZmZXJlZCB1cC5cbi8vXG4vLyBJbiBhIHRyYW5zZm9ybSBzdHJlYW0sIHRoZSB3cml0dGVuIGRhdGEgaXMgcGxhY2VkIGluIGEgYnVmZmVyLiAgV2hlblxuLy8gX3JlYWQobikgaXMgY2FsbGVkLCBpdCB0cmFuc2Zvcm1zIHRoZSBxdWV1ZWQgdXAgZGF0YSwgY2FsbGluZyB0aGVcbi8vIGJ1ZmZlcmVkIF93cml0ZSBjYidzIGFzIGl0IGNvbnN1bWVzIGNodW5rcy4gIElmIGNvbnN1bWluZyBhIHNpbmdsZVxuLy8gd3JpdHRlbiBjaHVuayB3b3VsZCByZXN1bHQgaW4gbXVsdGlwbGUgb3V0cHV0IGNodW5rcywgdGhlbiB0aGUgZmlyc3Rcbi8vIG91dHB1dHRlZCBiaXQgY2FsbHMgdGhlIHJlYWRjYiwgYW5kIHN1YnNlcXVlbnQgY2h1bmtzIGp1c3QgZ28gaW50b1xuLy8gdGhlIHJlYWQgYnVmZmVyLCBhbmQgd2lsbCBjYXVzZSBpdCB0byBlbWl0ICdyZWFkYWJsZScgaWYgbmVjZXNzYXJ5LlxuLy9cbi8vIFRoaXMgd2F5LCBiYWNrLXByZXNzdXJlIGlzIGFjdHVhbGx5IGRldGVybWluZWQgYnkgdGhlIHJlYWRpbmcgc2lkZSxcbi8vIHNpbmNlIF9yZWFkIGhhcyB0byBiZSBjYWxsZWQgdG8gc3RhcnQgcHJvY2Vzc2luZyBhIG5ldyBjaHVuay4gIEhvd2V2ZXIsXG4vLyBhIHBhdGhvbG9naWNhbCBpbmZsYXRlIHR5cGUgb2YgdHJhbnNmb3JtIGNhbiBjYXVzZSBleGNlc3NpdmUgYnVmZmVyaW5nXG4vLyBoZXJlLiAgRm9yIGV4YW1wbGUsIGltYWdpbmUgYSBzdHJlYW0gd2hlcmUgZXZlcnkgYnl0ZSBvZiBpbnB1dCBpc1xuLy8gaW50ZXJwcmV0ZWQgYXMgYW4gaW50ZWdlciBmcm9tIDAtMjU1LCBhbmQgdGhlbiByZXN1bHRzIGluIHRoYXQgbWFueVxuLy8gYnl0ZXMgb2Ygb3V0cHV0LiAgV3JpdGluZyB0aGUgNCBieXRlcyB7ZmYsZmYsZmYsZmZ9IHdvdWxkIHJlc3VsdCBpblxuLy8gMWtiIG9mIGRhdGEgYmVpbmcgb3V0cHV0LiAgSW4gdGhpcyBjYXNlLCB5b3UgY291bGQgd3JpdGUgYSB2ZXJ5IHNtYWxsXG4vLyBhbW91bnQgb2YgaW5wdXQsIGFuZCBlbmQgdXAgd2l0aCBhIHZlcnkgbGFyZ2UgYW1vdW50IG9mIG91dHB1dC4gIEluXG4vLyBzdWNoIGEgcGF0aG9sb2dpY2FsIGluZmxhdGluZyBtZWNoYW5pc20sIHRoZXJlJ2QgYmUgbm8gd2F5IHRvIHRlbGxcbi8vIHRoZSBzeXN0ZW0gdG8gc3RvcCBkb2luZyB0aGUgdHJhbnNmb3JtLiAgQSBzaW5nbGUgNE1CIHdyaXRlIGNvdWxkXG4vLyBjYXVzZSB0aGUgc3lzdGVtIHRvIHJ1biBvdXQgb2YgbWVtb3J5LlxuLy9cbi8vIEhvd2V2ZXIsIGV2ZW4gaW4gc3VjaCBhIHBhdGhvbG9naWNhbCBjYXNlLCBvbmx5IGEgc2luZ2xlIHdyaXR0ZW4gY2h1bmtcbi8vIHdvdWxkIGJlIGNvbnN1bWVkLCBhbmQgdGhlbiB0aGUgcmVzdCB3b3VsZCB3YWl0ICh1bi10cmFuc2Zvcm1lZCkgdW50aWxcbi8vIHRoZSByZXN1bHRzIG9mIHRoZSBwcmV2aW91cyB0cmFuc2Zvcm1lZCBjaHVuayB3ZXJlIGNvbnN1bWVkLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcblxudmFyIER1cGxleCA9IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG51dGlsLmluaGVyaXRzKFRyYW5zZm9ybSwgRHVwbGV4KTtcblxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdGF0ZShvcHRpb25zLCBzdHJlYW0pIHtcbiAgdGhpcy5hZnRlclRyYW5zZm9ybSA9IGZ1bmN0aW9uKGVyLCBkYXRhKSB7XG4gICAgcmV0dXJuIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpO1xuICB9O1xuXG4gIHRoaXMubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICB0aGlzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuICB0aGlzLndyaXRlY2h1bmsgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBhZnRlclRyYW5zZm9ybShzdHJlYW0sIGVyLCBkYXRhKSB7XG4gIHZhciB0cyA9IHN0cmVhbS5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuXG4gIHZhciBjYiA9IHRzLndyaXRlY2I7XG5cbiAgaWYgKCFjYilcbiAgICByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdubyB3cml0ZWNiIGluIFRyYW5zZm9ybSBjbGFzcycpKTtcblxuICB0cy53cml0ZWNodW5rID0gbnVsbDtcbiAgdHMud3JpdGVjYiA9IG51bGw7XG5cbiAgaWYgKGRhdGEgIT09IG51bGwgJiYgZGF0YSAhPT0gdW5kZWZpbmVkKVxuICAgIHN0cmVhbS5wdXNoKGRhdGEpO1xuXG4gIGlmIChjYilcbiAgICBjYihlcik7XG5cbiAgdmFyIHJzID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBycy5yZWFkaW5nID0gZmFsc2U7XG4gIGlmIChycy5uZWVkUmVhZGFibGUgfHwgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaykge1xuICAgIHN0cmVhbS5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKVxuICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKG9wdGlvbnMpO1xuXG4gIER1cGxleC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlID0gbmV3IFRyYW5zZm9ybVN0YXRlKG9wdGlvbnMsIHRoaXMpO1xuXG4gIC8vIHdoZW4gdGhlIHdyaXRhYmxlIHNpZGUgZmluaXNoZXMsIHRoZW4gZmx1c2ggb3V0IGFueXRoaW5nIHJlbWFpbmluZy5cbiAgdmFyIHN0cmVhbSA9IHRoaXM7XG5cbiAgLy8gc3RhcnQgb3V0IGFza2luZyBmb3IgYSByZWFkYWJsZSBldmVudCBvbmNlIGRhdGEgaXMgdHJhbnNmb3JtZWQuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcblxuICAvLyB3ZSBoYXZlIGltcGxlbWVudGVkIHRoZSBfcmVhZCBtZXRob2QsIGFuZCBkb25lIHRoZSBvdGhlciB0aGluZ3NcbiAgLy8gdGhhdCBSZWFkYWJsZSB3YW50cyBiZWZvcmUgdGhlIGZpcnN0IF9yZWFkIGNhbGwsIHNvIHVuc2V0IHRoZVxuICAvLyBzeW5jIGd1YXJkIGZsYWcuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuc3luYyA9IGZhbHNlO1xuXG4gIHRoaXMub25jZSgnZmluaXNoJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiB0aGlzLl9mbHVzaClcbiAgICAgIHRoaXMuX2ZsdXNoKGZ1bmN0aW9uKGVyKSB7XG4gICAgICAgIGRvbmUoc3RyZWFtLCBlcik7XG4gICAgICB9KTtcbiAgICBlbHNlXG4gICAgICBkb25lKHN0cmVhbSk7XG4gIH0pO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcpIHtcbiAgdGhpcy5fdHJhbnNmb3JtU3RhdGUubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICByZXR1cm4gRHVwbGV4LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgY2h1bmssIGVuY29kaW5nKTtcbn07XG5cbi8vIFRoaXMgaXMgdGhlIHBhcnQgd2hlcmUgeW91IGRvIHN0dWZmIVxuLy8gb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBpbiBpbXBsZW1lbnRhdGlvbiBjbGFzc2VzLlxuLy8gJ2NodW5rJyBpcyBhbiBpbnB1dCBjaHVuay5cbi8vXG4vLyBDYWxsIGBwdXNoKG5ld0NodW5rKWAgdG8gcGFzcyBhbG9uZyB0cmFuc2Zvcm1lZCBvdXRwdXRcbi8vIHRvIHRoZSByZWFkYWJsZSBzaWRlLiAgWW91IG1heSBjYWxsICdwdXNoJyB6ZXJvIG9yIG1vcmUgdGltZXMuXG4vL1xuLy8gQ2FsbCBgY2IoZXJyKWAgd2hlbiB5b3UgYXJlIGRvbmUgd2l0aCB0aGlzIGNodW5rLiAgSWYgeW91IHBhc3Ncbi8vIGFuIGVycm9yLCB0aGVuIHRoYXQnbGwgcHV0IHRoZSBodXJ0IG9uIHRoZSB3aG9sZSBvcGVyYXRpb24uICBJZiB5b3Vcbi8vIG5ldmVyIGNhbGwgY2IoKSwgdGhlbiB5b3UnbGwgbmV2ZXIgZ2V0IGFub3RoZXIgY2h1bmsuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLndyaXRlY2IgPSBjYjtcbiAgdHMud3JpdGVjaHVuayA9IGNodW5rO1xuICB0cy53cml0ZWVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIGlmICghdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdmFyIHJzID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgICBpZiAodHMubmVlZFRyYW5zZm9ybSB8fFxuICAgICAgICBycy5uZWVkUmVhZGFibGUgfHxcbiAgICAgICAgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaylcbiAgICAgIHRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayk7XG4gIH1cbn07XG5cbi8vIERvZXNuJ3QgbWF0dGVyIHdoYXQgdGhlIGFyZ3MgYXJlIGhlcmUuXG4vLyBfdHJhbnNmb3JtIGRvZXMgYWxsIHRoZSB3b3JrLlxuLy8gVGhhdCB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoZSByZWFkYWJsZSBzaWRlIHdhbnRzIG1vcmUgZGF0YS5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICh0cy53cml0ZWNodW5rICE9PSBudWxsICYmIHRzLndyaXRlY2IgJiYgIXRzLnRyYW5zZm9ybWluZykge1xuICAgIHRzLnRyYW5zZm9ybWluZyA9IHRydWU7XG4gICAgdGhpcy5fdHJhbnNmb3JtKHRzLndyaXRlY2h1bmssIHRzLndyaXRlZW5jb2RpbmcsIHRzLmFmdGVyVHJhbnNmb3JtKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBtYXJrIHRoYXQgd2UgbmVlZCBhIHRyYW5zZm9ybSwgc28gdGhhdCBhbnkgZGF0YSB0aGF0IGNvbWVzIGluXG4gICAgLy8gd2lsbCBnZXQgcHJvY2Vzc2VkLCBub3cgdGhhdCB3ZSd2ZSBhc2tlZCBmb3IgaXQuXG4gICAgdHMubmVlZFRyYW5zZm9ybSA9IHRydWU7XG4gIH1cbn07XG5cblxuZnVuY3Rpb24gZG9uZShzdHJlYW0sIGVyKSB7XG4gIGlmIChlcilcbiAgICByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuXG4gIC8vIGlmIHRoZXJlJ3Mgbm90aGluZyBpbiB0aGUgd3JpdGUgYnVmZmVyLCB0aGVuIHRoYXQgbWVhbnNcbiAgLy8gdGhhdCBub3RoaW5nIG1vcmUgd2lsbCBldmVyIGJlIHByb3ZpZGVkXG4gIHZhciB3cyA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHJzID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgdHMgPSBzdHJlYW0uX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICh3cy5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gd3MubGVuZ3RoICE9IDAnKTtcblxuICBpZiAodHMudHJhbnNmb3JtaW5nKVxuICAgIHRocm93IG5ldyBFcnJvcignY2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZycpO1xuXG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn1cbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gQSBiaXQgc2ltcGxlciB0aGFuIHJlYWRhYmxlIHN0cmVhbXMuXG4vLyBJbXBsZW1lbnQgYW4gYXN5bmMgLl93cml0ZShjaHVuaywgY2IpLCBhbmQgaXQnbGwgaGFuZGxlIGFsbFxuLy8gdGhlIGRyYWluIGV2ZW50IGVtaXNzaW9uIGFuZCBidWZmZXJpbmcuXG5cbm1vZHVsZS5leHBvcnRzID0gV3JpdGFibGU7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbldyaXRhYmxlLldyaXRhYmxlU3RhdGUgPSBXcml0YWJsZVN0YXRlO1xuXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgdXRpbCA9IHJlcXVpcmUoJ2NvcmUtdXRpbC1pcycpO1xudXRpbC5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuXG51dGlsLmluaGVyaXRzKFdyaXRhYmxlLCBTdHJlYW0pO1xuXG5mdW5jdGlvbiBXcml0ZVJlcShjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHRoaXMuY2h1bmsgPSBjaHVuaztcbiAgdGhpcy5lbmNvZGluZyA9IGVuY29kaW5nO1xuICB0aGlzLmNhbGxiYWNrID0gY2I7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RhdGUob3B0aW9ucywgc3RyZWFtKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIHRoZSBwb2ludCBhdCB3aGljaCB3cml0ZSgpIHN0YXJ0cyByZXR1cm5pbmcgZmFsc2VcbiAgLy8gTm90ZTogMCBpcyBhIHZhbGlkIHZhbHVlLCBtZWFucyB0aGF0IHdlIGFsd2F5cyByZXR1cm4gZmFsc2UgaWZcbiAgLy8gdGhlIGVudGlyZSBidWZmZXIgaXMgbm90IGZsdXNoZWQgaW1tZWRpYXRlbHkgb24gd3JpdGUoKVxuICB2YXIgaHdtID0gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrO1xuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSAoaHdtIHx8IGh3bSA9PT0gMCkgPyBod20gOiAxNiAqIDEwMjQ7XG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgb3Igbm90IHRoaXMgc3RyZWFtXG4gIC8vIGNvbnRhaW5zIGJ1ZmZlcnMgb3Igb2JqZWN0cy5cbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+fnRoaXMuaGlnaFdhdGVyTWFyaztcblxuICB0aGlzLm5lZWREcmFpbiA9IGZhbHNlO1xuICAvLyBhdCB0aGUgc3RhcnQgb2YgY2FsbGluZyBlbmQoKVxuICB0aGlzLmVuZGluZyA9IGZhbHNlO1xuICAvLyB3aGVuIGVuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIHJldHVybmVkXG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgLy8gd2hlbiAnZmluaXNoJyBpcyBlbWl0dGVkXG4gIHRoaXMuZmluaXNoZWQgPSBmYWxzZTtcblxuICAvLyBzaG91bGQgd2UgZGVjb2RlIHN0cmluZ3MgaW50byBidWZmZXJzIGJlZm9yZSBwYXNzaW5nIHRvIF93cml0ZT9cbiAgLy8gdGhpcyBpcyBoZXJlIHNvIHRoYXQgc29tZSBub2RlLWNvcmUgc3RyZWFtcyBjYW4gb3B0aW1pemUgc3RyaW5nXG4gIC8vIGhhbmRsaW5nIGF0IGEgbG93ZXIgbGV2ZWwuXG4gIHZhciBub0RlY29kZSA9IG9wdGlvbnMuZGVjb2RlU3RyaW5ncyA9PT0gZmFsc2U7XG4gIHRoaXMuZGVjb2RlU3RyaW5ncyA9ICFub0RlY29kZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyBub3QgYW4gYWN0dWFsIGJ1ZmZlciB3ZSBrZWVwIHRyYWNrIG9mLCBidXQgYSBtZWFzdXJlbWVudFxuICAvLyBvZiBob3cgbXVjaCB3ZSdyZSB3YWl0aW5nIHRvIGdldCBwdXNoZWQgdG8gc29tZSB1bmRlcmx5aW5nXG4gIC8vIHNvY2tldCBvciBmaWxlLlxuICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIHNlZSB3aGVuIHdlJ3JlIGluIHRoZSBtaWRkbGUgb2YgYSB3cml0ZS5cbiAgdGhpcy53cml0aW5nID0gZmFsc2U7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgb253cml0ZSBjYiBpcyBjYWxsZWQgaW1tZWRpYXRlbHksXG4gIC8vIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY3Vhc2UgYW55XG4gIC8vIGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHdyaXRlIGNhbGwuXG4gIHRoaXMuc3luYyA9IHRydWU7XG5cbiAgLy8gYSBmbGFnIHRvIGtub3cgaWYgd2UncmUgcHJvY2Vzc2luZyBwcmV2aW91c2x5IGJ1ZmZlcmVkIGl0ZW1zLCB3aGljaFxuICAvLyBtYXkgY2FsbCB0aGUgX3dyaXRlKCkgY2FsbGJhY2sgaW4gdGhlIHNhbWUgdGljaywgc28gdGhhdCB3ZSBkb24ndFxuICAvLyBlbmQgdXAgaW4gYW4gb3ZlcmxhcHBlZCBvbndyaXRlIHNpdHVhdGlvbi5cbiAgdGhpcy5idWZmZXJQcm9jZXNzaW5nID0gZmFsc2U7XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQncyBwYXNzZWQgdG8gX3dyaXRlKGNodW5rLGNiKVxuICB0aGlzLm9ud3JpdGUgPSBmdW5jdGlvbihlcikge1xuICAgIG9ud3JpdGUoc3RyZWFtLCBlcik7XG4gIH07XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQgdGhlIHVzZXIgc3VwcGxpZXMgdG8gd3JpdGUoY2h1bmssZW5jb2RpbmcsY2IpXG4gIHRoaXMud3JpdGVjYiA9IG51bGw7XG5cbiAgLy8gdGhlIGFtb3VudCB0aGF0IGlzIGJlaW5nIHdyaXR0ZW4gd2hlbiBfd3JpdGUgaXMgY2FsbGVkLlxuICB0aGlzLndyaXRlbGVuID0gMDtcblxuICB0aGlzLmJ1ZmZlciA9IFtdO1xuXG4gIC8vIFRydWUgaWYgdGhlIGVycm9yIHdhcyBhbHJlYWR5IGVtaXR0ZWQgYW5kIHNob3VsZCBub3QgYmUgdGhyb3duIGFnYWluXG4gIHRoaXMuZXJyb3JFbWl0dGVkID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlKG9wdGlvbnMpIHtcbiAgdmFyIER1cGxleCA9IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuICAvLyBXcml0YWJsZSBjdG9yIGlzIGFwcGxpZWQgdG8gRHVwbGV4ZXMsIHRob3VnaCB0aGV5J3JlIG5vdFxuICAvLyBpbnN0YW5jZW9mIFdyaXRhYmxlLCB0aGV5J3JlIGluc3RhbmNlb2YgUmVhZGFibGUuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBXcml0YWJsZSkgJiYgISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSlcbiAgICByZXR1cm4gbmV3IFdyaXRhYmxlKG9wdGlvbnMpO1xuXG4gIHRoaXMuX3dyaXRhYmxlU3RhdGUgPSBuZXcgV3JpdGFibGVTdGF0ZShvcHRpb25zLCB0aGlzKTtcblxuICAvLyBsZWdhY3kuXG4gIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuXG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xufVxuXG4vLyBPdGhlcndpc2UgcGVvcGxlIGNhbiBwaXBlIFdyaXRhYmxlIHN0cmVhbXMsIHdoaWNoIGlzIGp1c3Qgd3JvbmcuXG5Xcml0YWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdDYW5ub3QgcGlwZS4gTm90IHJlYWRhYmxlLicpKTtcbn07XG5cblxuZnVuY3Rpb24gd3JpdGVBZnRlckVuZChzdHJlYW0sIHN0YXRlLCBjYikge1xuICB2YXIgZXIgPSBuZXcgRXJyb3IoJ3dyaXRlIGFmdGVyIGVuZCcpO1xuICAvLyBUT0RPOiBkZWZlciBlcnJvciBldmVudHMgY29uc2lzdGVudGx5IGV2ZXJ5d2hlcmUsIG5vdCBqdXN0IHRoZSBjYlxuICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgY2IoZXIpO1xuICB9KTtcbn1cblxuLy8gSWYgd2UgZ2V0IHNvbWV0aGluZyB0aGF0IGlzIG5vdCBhIGJ1ZmZlciwgc3RyaW5nLCBudWxsLCBvciB1bmRlZmluZWQsXG4vLyBhbmQgd2UncmUgbm90IGluIG9iamVjdE1vZGUsIHRoZW4gdGhhdCdzIGFuIGVycm9yLlxuLy8gT3RoZXJ3aXNlIHN0cmVhbSBjaHVua3MgYXJlIGFsbCBjb25zaWRlcmVkIHRvIGJlIG9mIGxlbmd0aD0xLCBhbmQgdGhlXG4vLyB3YXRlcm1hcmtzIGRldGVybWluZSBob3cgbWFueSBvYmplY3RzIHRvIGtlZXAgaW4gdGhlIGJ1ZmZlciwgcmF0aGVyIHRoYW5cbi8vIGhvdyBtYW55IGJ5dGVzIG9yIGNoYXJhY3RlcnMuXG5mdW5jdGlvbiB2YWxpZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBjYikge1xuICB2YXIgdmFsaWQgPSB0cnVlO1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgJiZcbiAgICAgICdzdHJpbmcnICE9PSB0eXBlb2YgY2h1bmsgJiZcbiAgICAgIGNodW5rICE9PSBudWxsICYmXG4gICAgICBjaHVuayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIHZhciBlciA9IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsnKTtcbiAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIGNiKGVyKTtcbiAgICB9KTtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWxpZDtcbn1cblxuV3JpdGFibGUucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG5cbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpXG4gICAgZW5jb2RpbmcgPSAnYnVmZmVyJztcbiAgZWxzZSBpZiAoIWVuY29kaW5nKVxuICAgIGVuY29kaW5nID0gc3RhdGUuZGVmYXVsdEVuY29kaW5nO1xuXG4gIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpXG4gICAgY2IgPSBmdW5jdGlvbigpIHt9O1xuXG4gIGlmIChzdGF0ZS5lbmRlZClcbiAgICB3cml0ZUFmdGVyRW5kKHRoaXMsIHN0YXRlLCBjYik7XG4gIGVsc2UgaWYgKHZhbGlkQ2h1bmsodGhpcywgc3RhdGUsIGNodW5rLCBjYikpXG4gICAgcmV0ID0gd3JpdGVPckJ1ZmZlcih0aGlzLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYik7XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpIHtcbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmXG4gICAgICBzdGF0ZS5kZWNvZGVTdHJpbmdzICE9PSBmYWxzZSAmJlxuICAgICAgdHlwZW9mIGNodW5rID09PSAnc3RyaW5nJykge1xuICAgIGNodW5rID0gbmV3IEJ1ZmZlcihjaHVuaywgZW5jb2RpbmcpO1xuICB9XG4gIHJldHVybiBjaHVuaztcbn1cblxuLy8gaWYgd2UncmUgYWxyZWFkeSB3cml0aW5nIHNvbWV0aGluZywgdGhlbiBqdXN0IHB1dCB0aGlzXG4vLyBpbiB0aGUgcXVldWUsIGFuZCB3YWl0IG91ciB0dXJuLiAgT3RoZXJ3aXNlLCBjYWxsIF93cml0ZVxuLy8gSWYgd2UgcmV0dXJuIGZhbHNlLCB0aGVuIHdlIG5lZWQgYSBkcmFpbiBldmVudCwgc28gc2V0IHRoYXQgZmxhZy5cbmZ1bmN0aW9uIHdyaXRlT3JCdWZmZXIoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjaHVuayA9IGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpO1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSlcbiAgICBlbmNvZGluZyA9ICdidWZmZXInO1xuICB2YXIgbGVuID0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG5cbiAgc3RhdGUubGVuZ3RoICs9IGxlbjtcblxuICB2YXIgcmV0ID0gc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgLy8gd2UgbXVzdCBlbnN1cmUgdGhhdCBwcmV2aW91cyBuZWVkRHJhaW4gd2lsbCBub3QgYmUgcmVzZXQgdG8gZmFsc2UuXG4gIGlmICghcmV0KVxuICAgIHN0YXRlLm5lZWREcmFpbiA9IHRydWU7XG5cbiAgaWYgKHN0YXRlLndyaXRpbmcpXG4gICAgc3RhdGUuYnVmZmVyLnB1c2gobmV3IFdyaXRlUmVxKGNodW5rLCBlbmNvZGluZywgY2IpKTtcbiAgZWxzZVxuICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIGxlbiwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBzdGF0ZS53cml0ZWxlbiA9IGxlbjtcbiAgc3RhdGUud3JpdGVjYiA9IGNiO1xuICBzdGF0ZS53cml0aW5nID0gdHJ1ZTtcbiAgc3RhdGUuc3luYyA9IHRydWU7XG4gIHN0cmVhbS5fd3JpdGUoY2h1bmssIGVuY29kaW5nLCBzdGF0ZS5vbndyaXRlKTtcbiAgc3RhdGUuc3luYyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlRXJyb3Ioc3RyZWFtLCBzdGF0ZSwgc3luYywgZXIsIGNiKSB7XG4gIGlmIChzeW5jKVxuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICBjYihlcik7XG4gICAgfSk7XG4gIGVsc2VcbiAgICBjYihlcik7XG5cbiAgc3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IHRydWU7XG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbn1cblxuZnVuY3Rpb24gb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKSB7XG4gIHN0YXRlLndyaXRpbmcgPSBmYWxzZTtcbiAgc3RhdGUud3JpdGVjYiA9IG51bGw7XG4gIHN0YXRlLmxlbmd0aCAtPSBzdGF0ZS53cml0ZWxlbjtcbiAgc3RhdGUud3JpdGVsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSwgZXIpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgc3luYyA9IHN0YXRlLnN5bmM7XG4gIHZhciBjYiA9IHN0YXRlLndyaXRlY2I7XG5cbiAgb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtcblxuICBpZiAoZXIpXG4gICAgb253cml0ZUVycm9yKHN0cmVhbSwgc3RhdGUsIHN5bmMsIGVyLCBjYik7XG4gIGVsc2Uge1xuICAgIC8vIENoZWNrIGlmIHdlJ3JlIGFjdHVhbGx5IHJlYWR5IHRvIGZpbmlzaCwgYnV0IGRvbid0IGVtaXQgeWV0XG4gICAgdmFyIGZpbmlzaGVkID0gbmVlZEZpbmlzaChzdHJlYW0sIHN0YXRlKTtcblxuICAgIGlmICghZmluaXNoZWQgJiYgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiYgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpO1xuXG4gICAgaWYgKHN5bmMpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKSB7XG4gIGlmICghZmluaXNoZWQpXG4gICAgb253cml0ZURyYWluKHN0cmVhbSwgc3RhdGUpO1xuICBjYigpO1xuICBpZiAoZmluaXNoZWQpXG4gICAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG59XG5cbi8vIE11c3QgZm9yY2UgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIG9uIG5leHRUaWNrLCBzbyB0aGF0IHdlIGRvbid0XG4vLyBlbWl0ICdkcmFpbicgYmVmb3JlIHRoZSB3cml0ZSgpIGNvbnN1bWVyIGdldHMgdGhlICdmYWxzZScgcmV0dXJuXG4vLyB2YWx1ZSwgYW5kIGhhcyBhIGNoYW5jZSB0byBhdHRhY2ggYSAnZHJhaW4nIGxpc3RlbmVyLlxuZnVuY3Rpb24gb253cml0ZURyYWluKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5uZWVkRHJhaW4pIHtcbiAgICBzdGF0ZS5uZWVkRHJhaW4gPSBmYWxzZTtcbiAgICBzdHJlYW0uZW1pdCgnZHJhaW4nKTtcbiAgfVxufVxuXG5cbi8vIGlmIHRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXIgd2FpdGluZywgdGhlbiBwcm9jZXNzIGl0XG5mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKSB7XG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSB0cnVlO1xuXG4gIGZvciAodmFyIGMgPSAwOyBjIDwgc3RhdGUuYnVmZmVyLmxlbmd0aDsgYysrKSB7XG4gICAgdmFyIGVudHJ5ID0gc3RhdGUuYnVmZmVyW2NdO1xuICAgIHZhciBjaHVuayA9IGVudHJ5LmNodW5rO1xuICAgIHZhciBlbmNvZGluZyA9IGVudHJ5LmVuY29kaW5nO1xuICAgIHZhciBjYiA9IGVudHJ5LmNhbGxiYWNrO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcblxuICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcblxuICAgIC8vIGlmIHdlIGRpZG4ndCBjYWxsIHRoZSBvbndyaXRlIGltbWVkaWF0ZWx5LCB0aGVuXG4gICAgLy8gaXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgaXQgZG9lcy5cbiAgICAvLyBhbHNvLCB0aGF0IG1lYW5zIHRoYXQgdGhlIGNodW5rIGFuZCBjYiBhcmUgY3VycmVudGx5XG4gICAgLy8gYmVpbmcgcHJvY2Vzc2VkLCBzbyBtb3ZlIHRoZSBidWZmZXIgY291bnRlciBwYXN0IHRoZW0uXG4gICAgaWYgKHN0YXRlLndyaXRpbmcpIHtcbiAgICAgIGMrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcbiAgaWYgKGMgPCBzdGF0ZS5idWZmZXIubGVuZ3RoKVxuICAgIHN0YXRlLmJ1ZmZlciA9IHN0YXRlLmJ1ZmZlci5zbGljZShjKTtcbiAgZWxzZVxuICAgIHN0YXRlLmJ1ZmZlci5sZW5ndGggPSAwO1xufVxuXG5Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpKTtcbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG5cbiAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gY2h1bms7XG4gICAgY2h1bmsgPSBudWxsO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2h1bmsgIT09ICd1bmRlZmluZWQnICYmIGNodW5rICE9PSBudWxsKVxuICAgIHRoaXMud3JpdGUoY2h1bmssIGVuY29kaW5nKTtcblxuICAvLyBpZ25vcmUgdW5uZWNlc3NhcnkgZW5kKCkgY2FsbHMuXG4gIGlmICghc3RhdGUuZW5kaW5nICYmICFzdGF0ZS5maW5pc2hlZClcbiAgICBlbmRXcml0YWJsZSh0aGlzLCBzdGF0ZSwgY2IpO1xufTtcblxuXG5mdW5jdGlvbiBuZWVkRmluaXNoKHN0cmVhbSwgc3RhdGUpIHtcbiAgcmV0dXJuIChzdGF0ZS5lbmRpbmcgJiZcbiAgICAgICAgICBzdGF0ZS5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAhc3RhdGUuZmluaXNoZWQgJiZcbiAgICAgICAgICAhc3RhdGUud3JpdGluZyk7XG59XG5cbmZ1bmN0aW9uIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIG5lZWQgPSBuZWVkRmluaXNoKHN0cmVhbSwgc3RhdGUpO1xuICBpZiAobmVlZCkge1xuICAgIHN0YXRlLmZpbmlzaGVkID0gdHJ1ZTtcbiAgICBzdHJlYW0uZW1pdCgnZmluaXNoJyk7XG4gIH1cbiAgcmV0dXJuIG5lZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZFdyaXRhYmxlKHN0cmVhbSwgc3RhdGUsIGNiKSB7XG4gIHN0YXRlLmVuZGluZyA9IHRydWU7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xuICBpZiAoY2IpIHtcbiAgICBpZiAoc3RhdGUuZmluaXNoZWQpXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGNiKTtcbiAgICBlbHNlXG4gICAgICBzdHJlYW0ub25jZSgnZmluaXNoJywgY2IpO1xuICB9XG4gIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpIiwiKGZ1bmN0aW9uIChCdWZmZXIpe1xuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5mdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihhcmcpO1xufVxuZXhwb3J0cy5pc0J1ZmZlciA9IGlzQnVmZmVyO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIpIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcblxudmFyIGlzQnVmZmVyRW5jb2RpbmcgPSBCdWZmZXIuaXNFbmNvZGluZ1xuICB8fCBmdW5jdGlvbihlbmNvZGluZykge1xuICAgICAgIHN3aXRjaCAoZW5jb2RpbmcgJiYgZW5jb2RpbmcudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgY2FzZSAnaGV4JzogY2FzZSAndXRmOCc6IGNhc2UgJ3V0Zi04JzogY2FzZSAnYXNjaWknOiBjYXNlICdiaW5hcnknOiBjYXNlICdiYXNlNjQnOiBjYXNlICd1Y3MyJzogY2FzZSAndWNzLTInOiBjYXNlICd1dGYxNmxlJzogY2FzZSAndXRmLTE2bGUnOiBjYXNlICdyYXcnOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICB9XG4gICAgIH1cblxuXG5mdW5jdGlvbiBhc3NlcnRFbmNvZGluZyhlbmNvZGluZykge1xuICBpZiAoZW5jb2RpbmcgJiYgIWlzQnVmZmVyRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpO1xuICB9XG59XG5cbi8vIFN0cmluZ0RlY29kZXIgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBlZmZpY2llbnRseSBzcGxpdHRpbmcgYSBzZXJpZXMgb2Zcbi8vIGJ1ZmZlcnMgaW50byBhIHNlcmllcyBvZiBKUyBzdHJpbmdzIHdpdGhvdXQgYnJlYWtpbmcgYXBhcnQgbXVsdGktYnl0ZVxuLy8gY2hhcmFjdGVycy4gQ0VTVS04IGlzIGhhbmRsZWQgYXMgcGFydCBvZiB0aGUgVVRGLTggZW5jb2RpbmcuXG4vL1xuLy8gQFRPRE8gSGFuZGxpbmcgYWxsIGVuY29kaW5ncyBpbnNpZGUgYSBzaW5nbGUgb2JqZWN0IG1ha2VzIGl0IHZlcnkgZGlmZmljdWx0XG4vLyB0byByZWFzb24gYWJvdXQgdGhpcyBjb2RlLCBzbyBpdCBzaG91bGQgYmUgc3BsaXQgdXAgaW4gdGhlIGZ1dHVyZS5cbi8vIEBUT0RPIFRoZXJlIHNob3VsZCBiZSBhIHV0Zjgtc3RyaWN0IGVuY29kaW5nIHRoYXQgcmVqZWN0cyBpbnZhbGlkIFVURi04IGNvZGVcbi8vIHBvaW50cyBhcyB1c2VkIGJ5IENFU1UtOC5cbnZhciBTdHJpbmdEZWNvZGVyID0gZXhwb3J0cy5TdHJpbmdEZWNvZGVyID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEVub3VnaCBzcGFjZSB0byBzdG9yZSBhbGwgYnl0ZXMgb2YgYSBzaW5nbGUgY2hhcmFjdGVyLiBVVEYtOCBuZWVkcyA0XG4gIC8vIGJ5dGVzLCBidXQgQ0VTVS04IG1heSByZXF1aXJlIHVwIHRvIDYgKDMgYnl0ZXMgcGVyIHN1cnJvZ2F0ZSkuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIC8vIE51bWJlciBvZiBieXRlcyByZWNlaXZlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgZXhwZWN0ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhckxlbmd0aCA9IDA7XG59O1xuXG5cbi8vIHdyaXRlIGRlY29kZXMgdGhlIGdpdmVuIGJ1ZmZlciBhbmQgcmV0dXJucyBpdCBhcyBKUyBzdHJpbmcgdGhhdCBpc1xuLy8gZ3VhcmFudGVlZCB0byBub3QgY29udGFpbiBhbnkgcGFydGlhbCBtdWx0aS1ieXRlIGNoYXJhY3RlcnMuIEFueSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIgZm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIGJ1ZmZlcmVkIHVwLCBhbmQgd2lsbCBiZVxuLy8gcmV0dXJuZWQgd2hlbiBjYWxsaW5nIHdyaXRlIGFnYWluIHdpdGggdGhlIHJlbWFpbmluZyBieXRlcy5cbi8vXG4vLyBOb3RlOiBDb252ZXJ0aW5nIGEgQnVmZmVyIGNvbnRhaW5pbmcgYW4gb3JwaGFuIHN1cnJvZ2F0ZSB0byBhIFN0cmluZ1xuLy8gY3VycmVudGx5IHdvcmtzLCBidXQgY29udmVydGluZyBhIFN0cmluZyB0byBhIEJ1ZmZlciAodmlhIGBuZXcgQnVmZmVyYCwgb3Jcbi8vIEJ1ZmZlciN3cml0ZSkgd2lsbCByZXBsYWNlIGluY29tcGxldGUgc3Vycm9nYXRlcyB3aXRoIHRoZSB1bmljb2RlXG4vLyByZXBsYWNlbWVudCBjaGFyYWN0ZXIuIFNlZSBodHRwczovL2NvZGVyZXZpZXcuY2hyb21pdW0ub3JnLzEyMTE3MzAwOS8gLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgYXZhaWxhYmxlID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICBidWZmZXIubGVuZ3RoO1xuXG4gICAgLy8gYWRkIHRoZSBuZXcgYnl0ZXMgdG8gdGhlIGNoYXIgYnVmZmVyXG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCB0aGlzLmNoYXJSZWNlaXZlZCwgMCwgYXZhaWxhYmxlKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBhdmFpbGFibGU7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGJ5dGVzIGJlbG9uZ2luZyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZnJvbSB0aGUgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGF2YWlsYWJsZSwgYnVmZmVyLmxlbmd0aCk7XG5cbiAgICAvLyBnZXQgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyBzcGxpdFxuICAgIGNoYXJTdHIgPSB0aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCwgdGhpcy5jaGFyTGVuZ3RoKS50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcblxuICAgIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFyU3RyO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIGRldGVybWluZSBhbmQgc2V0IGNoYXJMZW5ndGggLyBjaGFyUmVjZWl2ZWRcbiAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpO1xuXG4gIHZhciBlbmQgPSBidWZmZXIubGVuZ3RoO1xuICBpZiAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gYnVmZmVyIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlciBieXRlcyB3ZSBnb3RcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCwgZW5kKTtcbiAgICBlbmQgLT0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgdGhpcy5jaGFyTGVuZ3RoICs9IHNpemU7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHNpemUsIDAsIHNpemUpO1xuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgMCwgc2l6ZSk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG4vLyBkZXRlY3RJbmNvbXBsZXRlQ2hhciBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFuIGluY29tcGxldGUgVVRGLTggY2hhcmFjdGVyIGF0XG4vLyB0aGUgZW5kIG9mIHRoZSBnaXZlbiBidWZmZXIuIElmIHNvLCBpdCBzZXRzIHRoaXMuY2hhckxlbmd0aCB0byB0aGUgYnl0ZVxuLy8gbGVuZ3RoIHRoYXQgY2hhcmFjdGVyLCBhbmQgc2V0cyB0aGlzLmNoYXJSZWNlaXZlZCB0byB0aGUgbnVtYmVyIG9mIGJ5dGVzXG4vLyB0aGF0IGFyZSBhdmFpbGFibGUgZm9yIHRoaXMgY2hhcmFjdGVyLlxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDIgOiAwO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMztcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAzIDogMDtcbn1cbiIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTsgLy8gaGFjayB0byBmaXggYSBjaXJjdWxhciBkZXBlbmRlbmN5IGlzc3VlIHdoZW4gdXNlZCB3aXRoIGJyb3dzZXJpZnlcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fcmVhZGFibGUuanMnKTtcbmV4cG9ydHMuU3RyZWFtID0gU3RyZWFtO1xuZXhwb3J0cy5SZWFkYWJsZSA9IGV4cG9ydHM7XG5leHBvcnRzLldyaXRhYmxlID0gcmVxdWlyZSgnLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcycpO1xuZXhwb3J0cy5EdXBsZXggPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX2R1cGxleC5qcycpO1xuZXhwb3J0cy5UcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcycpO1xuZXhwb3J0cy5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMnKTtcbiIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoXCIvVXNlcnMvc2V0aHZpbmNlbnQvd29ya3NwYWNlL21vc3N5b3dsL3BpenphLWNsaWNrZXIvbm9kZV9tb2R1bGVzL2xldmVsLWpzL25vZGVfbW9kdWxlcy9hYnN0cmFjdC1sZXZlbGRvd24vbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzXCIpIiwibW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJsZXZlbHVwXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgc2ltcGxlIHN0b3JhZ2UgLSBhIE5vZGUuanMtc3R5bGUgTGV2ZWxEQiB3cmFwcGVyXCIsXG4gIFwidmVyc2lvblwiOiBcIjAuMTkuMFwiLFxuICBcImNvbnRyaWJ1dG9yc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiUm9kIFZhZ2dcIixcbiAgICAgIFwiZW1haWxcIjogXCJyQHZhLmdnXCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ydmFnZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJKb2huIENoZXNsZXlcIixcbiAgICAgIFwiZW1haWxcIjogXCJqb2huQGNoZXNsLmVzXCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9jaGVzbGVzL1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJKYWtlIFZlcmJhdGVuXCIsXG4gICAgICBcImVtYWlsXCI6IFwicmF5bm9zMkBnbWFpbC5jb21cIixcbiAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3JheW5vc1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJEb21pbmljIFRhcnJcIixcbiAgICAgIFwiZW1haWxcIjogXCJkb21pbmljLnRhcnJAZ21haWwuY29tXCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kb21pbmljdGFyclwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJNYXggT2dkZW5cIixcbiAgICAgIFwiZW1haWxcIjogXCJtYXhAbWF4b2dkZW4uY29tXCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9tYXhvZ2RlblwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJMYXJzLU1hZ251cyBTa29nXCIsXG4gICAgICBcImVtYWlsXCI6IFwibGFycy5tYWdudXMuc2tvZ0BnbWFpbC5jb21cIixcbiAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3JhbHBodGhlbmluamFcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiRGF2aWQgQmrDtnJrbHVuZFwiLFxuICAgICAgXCJlbWFpbFwiOiBcImRhdmlkLmJqb3JrbHVuZEBnbWFpbC5jb21cIixcbiAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tlc2xhXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIkp1bGlhbiBHcnViZXJcIixcbiAgICAgIFwiZW1haWxcIjogXCJqdWxpYW5AanVsaWFuZ3J1YmVyLmNvbVwiLFxuICAgICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vanVsaWFuZ3J1YmVyXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIlBhb2xvIEZyYWdvbWVuaVwiLFxuICAgICAgXCJlbWFpbFwiOiBcInBhb2xvQGFzeW5jLmx5XCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9oaWoxbnhcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiQW50b24gV2hhbGxleVwiLFxuICAgICAgXCJlbWFpbFwiOiBcImFudG9uLndoYWxsZXlAbmVhcmZvcm0uY29tXCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ObzlcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiTWF0dGVvIENvbGxpbmFcIixcbiAgICAgIFwiZW1haWxcIjogXCJtYXR0ZW8uY29sbGluYUBnbWFpbC5jb21cIixcbiAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL21jb2xsaW5hXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIlBlZHJvIFRlaXhlaXJhXCIsXG4gICAgICBcImVtYWlsXCI6IFwicGVkcm8udGVpeGVpcmFAZ21haWwuY29tXCIsXG4gICAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9wZ3RlXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIkphbWVzIEhhbGxpZGF5XCIsXG4gICAgICBcImVtYWlsXCI6IFwibWFpbEBzdWJzdGFjay5uZXRcIixcbiAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrXCJcbiAgICB9XG4gIF0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwLmdpdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vcnZhZ2cvbm9kZS1sZXZlbHVwXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwibGV2ZWxkYlwiLFxuICAgIFwic3RyZWFtXCIsXG4gICAgXCJkYXRhYmFzZVwiLFxuICAgIFwiZGJcIixcbiAgICBcInN0b3JlXCIsXG4gICAgXCJzdG9yYWdlXCIsXG4gICAgXCJqc29uXCJcbiAgXSxcbiAgXCJtYWluXCI6IFwibGliL2xldmVsdXAuanNcIixcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYmxcIjogXCJ+MC44LjFcIixcbiAgICBcImRlZmVycmVkLWxldmVsZG93blwiOiBcIn4wLjIuMFwiLFxuICAgIFwiZXJybm9cIjogXCJ+MC4xLjFcIixcbiAgICBcInByclwiOiBcIn4wLjAuMFwiLFxuICAgIFwicmVhZGFibGUtc3RyZWFtXCI6IFwifjEuMC4yNlwiLFxuICAgIFwic2VtdmVyXCI6IFwifjIuMy4xXCIsXG4gICAgXCJ4dGVuZFwiOiBcIn4zLjAuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImxldmVsZG93blwiOiBcIn4wLjEwLjBcIixcbiAgICBcImJ1c3Rlcm1vdmVcIjogXCIqXCIsXG4gICAgXCJ0YXBcIjogXCIqXCIsXG4gICAgXCJyZWZlcmVlXCI6IFwiKlwiLFxuICAgIFwicmltcmFmXCI6IFwiKlwiLFxuICAgIFwiYXN5bmNcIjogXCIqXCIsXG4gICAgXCJmc3RyZWFtXCI6IFwiKlwiLFxuICAgIFwidGFyXCI6IFwiKlwiLFxuICAgIFwibWtmaWxldHJlZVwiOiBcIipcIixcbiAgICBcInJlYWRmaWxldHJlZVwiOiBcIipcIixcbiAgICBcInNsb3ctc3RyZWFtXCI6IFwiPj0wLjAuNFwiLFxuICAgIFwiZGVsYXllZFwiOiBcIipcIixcbiAgICBcImJvZ2FuaXBzdW1cIjogXCIqXCIsXG4gICAgXCJkdVwiOiBcIipcIixcbiAgICBcIm1lbWRvd25cIjogXCIqXCIsXG4gICAgXCJtc2dwYWNrLWpzXCI6IFwiKlwiXG4gIH0sXG4gIFwiYnJvd3NlclwiOiB7XG4gICAgXCJsZXZlbGRvd25cIjogZmFsc2UsXG4gICAgXCJsZXZlbGRvd24vcGFja2FnZVwiOiBmYWxzZSxcbiAgICBcInNlbXZlclwiOiBmYWxzZVxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwidGVzdFwiOiBcInRhcCB0ZXN0LyotdGVzdC5qcyAtLXN0ZGVyclwiLFxuICAgIFwiZnVuY3Rpb25hbHRlc3RzXCI6IFwibm9kZSAuL3Rlc3QvZnVuY3Rpb25hbC9mc3RyZWFtLXRlc3QuanMgJiYgbm9kZSAuL3Rlc3QvZnVuY3Rpb25hbC9iaW5hcnktZGF0YS10ZXN0LmpzICYmIG5vZGUgLi90ZXN0L2Z1bmN0aW9uYWwvY29tcGF0LXRlc3QuanNcIixcbiAgICBcImFsbHRlc3RzXCI6IFwibnBtIHRlc3QgJiYgbnBtIHJ1bi1zY3JpcHQgZnVuY3Rpb25hbHRlc3RzXCJcbiAgfSxcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwiZ2l0SGVhZFwiOiBcImZiNzQyYjAxOTkwMTM5YjQ0YjE4MTZkZTg3YTZlMWIyZGU2Mjk2MjdcIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ydmFnZy9ub2RlLWxldmVsdXAvaXNzdWVzXCJcbiAgfSxcbiAgXCJfaWRcIjogXCJsZXZlbHVwQDAuMTkuMFwiLFxuICBcIl9zaGFzdW1cIjogXCJmNmI2MGExNjhjODZjMmZlNWQ1OTUzNDc2Y2JlOTc4NmNjZjBhM2Y3XCIsXG4gIFwiX2Zyb21cIjogXCJsZXZlbHVwQCpcIixcbiAgXCJfbnBtVmVyc2lvblwiOiBcIjEuNC4yM1wiLFxuICBcIl9ucG1Vc2VyXCI6IHtcbiAgICBcIm5hbWVcIjogXCJydmFnZ1wiLFxuICAgIFwiZW1haWxcIjogXCJyb2RAdmFnZy5vcmdcIlxuICB9LFxuICBcIm1haW50YWluZXJzXCI6IFtcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJydmFnZ1wiLFxuICAgICAgXCJlbWFpbFwiOiBcInJvZEB2YWdnLm9yZ1wiXG4gICAgfVxuICBdLFxuICBcImRpc3RcIjoge1xuICAgIFwic2hhc3VtXCI6IFwiZjZiNjBhMTY4Yzg2YzJmZTVkNTk1MzQ3NmNiZTk3ODZjY2YwYTNmN1wiLFxuICAgIFwidGFyYmFsbFwiOiBcImh0dHA6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvbGV2ZWx1cC8tL2xldmVsdXAtMC4xOS4wLnRnelwiXG4gIH0sXG4gIFwiZGlyZWN0b3JpZXNcIjoge30sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvbGV2ZWx1cC8tL2xldmVsdXAtMC4xOS4wLnRnelwiLFxuICBcInJlYWRtZVwiOiBcIkVSUk9SOiBObyBSRUFETUUgZGF0YSBmb3VuZCFcIlxufVxuIixudWxsLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXMtYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG52YXIga01heExlbmd0aCA9IDB4M2ZmZmZmZmZcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAtIEltcGxlbWVudGF0aW9uIG11c3Qgc3VwcG9ydCBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcy5cbiAqICAgRmlyZWZveCA0LTI5IGxhY2tlZCBzdXBwb3J0LCBmaXhlZCBpbiBGaXJlZm94IDMwKy5cbiAqICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cbiAqXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleSB3aWxsXG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCB3aWxsIHdvcmsgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IChmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBuZXcgVWludDhBcnJheSgxKS5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBzdWJqZWN0ID4gMCA/IHN1YmplY3QgPj4+IDAgOiAwXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JylcbiAgICAgIHN1YmplY3QgPSBiYXNlNjRjbGVhbihzdWJqZWN0KVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnICYmIHN1YmplY3QgIT09IG51bGwpIHsgLy8gYXNzdW1lIG9iamVjdCBpcyBhcnJheS1saWtlXG4gICAgaWYgKHN1YmplY3QudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShzdWJqZWN0LmRhdGEpKVxuICAgICAgc3ViamVjdCA9IHN1YmplY3QuZGF0YVxuICAgIGxlbmd0aCA9ICtzdWJqZWN0Lmxlbmd0aCA+IDAgPyBNYXRoLmZsb29yKCtzdWJqZWN0Lmxlbmd0aCkgOiAwXG4gIH0gZWxzZVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3RhcnQgd2l0aCBudW1iZXIsIGJ1ZmZlciwgYXJyYXkgb3Igc3RyaW5nJylcblxuICBpZiAodGhpcy5sZW5ndGggPiBrTWF4TGVuZ3RoKVxuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKylcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKVxuICAgICAgICBidWZbaV0gPSAoKHN1YmplY3RbaV0gJSAyNTYpICsgMjU2KSAlIDI1NlxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW4gJiYgYVtpXSA9PT0gYltpXTsgaSsrKSB7fVxuICBpZiAoaSAhPT0gbGVuKSB7XG4gICAgeCA9IGFbaV1cbiAgICB5ID0gYltpXVxuICB9XG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0WywgbGVuZ3RoXSknKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHRvdGFsTGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggPj4+IDFcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbi8vIHByZS1zZXQgZm9yIHZhbHVlcyB0aGF0IG1heSBleGlzdCBpbiB0aGUgZnV0dXJlXG5CdWZmZXIucHJvdG90eXBlLmxlbmd0aCA9IHVuZGVmaW5lZFxuQnVmZmVyLnByb3RvdHlwZS5wYXJlbnQgPSB1bmRlZmluZWRcblxuLy8gdG9TdHJpbmcoZW5jb2RpbmcsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID09PSBJbmZpbml0eSA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcbiAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKGVuZCA8PSBzdGFydCkgcmV0dXJuICcnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAoYikge1xuICBpZighQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heClcbiAgICAgIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYilcbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKGJ5dGUpKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIGJpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiB1dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBiaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHV0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGJpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIGFzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW47XG4gICAgaWYgKHN0YXJ0IDwgMClcbiAgICAgIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKVxuICAgICAgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KVxuICAgIGVuZCA9IHN0YXJ0XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApXG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpXG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSlcbiAgICByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J1ZmZlciBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gdmFsdWVcbiAgfSBlbHNlIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbiAgfSBlbHNlIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9IHZhbHVlXG4gIH0gZWxzZSBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Ugb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9IHZhbHVlXG4gIH0gZWxzZSBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSB2YWx1ZVxuICB9IGVsc2Ugb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydClcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgaWYgKHRhcmdldF9zdGFydCA8IDAgfHwgdGFyZ2V0X3N0YXJ0ID49IHRhcmdldC5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gc291cmNlLmxlbmd0aCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHNvdXJjZS5sZW5ndGgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IHZhbHVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IHV0ZjhUb0J5dGVzKHZhbHVlLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICB9XG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5jb25zdHJ1Y3RvciA9IEJ1ZmZlclxuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuZXF1YWxzID0gQlAuZXF1YWxzXG4gIGFyci5jb21wYXJlID0gQlAuY29tcGFyZVxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtel0vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpIHtcbiAgICAgIGJ5dGVBcnJheS5wdXNoKGIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cbiIsInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDAsXG4gICAgICBkID0gaXNMRSA/IC0xIDogMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGMsXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApLFxuICAgICAgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpLFxuICAgICAgZCA9IGlzTEUgPyAxIDogLTEsXG4gICAgICBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwO1xuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpO1xuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcblxuICBlID0gKGUgPDwgbUxlbikgfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4O1xufTtcbiIsIlxuLyoqXG4gKiBpc0FycmF5XG4gKi9cblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIHRvU3RyaW5nXG4gKi9cblxudmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGB2YWxgXG4gKiBpcyBhbiBhcnJheS5cbiAqXG4gKiBleGFtcGxlOlxuICpcbiAqICAgICAgICBpc0FycmF5KFtdKTtcbiAqICAgICAgICAvLyA+IHRydWVcbiAqICAgICAgICBpc0FycmF5KGFyZ3VtZW50cyk7XG4gKiAgICAgICAgLy8gPiBmYWxzZVxuICogICAgICAgIGlzQXJyYXkoJycpO1xuICogICAgICAgIC8vID4gZmFsc2VcbiAqXG4gKiBAcGFyYW0ge21peGVkfSB2YWxcbiAqIEByZXR1cm4ge2Jvb2x9XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5IHx8IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuICEhIHZhbCAmJiAnW29iamVjdCBBcnJheV0nID09IHN0ci5jYWxsKHZhbCk7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZShcIi9Vc2Vycy9zZXRodmluY2VudC93b3Jrc3BhY2UvbW9zc3lvd2wvcGl6emEtY2xpY2tlci9ub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzXCIpIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuTXV0YXRpb25PYnNlcnZlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgdmFyIHF1ZXVlID0gW107XG5cbiAgICBpZiAoY2FuTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgICB2YXIgaGlkZGVuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXVlTGlzdCA9IHF1ZXVlLnNsaWNlKCk7XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgcXVldWVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGhpZGRlbkRpdiwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBoaWRkZW5EaXYuc2V0QXR0cmlidXRlKCd5ZXMnLCAnbm8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzXCIpXG4iLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKFwiL1VzZXJzL3NldGh2aW5jZW50L3dvcmtzcGFjZS9tb3NzeW93bC9waXp6YS1jbGlja2VyL25vZGVfbW9kdWxlcy9sZXZlbHVwL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fZHVwbGV4LmpzXCIpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZShcIi9Vc2Vycy9zZXRodmluY2VudC93b3Jrc3BhY2UvbW9zc3lvd2wvcGl6emEtY2xpY2tlci9ub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzXCIpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZShcIi9Vc2Vycy9zZXRodmluY2VudC93b3Jrc3BhY2UvbW9zc3lvd2wvcGl6emEtY2xpY2tlci9ub2RlX21vZHVsZXMvbGV2ZWx1cC9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qc1wiKSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoXCIvVXNlcnMvc2V0aHZpbmNlbnQvd29ya3NwYWNlL21vc3N5b3dsL3BpenphLWNsaWNrZXIvbm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV93cml0YWJsZS5qc1wiKSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanNcIilcbiIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoXCIvVXNlcnMvc2V0aHZpbmNlbnQvd29ya3NwYWNlL21vc3N5b3dsL3BpenphLWNsaWNrZXIvbm9kZV9tb2R1bGVzL2xldmVsdXAvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qc1wiKSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzXCIpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzXCIpXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW07XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmluaGVyaXRzKFN0cmVhbSwgRUUpO1xuU3RyZWFtLlJlYWRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLmpzJyk7XG5TdHJlYW0uV3JpdGFibGUgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vd3JpdGFibGUuanMnKTtcblN0cmVhbS5EdXBsZXggPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzJyk7XG5TdHJlYW0uVHJhbnNmb3JtID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcycpO1xuU3RyZWFtLlBhc3NUaHJvdWdoID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzJyk7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuNC54XG5TdHJlYW0uU3RyZWFtID0gU3RyZWFtO1xuXG5cblxuLy8gb2xkLXN0eWxlIHN0cmVhbXMuICBOb3RlIHRoYXQgdGhlIHBpcGUgbWV0aG9kICh0aGUgb25seSByZWxldmFudFxuLy8gcGFydCBvZiB0aGlzIGNsYXNzKSBpcyBvdmVycmlkZGVuIGluIHRoZSBSZWFkYWJsZSBjbGFzcy5cblxuZnVuY3Rpb24gU3RyZWFtKCkge1xuICBFRS5jYWxsKHRoaXMpO1xufVxuXG5TdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGlmIChkZXN0LndyaXRhYmxlKSB7XG4gICAgICBpZiAoZmFsc2UgPT09IGRlc3Qud3JpdGUoY2h1bmspICYmIHNvdXJjZS5wYXVzZSkge1xuICAgICAgICBzb3VyY2UucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2RhdGEnLCBvbmRhdGEpO1xuXG4gIGZ1bmN0aW9uIG9uZHJhaW4oKSB7XG4gICAgaWYgKHNvdXJjZS5yZWFkYWJsZSAmJiBzb3VyY2UucmVzdW1lKSB7XG4gICAgICBzb3VyY2UucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcblxuICAvLyBJZiB0aGUgJ2VuZCcgb3B0aW9uIGlzIG5vdCBzdXBwbGllZCwgZGVzdC5lbmQoKSB3aWxsIGJlIGNhbGxlZCB3aGVuXG4gIC8vIHNvdXJjZSBnZXRzIHRoZSAnZW5kJyBvciAnY2xvc2UnIGV2ZW50cy4gIE9ubHkgZGVzdC5lbmQoKSBvbmNlLlxuICBpZiAoIWRlc3QuX2lzU3RkaW8gJiYgKCFvcHRpb25zIHx8IG9wdGlvbnMuZW5kICE9PSBmYWxzZSkpIHtcbiAgICBzb3VyY2Uub24oJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub24oJ2Nsb3NlJywgb25jbG9zZSk7XG4gIH1cblxuICB2YXIgZGlkT25FbmQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gb25lbmQoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgZGVzdC5lbmQoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIGRlc3QuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgZGVzdC5kZXN0cm95KCk7XG4gIH1cblxuICAvLyBkb24ndCBsZWF2ZSBkYW5nbGluZyBwaXBlcyB3aGVuIHRoZXJlIGFyZSBlcnJvcnMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKEVFLmxpc3RlbmVyQ291bnQodGhpcywgJ2Vycm9yJykgPT09IDApIHtcbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgc3RyZWFtIGVycm9yIGluIHBpcGUuXG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuICBkZXN0Lm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gIC8vIHJlbW92ZSBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25kYXRhKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIGNsZWFudXApO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGVhbnVwKTtcblxuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG4gIH1cblxuICBzb3VyY2Uub24oJ2VuZCcsIGNsZWFudXApO1xuICBzb3VyY2Uub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5vbignY2xvc2UnLCBjbGVhbnVwKTtcblxuICBkZXN0LmVtaXQoJ3BpcGUnLCBzb3VyY2UpO1xuXG4gIC8vIEFsbG93IGZvciB1bml4LWxpa2UgdXNhZ2U6IEEucGlwZShCKS5waXBlKEMpXG4gIHJldHVybiBkZXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkYikge1xuICB2YXIgbWVzc2FnZSA9IHJlcXVpcmUoJy4vbWVzc2FnZScpKGRiKTtcbiAgdmFyIHN1cnByaXNlcyA9IHt9O1xuICAgIFxuICBzdXJwcmlzZXMuY2hlY2sgPSBmdW5jdGlvbiAoaSkge1xuICAgIGlmKHN1cnByaXNlc1tpLnRvU3RyaW5nKCldKSBzdXJwcmlzZXNbaS50b1N0cmluZygpXShpKTtcbiAgfTtcbiAgXG4gIHN1cnByaXNlc1snMTAnXSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgbWVzc2FnZS5zZW5kKCdZb3UgYXJlIGluIGEgPGJyPnBpenphIHBhcmxvci4nKTtcbiAgfTtcbiAgXG4gIHN1cnByaXNlc1snMjUnXSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgbWVzc2FnZS5zZW5kKCdBIG1hbiBsdXJrczxicj5hdCBhIG5lYXJieSBib290aC4nKTtcbiAgfTtcbiAgXG4gIHN1cnByaXNlc1snNTAnXSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgbWVzc2FnZS5zZW5kKCdZb3VyIHBpenphIHRhc3RlcyBnb29kLicpO1xuICB9O1xuICBcbiAgc3VycHJpc2VzWyc2MCddID0gZnVuY3Rpb24gKGkpIHtcbiAgICBtZXNzYWdlLnNlbmQoJ0J1dCB0aGUgbWFuIHN0aWxsIGx1cmtzLCA8YnI+c2lkZS1leWVpbmcgeW91ciBwaXp6YS4nKTtcbiAgfTtcbiAgXG4gIHN1cnByaXNlc1snMTAwJ10gPSBmdW5jdGlvbiAoaSkge1xuICAgIG1lc3NhZ2Uuc2VuZCgnVGhlIG1hbiBzbWFja3MgaGlzIGxpcHMgPGJyPmFzIGhlIGVhdHMgaGlzIHBpenphLicpO1xuICB9O1xuICBcbiAgc3VycHJpc2VzWycxMTAnXSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgbWVzc2FnZS5zZW5kKCdUaGUgbWFuIHNtYWNrcyBoaXMgbGlwcyA8YnI+YXMgaGUgc3RhcmVzIGF0IHlvdXIgcGl6emEuJyk7XG4gIH07XG4gIFxuICBzdXJwcmlzZXNbJzEyMCddID0gZnVuY3Rpb24gKGkpIHtcbiAgICBtZXNzYWdlLnNlbmQoJ1lvdSBwdXQgeW91ciBoYWxmLWVhdGVuIHNsaWNlIDxicj5kb3duIG9uIHlvdXIgcGxhdGUuJyk7XG4gIH07XG4gIFxuICByZXR1cm4gc3VycHJpc2VzO1xufVxuXG4iXX0=
