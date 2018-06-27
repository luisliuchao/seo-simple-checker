const rules = [
  // RULE: all <img> tag has attr attribute with '*' as wildcard for truthy value
  {
    tag: 'img',
    all: {
      attr: '*',
    },
  },
  // RULE: all <a> tag has href attribute with '*' as wildcard for truthy value
  {
    tag: 'a',
    all: {
      href: '*',
    },
  },
  // RULE: there is at least 1 <title> tag in head
  {
    tag: 'head title',
    limit: {
      min: 1,
    },
  },
  // RULE: there exists <meta name="description"> in head
  {
    tag: 'head meta',
    contain: {
      name: 'description',
    },
  },
  // RULE: there exists <meta name="keywords"> in head
  {
    tag: 'head meta',
    contain: {
      name: 'keywords',
    },
  },
  // RULE: there is at most 2 <strong> tag
  {
    tag: 'strong',
    limit: {
      max: 2,
    },
  },
  // RULE: there is at most 1 <h1> tag
  {
    tag: 'h1',
    limit: {
      max: 1,
    },
  },
];

export default rules;
