#!/usr/bin/env node --harmony

const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const colors = require('colors');

const seoChecker = require('../lib/seo-checker.js');

const showResult = (results) => {
  console.log('');
  console.log(results);
  console.log('');
  process.exit(1);
};

const showError = (e) => {
  console.error(colors.red(`error: ${e.message}`));
  console.log('');
  process.exit(1);
};

let input;

program
  .version('1.0.0')
  .arguments('<input>')
  .option('-o --output <output>', 'the output result file path')
  .action(function(inputCmd) {
    input = inputCmd;
    if (!input) {
      return;
    }
    co(function* () {
      let { output } = program;
      if (!output) {
        output = yield prompt('The output result file path (optional): ');
      }

      console.log('');
      console.log('************************ SEO CHECKER ************************');
      seoChecker.default
        .run(input, undefined, output)
        .then(showResult)
        .catch(showError);
    });
  })
  .on('--help', function() {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ seo-checker test/index.html');
    console.log('    $ cat test/index.html | seo-checker');
    console.log('');
    console.log('  Author:');
    console.log('    Liu Chao (luis.liu.1018@gmail.com)');
    console.log('');
  });

program.parse(process.argv);

const self = process.stdin;

if (!input) {
  if (self.isTTY) {
    // no pipe
    program.outputHelp((msg) => {
      return colors.red(msg);
    });
    process.exit(1);
  } else {
    // with pipe data
    setImmediate(function() {
      self.push(null);
    });
    console.log('');
    console.log('************************ SEO CHECKER ************************');
    seoChecker.default
      .run(self, undefined, program.output)
      .then(showResult)
      .catch(showError);
  }
}
