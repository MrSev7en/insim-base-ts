import { IS_MTC, MessageSound } from 'node-insim/packets';
import { insim } from '#insim';

export class Message {
  public text!: string;
  public sound!: MessageSound;
  public player!: number;

  public constructor(instance?: Partial<Message>) {
    Object.assign(this, instance ?? {});
  }

  public setText(...text: unknown[]): Message {
    this.text = text.join(' ');
    return this;
  }

  public setSound(sound: MessageSound): Message {
    this.sound = sound;
    return this;
  }

  public setPlayer(player: number): Message {
    this.player = player;
    return this;
  }

  public send(): Message {
    insim.send(
      new IS_MTC({
        Text: this.text,
        Sound: this.sound,
        UCID: this.player,
      }),
    );

    return this;
  }
}
