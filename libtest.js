var ASTParser = require('./lib/parser');
var ASTInferrer = require('./lib/inferrer');
const fs = require("fs");
const path = require("path");

var fileName = path.join(__dirname, 'test/tern.js');
const fileData = fs.readFileSync(fileName, "utf-8");

var ast = ASTParser.parse(fileData);

ASTInferrer.addToContext(fileName, fileData);

ASTInferrer.getType(fileName, 6, 14, function(err, data){
  if(err){
    console.error('Err!', err);
    return;
  }
  console.log('inferred CB', data);
});

ASTInferrer.getType(fileName, 6, 14).then(function(data){
  console.log('inferred Promise', data);
}).catch(function(err){
  console.error('Err!', err);
});
