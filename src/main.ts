import Phaser from 'phaser';
import Game from './scenes/Game';
import Preloader from './scenes/Preloader';
import Settings from './consts/Settings';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: Settings.GRAVITY },
      debug: true,
    },
  },
  scene: [Preloader, Game],
};

export default new Phaser.Game(config);
