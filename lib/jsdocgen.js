const fs = require("fs");
const path = require("path");
const traverse = require("ast-traverse");
const escodegen = require("escodegen");
const ASTParser = require('./parser');
const ASTInferrer = require('./inferrer');
const Comment = require('./comment');
const argv = require('yargs').argv

//patching and utils

var fileName = '';
var inferencePromises = [];

if(argv.f)
  fileName = argv.f;
else if(argv.test)
  fileName = path.join(__dirname, '../test/main.js');
else
  fileName = '/dev/stdin';

const fileData = fs.readFileSync(fileName, "utf-8");

ASTInferrer.addToContext(fileName, fileData);

var ast = ASTParser.parse(fileData, {comment: true, ranges: true, tokens: true, locations: true});

traverse(ast, {pre: function(node, parent, prop, idx) {
    // console.log(node.type + (parent ? " from parent " + parent.type +
    //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));

    if(node.type === 'FunctionExpression' && parent && parent.type === 'AssignmentExpression'){
      //this can be a prototype assignment
      if(isProtoAssignment(parent)){
        var functionName = parent.left.property.name;
        parent.leadingComments = [{
          type: 'Block',
          value: analyzeProtoFunction(node)
        }];

        parent.leadingComments[0].value.name = functionName;

      }else{
        //console.log('Not a proto assignment');
      }
    }else if(node.type === 'FunctionDeclaration'){
      node.leadingComments = [{
        type: 'Block',
        value: analyzeFunction(node)
      }];
    }
}});

Promise.all(inferencePromises).then(function(){
  escodegen.attachComments(ast, ast.comments, ast.tokens);
  var rebuiltData = escodegen.generate(ast, {comment: true, format: { preserveBlankLines: true}});

  fs.writeFileSync(fileName.replace('.js', '.annotated.js'), rebuiltData, "utf-8");
});


function analyzeFunction(fun){
  var commentObject = generateComment(fun);
  // adjust for 0 based ternjs lookup
  var row = fun.id.loc.end.line - 1;
  var col = fun.id.loc.end.column - 1;
  //console.log('found a function declaration!', row, col);

  var promise = ASTInferrer.getType(fileName, row, col);
  inferencePromises.push(promise);

  promise.then(function(data){
    var inferredType = null;
    if(data.type.indexOf('->') !== -1)
      inferredType = data.type.split('->')[1].trim().split('|');
    else if(commentObject.returns === true)
      inferredType = ['any'];
    commentObject.rTypes = inferredType;
  }).catch(function(err){
    console.error('Got an error!', row, col, err);
  })

  return commentObject;
}

function analyzeProtoFunction(fun){
  var commentObject = generateComment(fun);
  //console.log(fun);
  // adjust for 0 based ternjs lookup
  var row = fun.loc.start.line - 1;
  var col = fun.loc.start.column + 1;
  //console.log('found a function declaration!', row, col);

  var promise = ASTInferrer.getType(fileName, row, col);
  inferencePromises.push(promise);

  promise.then(function(data){
    var inferredType = null;
    if(data.type.indexOf('->') !== -1)
      inferredType = data.type.split('->')[1].trim().split('|');
    else if(commentObject.returns === true)
      inferredType = ['any'];
    commentObject.rTypes = inferredType;
  }).catch(function(err){
    console.error('Got an error!', row, col, err);
  })

  return commentObject;
}


function generateComment(fun){
  var comment = new Comment();

  if(fun.id)
    comment.name = fun.id.name;
  comment.params = [];
  if(fun.params){
    for(let p of fun.params){
      let paramObj = {name: p.name};
      comment.params.push(paramObj);
      var row = p.loc.end.line - 1;
      var col = p.loc.end.column - 1;
      var promise = ASTInferrer.getType(fileName, row, col);
      inferencePromises.push(promise);

      promise.then(function(data){
         if(data.type && data.type !== '?')
           paramObj.type = data.type;
         else
           paramObj.type = 'any';
      }).catch(function(err){
        console.trace(err);
      });
    }
  }
  comment.async = fun.async;
  comment.returns = ASTParser.doesItReturn(fun);
  //comment.throws = ASTParser.doesItThrow(fun);

  comment.tTypes = [];
  inferThrows(fun, comment);

  return comment;
}

function isProtoAssignment(node){
  //e.g. MyClass.prototype or MyClass.MyField.prototype
  var leftOp = node.left.object;
  return leftOp.property && leftOp.property.name === 'prototype';
}

function inferThrows(fun, commentObj){

  traverse(fun, {pre: function(node, parent, prop, idx) {
      // console.log(node.type + (parent ? " from parent " + parent.type +
      //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
      if(node.type === 'TryStatement' || (node.type !== 'CatchClause' && parent && parent.catching)){
        node.catching = true;
      }
      if(node.type === 'ThrowStatement' && (parent == null || !parent.catching)){
        var row = null;
        var col = null;

        if(node.argument && (node.argument.type === 'NewExpression' || node.argument.type === 'CallExpression')){
          row = node.argument.callee.loc.end.line - 1;
          col = node.argument.callee.loc.end.column - 1;
        }else if(node.argument && node.argument.type === 'Literal'){
          row = node.argument.loc.end.line - 1;
          col = node.argument.loc.end.column - 1;
        }

        var promise = ASTInferrer.getType(fileName, row, col);
        inferencePromises.push(promise);

        promise.then(function(data){
          if(data.type && data.type !== '?')
            commentObj.tTypes.uniquePush(data.type);
          else if(data.exprName)
            commentObj.tTypes.uniquePush(data.exprName);
          else
            commentObj.tTypes.uniquePush('any');

        }).catch(function(err){
          console.trace('Throw infer error');
        });
      }
  }});
}
