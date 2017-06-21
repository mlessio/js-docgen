const fs = require("fs");
const esprima = require("esprima");
const path = require("path");
var traverse = require("ast-traverse");

const escodegen = require("escodegen");

const fileData = fs.readFileSync(path.join(__dirname, "test/main.js"), "utf-8");

var ast = esprima.parse(fileData, {comment: true});

//analyze the first level
// for(var i = 0, len = ast.body.length; i < len; i++){
//   let el = ast.body[i];
//   if(el.type === 'FunctionDeclaration'){
//     el.leadingComments = [{
//       type: 'Block',
//       value: analyzeFunction(el)
//     }];
//   }
// }

traverse(ast, {pre: function(node, parent, prop, idx) {
    // console.log(node.type + (parent ? " from parent " + parent.type +
    //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
    if(node.type === 'FunctionDeclaration'){
      node.leadingComments = [{
        type: 'Block',
        value: analyzeFunction(node)
      }];
    }
}});
console.log('traversed!');

//escodegen.attachComments(ast, ast.comments, ast.tokens);
var rebuiltData = escodegen.generate(ast, {comment: true});
console.log(rebuiltData);

function analyzeFunction(fun){
  var commentString = '\n * ';
  commentString += fun.id.name;
  commentString += '\n * ';
  if(fun.params)
    for(let p of fun.params)
      commentString += '@param ' + p.name + '\n * ';
  commentString += '@async ' + fun.async;
  commentString += '\n'
  let rTypes = doesItReturn(fun);
  if(rTypes.length > 0){
    commentString += ' * @return {' + rTypes.join('|') + '}';
    commentString += '\n'
  }
  let tTypes = doesItThrow(fun);
  if(tTypes.length > 0){
    commentString += ' * @throws {' + tTypes.join('|') + '}';
    commentString += '\n';
  }
  // console.log(commentString);
  return commentString;
}

function doesItReturn(fun){
  var rTypes = [];
  traverse(fun, {pre: function(node, parent, prop, idx) {
      // console.log(node.type + (parent ? " from parent " + parent.type +
      //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
      if(node.type === 'ReturnStatement'){
        if(node.argument.value != null)
          rTypes.push(typeof node.argument.value);
        else if(node.argument.type === 'Identifier')
          rTypes.push('any');
      }
  }});
  return rTypes;
}

function doesItThrow(fun){
  var tTypes = [];
  traverse(fun, {pre: function(node, parent, prop, idx) {
      // console.log(node.type + (parent ? " from parent " + parent.type +
      //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
      if(node.type === 'ThrowStatement'){
        if(node.argument.value != null)
          tTypes.push(typeof node.argument.value);
        else if(node.argument.type === 'CallExpression'){
          if(node.argument.callee)
            tTypes.push(node.argument.callee.name)
          else
            tTypes.push('any');
        }
      }
  }});
  return tTypes;
}
