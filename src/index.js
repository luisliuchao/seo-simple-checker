import { readFile, writeFile } from 'fs';
import { load as cheerioLoad } from 'cheerio';
import _every from 'lodash.every';
import defaultRules from '../.seorc';

class RuleAll {
  static match(rule) {
    return rule.tag && rule.all;
  }

  static validate($, rule) {
    const { tag } = rule;
    const tagText = tag.split(' ').pop();
    const attrs = rule.all;
    const $items = $(tag);
    const $matchedItems = $items.filter((_, $item) => {
      const { attribs = {} } = $item;
      return _every(Object.keys(attrs), (key) => {
        const value = attrs[key];
        if (value === '*') {
          return !!attribs[key];
        }
        return attribs[key] === value;
      });
    });
    const diff = $items.length - $matchedItems.length;
    if (diff) {
      return `There ${diff > 1 ? 'are' : 'is'} ${diff} <${tagText}> tag without ${Object.keys(
        attrs,
      ).join(', ')} attribute`;
    }
  }
}

class RuleContain {
  static match(rule) {
    return rule.tag && rule.contain;
  }

  static validate($, rule) {
    const { tag } = rule;
    const tagText = tag.split(' ').pop();
    const attrs = rule.contain;
    const $items = $(tag);
    const $matchedItems = $items.filter((_, $item) => {
      const { attribs = {} } = $item;
      return _every(Object.keys(attrs), (key) => {
        const value = attrs[key];
        if (value === '*') {
          return !!attribs[key];
        }
        return attribs[key] === value;
      });
    });
    const { length } = !$matchedItems;
    if (!length) {
      return `This HTML doesn't have <${tagText} ${Object.keys(attrs)
        .map(key => `${key}="${attrs[key]}"`)
        .join(' ')} ... />`;
    }
  }
}

class RuleLimit {
  static match(rule) {
    return rule.tag && rule.limit;
  }

  static validate($, rule) {
    const {
      tag,
      limit: { min = 0, max = 0 },
    } = rule;
    const tagText = tag.split(' ').pop();
    const $items = $(tag);
    const { length } = $items;
    if (min && length < min) {
      return `This HTML has less than ${min} <${tagText}> tag`;
    }
    if (max && length > max) {
      return `This HTML has more than ${max} <${tagText}> tag`;
    }
  }
}
class RuleResolver {
  constructor(rule, ruleHandlers) {
    this.rule = rule;
    const allRuleHandlers = ruleHandlers || [RuleAll, RuleContain, RuleLimit];
    this.matchedRuleHandlers = allRuleHandlers.filter(handler => handler.match(this.rule));
  }

  validate($) {
    return this.matchedRuleHandlers.map(handler => handler.validate($, this.rule));
  }
}

const SEOChecker = (() => {
  const loadRules = (rules) => {
    return rules.map((rule) => {
      return new RuleResolver(rule);
    });
  };

  const loadFile = (path) => {
    return new Promise((resolve, reject) => {
      readFile(path, (err, data) => {
        if (err) {
          reject(new Error(`Failed to read input data from ${path}`));
        } else {
          resolve(data.toString().trim());
        }
      });
    });
  };

  const saveFile = (path, results) => {
    return new Promise((resolve, reject) => {
      writeFile(path, results, (err) => {
        if (err) {
          console.log('err', err);
          reject(new Error('Failed to write results to output file'));
        } else {
          resolve('The results are written to output file successfully');
        }
      });
    });
  };

  const run = (inputFile, rules, outputFile) => {
    if (!inputFile) {
      return new Promise((resolve, reject) => {
        reject(new Error('The input html file is required'));
      });
    }
    const _rules = rules || defaultRules;
    return loadFile(inputFile).then((data) => {
      const ruleResolvers = loadRules(_rules);
      const $ = cheerioLoad(data);
      const results = ruleResolvers
        .map((resolver) => {
          return resolver.validate($);
        })
        .join('\n');
      if (!outputFile) {
        return results;
      }
      return saveFile(outputFile, results);
    });
  };

  return {
    run,
  };
})();

export {
  RuleAll, RuleContain, RuleLimit, RuleResolver,
};
export default SEOChecker;
