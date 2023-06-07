import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', 'world/iceberg-bg.png');
    this.load.atlas(
      'penguin',
      'characters/penguin.png',
      'characters/penguin.json',
    );
  }

  create() {
    this.anims.create({
      key: 'penguin-walk',
      frames: this.anims.generateFrameNames('penguin', {
        start: 1,
        end: 4,
        prefix: 'penguin_walk',
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });
    const width = this.scale.width;
    const height = this.scale.height;
    this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0);
    this.add
      .sprite(width * 0.5, height * 0.5, 'penguin', 'penguin_walk01.png')
      .play('penguin-walk');
  }
}
