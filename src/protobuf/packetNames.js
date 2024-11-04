export const packetNames = {
  common: {
    packetHeader: 'common.Packet',
    position: 'common.Position',
    baseData: 'common.BaseData',
    towerData: 'common.TowerData',
    monsterData: 'common.MonsterData',
    initialGameState: 'common.InitialGameState',
    gameState: 'common.GameState',
  },
  monsterNotification: {
    spawnEnemyMonsterNotification: 'monsterNotification.S2CSpawnEnemyMonsterNotification',
  },
  request: {
    spawnMonsterRequest: 'request.C2SSpawnMonsterRequest',
    monsterAttackBaseRequest: 'request.C2SMonsterAttackBaseRequest',
  },
  response: {
    spawnMonsterResponse: 'response.S2CSpawnMonsterResponse',
  },
};