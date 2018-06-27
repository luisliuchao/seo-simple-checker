#!/usr/bin/env node --harmony

const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');

const seoChecker = require('../lib/seo-checker.js');

let input;

program
  .version('1.0.0')
  .arguments('<input>')
  .option('-r, --rule <rule>', 'the rules file path')
  .option('-o --output <output>', 'the output result file path')
  .action(function(cmdInput) {
    input = cmdInput;
    co(function* () {
      let { rule, output } = program;
      if (!rule) {
        rule = yield prompt('The rules file path (optional): ');
      }
      if (!output) {
        output = yield prompt('The output result file path (optional): ');
      }
      seoChecker.default
        .run(input, rule, output)
        .then((result) => {
          console.log('\n');
          console.log('************************ SEO CHECKER ************************');
          console.log(result);
          console.log('\n');
          process.exit(1);
        })
        .catch(() => {
          process.exit(1);
        });
    });
  })
  .parse(process.argv);

if (!input) {
  console.warn('The input html file is required');
  process.exit(1);
}
