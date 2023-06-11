import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';
import Settings from '../consts/Settings';
import SceneKeys from '../consts/SceneKeys';
import AudioKeys from '../consts/AudioKeys';

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
  private jumpSfx: Phaser.Sound.BaseSound;
  private hitSfx: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.sprite = scene.add.sprite(0, 0, TextureKeys.Penguin).setOrigin(0.5, 1);

    this.createAnimations();
    this.sprite.play(AnimationKeys.PenguinWalk);

    this.add(this.sprite);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width, this.sprite.height);
    body.setOffset(this.sprite.width * -0.5, -this.sprite.height);

    this.jumping = false;
    this.groundLevel = scene.scale.height - 200;
    // Controls
    const keyboard = scene.input
      .keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    this.cursors = keyboard.createCursorKeys();
    // SFX
    this.jumpSfx = scene.sound.add(AudioKeys.Jump);
    this.hitSfx = scene.sound.add(AudioKeys.Hit);
  }

  kill() {
    if (this.penguinState !== PenguinState.Running) return;

    this.penguinState = PenguinState.Killed;
    this.hitSfx.play();

    this.sprite.play(AnimationKeys.PenguinDie);
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    switch (this.penguinState) {
      case PenguinState.Running: {
        if (!this.jumping && this.cursors.space?.isDown) {
          body.setVelocityY(-Settings.JUMP_FORCE);
          this.jumping = true;
          this.jumpSfx.play();
        }

        if (body.y + body.height == this.groundLevel) this.jumping = false;
        if (this.jumping) this.sprite.play(AnimationKeys.PenguinJump, true);
        else this.sprite.play(AnimationKeys.PenguinWalk, true);

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

  private createAnimations() {
    this.sprite.anims.create({
      key: AnimationKeys.PenguinWalk,
      frames: this.sprite.anims.generateFrameNames(TextureKeys.Penguin, {
        start: 1,
        end: 4,
        prefix: AnimationKeys.PenguinWalk,
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite.anims.create({
      key: AnimationKeys.PenguinJump,
      frames: this.sprite.anims.generateFrameNames(TextureKeys.Penguin, {
        start: 2,
        end: 3,
        prefix: AnimationKeys.PenguinJump,
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 1,
    });

    this.sprite.anims.create({
      key: AnimationKeys.PenguinDie,
      frames: this.sprite.anims.generateFrameNames(TextureKeys.Penguin, {
        start: 1,
        end: 4,
        prefix: AnimationKeys.PenguinDie,
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
    });
  }
}
