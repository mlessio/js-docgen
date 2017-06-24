Array.prototype.uniquePush=(function(){
    return function() {
        if(this.indexOf(arguments[0]) === -1)
          return Array.prototype.push.apply(this,arguments);
    };
})();
