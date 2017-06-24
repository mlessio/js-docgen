const fs = require("fs");
const path = require("path");
const traverse = require("ast-traverse");
const escodegen = require("escodegen");
const ASTParser = require('./parser');
const ASTInferrer = require('./inferrer');
const Comment = require('./comment');

//patching and utils

var fileName = '';
var inferencePromises = [];

if(process.argv[2] === '-f')
  fileName = process.argv[3];
else if(process.argv[2] === '--test')
  fileName = path.join(__dirname, '../test/main.js');
else
  fileName = '/dev/stdin';

const fileData = fs.readFileSync(fileName, "utf-8");

ASTInferrer.addToContext(fileName, fileData);

var ast = ASTParser.parse(fileData, {comment: true, ranges: true, tokens: true, locations: true});

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

function generateComment(fun){
  var comment = new Comment();

  comment.name = fun.id.name;
  comment.params = [];
  if(fun.params)
    for(let p of fun.params)
      comment.params.push(p);
  comment.async = fun.async;
  comment.returns = ASTParser.doesItReturn(fun);
  //comment.throws = ASTParser.doesItThrow(fun);

  comment.tTypes = [];
  inferThrows(fun, comment);

  return comment;
}


function inferThrows(fun, commentObj){
  traverse(fun, {pre: function(node, parent, prop, idx) {
      // console.log(node.type + (parent ? " from parent " + parent.type +
      //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
      if(node.type === 'ThrowStatement'){
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

        }).catch(function(err){
          console.trace('Throw infer error');
        })
        // if(node.argument.value != null)
        //   tTypes.uniquePush(typeof node.argument.value);
        // else if(node.argument.type === 'CallExpression' || node.argument.type === 'NewExpression'){
        //   if(node.argument.callee)
        //     tTypes.uniquePush(node.argument.callee.name)
        //   else
        //     tTypes.uniquePush('any');
        // }
      }
  }});
}
