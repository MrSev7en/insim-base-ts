import {
  PlayerType,
  PlayerFlags,
  TyreCompound,
  PassengerFlags,
  CarConfiguration,
  Language,
  License,
} from 'node-insim/packets';
import { Scope, TranslateOptions } from 'i18n-js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { i18n } from '#i18n';
import { merge, objectify, remove, retrieve } from '#utils';

export class Player {
  public static players: Player[] = [];

  public uniqueId!: number;
  public playerId!: number;
  public username!: string;
  public name!: string;
  public plate!: string;
  public isAdministrator!: boolean;
  public ipAddress!: string;
  public language!: Language;
  public license!: License;
  public playerType!: PlayerType | 0;
  public playerFlags!: PlayerFlags | 0;
  public carName!: string;
  public skinName!: string;
  public tyreFrontalLeft!: TyreCompound;
  public tyreFrontalRight!: TyreCompound;
  public tyreRearLeft!: TyreCompound;
  public tyreRearRight!: TyreCompound;
  public addedMass!: number;
  public intakeRestriction!: number;
  public model!: number;
  public passengerFlags!: PassengerFlags | 0;
  public frontalWheelsAdjustment!: number;
  public rearWheelsAdjustment!: number;
  public raceNumber!: number;
  public carConfiguration!: CarConfiguration;
  public fuel!: number;
  public positionX!: number;
  public positionY!: number;
  public positionZ!: number;
  public heading!: number;
  public angle!: number;
  public speedMph!: number;
  public speedKph!: number;
  public lap!: number;
  public pitStatus: 'TRACK' | 'PIT' | 'SPECTATE' = 'SPECTATE';
  public data: any = {};

  public constructor(instance?: Partial<Player>) {
    Object.assign(this, instance ?? {});
  }

  public setUniqueId(uniqueId: number): Player {
    this.uniqueId = uniqueId;
    this.save();

    return this;
  }

  public setPlayerId(playerId: number): Player {
    this.playerId = playerId;
    this.save();

    return this;
  }

  public setUsername(username: string): Player {
    this.username = username;
    this.save();

    return this;
  }

  public setName(name: string): Player {
    this.name = name;
    this.save();

    return this;
  }

  public setPlate(plate: string): Player {
    this.plate = plate;
    this.save();

    return this;
  }

  public setIsAdministrator(isAdministrator: boolean): Player {
    this.isAdministrator = isAdministrator;
    this.save();

    return this;
  }

  public setIpAddress(ipAddress: string): Player {
    this.ipAddress = ipAddress;
    this.save();

    return this;
  }

  public setLanguage(language: Language): Player {
    this.language = language;
    this.save();

    return this;
  }

  public setLicense(license: License): Player {
    this.license = license;
    this.save();

    return this;
  }

  public setPlayerType(playerType: PlayerType | 0): Player {
    this.playerType = playerType;
    this.save();

    return this;
  }

  public setPlayerFlags(playerFlags: PlayerFlags | 0): Player {
    this.playerFlags = playerFlags;
    this.save();

    return this;
  }

  public setCarName(carName: string): Player {
    this.carName = carName;
    this.save();

    return this;
  }

  public setSkinName(skinName: string): Player {
    this.skinName = skinName;
    this.save();

    return this;
  }

  public setTyreFrontalLeft(tyreFrontalLeft: TyreCompound): Player {
    this.tyreFrontalLeft = tyreFrontalLeft;
    this.save();

    return this;
  }

  public setTyreFrontalRight(tyreFrontalRight: TyreCompound): Player {
    this.tyreFrontalRight = tyreFrontalRight;
    this.save();

    return this;
  }

  public setTyreRearLeft(tyreRearLeft: TyreCompound): Player {
    this.tyreRearLeft = tyreRearLeft;
    this.save();

    return this;
  }

  public setTyreRearRight(tyreRearRight: TyreCompound): Player {
    this.tyreRearRight = tyreRearRight;
    this.save();

    return this;
  }

  public setAddedMass(addedMass: number): Player {
    this.addedMass = addedMass;
    this.save();

    return this;
  }

