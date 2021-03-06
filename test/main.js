// This is an inline comment
const fs = require("fs");

var a = 12;

//this is a prepended comment inline
function myFunc(p1, p2){
  if(p1 === p2)
    return true;

  /* This is
     a multiline
     comment
  */
  if(p1 > p2){
    return p1;
  }

  throw MyError("p2 is greater!!!");
  throw "p2 is greater!!!";
}

/*this is a multiline prepended comment*/
function test2(a, b, c){
  return a+b+c;
}

function test3(a, b){
  return a > b ? a : b;
}

function test4(){
  return 5;
}

function test5(){
  return test4();
}

function test6(){
  throw new Error("asdf");
  return test5();
}

function noreturn(){
  var f = 1;
}

function voidreturn(){
  var f = 1;
  return;
}

function throwCatch(){
  var f = 1;

  try{
    throw new Error("asdf");
    return 0;
  }catch(e){
    return true;
    throw "str";
  }
  throw 1;
  return;
}

//helps the inference engine context
myFunc(11,22);

module.exports = {
  exportedValue: myFunc
};
