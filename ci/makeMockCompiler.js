var fs = require('fs');
var solc = require('solc/wrapper');
var soljson = require('../soljson');
var compiler = solc(soljson);

var inputs = readInputs();
var compilationResult = gatherCompilationResults(inputs);
replaceSolCompiler();
writeCompilationResult();

function readInputs () {
  var request = fs.readFileSync('./test-browser/mockcompiler/requests.json', 'utf8');
  return JSON.parse(request);
}

function gatherCompilationResults (sol) {
  var compilationResult = {};
  for (var k in sol) {
    var item = sol[k];
    var result = compile(item, 1);
    compilationResult[result.key] = result;
    result = compile(item, 0);
    compilationResult[result.key] = result;
  }
  return compilationResult;
}

function compile (source, optimization) {
  var missingInputs = [];
  var result = compiler.compile(source, optimization, function (path) {
    missingInputs.push(path);
  });
  var key = optimization.toString();
  for (var k in source.sources) {
    key += k + source.sources[k];
  }
  return {
    key: key.trim(),
    source: source,
    optimization: optimization,
    missingInputs: missingInputs,
    result: result
  };
}

function replaceSolCompiler () {
  fs.readFile('./test-browser/mockcompiler/compiler.js', 'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }
    fs.writeFile('./soljson.js', data, 'utf8', function (error) {
      if (error) {
        return console.log(error);
      }
    });
  });
}

function writeCompilationResult () {
  fs.writeFile('test-browser/mockcompiler/results.json', JSON.stringify(compilationResult), function (error) {
    if (error) {
      return console.log(error);
    }
  });
}
