if (typeof window !== 'undefined') {
  window.Module = {
    cwrap: function () { return arguments[0] === 'version' ? version : compile; },
    writeStringToMemory: function () {},
    setValue: function () {},
    Pointer_stringify: function () {},
    Runtime: {
      addFunction: function () {},
      removeFunction: function () {}
    },
    _compileJSONMulti: {},
    _compileJSONCallback: {},
    _compileJSON: {}
  };

  loadJSON('./test-browser/mockcompiler/results.json', function (data) {
    window.Module.mockData = JSON.parse(data);
  });
}

function loadJSON (url, callback) {
  var xobj = new XMLHttpRequest() // eslint-disable-line
  xobj.overrideMimeType('application/json');
  xobj.open('GET', url, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function compile (source, optimization, missingInputs) {
  if (typeof source === 'string') {
    source = JSON.parse(source);
  }
  var key = optimization.toString();
  for (var k in source.sources) {
    key += k + source.sources[k];
  }
  var data = window.Module.mockData[key.trim()];
  if (data === undefined) {
    return JSON.stringify({
      errors: ['mock compiler: source not found']
    });
  } else {
    data.missingInputs.map(function (item, i) {
      if (missingInputs) {
        missingInputs(item);
      }
    });
  }
  return JSON.stringify(data.result);
}

function version () {
  return 'mock compiler';
}
