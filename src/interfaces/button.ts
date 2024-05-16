import {
  ButtonStyle,
  ButtonTextColour,
  IS_BFN,
  IS_BTC,
  IS_BTN,
  IS_BTT,
  PacketType,
} from 'node-insim/packets';
import { insim } from '#insim';

export class Button {
  public id!: number;
  public style!: ButtonStyle | ButtonTextColour;
  public title!: string;
  public caption!: string;
  public length!: number;
  public width!: number;
  public height!: number;
  public left!: number;
  public top!: number;
  public player!: number;
  public clickOnce!: boolean;
  public visible!: boolean;

  public constructor(instance?: Partial<Button>) {
    Object.assign(this, instance ?? {});
  }

  public setId(id: number): Button {
    this.id = id;
    this.update();

    return this;
  }

  public setStyle(style: ButtonStyle | ButtonTextColour): Button {
    this.style = style;
    this.update();

    return this;
  }

  public setTitle(...title: unknown[]): Button {
    this.title = title.join(' ');
    this.update();

    return this;
  }

  public setCaption(...caption: unknown[]): Button {
    this.caption = caption.join(' ');
    this.update();

    return this;
  }

  public setLength(length: number): Button {
    this.length = length;
    this.update();

    return this;
  }

  public setWidth(width: number): Button {
    this.width = width;
    this.update();

    return this;
  }

  public setHeight(height: number): Button {
    this.height = height;
    this.update();

    return this;
  }

  public setLeft(left: number): Button {
    this.left = left;
    this.update();

    return this;
  }

  public setTop(top: number): Button {
    this.top = top;
    this.update();

    return this;
  }

  public setPlayer(player: number): Button {
    this.player = player;
    this.update();

    return this;
  }

  public setClickOnce(clickOnce: boolean): Button {
    this.clickOnce = clickOnce;
    this.update();

    return this;
  }

  public onClick(
    callback: ({
      text,
      button,
      stopPropagation,
    }: {
      text: string;
      button: Button;
      stopPropagation: () => void;
    }) => void,
  ): Button {
    const type =
      this.caption || this.length ? PacketType.ISP_BTT : PacketType.ISP_BTC;

    const bind = (packet: IS_BTT | IS_BTC): void => {
      if (packet.ClickID === this.id && packet.UCID === this.player) {
        const text = packet instanceof IS_BTT ? packet.Text : '';

        callback({ text, button: this, stopPropagation: unbind });
        this.update();

        if (this.clickOnce) {
          unbind();
        }
      }
    };

    const unbind = (): void => {
      insim.removeListener(type, bind);
    };

    insim.addListener(type, bind);
    return this;
  }

  public create(): Button {
    if (this.visible) {
      this.update();
    } else {
      this.visible = true;
      this.update();
    }

    return this;
  }

  public update(): Button {
    if (this.visible) {
      insim.send(
        new IS_BTN({
          ClickID: this.id,
          BStyle: this.style,
          Text: `\0${this.caption}\0${this.title}`,
          TypeIn: this.length,
          W: this.width,
          H: this.height,
          L: this.left,
          T: this.top,
          UCID: this.player || 255,
          ReqI: 2,
        }),
      );
    }

    return this;
  }

  public destroy(): Button {
    if (this.visible) {
      this.visible = false;
      insim.send(new IS_BFN({ UCID: this.player, ClickID: this.id }));
    }

    return this;
  }
}
