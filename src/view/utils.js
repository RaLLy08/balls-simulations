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
};
