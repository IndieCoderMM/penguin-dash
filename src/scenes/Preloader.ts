import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';
import AnimationKeys from '../consts/AnimationKeys';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    this.load.image(TextureKeys.Background, 'world/iceberg-bg.png');
    this.load.atlas(
      TextureKeys.Penguin,
      'characters/penguin.png',
      'characters/penguin.json',
    );
  }

  create() {
    this.anims.create({
      key: AnimationKeys.PenguinWalk,
      frames: this.anims.generateFrameNames('penguin', {
        start: 1,
        end: 4,
        prefix: AnimationKeys.PenguinWalk,
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.start(SceneKeys.Game);
  }
}
