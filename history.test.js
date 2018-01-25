import History from './history';

// Helper used to vary insertion time
const delay = () => {
  for (let i = 0, a = []; i < 300000; i += 1) {
    a.push(i);
    a.shift();
  }
}

const ENTRY_TYPE = 'test.type';

describe('size()', () => {
  test('initially 0', () => {
    const log = new History();
    expect(log.size()).toEqual(0);
  });

  test('returns the number of items currently in the log', () => {
    const log = new History();
    for (let i = 0; i < 5; i++) {
      log.insert(ENTRY_TYPE, 'a');
    }
    expect(log.size()).toEqual(5);
  });

  test('size never goes past the limit', () => {
    const limit = 10;
    const log = new History({ limit });
    for (let i = 0; i < limit + 5; i++) {
      log.insert(ENTRY_TYPE, 'a');
    }
    expect(log.size()).toEqual(limit);
  });
});

describe('import(serializedLog)', () => {
  describe('throws and reverts when serialized log is invalid', () => {
    const log = new History();

    test('non array', () => {
      expect(() => log.import('')).toThrow();
      expect(() => log.import('{timestamp: "", data: "", type: "test"}')).toThrow();
    });

    test('without type', () => {
      const withoutType = JSON.stringify([
        { timestamp: '2018-01-09T17:20:49.814Z', data: 'test' },
      ]);
      expect(() => log.import(withoutType)).toThrow();
    });

    test('without data', () => {
      const withoutData = JSON.stringify([
        { type: 'test.data', timestamp: '2018-01-09T17:20:49.814Z' },
      ]);
      expect(() => log.import(withoutData)).toThrow();
    });

    test('without timestamp', () => {
      const withoutTimestamp = JSON.stringify([
        { type: 'test.data', data: 'test' },
      ]);
      expect(() => log.import(withoutTimestamp)).toThrow();
    });
  });

  test('merges given log from the front (latest) up to limit', () => {
    const log1 = new History({ limit: 5 });
    const log2 = new History();
    const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].reverse();

    for (let i = 0; i < 10; i += 1) {
      if (i % 2 == 0) {
        log1.insert(ENTRY_TYPE, data[i]);
      } else {
        log2.insert(ENTRY_TYPE, data[i]);
      }
      // introduce some compute time to vary the insertion times
      delay();
    }

    expect(log1.newest().data).toEqual('b');
    expect(log2.newest().data).toEqual('a');

    log1.import(log2.serialize());
    expect(log1.size()).toEqual(5);

    const array1 = log1.toArray();
    expect(array1[0].data).toEqual('a');
    expect(array1[1].data).toEqual('b');
  });

  test('returns the new log in array form', () => {
    const data = JSON.stringify([
      { type: 'test.data', timestamp: '2018-01-09T17:20:49.814Z', data: 'test' },
    ]);
    const log = new History();
    const result = log.import(data);
    expect(result.length).toEqual(1);
    expect(result[0].data).toEqual('test');
  });
});

describe('import(arrayOfLogItems)', () => {
  describe('throws on invalid input', () => {
    const log = new History();

    test('non array', () => {
      expect(() => log.import('')).toThrow();
      expect(() => log.import({timestamp: "", data: "", type: ''})).toThrow();
    });

    test('without type', () => {
      const withoutType = [
        { timestamp: '2018-01-09T17:20:49.814Z', data: 'test' },
      ];
      expect(() => log.import(withoutType)).toThrow();
    });

    test('without data', () => {
      const withoutData = [
        { type: 'test.data', timestamp: '2018-01-09T17:20:49.814Z' },
      ];
      expect(() => log.import(withoutData)).toThrow();
    });

    test('without timestamp', () => {
      const withoutTimestamp = [
        { type: 'test.data', data: 'test' },
      ];
      expect(() => log.import(withoutTimestamp)).toThrow();
    });
  });

  test('merges given log from the front (latest) up to limit', () => {
    const log1 = new History({ limit: 5 });
    const log2 = new History();
    const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].reverse();

    for (let i = 0; i < 10; i += 1) {
      if (i % 2 == 0) {
        log1.insert(ENTRY_TYPE, data[i]);
      } else {
        log2.insert(ENTRY_TYPE, data[i]);
      }
      // introduce some compute time to vary the insertion times
      delay();
    }

    expect(log1.newest().data).toEqual('b');
    expect(log2.newest().data).toEqual('a');

    log1.import(log2.toArray());
    expect(log1.size()).toEqual(5);

    const array1 = log1.toArray();
    expect(array1[0].data).toEqual('a');
    expect(array1[1].data).toEqual('b');
  });

  test('returns the new log in array form', () => {
    const data = [
      { type: 'test.data', timestamp: '2018-01-09T17:20:49.814Z', data: 'test' },
    ];
    const log = new History();
    const result = log.import(data);
    expect(result.length).toEqual(1);
    expect(result[0].data).toEqual('test');
  });
});

