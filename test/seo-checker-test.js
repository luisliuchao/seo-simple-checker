import assert from 'assert';
import Test from '../src/index';

describe('It should run test correctly', function() {
  it('import the index correctly', function() {
    const result = Test.run();
    assert.equal(result, 'Hello World', 'it should return hello world');
  });
});
