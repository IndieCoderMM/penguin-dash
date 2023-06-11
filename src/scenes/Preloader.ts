import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    this.load.image(TextureKeys.Background, 'world/iceberg-bg.png');
    this.load.image(TextureKeys.Igloo, 'world/object_igloo.png');
    this.load.image(TextureKeys.TreeSmall, 'world/object_tree_small.png');
    this.load.image(TextureKeys.TreeLarge, 'world/object_tree_large.png');
    this.load.image(TextureKeys.Iceberg, 'world/object_iceberg.png');
    this.load.image(TextureKeys.Snowman, 'characters/snowman.png');
    this.load.image(TextureKeys.Coin, 'world/object_coin.png');
    this.load.atlas(
      TextureKeys.Penguin,
      'characters/penguin.png',
      'characters/penguin.json',
    );
  }

  create() {
    this.scene.start(SceneKeys.Game);
  }
}