  public setIntakeRestriction(intakeRestriction: number): Player {
    this.intakeRestriction = intakeRestriction;
    this.save();

    return this;
  }

  public setModel(model: number): Player {
    this.model = model;
    this.save();

    return this;
  }

  public setPassengerFlags(passengerFlags: PassengerFlags | 0): Player {
    this.passengerFlags = passengerFlags;
    this.save();

    return this;
  }

  public setFrontalWheelsAdjustment(frontalWheelsAdjustment: number): Player {
    this.frontalWheelsAdjustment = frontalWheelsAdjustment;
    this.save();

    return this;
  }

  public setRearWheelsAdjustment(rearWheelsAdjustment: number): Player {
    this.rearWheelsAdjustment = rearWheelsAdjustment;
    this.save();

    return this;
  }

  public setRaceNumber(raceNumber: number): Player {
    this.raceNumber = raceNumber;
    this.save();

    return this;
  }

  public setCarConfiguration(carConfiguration: CarConfiguration): Player {
    this.carConfiguration = carConfiguration;
    this.save();

    return this;
  }

  public setFuel(fuel: number): Player {
    this.fuel = fuel;
    this.save();

    return this;
  }

  public setPositionX(positionX: number): Player {
    this.positionX = positionX;

    return this;
  }

  public setPositionY(positionY: number): Player {
    this.positionY = positionY;

    return this;
  }

  public setPositionZ(positionZ: number): Player {
    this.positionZ = positionZ;

    return this;
  }

  public setHeading(heading: number): Player {
    this.heading = heading;

    return this;
  }

  public setAngle(angle: number): Player {
    this.angle = angle;

    return this;
  }

  public setSpeedMph(speedMph: number): Player {
    this.speedMph = speedMph;

    return this;
  }

  public setSpeedKph(speedKph: number): Player {
    this.speedKph = speedKph;

    return this;
  }

  public setLap(lap: number): Player {
    this.lap = lap;

    return this;
  }

  public setPitStatus(pitStatus: 'TRACK' | 'PIT' | 'SPECTATE'): Player {
    this.pitStatus = pitStatus;
    this.save();

    return this;
  }

  public closer(radius: number): Player[] {
    return Player.players.filter(
      (player) =>
        ((player.uniqueId > 0 && player.uniqueId !== this.uniqueId) ||
          (player.playerId > 0 && player.playerId !== this.playerId)) &&
        Math.abs(this.positionX * 65536 - player.positionX * 65536) <= radius &&
        Math.abs(this.positionY * 65536 - player.positionY * 65536) <= radius &&
        Math.abs(this.positionZ * 65536 - player.positionZ * 65536) <= radius,
    );
  }

