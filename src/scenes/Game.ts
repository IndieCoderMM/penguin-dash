import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';
import Penguin from '../game/Penguin';

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private decors: Phaser.GameObjects.Image[] = [];

  constructor() {
    super(SceneKeys.Game);
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0)
      .setScrollFactor(0, 0);

    const igloo = this.add
      .image(Phaser.Math.Between(900, 1500), height - 205, TextureKeys.Igloo)
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

    this.decors = [igloo, treeSmall, treeLarge];

    const penguin = new Penguin(this, width * 0.5, height - 200);
    this.add.existing(penguin);

    const body = penguin.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setVelocityX(200);

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 200);

    this.cameras.main.startFollow(penguin);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
  }

  update(t: number, dt: number) {
    this.wrapDecors();
    this.background.setTilePosition(this.cameras.main.scrollX);
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
