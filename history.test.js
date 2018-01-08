import History from './history';

describe('count()', () => {
  test('returns the number of items currently in the log');

  test('count never goes past the limit');
});

describe('import(serializedLog)', () => {
  test('throws and revers when serialized log is invalid');

  test('merges given log from the front (latest) up to limit');

  test('returns the new log');
});

describe('import(arrayOfLogItems)', () => {
  test('throws and reverts when one of the items does not conform to log shape');

  test('merges given log from the front (latest) up to limit');

  test('returns the new log');
});

describe('insert(obj)', () => {
  test('throws when obj is falsy');

  test('accepts anything truthy as an argument');

  test('returns a tuple (array) of <oldlog, newlog>');
});

describe('limit()', () => {
  test('returns the current limit');
});

describe('serialize([start], [end])', () => {
  describe('serialize()', () => {
    test('returns every item in the log from start up to limit');
  });

  describe('serialize(start)', () => {
    test('returns items from start up to the limit');
  });

  describe('serialize(start, end)', () => {
    test('returns items from start to end');

    test('returns items from start to limit if end > limit');
  });

  describe('b.import(a.serialize) -> b.serialize', () => {
    test('both logs should be equal', () => {

    });
  });
});

describe('setLimit(new limit)', () => {
  test('throws on non-numeric or negative inputs');

  test('floors decimal values');

  test('returns the new limit');

  test('updates the limit to the given limit')
});

describe('toArray([start], [end])', () => {
  describe('toArray()', () => {
    test('returns every item in the log from start up to limit');
  });

  describe('toArray(start)', () => {
    test('returns items from start up to the limit');
  });

  describe('toArray(start, end)', () => {
    test('returns items from start to end');

    test('returns items from start to limit if end > limit');
  });

  describe('b.import(a.toArray) -> b.toArray', () => {
    test('both logs should be equal', () => {

    });
  });
});
