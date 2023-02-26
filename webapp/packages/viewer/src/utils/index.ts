import { db } from './viewerDb';
import { readImageArrayBuffer } from 'itk-wasm';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

function hasClassName(className: string, classNameStart): boolean {
  if (className == null) {
    return false;
  }

  const classNameParts = className.split(' ');

  return classNameParts.reduce((prev, cn) => cn.trim().startsWith(classNameStart) || prev, false);
}

async function createItkWebWorker(worker: Worker | null) {
  const smallPng = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 6, 0, 0, 0, 6, 8, 6, 0, 0, 0, 224, 204, 239,
    72, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 14, 196, 0, 0, 14, 196, 1, 149, 43, 14, 27, 0, 0, 0, 39, 73, 68, 65, 84, 8,
    153, 99, 116, 116, 116, 252, 207, 200, 200, 200, 128, 14, 152, 48, 68, 136, 146, 248, 255, 255, 63, 110, 29, 232,
    146, 76, 216, 84, 51, 48, 48, 48, 0, 0, 146, 134, 10, 200, 117, 66, 188, 155, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66,
    96, 130
  ]);
  const { webWorker } = await readImageArrayBuffer(worker, smallPng.buffer, 'x', 'image/png');
  return webWorker;
}

export { delay, capitalize, createItkWebWorker, db, hasClassName };
