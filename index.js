const fs = require("fs");
const esprima = require("esprima");
const path = require("path");
const escodegen = require("escodegen");

const fileData = fs.readFileSync(path.join(__dirname, "test/main.js"), "utf-8");
console.log(fileData);

var ast = esprima.parse(fileData, {comment: true, range: true, tokens: true});

console.log('Initial comments', ast.comments);
//analyze the first level
var annotations = {};
var annotationsLen = 0;
for(var i = 0, len = ast.body.length; i < len; i++){
  let el = ast.body[i];
  if(el.type === 'FunctionDeclaration'){
    console.log('found function!', el.range);
    annotations[el.range.join('|')] = analyzeFunction(el);
  }
}

Object.keys(annotations).forEach(function(el){
  console.log('Found comment at:', el);
  var comment = esprima.parse(annotations[el], {comment: true, range: true}).comments[0];
  var fRange = el.split('|');
  comment.range = [parseInt(fRange[0]), parseInt(fRange[0]) + comment.value.length];
  ast.comments.push(comment);
});

var b = ast.comments[2];
ast.comments[2] = ast.comments[1];
ast.comments[1] = b;

console.log('modded comments', ast.comments, '\n\n');

escodegen.attachComments(ast, ast.comments, ast.tokens);
var rebuiltData = escodegen.generate(ast, {comment: true});
console.log(rebuiltData);

function analyzeFunction(fun){
  var commentString = '/*\n * name: ';
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
  commentString += '\n*/';
  // console.log(commentString);
  return commentString;
}

function doesItThrow(fun){
  return false;
}
