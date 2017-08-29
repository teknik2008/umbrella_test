Object.defineProperty(global, '__stack', {
    get: function(){
      var orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack){ return stack; };
      var err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      var stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    }
  });
  
  Object.defineProperty(global, '__line', {
    get: function(){
      return __stack[2].getLineNumber();
    }
  });
  
  module.exports = function (_module) {
      return function lo() {
          let path= _module.id//.replace(/.+vk\-store\\(.+)/,'$1')
          path = path.replace(/\\/g,'/')
          console.log('\x1b[33m%s\x1b[0m','@ '+path+':'+__line);
          let l = lo.arguments.length;
  
          for (let i = 0; i < l; i++) {
              let s = (i + 1) >= l ? '┕' : '┝';
              let view=lo.arguments[i]
              let color=typeof view=='object'&& view instanceof Error?'\x1b[0m%s\x1b[41m%S':'\x1b[33m%s\x1b[0m'
              console.log(color, s, view)
          }
      }
  };