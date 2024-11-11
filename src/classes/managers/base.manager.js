class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct BaseManager instances');
    }
  }

  addUser(userId, ...args) {
    throw new Error('Method not implemented');
  }

  removeUser(userId) {
    throw new Error('Method not implemented');
  }

  clearAll() {
    throw new Error('Method not implemented');
  }
}

export default BaseManager;
