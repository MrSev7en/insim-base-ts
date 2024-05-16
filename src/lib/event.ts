import { InSim } from 'node-insim';
import {
  IS_CNL,
  IS_CPR,
  IS_MCI,
  IS_MSO,
  IS_NCI,
  IS_NCN,
  IS_NPL,
  IS_PLL,
  IS_PLP,
  IS_TOC,
  PacketType,
  UserType,
} from 'node-insim/packets';
import { Player } from '#core/player';

export class Event {
  public unkwonCommands: ((
    player: Player,
    command: string,
    args: string[],
  ) => Promise<void>)[] = [];

  public commands: {
    commands: string[];
    callback: (player: Player, args: string[]) => Promise<void>;
  }[] = [];

  public events: {
    type: PacketType;
    callback: (packet: any) => Promise<void>;
  }[] = [];

  public ticks: {
    interval: number;
    callback: (players: Player[]) => Promise<void>;
  }[] = [];

  public initialize(insim: InSim): void {
    insim.addListener(PacketType.ISP_NCN, this.onPlayerConnectHandler);
    insim.addListener(PacketType.ISP_NCI, this.onPlayerDetailsHandler);
    insim.addListener(PacketType.ISP_CNL, this.onPlayerLeftHandler);
    insim.addListener(PacketType.ISP_NPL, this.onPlayerJoinHandler);
    insim.addListener(PacketType.ISP_PLP, this.onPlayerPitHandler);
    insim.addListener(PacketType.ISP_PLL, this.onPlayerSpectateHandler);
    insim.addListener(PacketType.ISP_TOC, this.onPlayerChangeHandler);
    insim.addListener(PacketType.ISP_CPR, this.onPlayerRenameHandler);
    insim.addListener(PacketType.ISP_MCI, this.onCarMovementHandler);
  }

  public async onUnknownCommand(
    callback: (
      player: Player,
      command: string,
      args: string[],
    ) => Promise<void>,
  ): Promise<void> {
    this.unkwonCommands.push(callback);
  }

  public async onCommand(
    commands: string | string[],
    callback: (player: Player, args: string[]) => Promise<void>,
  ): Promise<void> {
    this.commands.push({
      commands: Array.isArray(commands) ? commands : [commands],
      callback,
    });
  }

  public async onEvent<T>(
    packetType: PacketType,
    callback: (player: Player, packet: T) => Promise<void>,
  ): Promise<void> {
    this.events.push({
      type: packetType,
      callback: async (packet) => this.onEventHandler<T>(callback, packet),
    });
  }

  public async onTick(
    interval: number,
    callback: (players: Player[]) => Promise<void>,
  ): Promise<void> {
    this.ticks.push({ interval, callback });
  }

  public onUnknownCommandHandler(
    callback: (
      player: Player,
      command: string,
      args: string[],
    ) => Promise<void>,
    packet: IS_MSO,
  ): void {
    if (packet.UserType === UserType.MSO_PREFIX) {
      const content = packet.Msg.substring(packet.TextStart)
        .replace(/ +(?= )/g, '')
        .split(' ');
      const command = content[0].slice(1);
      const args = content.slice(1);
      const player = Player.players.find(
        (player) =>
          (player.uniqueId > 0 && player.uniqueId === packet.UCID) ||
          (player.playerId > 0 && player.playerId === packet.PLID),
      ) as Player;

      if (
        !this.commands.some((c) =>
          c.commands.some(
            (commands) => commands.toLowerCase() === command.toLowerCase(),
          ),
        )
      ) {
        callback(player, command, args);
      }
    }
  }

  public onCommandHandler(
    commands: string[],
    callback: (player: Player, args: string[]) => Promise<void>,
    packet: IS_MSO,
  ): void {
    if (packet.UserType === UserType.MSO_PREFIX) {
      const content = packet.Msg.substring(packet.TextStart)
        .replace(/ +(?= )/g, '')
        .split(' ');
      const command = content[0].slice(1);
      const args = content.slice(1);
      const player = Player.players.find(
        (player) =>
          (player.uniqueId > 0 && player.uniqueId === packet.UCID) ||
          (player.playerId > 0 && player.playerId === packet.PLID),
      ) as Player;

      if (commands.some((c) => c.toLowerCase() === command.toLowerCase())) {
        callback(player, args);
      }
    }
  }

