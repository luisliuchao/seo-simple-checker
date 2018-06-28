import { createWriteStream, createReadStream } from 'fs';
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

  const loadStream = (rs, path) => {
    let data;
    rs.setEncoding('utf8');
    return new Promise((resolve, reject) => {
      rs.on('readable', () => {
        data += rs.read();
      })
        .on('end', () => {
          if (!data) {
            reject(new Error('Failed to read input data'));
          } else {
            resolve(data);
          }
        })
        .on('error', () => {
          reject(new Error(`Failed to read input data from ${path}`));
        });
    });
  };

  const writeStream = (ws, results) => {
    return new Promise((resolve, reject) => {
      ws.write(results);
      ws.end();
      ws.on('finish', () => {
        resolve('The results are written to output file successfully');
      }).on('error', function() {
        reject(new Error('Failed to write results to output file'));
      });
    });
  };

  const run = (input, rules, output) => {
    if (!input) {
      return new Promise((resolve, reject) => {
        reject(new Error('The input html file is required'));
      });
    }
    const _rules = rules || defaultRules;
    // let promise;
    let rs;
    if (typeof input === 'string') {
      rs = createReadStream(input);
    } else {
      rs = input;
    }
    return loadStream(rs, input)
      .then((data) => {
        const ruleResolvers = loadRules(_rules);
        const $ = cheerioLoad(data);
        const results = ruleResolvers
          .map((resolver) => {
            return resolver.validate($);
          })
          .join('\n');
        if (!output) {
          return results;
        }
        const ws = createWriteStream(output);
        return writeStream(ws, results);
      })
      .catch((e) => {
        throw e;
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
