import Phaser from 'phaser';
import Game from './scenes/Game';
import Preloader from './scenes/Preloader';
import Settings from './consts/Settings';
import GameOver from './scenes/GameOver';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: '100%',
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: Settings.GRAVITY },
    },
  },
  scene: [Preloader, Game, GameOver],
};

document.body.style.overflow = 'hidden';

export default new Phaser.Game(config);
