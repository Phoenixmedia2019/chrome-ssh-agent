// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

require("chromedriver");
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var assert = require("assert");
var fs = require("fs");

function makeExtensionUrl(page) {
  var url = []
  url.push(
    "chrome-extension://",
    process.env.TEST_EXTENSION_ID,
    "/",
    page,
  );
  return url.join("");
}


describe('End-to-end Tests For SSH Agent', function () {
  let driver
  this.timeout(10000);

  beforeEach(async function() {
    extensionData = fs.readFileSync(process.env.TEST_EXTENSION_CRX)
      .toString("base64");
    options = new chrome.Options();
    options.addExtensions(extensionData);
    builder = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
    driver = await builder.build();
  })

  it('successfully manages keys via the Options UI', async function() {
    await driver.get(makeExtensionUrl("html/options.html?test"));
   
    body = await driver.findElement(webdriver.By.id("body")).getText();
    fail = await driver.findElement(webdriver.By.id('failureCount')).getText();
    assert.equal(parseInt(fail), 0, body);
  })

  afterEach(async function() {
    await driver.quit();
  })
})
