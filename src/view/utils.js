function throttle(func, wait) {
    let timeout;
    let lastArgs;
    return function(...args) {
      lastArgs = args;
    
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func(...lastArgs);
        }, wait);
      }
    };
}

function truncTo(value, point) {
  const k = 10**point;
  return Math.trunc(value * k) / k
}