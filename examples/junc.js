(function() {
  var Actor, AnimationFrameTicker, Easing, EasingActor, FunctionActor, GroupActor, Junc, ParallelActor, RepeatActor, SerialActor, WaitActor, _PI, _PI_D, _PI_H, _abs, _asin, _cos, _isArray, _pow, _requestAnimationFrame, _sin, _slice, _sqrt,
    __slice = Array.prototype.slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _slice = Array.prototype.slice;

  _PI = Math.PI;

  _PI_D = _PI * 2;

  _PI_H = _PI / 2;

  _abs = Math.abs;

  _pow = Math.pow;

  _sqrt = Math.sqrt;

  _sin = Math.sin;

  _cos = Math.cos;

  _asin = Math.asin;

  _requestAnimationFrame = (function() {
    return (typeof window !== "undefined" && window !== null ? window.requestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.webkitRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.mozRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.msRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.oRequestAnimationFrame : void 0) || function(callback) {
      return setTimeout((function() {
        return callback(new Date().getTime());
      }), 16.666666666666668);
    };
  })();

  _isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Junc = (function() {

    function Junc() {}

    Junc.func = function(func) {
      return new FunctionActor(func);
    };

    Junc.wait = function(delay) {
      return new WaitActor(delay);
    };

    Junc.serial = function() {
      var actors;
      actors = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (_isArray(actors[0])) actors = actors[0];
      return new SerialActor(actors);
    };

    Junc.parallel = function() {
      var actors;
      actors = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (_isArray(actors[0])) actors = actors[0];
      return new ParallelActor(actors);
    };

    Junc.repeat = function(actor, repeatCount) {
      return new RepeatActor(actor, repeatCount);
    };

    Junc.tween = function(target, src, dst, duration, easing) {
      if (duration == null) duration = 1000;
      if (easing == null) easing = Easing.linear;
      return new EasingActor(target, src, dst, duration, easing);
    };

    Junc.to = function(target, dst, duration, easing) {
      if (duration == null) duration = 1000;
      if (easing == null) easing = Easing.linear;
      return new EasingActor(target, null, dst, duration, easing);
    };

    return Junc;

  })();

  Actor = (function() {

    function Actor() {
      this.root = this;
    }

    Actor.prototype.start = function() {
      if (this._running) this.stop();
      this._reset();
      this._running = true;
      return this;
    };

    Actor.prototype.stop = function() {
      this._running = false;
      return this;
    };

    Actor.prototype.complete = function(callback) {
      this.onComplete = callback;
      return this;
    };

    Actor.prototype._reset = function() {
      if (this === this.root) return this.global = {};
    };

    Actor.prototype._onStart = function() {
      return typeof this.onStart === "function" ? this.onStart(this) : void 0;
    };

    Actor.prototype._onComplete = function(args) {
      var _ref;
      if (this._running) {
        this._running = false;
        return (_ref = this.onComplete) != null ? _ref.apply(this, args) : void 0;
      }
    };

    return Actor;

  })();

  FunctionActor = (function(_super) {

    __extends(FunctionActor, _super);

    function FunctionActor(func) {
      this.func = func;
      this.next = __bind(this.next, this);
      FunctionActor.__super__.constructor.call(this);
      if (typeof this.func !== 'function') {
        throw new TypeError('Arguments[0] of FunctionActor must be inspected Function.');
      }
    }

    FunctionActor.prototype.start = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      FunctionActor.__super__.start.call(this);
      this.func.apply(this, args);
      return this;
    };

    FunctionActor.prototype.next = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this._onComplete(args);
      return this;
    };

    return FunctionActor;

  })(Actor);

  WaitActor = (function(_super) {

    __extends(WaitActor, _super);

    function WaitActor(delay) {
      WaitActor.__super__.constructor.call(this, (function() {
        return setTimeout(this.next, delay);
      }), null, true);
    }

    return WaitActor;

  })(FunctionActor);

  GroupActor = (function(_super) {

    __extends(GroupActor, _super);

    function GroupActor(actors) {
      var actor, _i, _len;
      GroupActor.__super__.constructor.call(this);
      for (_i = 0, _len = actors.length; _i < _len; _i++) {
        actor = actors[_i];
        if (!(actor instanceof Actor || actor === Junc.serial || actor === Junc.parallel)) {
          throw new TypeError('Arguments[0] of GroupActor must be inspected Array of Actor.');
        }
      }
      this._src = actors;
    }

    GroupActor.prototype.stop = function() {
      var actor, _i, _len, _ref;
      GroupActor.__super__.stop.call(this);
      _ref = this._dst;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        if (actor instanceof Actor) actor.stop();
      }
      return this;
    };

    GroupActor.prototype._reset = function() {
      var actor, _i, _len, _ref;
      GroupActor.__super__._reset.call(this);
      this._dst = [];
      this.local = {};
      this.local.index = 0;
      this.local.length = this._src.length;
      if (this === this.root) this.global.index = 0;
      _ref = this._src;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        if (typeof actor._reset === "function") actor._reset();
      }
    };

    GroupActor.prototype._act = function(actor, args) {
      var _ref,
        _this = this;
      if (this.local.index < this.local.length) {
        actor.root = this.root;
        actor.skip = function() {
          _this.local.index = _this.local.length;
          return _this._onComplete();
        };
        if (!(actor instanceof RepeatActor)) actor.repeatRoot = this.repeatRoot;
        actor.global = this.global;
        actor.repeat = (_ref = this.repeatRoot) != null ? _ref.repeat : void 0;
        if (actor instanceof GroupActor) {
          return actor.start(args);
        } else {
          actor.local = this.local;
          return actor.start.apply(actor, args);
        }
      }
    };

    return GroupActor;

  })(Actor);

  SerialActor = (function(_super) {

    __extends(SerialActor, _super);

    function SerialActor(actors) {
      this.next = __bind(this.next, this);      SerialActor.__super__.constructor.call(this, actors);
    }

    SerialActor.prototype.start = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      SerialActor.__super__.start.call(this);
      if (this.local.index < this.local.length) {
        this._act(this._getCurrentActor(args), args);
        this._onStart();
      }
      return this;
    };

    SerialActor.prototype.next = function() {
      var actor, args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      actor = this._dst[this.local.index];
      this.local.index++;
      if (actor instanceof GroupActor) {
        this.global.index = this.root.global.index;
      } else {
        this.root.global.index++;
      }
      if (this.local.index < this.local.length) {
        actor = this._getCurrentActor(args);
        this._act(actor, args);
      } else if (this.local.index === this.local.length) {
        this._onComplete(args);
      }
      return this;
    };

    SerialActor.prototype._getCurrentActor = function(args) {
      var actor;
      actor = this._src[this.local.index];
      if (actor === Junc.serial || actor === Junc.parallel) {
        actor = actor.apply(Junc, args);
        while (args.length) {
          args.pop();
        }
      }
      this._dst[this.local.index] = actor;
      return actor;
    };

    SerialActor.prototype._act = function(actor, args) {
      actor.onComplete = this.next;
      return SerialActor.__super__._act.call(this, actor, args);
    };

    return SerialActor;

  })(GroupActor);

  RepeatActor = (function(_super) {

    __extends(RepeatActor, _super);

    function RepeatActor(actor, repeatCount) {
      var actors;
      actors = [];
      while (repeatCount--) {
        actors.push(actor);
      }
      RepeatActor.__super__.constructor.call(this, actors);
      this.repeatRoot = this;
    }

    RepeatActor.prototype.next = function() {
      this.repeat.index++;
      return RepeatActor.__super__.next.call(this);
    };

    RepeatActor.prototype._reset = function() {
      RepeatActor.__super__._reset.call(this);
      return this.repeat = {
        index: 0,
        length: this._src.length
      };
    };

    return RepeatActor;

  })(SerialActor);

  ParallelActor = (function(_super) {

    __extends(ParallelActor, _super);

    function ParallelActor(actors) {
      this.next = __bind(this.next, this);      ParallelActor.__super__.constructor.call(this, actors);
      this.argsStorage = [];
    }

    ParallelActor.prototype.start = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ParallelActor.__super__.start.call(this);
      if (this.local.index < this.local.length) {
        this._act(args);
        this._onStart();
      }
      return this;
    };

    ParallelActor.prototype.next = function() {
      var args, i,
        _this = this;
      i = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.argsStorage[i] = args;
      setTimeout((function() {
        _this.local.index++;
        _this.root.global.index++;
        if (_this.local.index >= _this.local.length) {
          _this.local.index = _this.local.length;
          return _this._onComplete(_this.argsStorage);
        }
      }), 0);
      return this;
    };

    ParallelActor.prototype._act = function(args) {
      var actor, i, _len, _ref, _results,
        _this = this;
      _ref = this._src;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        actor = _ref[i];
        actor.onComplete = (function(i) {
          return function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            args.unshift(i);
            return _this.next.apply(_this, args);
          };
        })(i);
        _results.push(ParallelActor.__super__._act.call(this, actor, args));
      }
      return _results;
    };

    return ParallelActor;

  })(GroupActor);

  EasingActor = (function(_super) {

    __extends(EasingActor, _super);

    EasingActor._getStyle = function(element) {
      return getComputedStyle(element, '') || element.currentStyle;
    };

    function EasingActor(target, src, dst, duration, easing) {
      this.src = src;
      this.dst = dst;
      this.duration = duration;
      this.easing = easing;
      this._update = __bind(this._update, this);
      EasingActor.__super__.constructor.call(this);
      if ((typeof window !== "undefined" && window !== null) && target instanceof window.HTMLElement) {
        this.target = target.style;
        this.object = EasingActor._getStyle(target);
      } else {
        this.target = this.object = target;
      }
      this._requestAnimationFrame = AnimationFrameTicker.getInstance();
    }

    EasingActor.prototype.start = function() {
      var changer, changers, checkList, dst, object, prop, src, srcOrDst, type, value, _i, _len;
      EasingActor.__super__.start.call(this);
      object = this.object;
      src = this.src;
      dst = this.dst;
      changers = {};
      checkList = ['src', 'dst'];
      for (prop in src) {
        value = src[prop];
        if (changers[prop] == null) changers[prop] = {};
        changers[prop].src = value;
      }
      for (prop in dst) {
        value = dst[prop];
        if (changers[prop] == null) changers[prop] = {};
        changers[prop].dst = value;
      }
      for (prop in changers) {
        changer = changers[prop];
        for (_i = 0, _len = checkList.length; _i < _len; _i++) {
          srcOrDst = checkList[_i];
          value = changer[srcOrDst];
          if (value == null) value = object[prop];
          type = typeof value;
          if (type === 'number') {
            changer[srcOrDst] = value;
          } else if (type === 'string') {
            value = value.match(/(\d+)(\D*)/);
            changer[srcOrDst] = Number(value[1]);
            if (changer.unit == null) {
              changer.unit = value[2] != null ? value[2] : '';
            }
          }
        }
      }
      this.changers = changers;
      this._beginningTime = new Date().getTime();
      this._requestAnimationFrame.addHandler(this._update);
      if (typeof this.onStart === "function") this.onStart();
      return this;
    };

    EasingActor.prototype._update = function(time) {
      var changer, changers, current, factor, prop, target;
      this.time = time - this._beginningTime;
      if (this.time >= this.duration) {
        this.time = this.duration;
        factor = 1;
        this._requestAnimationFrame.removeHandler(this._update);
      } else {
        factor = this.easing(this.time, 0, 1, this.duration);
      }
      target = this.target;
      changers = this.changers;
      for (prop in changers) {
        changer = changers[prop];
        current = changer.src + (changer.dst - changer.src) * factor;
        target[prop] = changer.unit ? "" + current + changer.unit : current;
      }
      if (typeof this.onUpdate === "function") this.onUpdate();
      if (this.time === this.duration) this._onComplete();
    };

    return EasingActor;

  })(Actor);

  AnimationFrameTicker = (function() {

    AnimationFrameTicker.getInstance = function() {
      if (this.instance == null) {
        this.internal = true;
        this.instance = new AnimationFrameTicker;
      }
      return this.instance;
    };

    function AnimationFrameTicker() {
      this._onAnimationFrame = __bind(this._onAnimationFrame, this);
      this.addHandler = __bind(this.addHandler, this);      if (!AnimationFrameTicker.internal) {
        throw new Error("Ticker is singleton model, call Ticker.getInstance().");
      }
      AnimationFrameTicker.internal = false;
      this._handlers = [];
      this._continuous = false;
      this._counter = 0;
    }

    AnimationFrameTicker.prototype.addHandler = function(handler) {
      this._handlers.push(handler);
      if (this._continuous === false) {
        this._continuous = true;
        _requestAnimationFrame(this._onAnimationFrame);
      }
    };

    AnimationFrameTicker.prototype.removeHandler = function(handler) {
      this._handlers.splice(this._handlers.indexOf(handler), 1);
      if (this._handlers.length === 0) this._continuous = false;
    };

    AnimationFrameTicker.prototype._onAnimationFrame = function(time) {
      var handler, _fn, _i, _len, _ref;
      this._counter++;
      _ref = this._handlers;
      _fn = function(handler) {
        return setTimeout((function() {
          return handler(time);
        }), 0);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _fn(handler);
      }
      if (this._continuous === true) {
        _requestAnimationFrame(this._onAnimationFrame);
      }
    };

    return AnimationFrameTicker;

  })();

  Easing = (function() {

    function Easing() {}

    Easing.linear = function(t, b, c, d) {
      return c * t / d + b;
    };

    Easing.easeInQuad = function(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    };

    Easing.easeOutQuad = function(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    };

    Easing.easeInOutQuad = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t + b;
      } else {
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
    };

    Easing.easeOutInQuad = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return -c / 2 * t * (t - 2) + b;
      } else {
        t--;
        return c / 2 * (t * t + 1) + b;
      }
    };

    Easing.easeInCubic = function(t, b, c, d) {
      t /= d;
      return c * t * t * t + b;
    };

    Easing.easeOutCubic = function(t, b, c, d) {
      t = t / d - 1;
      return c * (t * t * t + 1) + b;
    };

    Easing.easeInOutCubic = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t * t + b;
      } else {
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      }
    };

    Easing.easeOutInCubic = function(t, b, c, d) {
      t = t * 2 / d - 1;
      return c / 2 * (t * t * t + 1) + b;
    };

    Easing.easeInQuart = function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t + b;
    };

    Easing.easeOutQuart = function(t, b, c, d) {
      t = t / d - 1;
      return -c * (t * t * t * t - 1) + b;
    };

    Easing.easeInOutQuart = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
      }
    };

    Easing.easeOutInQuart = function(t, b, c, d) {
      t = t * 2 / d - 1;
      if (t < 0) {
        return -c / 2 * (t * t * t * t - 1) + b;
      } else {
        return c / 2 * (t * t * t * t + 1) + b;
      }
    };

    Easing.easeInQuint = function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t * t + b;
    };

    Easing.easeOutQuint = function(t, b, c, d) {
      t = t / d - 1;
      return c * (t * t * t * t * t + 1) + b;
    };

    Easing.easeInOutQuint = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
      }
    };

    Easing.easeOutInQuint = function(t, b, c, d) {
      t = t * 2 / d - 1;
      return c / 2 * (t * t * t * t * t + 1) + b;
    };

    Easing.easeInExpo = function(t, b, c, d) {
      return c * _pow(2, 10 * (t / d - 1)) + b;
    };

    Easing.easeOutExpo = function(t, b, c, d) {
      return c * (1 - _pow(2, -10 * t / d)) + b;
    };

    Easing.easeInOutExpo = function(t, b, c, d) {
      t = t * 2 / d - 1;
      if (t < 0) {
        return c / 2 * _pow(2, 10 * t) + b;
      } else {
        return c / 2 * (2 - _pow(2, -10 * t)) + b;
      }
    };

    Easing.easeOutInExpo = function(t, b, c, d) {
      t *= 2 / d;
      if (t === 1) {
        return c / 2 + b;
      } else if (t < 1) {
        return c / 2 * (1 - _pow(2, -10 * t)) + b;
      } else {
        return c / 2 * (1 + _pow(2, 10 * (t - 2))) + b;
      }
    };

    Easing.easeInSine = function(t, b, c, d) {
      return -c * (_cos(t / d * _PI_H) - 1) + b;
    };

    Easing.easeOutSine = function(t, b, c, d) {
      return c * _sin(t / d * _PI_H) + b;
    };

    Easing.easeInOutSine = function(t, b, c, d) {
      return -c / 2 * (_cos(_PI * t / d) - 1) + b;
    };

    Easing.easeOutInSine = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * _sin(t * _PI_H) + b;
      } else {
        return -c / 2 * (_cos((t - 1) * _PI_H) - 2) + b;
      }
    };

    Easing.easeInCirc = function(t, b, c, d) {
      t /= d;
      return -c * (_sqrt(1 - t * t) - 1) + b;
    };

    Easing.easeOutCirc = function(t, b, c, d) {
      t = t / d - 1;
      return c * _sqrt(1 - t * t) + b;
    };

    Easing.easeInOutCirc = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return -c / 2 * (_sqrt(1 - t * t) - 1) + b;
      } else {
        t -= 2;
        return c / 2 * (_sqrt(1 - t * t) + 1) + b;
      }
    };

    Easing.easeOutInCirc = function(t, b, c, d) {
      t = t * 2 / d - 1;
      if (t < 0) {
        return c / 2 * _sqrt(1 - t * t) + b;
      } else {
        return -c / 2 * (_sqrt(1 - t * t) - 2) + b;
      }
    };

    Easing.easeInBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s;
        t /= d;
        return c * t * t * ((_s + 1) * t - _s) + b;
      };
    };

    Easing.easeInBack = Easing.easeInBackWith();

    Easing.easeOutBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s;
        t = t / d - 1;
        return c * (t * t * ((_s + 1) * t + _s) + 1) + b;
      };
    };

    Easing.easeOutBack = Easing.easeOutBackWith();

    Easing.easeInOutBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s * 1.525;
        t *= 2 / d;
        if (t < 1) {
          return c / 2 * (t * t * ((_s + 1) * t - _s)) + b;
        } else {
          t -= 2;
          return c / 2 * (t * t * ((_s + 1) * t + _s) + 2) + b;
        }
      };
    };

    Easing.easeInOutBack = Easing.easeInOutBackWith();

    Easing.easeOutInBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s;
        t = t * 2 / d - 1;
        if (t < 0) {
          return c / 2 * (t * t * ((_s + 1) * t + _s) + 1) + b;
        } else {
          return c / 2 * (t * t * ((_s + 1) * t - _s) + 1) + b;
        }
      };
    };

    Easing.easeOutInBack = Easing.easeOutInBackWith();

    Easing.easeInBounce = function(t, b, c, d) {
      t = 1 - t / d;
      if (t < 0.36363636363636365) {
        return -c * (7.5625 * t * t - 1) + b;
      } else if (t < 0.7272727272727273) {
        t -= 0.5454545454545454;
        return -c * (7.5625 * t * t - 0.25) + b;
      } else if (t < 0.9090909090909091) {
        t -= 0.8181818181818182;
        return -c * (7.5625 * t * t - 0.0625) + b;
      } else {
        t -= 0.9545454545454546;
        return -c * (7.5625 * t * t - 0.015625) + b;
      }
    };

    Easing.easeOutBounce = function(t, b, c, d) {
      t /= d;
      if (t < 0.36363636363636365) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 0.7272727272727273) {
        t -= 0.5454545454545454;
        return c * (7.5625 * t * t + 0.75) + b;
      } else if (t < 0.9090909090909091) {
        t -= 0.8181818181818182;
        return c * (7.5625 * t * t + 0.9375) + b;
      } else {
        t -= 0.9545454545454546;
        return c * (7.5625 * t * t + 0.984375) + b;
      }
    };

    Easing.easeInOutBounce = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        t = 1 - t;
        if (t < 0.36363636363636365) {
          return -c / 2 * (7.5625 * t * t - 1) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return -c / 2 * (7.5625 * t * t - 0.25) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return -c / 2 * (7.5625 * t * t - 0.0625) + b;
        } else {
          t -= 0.9545454545454546;
          return -c / 2 * (7.5625 * t * t - 0.015625) + b;
        }
      } else {
        t -= 1;
        if (t < 0.36363636363636365) {
          return c / 2 * (7.5625 * t * t + 1) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return c / 2 * (7.5625 * t * t + 1.75) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return c / 2 * (7.5625 * t * t + 1.9375) + b;
        } else {
          t -= 0.9545454545454546;
          return c / 2 * (7.5625 * t * t + 1.984375) + b;
        }
      }
    };

    Easing.easeOutInBounce = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        if (t < 0.36363636363636365) {
          return c / 2 * (7.5625 * t * t) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return c / 2 * (7.5625 * t * t + 0.75) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return c / 2 * (7.5625 * t * t + 0.9375) + b;
        } else {
          t -= 0.9545454545454546;
          return c / 2 * (7.5625 * t * t + 0.984375) + b;
        }
      } else {
        t = 2 - t;
        if (t < 0.36363636363636365) {
          return -c / 2 * (7.5625 * t * t - 2) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return -c / 2 * (7.5625 * t * t - 1.25) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return -c / 2 * (7.5625 * t * t - 1.0625) + b;
        } else {
          t -= 0.9545454545454546;
          return -c / 2 * (7.5625 * t * t - 1.015625) + b;
        }
      }
    };

    Easing.easeInElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t = t / d - 1;
        if (_p === 0) _p = d * 0.3;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_D * _asin(c / _a);
        }
        return -_a * _pow(2, 10 * t) * _sin((t * d - s) * _PI_D / _p) + b;
      };
    };

    Easing.easeInElastic = Easing.easeInElasticWith();

    Easing.easeOutElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t /= d;
        if (_p === 0) _p = d * 0.3;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_D * _asin(c / _a);
        }
        return _a * _pow(2, -10 * t) * _sin((t * d - s) * _PI_D / _p) + b + c;
      };
    };

    Easing.easeOutElastic = Easing.easeOutElasticWith();

    Easing.easeInOutElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t = t * 2 / d - 1;
        if (_p === 0) _p = d * 0.45;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_D * _asin(c / _a);
        }
        if (t < 0) {
          return -_a / 2 * _pow(2, 10 * t) * _sin((t * d - s) * _PI_D / _p) + b;
        } else {
          return _a / 2 * _pow(2, -10 * t) * _sin((t * d - s) * _PI_D / _p) + b + c;
        }
      };
    };

    Easing.easeInOutElastic = Easing.easeInOutElasticWith();

    Easing.easeOutInElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t = t * 2 / d;
        c /= 2;
        if (_p === 0) _p = d * 0.3;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_D * _asin(c / _a);
        }
        if (t < 1) {
          return _a * _pow(2, -10 * t) * _sin((t * d - s) * _PI_D / _p) + b + c;
        } else {
          t -= 2;
          return -_a * _pow(2, 10 * t) * _sin((t * d - s) * _PI_D / _p) + b + c;
        }
      };
    };

    Easing.easeOutInElastic = Easing.easeOutInElasticWith();

    return Easing;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Junc;
  } else if (typeof define !== "undefined" && define !== null) {
    define(function() {
      return Junc;
    });
  } else if (typeof window !== "undefined" && window !== null) {
    if (window.mn == null) window.mn = {};
    if (window.mn.dsk == null) window.mn.dsk = {};
    window.mn.dsk.Junc = Junc;
    window.mn.dsk.Easing = Easing;
    window.mn.dsk.AnimationFrameTicker = AnimationFrameTicker;
  }

}).call(this);
