var infer = require('tern/lib/infer');

var ASTParser = function(){

};

ASTParser.prototype.parse = function(srcData, options){
  //makes use of acorn ast parser

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

module.exports = new ASTParser();
