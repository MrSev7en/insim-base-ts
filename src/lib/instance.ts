import { lstat, readdir } from 'fs/promises';
import { join } from 'path';

export async function loadInstances(...path: string[]): Promise<NodeRequire[]> {
  const instances: NodeRequire[] = [];

  async function recursively(path: string): Promise<void> {
    const stat = await lstat(path);
    const isDirectory = stat.isDirectory();

    if (isDirectory) {
      const files = await readdir(path);

      for (const file of files) {
        await recursively(join(path, file));
      }
    } else {
      const instance = await require(path);

      if (instance.default) {
        instances.push(instance.default);
      } else {
        instances.push(instance);
      }
    }
  }

  await recursively(join(__dirname, '..', '..', ...path));
  return instances;
}
