const infer = require('tern/lib/infer');
const traverse = require("ast-traverse");

var ASTParser = function(){

};

ASTParser.prototype.parse = function(srcData, options){
  //makes use of acorn ast parser

  options = options || {};

  //esprima format retrocompatibility
  var comments = [];
  var tokens = [];
  options.onComment = comments;
  options.onToken = tokens;

  var _ast = infer.parse(srcData, options);

  //sets on ast to be esprima format compatible
  _ast.comments = comments;
  _ast.tokens = tokens;

  return _ast;
}

//TODO: check for void return type
ASTParser.prototype.doesItReturn = function(fun){
  var rTypes = [];
  traverse(fun, {pre: function(node, parent, prop, idx) {
      // console.log(node.type + (parent ? " from parent " + parent.type +
      //     " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
      if(node.type === 'ReturnStatement' && node.argument != null){
        //console.log(node);
        if(node.argument.value != null)
          rTypes.uniquePush(typeof node.argument.value);
        else if(node.argument.type === 'Identifier' ||
                node.argument.type === 'ConditionalExpression' ||
                node.argument.type === 'CallExpression' ||
                node.argument.type === 'BinaryExpression')
          rTypes.uniquePush('any');
      }
    }
  });
  return rTypes.length > 0;
}


module.exports = new ASTParser();
