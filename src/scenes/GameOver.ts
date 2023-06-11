import Phaser from 'phaser';

import SceneKeys from '../consts/SceneKeys';
import AudioKeys from '../consts/AudioKeys';
import TextureKeys from '../consts/TextureKeys';

export default class GameOver extends Phaser.Scene {
  private gameoverSfx!: Phaser.Sound.BaseSound;

  constructor() {
    super(SceneKeys.GameOver);
  }

  create() {
    const { width, height } = this.scale;

    const x = width * 0.5;
    const y = height * 0.5;

    this.gameoverSfx = this.sound.add(AudioKeys.GameOver);
    this.gameoverSfx.play();
    const beepSfx = this.sound.add(AudioKeys.Beep);

    const retryBtn = this.add.image(x, y - 100, TextureKeys.RetryBtn);
    // * Setting interactive mode
    retryBtn.setInteractive();

    // Hover effect
    retryBtn.on('pointerover', () => {
      retryBtn.setTexture(TextureKeys.RetryBtnHover);
    });
    retryBtn.on('pointerout', () => {
      retryBtn.setTexture(TextureKeys.RetryBtn);
    });

    retryBtn.on('pointerup', () => {
      // ! Starting the Game scene
      beepSfx.play();
      this.scene.start(SceneKeys.Game);
    });
  }
}
