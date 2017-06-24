var ASTParser = require('./lib/parser');
var ASTInferrer = require('./lib/inferrer');
const fs = require("fs");
const path = require("path");

var fileName = path.join(__dirname, 'test/tern.js');
const fileData = fs.readFileSync(fileName, "utf-8");

var ast = ASTParser.parse(fileData);

console.log(ast);