describe('insert(obj)', () => {
  test('throws when not given 2 arguments', () => {
    const log = new History();
    expect(() =>log.insert('type')).toThrow();
  });

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
    expect(() => log.insert(ENTRY_TYPE, 'asdf')).not.toThrow();
    expect(() => log.insert(ENTRY_TYPE, {})).not.toThrow();
    expect(() => log.insert(ENTRY_TYPE, { a: 1 })).not.toThrow();
  });

  test('returns an array version of the old log', () => {
    const log = new History();
    const oldA = log.insert(ENTRY_TYPE, 'a');
    const oldB = log.insert(ENTRY_TYPE, 'b');
    expect(oldA).toEqual([]);
    expect(oldB.length).toEqual(1);
  });

  test('manipulating old log does not change current log', () => {
    const log = new History();
    log.insert(ENTRY_TYPE, 'a');
    const oldA = log.insert(ENTRY_TYPE, 'b');
    oldA.push('c');
    oldA.unshift('d');
    expect(log.size()).toEqual(2);
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
    log.insert(ENTRY_TYPE, 'a');
    log.insert(ENTRY_TYPE, 'b');
    log.insert(ENTRY_TYPE, 'c');
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
    log.insert(ENTRY_TYPE, 'a');
    log.insert(ENTRY_TYPE, 'b');
    log.insert(ENTRY_TYPE, 'c');
    expect(log.oldest().data).toEqual('a');
  });

  test('gets the last item but not past the limit', () => {
    const log = new History({ limit: 3 });
    log.insert(ENTRY_TYPE, 'a');
    log.insert(ENTRY_TYPE, 'b');
    log.insert(ENTRY_TYPE, 'c');
    log.insert(ENTRY_TYPE, 'd');
    expect(log.oldest().data).toEqual('b');
  });
});

describe('serialize([start], [end])', () => {
  const log = new History({ limit: 5 });
  const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  data.forEach((item) => {
    log.insert(ENTRY_TYPE, item);
  });

  test('returns an empty array when the log is empty', () => {
    const emptyLog = new History();
    expect(emptyLog.serialize()).toEqual('[]');
  });

  describe('serialize()', () => {
    test('returns every item in the log from start up to limit', () => {
      const rawResult = log.serialize();
      const parsedResult = JSON.parse(rawResult);
      expect(parsedResult.length).toEqual(5);
      expect(parsedResult[0].data).toEqual('g');
      expect(parsedResult[2].data).toEqual('e');
    });
  });

  describe('serialize(start)', () => {
    test('returns items from start up to the limit', () => {
      const rawResult = log.serialize(3);
      const parsedResult = JSON.parse(rawResult);
      expect(parsedResult.length).toEqual(2);
      expect(parsedResult[0].data).toEqual('d');
      expect(parsedResult[1].data).toEqual('c');
    });
  });

  describe('serialize(start, end)', () => {
    test('returns items from start to end', () => {
      const rawResult = log.serialize(1, 3);
      const parsedResult = JSON.parse(rawResult);
      expect(parsedResult.length).toEqual(2);
      expect(parsedResult[0].data).toEqual('f');
      expect(parsedResult[1].data).toEqual('e');
    });

    test('returns items from start to limit if end > limit', () => {
      const rawResult = log.serialize(3, 7);
      const parsedResult = JSON.parse(rawResult);
      expect(parsedResult.length).toEqual(2);
      expect(parsedResult[0].data).toEqual('d');
      expect(parsedResult[1].data).toEqual('c');
    });
  });

  describe('b.import(a.serialize) -> b.serialize', () => {
    test('both logs should be equal', () => {
      const logA = new History();
      const logB = new History();
      const data = ['a', 'b', 'c', 'd', 'e'];

      data.forEach((item) => {
        logA.insert(ENTRY_TYPE, item);
      });
      logB.import(logA.serialize());
      expect(logA.size()).toEqual(data.length);
      expect(logA.serialize()).toEqual(logB.serialize());
    });
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

  test('truncates the log to the new limit if size() > newLimit', () => {
    const log = new History();
    const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    data.forEach(item => {
      log.insert(ENTRY_TYPE, item);
    });
    const newLimit = 3;

    log.setLimit(newLimit);
    expect(log.limit()).toEqual(newLimit);
    expect(log.size()).toEqual(newLimit);
  });
});

describe('toArray([start], [end])', () => {
  const log = new History({ limit: 5 });
  const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  data.forEach((item) => {
    log.insert(ENTRY_TYPE, item);
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
    test('both logs should be equal', () => {
      const logA = new History();
      const logB = new History();
      const data = ['a', 'b', 'c', 'd', 'e'];

      data.forEach((item) => {
        logA.insert(ENTRY_TYPE, item);
      });
      logB.import(logA.toArray());
      expect(logA.size()).toEqual(data.length);
      expect(logA.toArray()).toEqual(logB.toArray());
    });
  });
});
