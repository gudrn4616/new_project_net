class Monster {
  constructor(id, name, health, attack) {
    this.id = id;
    this.name = name;
    this.health = health;
    this.attack = attack;
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  isAlive() {
    return this.health > 0;
  }
}

export default Monster;
