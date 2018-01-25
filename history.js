class History {
  constructor(options = {}) {
    this._log = [];
    this._limit = options.limit || 100;
  }

  import(rawData) {
    let data;
    if (typeof rawData === 'string') {
      data = JSON.parse(rawData);
    } else {
      data = rawData;
    }

    if (!(data instanceof Array)) {
      throw new Error('Argument to import must be in array form whether stringified or parsed.');
    }

    data.forEach((item, index) => {
      const keys = Object.keys(item);
      if (!keys.includes('type') || !keys.includes('timestamp') || !keys.includes('data')) {
        throw new Error(`Check the shape of the item at index ${index} of imported array.\n` +
          'It must include the keys "type", "data", and "timestamp".');
      }
      this._log.push(item);
    });
    this._log.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    this._log = this._log.slice(0, this._limit);
    return this.toArray();
  }

  insert(entryType, payload) {
    if (typeof entryType !== 'string') {
      throw new Error('type must be a string');
    }

    if (!payload ||
        (typeof payload !== 'object' && typeof payload !== 'string') ||
        typeof payload == 'string' && payload.length  === 0
      ) {
      throw new Error('payload must be an object or non-empty string');
    }

    const inserted = new Date();
    const oldLog = this._log;
    const newLog = [{
      type: entryType,
      timestamp: inserted.toISOString(),
      data: payload,
    }].concat(oldLog);
    this._log = newLog.slice(0, this._limit);
    return oldLog;
  }

  limit() {
    return this._limit;
  }

  newest() {
    return this._log[0];
  }

  oldest() {
    return this._log[this._log.length - 1];
  }

  serialize(start, end) {
    return JSON.stringify(this._log.slice(start, end));
  }

  setLimit(newLimit) {
    if (typeof newLimit !== 'number' || newLimit < 1) {
      throw new Error('newLimit must be a positive number');
    }
    this._limit = Math.floor(newLimit);
    this._log = this._log.slice(0, this._limit);

    return this._limit;
  }

  size() {
    return this._log.length;
  }

  toArray(start, end) {
    return this._log.slice(start, end);
  }
}

module.exports = History;
