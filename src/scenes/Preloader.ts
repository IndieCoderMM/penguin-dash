import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';
import AudioKeys from '../consts/AudioKeys';

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
    this.load.image(TextureKeys.GameLogo, 'game-title.png');
    this.load.atlas(
      TextureKeys.Penguin,
      'characters/penguin.png',
      'characters/penguin.json',
    );

    // load audios
    this.load.audio(AudioKeys.Background, 'sfx/background-loop.mp3');
    this.load.audio(AudioKeys.Coin, 'sfx/coin.mp3');
    this.load.audio(AudioKeys.Jump, 'sfx/jump.mp3');
    this.load.audio(AudioKeys.GameOver, 'sfx/gameover.mp3');
    this.load.audio(AudioKeys.Hit, 'sfx/hit.mp3');
  }

  create() {
    const { width, height } = this.scale;

    const x = width * 0.5;

    this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0);
    this.add.image(x, 200, TextureKeys.GameLogo);
    this.add
      .text(x, height - 300, 'Press SPACE to Start', {
        fontFamily: 'Arial',
        fontSize: '50px',
        color: '#4A90E2',
        stroke: '#4A90E2',
        strokeThickness: 2,
        shadow: { stroke: false },
        maxLines: 1,
        resolution: 2,
      })
      .setOrigin(0.5);

    // listen for Space press
    const keyboard = this.input
      .keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    keyboard.once('keydown-SPACE', () => {
      // ! Starting the Game scene
      this.scene.start(SceneKeys.Game);
    });
  }
}
