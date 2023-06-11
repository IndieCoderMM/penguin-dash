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
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private scoreLabel!: Phaser.GameObjects.Text;
  private score = 0;
  private coinSpawner!: Phaser.Time.TimerEvent;
  private scoreAdder!: Phaser.Time.TimerEvent;

  constructor() {
    super(SceneKeys.Game);
  }

  init() {
    this.score = 0;
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

    this.coins = this.physics.add.staticGroup();
    this.spawnCoins();

    this.coinSpawner = this.time.addEvent({
      delay: 10000,
      callback: this.spawnCoins,
      callbackScope: this,
      loop: true,
    });

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

    // Collect coins
    this.physics.add.overlap(
      this.coins,
      this.penguin,
      this.handleCoinCollect,
      undefined,
      this,
    );

    // Setting world bounds
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, groundLevel);

    // Camera setup
    this.cameras.main.startFollow(this.penguin);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);

    // Score label
    this.scoreLabel = this.add
      .text(10, 10, `Score: ${this.score}`, {
        fontFamily: 'Arial',
        fontSize: '50px',
        color: '#4A90E2',
        stroke: '#4A90E2',
        strokeThickness: 2,
        shadow: { stroke: false },
      })
      .setScrollFactor(0);

    // Add score every second
    this.scoreAdder = this.time.addEvent({
      delay: 1000,
      callback: () => (this.score += 1),
      callbackScope: this,
      loop: true,
    });
  }

  update(t: number, dt: number) {
    this.wrapDecors();
    this.wrapSnowman();
    this.background.setTilePosition(this.cameras.main.scrollX);
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  private spawnCoins() {
    this.coins.children.each((child) => {
      const coin = child as Phaser.Physics.Arcade.Sprite;
      this.coins.killAndHide(coin);
      coin.body.enable = false;
    });

    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    let x = rightEdge + 100;
    const y = this.scale.height * 0.5;

    const numCoins = Phaser.Math.Between(3, 20);

    for (let i = 0; i < numCoins; i++) {
      const coin = this.coins.get(
        x,
        y,
        TextureKeys.Coin,
      ) as Phaser.Physics.Arcade.Sprite;
      coin.setVisible(true);
      coin.setActive(true);

      const body = coin.body as Phaser.Physics.Arcade.StaticBody;
      body.setCircle(body.width * 0.5);
      body.enable = true;
      body.updateFromGameObject();

      x += coin.width * 1.5;
    }
  }

  private handleCoinCollect(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    this.score += 10;
    this.scoreLabel.text = `Score: ${this.score}`;
    // Remove coin
    const coin = obj2 as Phaser.Physics.Arcade.Sprite;
    this.coins.killAndHide(coin);
    coin.body.enable = false;
  }

  private handleOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    this.penguin.kill();
    this.coinSpawner.destroy();
    this.scoreAdder.destroy();
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
