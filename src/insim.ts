import { InSim } from 'node-insim';
import { IS_TINY, InSimFlags, PacketType, TinyType } from 'node-insim/packets';
import { i18n } from '#i18n';
import { logger } from '#logger';
import { Event } from '#lib/event';
import { loadInstances } from '#lib/instance';
import 'dotenv/config';

export const insim = new InSim();

async function instantiate(): Promise<void> {
  const translations = await loadInstances('plugins', 'translations');
  const events = await loadInstances('plugins', 'events');

  for (const translation of translations) {
    i18n.store(translation);
  }

  for (const event of events) {
    const eventName = Object.keys(event).at(0) as never;
    const eventClass = event[eventName] as any;
    const eventInstance = new eventClass() as Event;

    const instanceUnknownCommands = eventInstance.unkwonCommands;
    const instanceCommands = eventInstance.commands;
    const instanceEvents = eventInstance.events;
    const instanceTicks = eventInstance.ticks;

    eventInstance.initialize(insim);

    insim.addListener(PacketType.ISP_MSO, (packet) => {
      instanceUnknownCommands.forEach((instanceUnknownCommand) =>
        eventInstance.onUnknownCommandHandler(instanceUnknownCommand, packet),
      );

      instanceCommands.forEach((instanceCommand) =>
        eventInstance.onCommandHandler(
          instanceCommand.commands,
          instanceCommand.callback,
          packet,
        ),
      );
    });

    for (const instanceEvent of instanceEvents) {
      insim.addListener(instanceEvent.type, instanceEvent.callback);
    }

    instanceTicks.forEach((instanceTick) =>
      setInterval(
        () => eventInstance.onTickHandler(instanceTick.callback),
        instanceTick.interval,
      ),
    );
  }
}

async function bootstrap(): Promise<void> {
  insim.on('connect', () => {
    logger.info(`InSim connected at ${process.env.HOST}:${process.env.PORT}`);

    insim.send(new IS_TINY({ SubT: TinyType.TINY_NCN, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_NCI, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_NLP, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_NPL, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_ALC, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_AXI, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_AXM, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_GTH, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_ISM, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_MAL, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_MCI, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_PLH, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_REO, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_RES, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_RIP, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_RST, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_SCP, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_SLC, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_SST, ReqI: 2 }));
    insim.send(new IS_TINY({ SubT: TinyType.TINY_VER, ReqI: 2 }));
  });

  insim.on('disconnect', () => {
    logger.warn('InSim was disconnected.');
  });

  insim.connect({
    Host: String(process.env.HOST),
    Port: Number(process.env.PORT),
    Admin: String(process.env.PASSWORD),
    Flags:
      InSimFlags.ISF_AXM_EDIT |
      InSimFlags.ISF_AXM_LOAD |
      InSimFlags.ISF_CON |
      InSimFlags.ISF_HLV |
      InSimFlags.ISF_MCI |
      InSimFlags.ISF_MSO_COLS |
      InSimFlags.ISF_NLP |
      InSimFlags.ISF_OBH,
    Interval: Number(process.env.INTERVAL),
    Prefix: '!',
  });
}

instantiate();
bootstrap();
