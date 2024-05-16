# InSim Base in TypeScript - v0.0.0

InSim Base is a pre-made template to kickstart your InSim development without worrying about handlers, packets, and user management. It's all set up so you can focus on the logic and mechanics of your InSim.

## Before you start

1. Make sure your Node.js version is 20 or higher. Check using the command `node -v`, or download the required version [here](https://nodejs.org/dist/v20.13.1/node-v20.13.1-x64.msi).
2. Install pnpm to manage packages and run the code: `npm install -g pnpm`.
3. Clone the repository or download the project ZIP (`<> Code -> Download ZIP`).
4. Install dependencies: `pnpm install`.
5. Rename the `.env.example` file to `.env` and fill it with your server's data.
6. Start InSim using `pnpm dev`.

## InSim Programming

We've simplified development to the fullest, so you don't need to change anything in the `src` folder. All the logic and mechanics of your InSim should be developed in the `plugins` folder.

- Check out available examples like test events and test layouts.
- Examples include connection packets and a timer that runs every minute.

## Features of This Template

To facilitate development, the `Player` is immutable anywhere in the code. Player data will always be available. Additionally, we have several useful features:

- **Translation System**: Automatically detects the player's language and translates content according to the corresponding translation file.
- **Player Data Saving and Loading System**: All data in the `Player` class is saved in a `.json` file in the `database` folder with the player's username.
- **Immutable Data System**: Ensures player data integrity.
- **Managed Messaging System**.
- **Managed Button System**: With `onClick` type events.
- And much more.

## Immutable Data Handling

Instead of directly editing the `Player` class, you can use methods to modify properties, as shown in the example below:

```typescript
// Set '50' to this property.
player.set<number>('account.money', 50);

// Returns 50.
player.get<number>('account.money');

// Deletes the 'money' property, and it returns null.
player.remove('account.money');

// Deletes all properties.
player.clear();
```

These methods work for any data related to the `Player` class, for example:

```typescript
player
  .setName('MrSev7en')
  .set<boolean>('is_owner', true)
  .set<number>('bank.balance', 100)
  .set<number>('horse_power', 500);
```

## Found an issue or have suggestions?

Feel free to create an `Issue` on GitHub or contact me on Discord: `@MrSev7en`.

---
