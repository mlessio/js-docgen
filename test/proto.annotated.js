/**
 * getVal
 * @return {any}
 * @throws {string}
 * */
TestClass.prototype.getVal = function () {
    return parseInt(this.aVal);
    throw 'asd';
};
/**
 * setVal
 * @param val {any}
 * */
TestClass.prototype.setVal = function (val) {
    this.aVal = val;
};