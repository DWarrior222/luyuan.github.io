function animate(obj,targetJSON,time,tweenString,callback) {
  if(arguments.length < 3
    || arguments.length > 5
    || typeof arguments[0] != 'object'
    || typeof arguments[1] != 'object'
    || typeof arguments[2] != 'number') {
    throw new Error('请仔细检查三个参数');
  } else if(arguments.length === 3) {
    tweenString = 'Linear';
    callback = null;
  } else if(arguments.length === 4) {
    // if(typeof arguments[3] === 'function') {
    //   tweenString = 'Linear';
    //   callback = arguments[3]
    // } else {
    //   callback = null
    // };
    switch(typeof arguments[3]) {
      case 'function':
        callback = arguments[3];
        tweenString = 'Linear';
        break;
      case 'string':
        callback = null;
        break;
      default:
        throw new Error('请检查第四个参数是否为缓冲函数名或者函数')
    } 
  }
  //友好：检查参数是五个时的情况；
   else if(arguments.length === 5) {
      if(typeof arguments[3] != 'string') throw new Error("请检查第4个参数")
        else {//检查是否存在该缓冲字符串
          if(!Tween[tweenString]) throw new Error("请检查第4个参数")
        }
      if(typeof arguments[4] != 'function') throw new Error("请检查第5个参数")
    }

  if(navigator.userAgent.indexOf('MSIE') != -1) {
    interval = 50;
  } else {
    interval = 20;
  }

  //总共需要初始位置，开始结束的变化量，总帧数，当前帧数



  var frames = time / interval;
   //初始状态，也表示信号量
  var originalJSON = {};
  //变化量对象
  var deltaJSON = {};

  for(var k in targetJSON) {
    originalJSON[k] = parseFloat(fetchComputedStyle(obj,k));
    deltaJSON[k] = (targetJSON[k] - originalJSON[k]);
  }

  var frame = 0;
  obj.isAnimated = true;
  var timer = setInterval(function() {
    for(var k in targetJSON) {
      nowLocation = Tween[tweenString](frame,originalJSON[k],deltaJSON[k],frames)
      if(k != 'opacity') {
        obj.style[k] = nowLocation + 'px';
      } else {
        obj.style[k] = nowLocation;
        obj.style.filter = "alpha(opacity = " + nowLocation*100 + ")";
      }
    }
    frame++;
    if(frame > frames){
      for(var k in targetJSON) {
        if(k != 'opacity') {
          obj.style[k] = targetJSON[k] + 'px';
        } else {
          obj.style[k] = targetJSON[k];
          obj.style.filter = "alpha(opacity = " + targetJSON[k]*100 + ")";
        }
      }
      clearInterval(timer);
      obj.isAnimated = false;
      callback && callback.call(obj)
    }
  },interval)
}


function fetchComputedStyle(obj, property) {
  if (window.getComputedStyle) {
    property = property.replace(/[A-Z]/g, function(match){
      return '-' + match.toLowerCase();
    });
    return window.getComputedStyle(obj)[property]; //中括号里面可以是变量
  } else {
    property = property.replace(/-([a-z])/g, function(match, $1){
      return $1.toUpperCase();
    });
    return obj.currentStyle[property];
  }
}
//不断更新类似的方法；
var Tween = {
  Linear: function(t,b,c,d){ return c*t/d + b; },
  QuadEaseIn: function(t,b,c,d){
    return c*(t/=d)*t + b;
  },
  QuadEaseOut: function(t,b,c,d){
    return -c *(t/=d)*(t-2) + b;
  },
  QuadEaseInOut: function(t,b,c,d){
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  CubicEaseIn: function(t,b,c,d){
      return c*(t/=d)*t*t + b;
    },
    CubicEaseOut: function(t,b,c,d){
      return c*((t=t/d-1)*t*t + 1) + b;
    },
    CubicEaseInOut: function(t,b,c,d){
      if ((t/=d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
  },
  QuartEaseIn: function(t,b,c,d){
      return c*(t/=d)*t*t*t + b;
    },
    QuartEaseOut: function(t,b,c,d){
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    QuartEaseInOut: function(t,b,c,d){
      if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
      return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  QuintEaseIn: function(t,b,c,d){
    return c*(t/=d)*t*t*t*t + b;
  },
  QuintEaseOut: function(t,b,c,d){
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  QuintEaseInOut: function(t,b,c,d){
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  SineEaseIn: function(t,b,c,d){
      return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    SineEaseOut: function(t,b,c,d){
      return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    SineEaseInOut: function(t,b,c,d){
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  ExpoEaseIn: function(t,b,c,d){
      return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    ExpoEaseOut: function(t,b,c,d){
      return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    ExpoEaseInOut: function(t,b,c,d){
      if (t==0) return b;
      if (t==d) return b+c;
      if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  CircEaseIn: function(t,b,c,d){
      return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    CircEaseOut: function(t,b,c,d){
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    CircEaseInOut: function(t,b,c,d){
      if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;

  },
  ElasticEaseIn: function(t,b,c,d,a,p){
      if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
      if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    ElasticEaseOut: function(t,b,c,d,a,p){
      if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
      if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
    },
    ElasticEaseInOut: function(t,b,c,d,a,p){
      if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
      if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    
  },
  BackEaseIn: function(t,b,c,d,s){
      if (s == undefined) s = 1.70158;
      return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    BackEaseOut: function(t,b,c,d,s){
      if (s == undefined) s = 1.70158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    BackEaseInOut: function(t,b,c,d,s){
      if (s == undefined) s = 1.70158;
      if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  BounceEaseIn: function(t,b,c,d){
      return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
    },
    BounceEaseOut: function(t,b,c,d){
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      }
    },
    BounceEaseInOut: function(t,b,c,d){
      if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
      else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
}