  public translate(scope: Scope, options?: TranslateOptions): string {
    switch (this.language) {
      case Language.LFS_ENGLISH:
        i18n.locale = 'en-US';
        break;

      case Language.LFS_DEUTSCH:
        i18n.locale = 'de-DE';
        break;

      case Language.LFS_PORTUGUESE:
        i18n.locale = 'pt-PT';
        break;

      case Language.LFS_FRENCH:
        i18n.locale = 'fr-FR';
        break;

      case Language.LFS_SUOMI:
        i18n.locale = 'fi-FI';
        break;

      case Language.LFS_NORSK:
        i18n.locale = 'no-NO';
        break;

      case Language.LFS_NEDERLANDS:
        i18n.locale = 'nl-NL';
        break;

      case Language.LFS_CATALAN:
        i18n.locale = 'ca-ES';
        break;

      case Language.LFS_TURKISH:
        i18n.locale = 'tr-TR';
        break;

      case Language.LFS_CASTELLANO:
        i18n.locale = 'es-ES';
        break;

      case Language.LFS_ITALIANO:
        i18n.locale = 'it-IT';
        break;

      case Language.LFS_DANSK:
        i18n.locale = 'da-DK';
        break;

      case Language.LFS_CZECH:
        i18n.locale = 'cs-CZ';
        break;

      case Language.LFS_RUSSIAN:
        i18n.locale = 'ru-RU';
        break;

      case Language.LFS_ESTONIAN:
        i18n.locale = 'et-EE';
        break;

      case Language.LFS_SERBIAN:
        i18n.locale = 'sr-RS';
        break;

      case Language.LFS_GREEK:
        i18n.locale = 'el-GR';
        break;

      case Language.LFS_POLSKI:
        i18n.locale = 'pl-PL';
        break;

      case Language.LFS_CROATIAN:
        i18n.locale = 'hr-HR';
        break;

      case Language.LFS_HUNGARIAN:
        i18n.locale = 'hu-HU';
        break;

      case Language.LFS_BRAZILIAN:
        i18n.locale = 'pt-BR';
        break;

      case Language.LFS_SWEDISH:
        i18n.locale = 'sv-SE';
        break;

      case Language.LFS_SLOVAK:
        i18n.locale = 'sk-SK';
        break;

      case Language.LFS_GALEGO:
        i18n.locale = 'gl-ES';
        break;

      case Language.LFS_SLOVENSKI:
        i18n.locale = 'sl-SI';
        break;

      case Language.LFS_BELARUSSIAN:
        i18n.locale = 'be-BY';
        break;

      case Language.LFS_LATVIAN:
        i18n.locale = 'lv-LV';
        break;

      case Language.LFS_LITHUANIAN:
        i18n.locale = 'lt-LT';
        break;

      case Language.LFS_TRADITIONAL_CHINESE:
        i18n.locale = 'zh-TW';
        break;

      case Language.LFS_SIMPLIFIED_CHINESE:
        i18n.locale = 'zh-CN';
        break;

      case Language.LFS_JAPANESE:
        i18n.locale = 'ja-JP';
        break;

      case Language.LFS_KOREAN:
        i18n.locale = 'ko-KR';
        break;

      case Language.LFS_BULGARIAN:
        i18n.locale = 'bg-BG';
        break;

      case Language.LFS_LATINO:
        i18n.locale = 'la';
        break;

      case Language.LFS_UKRAINIAN:
        i18n.locale = 'uk-UA';
        break;

      case Language.LFS_INDONESIAN:
        i18n.locale = 'id-ID';
        break;

      case Language.LFS_ROMANIAN:
        i18n.locale = 'ro-RO';
        break;

      default:
        i18n.locale = 'en-US';
        break;
    }

    return i18n.t(scope, options);
  }

  public load(): Player {
    if (
      this.username &&
      existsSync(
        join(__dirname, '..', '..', '..', 'database', `${this.username}.json`),
      )
    ) {
      Object.assign(
        this,
        JSON.parse(
          readFileSync(
            join(
              __dirname,
              '..',
              '..',
              '..',
              'database',
              `${this.username}.json`,
            ),
            { encoding: 'utf-8' },
          ),
        ),
      );
    }

    return this;
  }

  public save(): Player {
    if (this.username) {
      writeFileSync(
        join(__dirname, '..', '..', '..', 'database', `${this.username}.json`),
        JSON.stringify(this, null, 2),
        { encoding: 'utf-8' },
      );
    }

    return this;
  }

  /**
   * Retrieves the value from the nested object structure based on the given path.
   * @template T
   * @param {string} path - The path to the desired value, using dot notation.
   * @returns {T} - The value at the specified path.
   */
  public get<T>(path: string): T {
    return retrieve(path, this.data);
  }

  /**
   * Sets a value in the nested object structure based on the given path.
   * @template T
   * @param {string} path - The path where the value should be set, using dot notation.
   * @param {T} value - The value to set at the specified path.
   * @returns {Player} - The instance of the Player class.
   */
  public set<T>(path: string, value: T): Player {
    this.data = merge(this.data, objectify(path, value));
    this.save();

    return this;
  }

  /**
   * Removes a specific key from the nested object structure based on the given path.
   * @param {string} path - The path to the key that should be removed, using dot notation.
   * @returns {Player} - The instance of the Player class.
   */
  public remove(path: string): Player {
    this.data = remove(this.data, path.split('.'));
    this.save();

    return this;
  }

  /**
   * Clears all data from the Player instance.
   * @returns {Player} - The instance of the Player class.
   */
  public clear(): Player {
    this.data = {};
    this.save();

    return this;
  }
}
