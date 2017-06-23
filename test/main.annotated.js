// This is an inline comment
const fs = require('fs');
var a = 12;
/**
 * myFunc
 * @param p1
 * @param p2
 * @async false
 * @return {boolean|any}
 * @throws {Error|string}
*/
//this is a prepended comment inline
function myFunc(p1, p2) {
    if (p1 === p2)
        return true;
    /* This is
     a multiline
     comment
  */
    if (p1 > p2) {
        return p1;
    }
    throw Error('p2 is greater!!!');
    throw 'p2 is greater!!!';
}
/**
 * test2
 * @param a
 * @param b
 * @param c
 * @async false
 * @return {any}
*/
/*this is a multiline prepended comment*/
function test2(a, b, c) {
    return a + b + c;
}
/**
 * test3
 * @param a
 * @param b
 * @async false
 * @return {any}
*/
function test3(a, b) {
    return a > b ? a : b;
}
/**
 * test4
 * @async false
 * @return {number}
*/
function test4() {
    return 5;
}
/**
 * test5
 * @async false
 * @return {any}
*/
function test5() {
    return test4();
}
/**
 * test6
 * @async false
 * @return {any}
 * @throws {Error}
*/
function test6() {
    throw new Error('asdf');
    return test5();
}
module.exports = { exportedValue: myFunc };