const rules = [
  {
    tag: 'img',
    all: {
      attr: '*',
    },
  },
  {
    tag: 'a',
    all: {
      href: '*',
    },
  },
  {
    tag: 'head title',
    limit: {
      min: 2,
    },
  },
  {
    tag: 'head meta',
    contain: {
      name: 'description',
    },
  },
  {
    tag: 'head meta',
    contain: {
      name: 'keywords',
    },
  },
  {
    tag: 'strong',
    limit: {
      max: 2,
    },
  },
  {
    tag: 'h1',
    limit: {
      max: 1,
    },
  },
];

export default rules;
