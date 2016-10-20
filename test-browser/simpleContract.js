'use strict';
var fs = require('fs');

module.exports = {
  'Simple Contract': function (browser) {
    initTestData(function (error, testData) {
      if (error) {
        console.log(error);
      } else {
        runTests(browser, testData);
      }
    });
  }
};

function runTests (browser, testData) {
  browser
    .url('http://127.0.0.1:8080/#version=builtin')
    .waitForElementVisible('.newFile', 10000);
  browser.assert.notEqual(testData, null);
/*
TODO push contracts to the editor and test
setEditorContent(browser, testData.testSimpleContract.sources.Untitled, function () {
  getCompiledContracts(browser, function (contracts) {
    browser.assert.equal(contracts[0].name, 'test')
    browser.end()
  })
})
*/
}

function initTestData (callback) {
  fs.readFile('./test-browser/mockcompiler/requests.json', 'utf8', function (error, data) {
    if (error) {
      callback(error);
    } else {
      callback(null, JSON.parse(data));
    }
  });
}

/*
function setEditorContent (browser, data, callback) {
  browser.execute(function (data) {
    var editor = document.getElementById('input').bseditor;
    editor.getSession().setValue(data);
  }, [data], function () {
    callback();
  });
}

function getCompiledContracts (browser, callback) {
  browser.execute(function () {
    var ret = [];
    var contracts = document.querySelectorAll('#output .contract');
    for (var k in contracts) {
      var item = contracts[k];
      var contract = {};
      contract.name = item.querySelector('.title').innerText;
      ret.push(contract);
      return ret;
    }
  }, [], function (contracts) {
    callback(contracts);
  });
}
*/
