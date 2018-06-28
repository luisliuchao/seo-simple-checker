# SEO Simple Checker

A simple Node.js package to let a user use this package to scan a HTML file and show all of the SEO defects. [What is SEO?](https://moz.com/learn/seo/what-is-seo)

## Requirements

- yarn

## Usage Globally

```bash
  yarn global add seo-simple-checker
```

### Example

```bahs
  seo-simple-checker --help
  seo-simple-checker test/index.html -o output.txt
  cat test/index | seo-simple-checker
```

## Usage Locally

```bash
  yarn add seo-simple-checker
```

### Example

```js
const seoChecker = require('seo-simple-checker');

seoChecker.run('index.html', [
  {
    tag: 'img',
    all: {
      src: '*'
    }
  },
  'output.txt'
]);
```

### Explanation

`seoChecker.run` takes three parameters `input`, `rules` and `output`

- **input** _[string | node readable stream]_ - the input html file path or stream
- **rules** _[array]_- the rules to be validated (optinal). If undefined, default rules will be used
- **output** _[string]_ - the output file path (optional)

## Rules

> Rule 1: All

Example: All \<a\> have `href` attribute

```js
  {
    tag: 'a',
    all: {
      href: '*'
    }
  }
```

> Rule 2 Contain

Example: There exists \<meta `name`="`description`">

```js
  {
    tag: 'meta',
    contain: {
      name: 'description'
    }
  }
```

> Rule 3 Limit

Example: \<strong\> appears at least 1, but no more than 3 times

```js
  {
    tag: 'strong',
    limit: {
      min: 1,
      max: 3,
    }
  }
```

### Customize Rule

```bash
const seoChecker = require('seo-simple-checker');

# import all default rules
const { defaultRules, run } = seoChecker;

# add custom rules
const customRules = [
  {
    tag: 'meta',
    contain: {
      meta: 'robots',
    },
  },
];
const rules = defaultRules.slice().concat(customRules);

# run the SEO checker
seoChecker.run('input.html', rules);
```

## Test

```bash
  yarn test
```

## Build

```bash
  #  for developmen with source map enabled
  yarn dev

  #  for production uglification and minification
  yarn build
```

## Authors

[Liu Chao](https://github.com/luisliuchao)
