import assert from 'assert';
import { join } from 'path';
import seoChecker from '../src/index';

const InputFile = 'index.html';
const InputFilePath = join(__dirname, InputFile);

const RULES = {
  img: {
    rule: {
      tag: 'img',
      all: {
        attr: '*',
      },
    },
    error: 'There is 1 <img> tag without attr attribute',
  },
  a: {
    rule: {
      tag: 'a',
      all: {
        href: '*',
      },
    },
    error: 'There is 1 <a> tag without href attribute',
  },
  title: {
    rule: {
      tag: 'head title',
      limit: {
        min: 1,
      },
    },
    error: 'This HTML has less than 1 <title> tag',
  },
  description: {
    rule: {
      tag: 'head meta',
      contain: {
        name: 'description',
      },
    },
    error: 'This HTML doesn\'t have <meta name="description" ... />',
  },
  keywords: {
    rule: {
      tag: 'head meta',
      contain: {
        name: 'keywords',
      },
    },
    error: 'This HTML doesn\'t have <meta name="keywords" ... />',
  },
  strong: {
    rule: {
      tag: 'strong',
      limit: {
        max: 3,
      },
    },
    error: 'This HTML has more than 3 <strong> tag',
  },
  h1: {
    rule: {
      tag: 'h1',
      limit: {
        max: 1,
      },
    },
    error: 'This HTML has more than 1 <h1> tag',
  },
};

describe('It checks each rule correctly', function() {
  it('detects the missing of attr attribute in <img> tag', function(done) {
    const { img } = RULES;
    const rules = [img.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(result, img.error, 'It should find one <img> tag without attr attribute');
        done();
      })
      .catch(done);
  });

  it('detects the missing of href attribute in <a> tag', function(done) {
    const { a } = RULES;
    const rules = [a.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(result, a.error, 'It should find one <a> tag without href attribute');
        done();
      })
      .catch(done);
  });

  it('detects the missing of <title> tag in header', function(done) {
    const { title } = RULES;
    const rules = [title.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(result, title.error, 'It should find the missing of <title> tag in header');
        done();
      })
      .catch(done);
  });

  it('detects the missing of <meta name="description"> tag in header', function(done) {
    const { description } = RULES;
    const rules = [description.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          description.error,
          'It should find the missing of <meta name="description" ... /> tag in header',
        );
        done();
      })
      .catch(done);
  });

  it('detects the missing of <meta name="keywords"> tag in header', function(done) {
    const { keywords } = RULES;
    const rules = [keywords.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          keywords.error,
          'It should find the missing of <meta name="description" ... /> tag in header',
        );
        done();
      })
      .catch(done);
  });

  it('detects more than 3 <strong> tag', function(done) {
    const { strong } = RULES;
    const rules = [strong.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(result, strong.error, 'It should find more than 3 <strong> tag');
        done();
      })
      .catch(done);
  });

  it('detects more than 1 <h1> tag', function(done) {
    const { h1 } = RULES;
    const rules = [h1.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(result, h1.error, 'It should find more than 1 <h1> tag');
        done();
      })
      .catch(done);
  });
});

describe('It checks multiple rules together correctly', function() {
  it('detects the missing of attr attribute in <img> tag and href attribute in <a> tag', function(done) {
    const { img, a } = RULES;
    const rules = [img.rule, a.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          [img.error, a.error].join('\n'),
          'It should find one <img> tag without attr attribute and one <a> tag without href attribute',
        );
        done();
      })
      .catch(done);
  });

  it('detects the missing of attr attribute in <img> tag and missing of <title> tag', function(done) {
    const { img, title } = RULES;
    const rules = [img.rule, title.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          [img.error, title.error].join('\n'),
          'It should find one <img> tag without attr attribute and missing of <title> tag in head',
        );
        done();
      })
      .catch(done);
  });

  it('detects the missing of attr attribute in <img> tag and missing of <meta name="description"> tag', function(done) {
    const { img, description } = RULES;
    const rules = [img.rule, description.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          [img.error, description.error].join('\n'),
          'It should find one <img> tag without attr attribute and missing of <meta name="description"> tag in head',
        );
        done();
      })
      .catch(done);
  });

  it('detects the missing of attr attribute in <img> tag and more than three <strong> tag', function(done) {
    const { img, strong } = RULES;
    const rules = [img.rule, strong.rule];
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          [img.error, strong.error].join('\n'),
          'It should find one <img> tag without attr attribute and more than three <strong> tag',
        );
        done();
      })
      .catch(done);
  });

  it('detects all the errors correctly', function(done) {
    const keys = Object.keys(RULES);
    const rules = keys.map(key => RULES[key].rule);
    seoChecker
      .run(InputFilePath, rules)
      .then((result) => {
        assert.equal(
          result,
          keys.map(key => RULES[key].error).join('\n'),
          'It should find all the errors correctly',
        );
        done();
      })
      .catch(done);
  });
});
