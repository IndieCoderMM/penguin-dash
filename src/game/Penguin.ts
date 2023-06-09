import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';
import Settings from '../consts/Settings';

enum PenguinState {
  Running,
  Killed,
  Dead,
}

export default class Penguin extends Phaser.GameObjects.Container {
  private penguinState = PenguinState.Running;
  private jumping: boolean;
  private groundLevel: number;
  private sprite: Phaser.GameObjects.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.sprite = scene.add
      .sprite(0, 0, TextureKeys.Penguin)
      .setOrigin(0.5, 1)
      .play(AnimationKeys.PenguinWalk);
    this.add(this.sprite);

    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width, this.sprite.height);
    body.setOffset(this.sprite.width * -0.5, -this.sprite.height);

    this.jumping = false;
    this.groundLevel = scene.scale.height - 200;
    // Controls
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  kill() {
    if (this.penguinState !== PenguinState.Running) return;

    this.penguinState = PenguinState.Killed;

    this.sprite.anims.play(AnimationKeys.PenguinDie);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  preUpdate() {
    switch (this.penguinState) {
      case PenguinState.Running: {
        const body = this.body as Phaser.Physics.Arcade.Body;

        if (!this.jumping && this.cursors.space?.isDown) {
          body.setVelocityY(-Settings.JUMP_FORCE);
          this.jumping = true;
        }

        if (body.y + body.height == this.groundLevel) this.jumping = false;
        if (this.jumping)
          this.sprite.anims.play(AnimationKeys.PenguinJump, true);
        else this.sprite.anims.play(AnimationKeys.PenguinWalk, true);

        break;
      }
    }
  }
}
