const seoChecker = require('./index');

const { defaultRules, run } = seoChecker;

const customRules = [
  {
    tag: 'meta',
    contain: {
      meta: 'robots',
    },
  },
];
const rules = defaultRules.slice().concat(customRules);

run('test/index.html', rules)
  .then(console.log)
  .catch(console.warn);
