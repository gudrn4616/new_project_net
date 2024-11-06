class User {
  constructor(socket, id, playerId, latency) {
    this.socket = socket;
    this.id = id;
    this.playerId = playerId;
    this.latency = latency;
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
}
