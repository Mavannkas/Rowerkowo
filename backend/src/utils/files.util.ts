import { stat } from 'fs/promises';
import { extname } from 'path';

export async function getUnExistingFileName(
  destination: string,
  name: string,
): Promise<string> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const fileName = `${crypto.randomUUID()}${extname(name)}`;
    console.log(
      (await stat(`${destination}/${fileName}`).catch(() => 'not found')) ==
        'not found',
    );
    if (
      (await stat(`${destination}/${fileName}`).catch(() => 'not found')) ==
      'not found'
    ) {
      return fileName;
    }
  }
}
