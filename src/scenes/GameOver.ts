import Phaser from 'phaser';

import SceneKeys from '../consts/SceneKeys';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver);
  }

  create() {
    const { width, height } = this.scale;

    const x = width * 0.5;
    const y = 200;

    this.add
      .text(x, y, 'Press SPACE to Play Again', {
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
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.stop(SceneKeys.GameOver);

      // ! Restarting the Game scene
      this.scene.stop(SceneKeys.Game);
      this.scene.start(SceneKeys.Game);
    });
  }
}
