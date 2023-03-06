import Dexie, { Table } from 'dexie';
import { ImageInstance } from '@labelstack/api';
import { showDangerNotification } from '@labelstack/app/src/utils';

const IMAGE_STORE_SIZE_MAX_DEFAULT = 5 * 1024;

interface ImageData {
  id: number;
  data: ArrayBuffer[];
}

interface ImageMetadata {
  id: number;
  dateCreated: number;
  // TODO define type
  dataset: any;
  size: number;
}

export class ViewerDb {
  imageData: Table<ImageData>;
  imageMetadata: Table<ImageMetadata>;

  db: ViewerDb;

  constructor() {
    const db = new Dexie('ViewerCacheDb');

    db.version(1).stores({
      imageData: 'id',
      imageMetadata: 'id, dateCreated'
    });

    // @ts-ignore
    this.db = db;

    if (!localStorage.getItem('imageCacheSizeMb')) {
      localStorage.setItem('imageCacheSizeMb', String(IMAGE_STORE_SIZE_MAX_DEFAULT));
    }
  }

  use(): ViewerDb {
    return this.db;
  }

  useRaw(): Dexie {
    // @ts-ignore
    return this.db;
  }

  async cacheImage(imageInstance: ImageInstance, imageDataList: ArrayBuffer[], dataset: any) {
    const totalImageSize = imageDataList.reduce((prev, curr) => prev + curr.byteLength, 0);

    await this.useRaw()
      .transaction('rw', this.db.imageMetadata, this.db.imageData, async () => {
        await this._dropImagesUntilEnoughSpace(totalImageSize);

        this.db.imageMetadata.add(
          {
            id: imageInstance.id,
            dataset,
            dateCreated: Date.now(),
            size: totalImageSize
          },
          imageInstance.id
        );
        this.db.imageData.add({ id: imageInstance.id, data: imageDataList }, imageInstance.id);
      })
      .catch(() => {
        showDangerNotification('ERROR', 'Cannot cache data.');
      });
  }

  async getImage(imageInstance: ImageInstance) {
    const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);
    const imageData = await this.db.imageData.get(imageInstance.id);

    return { imageData: imageData?.data, dataset: imageMetadata?.dataset };
  }

  async hasImage(imageInstance: ImageInstance) {
    const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);

    return imageMetadata != null;
  }

  async _dropImagesUntilEnoughSpace(newDataSize: number) {
    const storedMetaAll = await this.db.imageMetadata.orderBy('dateCreated').reverse().toArray();
    const cacheSize = Number(localStorage.getItem('imageCacheSizeMb')) * 1024 * 1024;

    let totalSize = storedMetaAll.reduce((prev, curr) => prev + curr.size, 0);

    const metaToDrop: ImageMetadata[] = [];
    while (totalSize + newDataSize > cacheSize) {
      const toDrop = storedMetaAll.pop();
      totalSize -= toDrop.size;
      metaToDrop.push(toDrop);
    }

    metaToDrop.forEach((meta) => {
      this.db.imageMetadata.delete(meta.id);
      this.db.imageData.delete(meta.id);
    });
  }
}

const db = new ViewerDb();

export { db };
