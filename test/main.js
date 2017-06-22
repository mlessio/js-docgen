// This is an inline comment
const fs = require("fs");

var a = 12;

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

  throw Error("p2 is greater!!!");
  throw "p2 is greater!!!";
}

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

module.exports = {
  exportedValue: myFunc
};
