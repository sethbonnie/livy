import History from './history';

describe('count()', () => {
  test('initially 0', () => {
    const log = new History();
    expect(log.count()).toEqual(0);
  });

  test('returns the number of items currently in the log', () => {
    const log = new History();
    for (let i = 0; i < 5; i++) {
      log.insert('a');
    }
    expect(log.count()).toEqual(5);
  });

  test('count never goes past the limit', () => {
    const limit = 10;
    const log = new History({ limit });
    for (let i = 0; i < limit + 5; i++) {
      log.insert('a');
    }
    expect(log.count()).toEqual(limit);
  });
});

describe('import(serializedLog)', () => {
  test('throws and reverts when serialized log is invalid');

  test('merges given log from the front (latest) up to limit');

  test('returns the new log');
});

describe('import(arrayOfLogItems)', () => {
  test('throws and reverts when one of the items does not conform to log shape');

  test('merges given log from the front (latest) up to limit');

  test('returns the new log');
});

describe('insert(obj)', () => {
  test('throws when obj is not an object or a non-empty string', () => {
    const log = new History();
    expect(() =>log.insert(undefined)).toThrow();
    expect(() =>log.insert(null)).toThrow();
    expect(() =>log.insert(1)).toThrow();
    expect(() =>log.insert(true)).toThrow();
    expect(() =>log.insert(false)).toThrow();
    expect(() =>log.insert('')).toThrow();
  });

  test('accepts any string or object as an argument', () => {
    const log = new History();
    expect(() => log.insert('asdf')).not.toThrow();
    expect(() => log.insert({})).not.toThrow();
    expect(() => log.insert({ a: 1 })).not.toThrow();
  });

  test('returns an array version of the old log', () => {
    const log = new History();
    const oldA = log.insert('a');
    const oldB = log.insert('b');
    expect(oldA).toEqual([]);
    expect(oldB.length).toEqual(1);
  });

  test('manipulating old log does not change current log', () => {
    const log = new History();
    log.insert('a');
    const oldA = log.insert('b');
    oldA.push('c');
    oldA.unshift('d');
    expect(log.count()).toEqual(2);
    expect(log.newest().data).toEqual('b');
  });
});

describe('limit()', () => {
  test('defaults to 100', () => {
    const log = new History();
    expect(log.limit()).toEqual(100);
  });

  test('returns the given limit from the constructor', () => {
    const log = new History({ limit: 50 });
    expect(log.limit()).toEqual(50);
  });
});

describe('newest()', () => {
  test('returns undefined if the log is empty', () => {
    const log = new History();
    expect(log.newest()).toEqual(undefined);
  });

  test('returns the last item inserted into the log', () => {
    const log = new History();
    log.insert('a');
    log.insert('b');
    log.insert('c');
    expect(log.newest().data).toEqual('c');
  });
});

describe('oldest()', () => {
  test('returns undefined if the log is empty', () => {
    const log = new History();
    expect(log.oldest()).toEqual(undefined);
  });

  test('returns the oldest item inserted into the log', () => {
    const log = new History();
    log.insert('a');
    log.insert('b');
    log.insert('c');
    expect(log.oldest().data).toEqual('a');
  });

  test('gets the last item but not past the limit', () => {
    const log = new History({ limit: 3 });
    log.insert('a');
    log.insert('b');
    log.insert('c');
    log.insert('d');
    expect(log.oldest().data).toEqual('b');
  });
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
    test('both logs should be equal');
  });
});

describe('setLimit(new limit)', () => {
  test('throws on non-numeric or non-positive inputs', () => {
    const log = new History();
    expect(() => log.setLimit(undefined)).toThrow();
    expect(() => log.setLimit(null)).toThrow();
    expect(() => log.setLimit(false)).toThrow();
    expect(() => log.setLimit(true)).toThrow();
    expect(() => log.setLimit('5')).toThrow();
    expect(() => log.setLimit(-1)).toThrow();
    expect(() => log.setLimit(0)).toThrow();
    expect(() => log.setLimit([])).toThrow();
  });

  test('updates the limit to the given limit', () => {
    const log = new History();
    const newLimit = 5;
    expect(log.setLimit(newLimit)).toEqual(newLimit);
    expect(log.limit()).toEqual(newLimit);
  });

  test('floors decimal values', () => {
    const log = new History();
    expect(log.setLimit(10.3)).toEqual(10);
    expect(log.limit()).toEqual(10);
  });
});

describe('toArray([start], [end])', () => {
  const log = new History({ limit: 5 });
  const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  data.forEach((item) => {
    log.insert(item);
  });

  test('returns an empty array when the log is empty', () => {
    const emptyLog = new History();
    expect(emptyLog.toArray()).toEqual([]);
  });

  describe('toArray()', () => {
    test('returns every item in the log from start up to limit', () => {
      const result = log.toArray();
      expect(result.length).toEqual(5);
      expect(result[0].data).toEqual('g');
      expect(result[2].data).toEqual('e');
    });
  });

  describe('toArray(start)', () => {
    test('returns items from start up to the limit (inclusive)', () => {
      const result = log.toArray(3);
      expect(result.length).toEqual(2);
      expect(result[0].data).toEqual('d');
      expect(result[1].data).toEqual('c');
    });
  });

  describe('toArray(start, end)', () => {
    test('returns items from start index up to but not including end', () => {
      const result = log.toArray(1, 3);
      expect(result.length).toEqual(2);
      expect(result[0].data).toEqual('f');
      expect(result[1].data).toEqual('e');
    });

    test('returns items from start to limit if end > limit', () => {
      const result = log.toArray(3, 7);
      expect(result.length).toEqual(2);
      expect(result[0].data).toEqual('d');
      expect(result[1].data).toEqual('c');
    });
  });

  describe('b.import(a.toArray) -> b.toArray', () => {
    test('both logs should be equal');
  });
});
