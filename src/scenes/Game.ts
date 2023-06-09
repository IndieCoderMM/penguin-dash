import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';
import Penguin from '../game/Penguin';
import Snowman from '../game/Snowman';
import Settings from '../consts/Settings';

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  public penguin!: Penguin;
  private snowman!: Snowman;
  private decors: Phaser.GameObjects.Image[] = [];

  constructor() {
    super(SceneKeys.Game);
  }

  create() {
    const { width, height } = this.scale;
    const groundLevel = height - 200;
    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0)
      .setScrollFactor(0, 0);

    // Place objects
    const igloo = this.add
      .image(Phaser.Math.Between(900, 1500), groundLevel - 5, TextureKeys.Igloo)
      .setOrigin(0, 1);
    const treeSmall = this.add
      .image(
        Phaser.Math.Between(1700, 2000),
        height - 205,
        TextureKeys.TreeSmall,
      )
      .setOrigin(0, 1);
    const treeLarge = this.add
      .image(
        Phaser.Math.Between(2100, 2300),
        height - 205,
        TextureKeys.TreeLarge,
      )
      .setOrigin(0, 1);

    // Add objects to decors
    this.decors = [igloo, treeSmall, treeLarge];

    this.penguin = new Penguin(this, width * 0.5, groundLevel);
    this.penguin.setDepth(1); // Display over others
    this.add.existing(this.penguin);

    const body = this.penguin.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setVelocityX(Settings.SPEED);

    this.snowman = new Snowman(this, 1500, groundLevel);
    this.add.existing(this.snowman);

    // Collision handling
    this.physics.add.overlap(
      this.snowman,
      this.penguin,
      this.handleOverlap,
      undefined,
      this,
    );

    // Setting world bounds
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, groundLevel);

    // Camera setup
    this.cameras.main.startFollow(this.penguin);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
  }

  update(t: number, dt: number) {
    this.wrapDecors();
    this.wrapSnowman();
    this.background.setTilePosition(this.cameras.main.scrollX);
  }

  private handleOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    this.penguin.kill();
  }

  private wrapSnowman() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    const body = this.snowman.body as Phaser.Physics.Arcade.StaticBody;
    const width = body.width;

    if (this.snowman.x + width < scrollX) {
      this.snowman.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 1000,
      );
      body.position.x = this.snowman.x + body.offset.x;
    }
  }

  private wrapDecors() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    for (let i = 0; i < this.decors.length; i++) {
      const object = this.decors[i];
      if (object.x + object.width < scrollX) {
        const randX = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000);

        const overlapping = this.decors.find((d) => {
          return Math.abs(randX - d.x) <= object.width;
        });
        object.x = randX;
        object.visible = !overlapping;
      }
    }
  }
}
