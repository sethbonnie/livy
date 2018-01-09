class History {
  constructor(options = {}) {
    this._log = [];
    this._limit = options.limit || 100;
  }

  count() {
    return this._log.length;
  }

  insert(item) {
    if (!item ||
        (typeof item !== 'object' && typeof item !== 'string') ||
        typeof item == 'string' && item.length  === 0
      ) {
      throw new Error('Item must be an object or non-empty string');
    }

    const inserted = new Date();
    const oldLog = this._log;
    const newLog = [{
      id: inserted.getTime(),
      timestamp: inserted.toISOString(),
      data: item,
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

    return this._limit;
  }

  toArray(start, end) {
    return this._log.slice(start, end);
  }
}

module.exports = History;
