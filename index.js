const fs = require("fs");
const esprima = require("esprima");
const path = require("path");
const escodegen = require("escodegen");

const fileData = fs.readFileSync(path.join(__dirname, "test/main.js"), "utf-8");
console.log(fileData);

var ast = esprima.parse(fileData, {comment: true, tokens: true});

console.log('Initial comments', ast.comments);
//analyze the first level
var annotations = {};
var annotationsLen = 0;
for(var i = 0, len = ast.body.length; i < len; i++){
  let el = ast.body[i];
  if(el.type === 'FunctionDeclaration'){
    el.leadingComments = [{
      type: 'Block',
      value: analyzeFunction(el)
    }];
  }
}

//escodegen.attachComments(ast, ast.comments, ast.tokens);
var rebuiltData = escodegen.generate(ast, {comment: true});
console.log(rebuiltData);

function analyzeFunction(fun){
  var commentString = '* name: ';
  commentString += fun.id.name;
  commentString += '\n * number of params: '
  commentString += fun.params.length;
  commentString += '\n * ';
  if(fun.params)
    for(let p of fun.params)
      commentString += 'param: ' + p.name + '\n * ';
  commentString += 'async: ' + fun.async;
  commentString += '\n * '
  commentString += 'throws: ' + fun.async;
  commentString += '\n';
  // console.log(commentString);
  return commentString;
}

function doesItThrow(fun){
  return false;
}
