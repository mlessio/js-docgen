
var infer = require('tern/lib/infer');
var tern = require('tern');
const fs = require("fs");
const esprima = require("esprima");
const path = require("path");
const escodegen = require("escodegen");

var fileName = path.join(__dirname, 'test/tern.js');

const fileData = fs.readFileSync(fileName, "utf-8");

var ast = esprima.parse(fileData, {range: true});
var myConf = {
  switchToDoc: function(name) { self.selectDoc(self.findDoc(name)) },
  useWorker: false
};

var server = new tern.Server(myConf);
infer.Context([]);
console.log(server.request);
var request = {
  query:{
    type: "type",
    lineCharPositions: true,
    end: {
      line: 4,
      ch: 4,
      sticky: "after",
      xRel: -1
    },
    file: "test"
  },
  files: []
};
server.addFile('test', fileData);
server.request(request, function (error, data) {
  console.log('err', error);
  console.log('data', data);
});

ast.body[1].declarations[0].id.name = 'faca';
ast.body[1].declarations[0].init.value = 'foco';
ast.body[1].declarations[0].init.raw = 'foco';

var rebuiltData = escodegen.generate(ast, { format: { preserveBlankLines: true}});
console.log(rebuiltData);
