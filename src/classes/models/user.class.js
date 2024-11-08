class User {
  constructor(socket, id, playerId, latency) {
    this.socket = socket;
    this.id = id;
    this.playerId = playerId;
    this.latency = latency;
    this.sequence = 0;
  }

  getSocket() {
    return this.socket;
  }

  getId() {
    return this.id;
  }

  getPlayerId() {
    return this.playerId;
  }

  getSequence() {
    return this.sequence++;
  }
}

export default User;
