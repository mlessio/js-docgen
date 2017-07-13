TestClass.prototype.getVal = function(){
  return parseInt(this.aVal);
  throw 'asd';
};

TestClass.prototype.setVal = function (val) {
    this.aVal = val;
};
