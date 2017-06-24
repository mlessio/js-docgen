const fs = require("fs");
const path = require("path");
const traverse = require("ast-traverse");
const escodegen = require("escodegen");
const ASTParser = require('./parser');
const Comment = require('./comment');

//patching and utils
require('../patches');

var fileName = '';

if(process.argv[2] === '-f')
  fileName = process.argv[3];
else if(process.argv[2] === '--test')
  fileName = path.join(__dirname, '../test/main.js');
else
  fileName = '/dev/stdin';

const fileData = fs.readFileSync(fileName, "utf-8");

var ast = ASTParser.parse(fileData, {comment: true, ranges: true, tokens: true});

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

fs.writeFileSync(fileName.replace('.js', '.annotated.js'), rebuiltData, "utf-8");

function analyzeFunction(fun){
  return generateComment(fun);
}

function generateComment(fun){
  var comment = new Comment();

  comment.name = fun.id.name;
  comment.params = [];
  if(fun.params)
    for(let p of fun.params)
      comment.params.push(p);
  comment.async = fun.async;
  comment.rTypes = doesItReturn(fun);
  comment.tTypes = doesItThrow(fun);

  return comment;
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
        //console.log(node);
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
