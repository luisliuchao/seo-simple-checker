import { readFile } from 'fs';
import { join } from 'path';
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
    const matchedItems = $items.filter((_, $item) => {
      const { attribs = {} } = $item;
      return _every(Object.keys(attrs), (key) => {
        const value = attrs[key];
        if (value === '*') {
          return !!attribs[key];
        }
        return attribs[key] === value;
      });
    });
    const diff = $items.length - matchedItems.length;
    if (diff) {
      console.warn(
        `There ${diff > 1 ? 'are' : 'is'} ${diff} <${tagText}> without ${Object.keys(attrs).join(
          ', ',
        )} attribute`,
      );
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
    const matchedItems = $items.filter((_, $item) => {
      const { attribs = {} } = $item;
      return _every(Object.keys(attrs), (key) => {
        const value = attrs[key];
        if (value === '*') {
          return !!attribs[key];
        }
        return attribs[key] === value;
      });
    });
    if (!matchedItems.length) {
      console.warn(
        `This HTML doesn't have <${tagText} ${Object.keys(attrs)
          .map(key => `${key}="${attrs[key]}"`)
          .join(' ')} ... />`,
      );
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
      console.warn(`This HTML has less than ${min} <${tagText}> tag`);
    }
    if (max && length > max) {
      console.warn(`This HTML has more than ${max} <${tagText}> tag`);
    }
  }
}
class RuleResolver {
  constructor(rule) {
    this.rule = rule;
    const allRuleHandlers = [RuleAll, RuleContain, RuleLimit];
    this.matchedRuleHandlers = allRuleHandlers.filter(handler => handler.match(this.rule));
  }

  validate($) {
    this.matchedRuleHandlers.forEach(handler => handler.validate($, this.rule));
  }
}

const SEOChecker = (() => {
  const loadRules = () => {
    return defaultRules.map((rule) => {
      return new RuleResolver(rule);
    });
  };

  const loadFile = (path) => {
    return new Promise((resolve, reject) => {
      readFile(path, (err, data) => {
        if (err) {
          reject(new Error('Failed to read data'));
        } else {
          resolve(data.toString().trim());
        }
      });
    });
  };

  const run = () => {
    const inputFile = 'index.html';
    const inputFilePath = join(__dirname, inputFile);
    loadFile(inputFilePath).then((data) => {
      const ruleResolvers = loadRules();
      const $ = cheerioLoad(data);
      ruleResolvers.forEach((resolver) => {
        resolver.validate($);
      });
    });
  };

  return {
    run,
  };
})();

export default SEOChecker;
