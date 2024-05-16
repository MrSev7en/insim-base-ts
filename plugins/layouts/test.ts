import {
  ButtonStyle,
  ButtonTextColour,
  MessageSound,
} from 'node-insim/packets';
import { Button } from '#button';
import { Message } from '#message';
import { Player } from '#core/player';

export class TestLayout {
  public static creditsModal(player: Player): void {
    new Button()
      .setId(0)
      .setStyle(ButtonStyle.ISB_LEFT)
      .setTitle(`^7made by: ^0Mr^7Sev^07^7en`)
      .setWidth(50)
      .setHeight(5)
      .setTop(190)
      .setLeft(5)
      .setPlayer(player.uniqueId)
      .create();
  }

  public static speedModal(player: Player): void {
    new Button()
      .setId(1)
      .setStyle(ButtonStyle.ISB_LIGHT)
      .setTitle(`^7insim-base-ts`)
      .setWidth(50)
      .setHeight(5)
      .setTop(20)
      .setLeft(75)
      .setPlayer(player.uniqueId)
      .create();

    new Button()
      .setId(2)
      .setStyle(ButtonTextColour.LIGHT_GREY)
      .setTitle(`^1${player.speedKph}km/h`)
      .setWidth(50)
      .setHeight(5)
      .setTop(25)
      .setLeft(75)
      .setPlayer(player.uniqueId)
      .create();
  }

  public static buttonsModal(player: Player): void {
    let counter = 0;

    new Button()
      .setId(3)
      .setStyle(
        ButtonStyle.ISB_LIGHT |
          ButtonStyle.ISB_CLICK |
          ButtonTextColour.TEXT_STRING,
      )
      .setTitle('^7Counter: ^60')
      .setWidth(50)
      .setHeight(5)
      .setTop(30)
      .setLeft(75)
      .setPlayer(player.uniqueId)
      .onClick(({ button, stopPropagation }) => {
        if (counter++ < 10) {
          button.setTitle(`^7Counter: ^6${counter}`);
        } else {
          stopPropagation();
          button.setTitle('^1Counter max!');
        }
      })
      .create();

    new Button()
      .setId(4)
      .setStyle(
        ButtonStyle.ISB_DARK |
          ButtonStyle.ISB_CLICK |
          ButtonTextColour.TEXT_STRING,
      )
      .setTitle(player.translate('buttons.click-me'))
      .setWidth(50)
      .setHeight(5)
      .setTop(35)
      .setLeft(75)
      .setPlayer(player.uniqueId)
      .setClickOnce(true)
      .onClick(() =>
        new Message()
          .setText('^6---------------- YIKES ----------------')
          .setSound(MessageSound.SND_MESSAGE)
          .setPlayer(player.uniqueId)
          .send(),
      )
      .create();
  }
}
