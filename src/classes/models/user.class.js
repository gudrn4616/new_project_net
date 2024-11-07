class User {
  constructor(socket, id, playerId, latency, sequence) {
    this.socket = socket;
    this.id = id;
    this.playerId = playerId;
    this.latency = latency;
    this.sequence = sequence;
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
    return this.sequence;
  }
}

export default User;
