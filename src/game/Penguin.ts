import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';
import Settings from '../consts/Settings';
import SceneKeys from '../consts/SceneKeys';

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
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    switch (this.penguinState) {
      case PenguinState.Running: {
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

      case PenguinState.Killed: {
        body.velocity.x *= 0.9;
        body.velocity.y = 400;

        if (body.velocity.x <= 5) {
          this.penguinState = PenguinState.Dead;
        }
        break;
      }

      case PenguinState.Dead: {
        body.setVelocity(0, 0);

        // ! Running the Gameover Scene
        if (!this.scene.scene.isActive(SceneKeys.GameOver))
          this.scene.scene.run(SceneKeys.GameOver);
        break;
      }
    }
  }
}
