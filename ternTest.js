var infer = require('tern/lib/infer');
var tern = require('tern');
const fs = require("fs");
const esprima = require("esprima");
const path = require("path");
const escodegen = require("escodegen");

var fileName = path.join(__dirname, 'test/tern.js');

const fileData = fs.readFileSync(fileName, "utf-8");

//var ast = esprima.parse(fileData, {range: true});
var ast = infer.parse(fileData);
var ternServerConfig = {
  switchToDoc: function(name) { self.selectDoc(self.findDoc(name)) },
  useWorker: false
};

//declares a tern server instance
var server = new tern.Server(ternServerConfig);


function getType(file, line, col, cb){
  var request = {
    query:{
      type: "type",
      end: {
        line: line,
        ch: col
      },
      file: file
    }
  };

  //makes a type inference request to the tern server
  server.request(request, cb);
}

//adds a file to the infer engine context
server.addFile('test', fileData);

getType('test', 4, 4, function(err, data){
  if(err){
    console.error('Err!', err);
    return;
  }
  console.log(data);
});

getType('test', 0, 13, function(err, data){
  if(err){
    console.error('Err!', err);
    return;
  }
  console.log(data);
});

getType('test', 6, 14, function(err, data){
  if(err){
    console.error('Err!', err);
    return;
  }
  console.log(data);
});

getType('test', 13, 5, function(err, data){
  if(err){
    console.error('Err!', err);
    return;
  }
  console.log(data);
});
