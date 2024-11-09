import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();

    this.intervals = new Map();
  }

  addUser(userId, callback, interval, type = 'user') {
    if (!this.intervals.has(userId)) {
      this.intervals.set(userId, new Map());
    }

    this.intervals.get(userId).set(type, setInterval(callback, interval));
  }

  removeUser(userId) {
    if (this.intervals.has(userId)) {
      const userIntervals = this.intervals.get(userId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(userId);
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });

    this.intervals.clear();
  }
}

export default IntervalManager;
