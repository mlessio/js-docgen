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
}

module.exports = {
  exportedValue: myFunc
};
