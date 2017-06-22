const fs = require("fs");
const esprima = require("esprima");
const path = require("path");
var traverse = require("ast-traverse");

const escodegen = require("escodegen");

Array.prototype.uniquePush=(function(){
    return function() {
        if(this.indexOf(arguments[0]) === -1)
          return Array.prototype.push.apply(this,arguments);
    };
})();


var fileName = '';

if(process.argv[2] === '-f')
  fileName = process.argv[3];
else if(process.argv[2] === '--test')
  fileName = path.join(__dirname, 'test/main.js');
else
  fileName = '/dev/stdin';

const fileData = fs.readFileSync(fileName, "utf-8");

var ast = esprima.parse(fileData, {comment: true, range: true, tokens: true});

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

escodegen.attachComments(ast, ast.comments, ast.tokens);
var rebuiltData = escodegen.generate(ast, {comment: true, format: { preserveBlankLines: true}});
console.log(rebuiltData);
fs.writeFileSync(fileName.replace('.js', '.annotated.js'), rebuiltData, "utf-8");

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
        //console.log(node);
        if(node.argument.value != null)
          rTypes.uniquePush(typeof node.argument.value);
        else if(node.argument.type === 'Identifier' ||
                node.argument.type === 'ConditionalExpression' ||
                node.argument.type === 'CallExpression' ||
                node.argument.type === 'BinaryExpression')
          rTypes.uniquePush('any');
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
        console.log(node);
        if(node.argument.value != null)
          tTypes.uniquePush(typeof node.argument.value);
        else if(node.argument.type === 'CallExpression' || node.argument.type === 'NewExpression'){
          if(node.argument.callee)
            tTypes.uniquePush(node.argument.callee.name)
          else
            tTypes.uniquePush('any');
        }
      }
  }});
  return tTypes;
}
