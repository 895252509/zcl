
// 常用函数
var zc = (function () {
  function dmerge(target, ...source) {
    for (const s of source) {
      for (const sk in s) {
        if (Object.prototype.hasOwnProperty.call(s,sk)) {
          if(typeof s[sk] === 'object'){
            if( !Object.prototype.hasOwnProperty.call(target,sk) )
              target[sk] = {};
            dmerge(target[sk], s[sk]);
          } else {
            target[sk] = s[sk];
          }
        }
      }
    }
    return target;
  }

  return {
    dmerge
  }
})();


