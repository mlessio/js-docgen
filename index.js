const fs = require("fs");
const esprima = require("esprima");
const path = require("path");

const fileData = fs.readFileSync(path.join(__dirname, "test/main.js"), "utf-8");
console.log(fileData);

var parsedData = esprima.parse(fileData, {comment: true, range: true});

console.log(parsedData);
console.log(JSON.stringify(parsedData));
console.log(typeof parsedData.body);

//analyze the first level
for(let el of parsedData.body){
  if(el.type === 'FunctionDeclaration'){
    analyzeFunction(el);
  }
}

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
  commentString += '\n*/';
  console.log(commentString);
}
