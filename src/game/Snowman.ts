import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import Penguin from './Penguin';
import Game from '../scenes/Game';

export default class Snowman extends Phaser.GameObjects.Container {
  private target: Penguin;
  private sprite: Phaser.GameObjects.Image;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
    this.target = scene.penguin;
    this.sprite = scene.add.image(0, 0, TextureKeys.Snowman).setOrigin(0.5, 1);
    this.add(this.sprite);

    scene.physics.add.existing(this, true);
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(this.sprite.width - 50, this.sprite.height - 50);
    body.setOffset(
      -0.3 * this.sprite.displayWidth,
      -0.7 * this.sprite.displayHeight,
    );

    body.position.x = this.x + body.offset.x;
    body.position.y = this.y + body.offset.y;
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    this.sprite.flipX = this.target.x > body.position.x;
  }
}
