var infer = require('tern/lib/infer');
var tern = require('tern');

var ASTInferrer = function(){
  var ternServerConfig = {
    switchToDoc: function(name) { self.selectDoc(self.findDoc(name)) },
    useWorker: false
  };

  //declares a tern server instance
  this.server = new tern.Server(ternServerConfig);

  //console.log('ASTInferrer initialized');
};


ASTInferrer.prototype.getType = function(file, line, col, cb){
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
  this.server.request(request, cb);
}

ASTInferrer.prototype.addToContext = function(fileName, fileData){
  //adds a file to the infer engine context
  this.server.addFile(fileName, fileData);
};

ASTInferrer.prototype.getContext = function(){
  //adds a file to the infer engine context
  return this.server.cx();
};


module.exports = new ASTInferrer();
