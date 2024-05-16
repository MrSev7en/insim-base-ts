import { IS_MCI, IS_NCI, MessageSound, PacketType } from 'node-insim/packets';
import { Event } from '#event';
import { i18n } from '#i18n';
import { logger } from '#logger';
import { Message } from '#message';
import { Player } from '#core/player';
import { TestLayout } from '#layouts/test';

export class TestEvent extends Event {
  public constructor() {
    super();

    this.onUnknownCommand(this.onCommandNotFound);
    this.onCommand('buttons', this.onButtonsCommand);
    this.onCommand('closer', this.onCloserCommand);
    this.onCommand('help', this.onTestCommand);
    this.onCommand('howoldareme', this.onHowOldAreMeCommand);
    this.onCommand(
      [
        i18n.translations['en-US'].commands.multilingual.name,
        i18n.translations['pt-BR'].commands.multilingual.name,
      ],
      this.onMultilingualCommand,
    );

    this.onEvent<IS_NCI>(PacketType.ISP_NCI, this.onPlayerConnect);
    this.onEvent<IS_MCI>(PacketType.ISP_MCI, this.onCarMovement);

    this.onTick(60 * 1000, this.onMinuteTick);
  }

  public async onCommandNotFound(
    player: Player,
    command: string,
    args: string[],
  ): Promise<void> {
    logger.warn(
      `Player "${player.username}" tried to use an unknown command: "${command}" with args "${args.join(', ')}"`,
    );
  }

  public async onButtonsCommand(player: Player): Promise<void> {
    TestLayout.buttonsModal(player);
  }

  public async onCloserCommand(player: Player, args: string[]): Promise<void> {
    new Message()
      .setText(
        player.translate('commands.closer', {
          names: player
            .closer(args[0] ? Number(args[0]) : 50)
            .map((player) => player.username)
            .join(', '),
        }),
      )
      .setSound(MessageSound.SND_INVALIDKEY)
      .setPlayer(player.uniqueId)
      .send();
  }

  public async onTestCommand(player: Player): Promise<void> {
    new Message()
      .setText(player.translate('commands.help.primary'))
      .setSound(MessageSound.SND_MESSAGE)
      .setPlayer(player.uniqueId)
      .send();

    new Message()
      .setText(player.translate('commands.help.secondary'))
      .setSound(MessageSound.SND_MESSAGE)
      .setPlayer(player.uniqueId)
      .send();
  }

  public async onMultilingualCommand(player: Player): Promise<void> {
    new Message()
      .setText('^5=)')
      .setSound(MessageSound.SND_ERROR)
      .setPlayer(player.uniqueId)
      .send();
  }

  public async onHowOldAreMeCommand(
    player: Player,
    args: string[],
  ): Promise<void> {
    if (args[0]) {
      player.set('my.age.here', Number(args[0]));
    }

    new Message()
      .setText(`^2You're ^6${player.get<number>('my.age.here')} years old`)
      .setSound(MessageSound.SND_SYSMESSAGE)
      .setPlayer(player.uniqueId)
      .send();
  }

  public async onPlayerConnect(player: Player): Promise<void> {
    logger.warn(`Player "${player.username}" joined in server.`);

    new Message()
      .setText(player.translate('join', { name: player.name }))
      .setSound(MessageSound.SND_MESSAGE)
      .setPlayer(player.uniqueId)
      .send();
  }

  public async onCarMovement(player: Player): Promise<void> {
    TestLayout.creditsModal(player);
    TestLayout.speedModal(player);
  }

  public async onMinuteTick(players: Player[]): Promise<void> {
    logger.warn(`Server has "${players.length}" players playing!`);
  }
}