  public onEventHandler<T>(
    callback: (player: Player, packet: T) => Promise<void>,
    packet: any,
  ): void {
    const player = Player.players.find(
      (player) =>
        player.uniqueId === packet.UCID ||
        (player.playerId > 0 &&
          player.playerId ===
            (packet.Info?.find?.(
              (info: { PLID: number }) => info.PLID === player.playerId,
            )?.PLID || packet.playerId)),
    ) as Player;

    callback(player, packet);
  }

  public onTickHandler(callback: (players: Player[]) => Promise<void>): void {
    callback(Player.players);
  }

  private onPlayerConnectHandler(packet: IS_NCN): void {
    const exists = Player.players.find(
      (player) => player.uniqueId === packet.UCID,
    );

    if (!exists && packet.UName) {
      const player = new Player();

      player.username = packet.UName;
      player
        .load()
        .setUniqueId(packet.UCID)
        .setUsername(packet.UName)
        .setName(packet.PName)
        .setIsAdministrator(!!packet.Admin);

      Player.players.push(player);
    }
  }

  private onPlayerDetailsHandler(packet: IS_NCI): void {
    const player = Player.players.find(
      (player) => player.uniqueId === packet.UCID,
    );

    if (player) {
      player
        .setIpAddress(packet.IPAddress)
        .setLanguage(packet.Language)
        .setLicense(packet.License);
    }
  }

  private onPlayerLeftHandler(packet: IS_CNL): void {
    const index = Player.players.findIndex(
      (player) => player.uniqueId === packet.UCID,
    );

    if (index !== -1) {
      Player.players.splice(index, 1);
    }
  }

  private onPlayerJoinHandler(packet: IS_NPL): void {
    const player = Player.players.find(
      (player) =>
        (player.uniqueId > 0 && player.uniqueId === packet.UCID) ||
        (player.playerId > 0 && player.playerId === packet.PLID),
    );

    if (player) {
      player
        .setPlayerId(packet.PLID)
        .setPlate(packet.Plate)
        .setPlayerType(packet.PType)
        .setPlayerFlags(packet.Flags)
        .setCarName(packet.CName)
        .setSkinName(packet.SName)
        .setTyreFrontalLeft(packet.TyreFL)
        .setTyreFrontalRight(packet.TyreFR)
        .setTyreRearLeft(packet.TyreRL)
        .setTyreRearRight(packet.TyreRR)
        .setAddedMass(packet.H_Mass)
        .setIntakeRestriction(packet.H_TRes)
        .setModel(packet.Model)
        .setPassengerFlags(packet.Pass)
        .setFrontalWheelsAdjustment(packet.FWAdj)
        .setRearWheelsAdjustment(packet.RWAdj)
        .setRaceNumber(packet.NumP)
        .setCarConfiguration(packet.Config)
        .setFuel(packet.Fuel)
        .setPitStatus('TRACK');
    }
  }

  private onPlayerPitHandler(packet: IS_PLP): void {
    const player = Player.players.find(
      (player) => player.playerId > 0 && player.playerId === packet.PLID,
    );

    if (player) {
      player.setPlayerId(-1).setPitStatus('PIT');
    }
  }

  private onPlayerSpectateHandler(packet: IS_PLL): void {
    const player = Player.players.find(
      (player) => player.playerId > 0 && player.playerId === packet.PLID,
    );

    if (player) {
      player.setPlayerId(-1).setPitStatus('SPECTATE');
    }
  }

  private onPlayerChangeHandler(packet: IS_TOC): void {
    const player = Player.players.find(
      (player) => player.uniqueId === packet.OldUCID,
    );

    if (player) {
      player.setUniqueId(packet.NewUCID).setPlayerId(packet.PLID);
    }
  }

  private onPlayerRenameHandler(packet: IS_CPR): void {
    const player = Player.players.find(
      (player) => player.uniqueId === packet.UCID,
    );

    if (player) {
      player.setName(packet.PName).setPlate(packet.Plate);
    }
  }

  private onCarMovementHandler(packet: IS_MCI): void {
    for (const info of packet.Info) {
      const player = Player.players.find(
        (player) => player.playerId > 0 && player.playerId === info.PLID,
      );

      if (player) {
        player
          .setPositionX(Math.floor(info.X / 65536))
          .setPositionY(Math.floor(info.Y / 65536))
          .setPositionZ(Math.floor(info.Z / 65536))
          .setHeading(Math.floor(info.Heading / 256 + 128))
          .setAngle(Math.floor(info.AngVel / 16384))
          .setSpeedMph(Math.floor(info.Speed / 146.486067))
          .setSpeedKph(Math.floor(info.Speed / 91.02))
          .setLap(info.Lap);
      }
    }
  }
}
