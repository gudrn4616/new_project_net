class Base {
  constructor(id, name, health) {
    this.id = id;
    this.name = name;
    this.health = health;
  }

  applyDamage(damage) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }
}

export default Base;
