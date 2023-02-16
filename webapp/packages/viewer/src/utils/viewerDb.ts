import Dexie, { Table } from 'dexie';
import { Dicom, ImageInstance } from '@labelstack/api';
import { showDangerNotification } from '@labelstack/app/src/utils';

const IMAGE_STORE_SIZE_MAX_DEFAULT = 700;

interface DicomDb {
  id: number;
  imageInstanceId: number;
  data: ArrayBuffer;
}

interface ImageMetadataDb {
  id: number;
  dateCreated: number;
  // TODO define type
  dataset: any;
  cachedSize: number;
  fullyCached: boolean;
}

export class ViewerDb {
  imageData: Table<DicomDb>;
  imageMetadata: Table<ImageMetadataDb>;

  db: ViewerDb;

  constructor() {
    const db = new Dexie('ViewerCacheDb');

    db.version(1).stores({
      imageData: 'id, imageInstanceId',
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

  async createImageInstanceCacheEntry(imageInstance: ImageInstance) {
    await this.useRaw()
      .transaction('rw', this.db.imageMetadata, async () => {
        this.db.imageMetadata.add(
          {
            id: imageInstance.id,
            dataset: undefined,
            dateCreated: Date.now(),
            cachedSize: 0,
            fullyCached: false
          },
          imageInstance.id
        );
      })
      .catch(() => {
        showDangerNotification('ERROR', 'Cannot cache data.');
      });
  }

  async cacheDicom(imageInstance: ImageInstance, dicom: Dicom, imageData: ArrayBuffer) {
    if (!(await this.hasEntry(imageInstance))) {
      throw 'There is no image instance entry for dicom. Cannot cache.';
    }

    const totalImageSize = imageData.byteLength;

    await this.useRaw()
      .transaction('rw', this.db.imageData, this.db.imageMetadata, async () => {
        await this._dropImagesUntilEnoughSpace(totalImageSize);

        const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);
        this.db.imageData.add({ id: dicom.id, imageInstanceId: imageInstance.id, data: imageData }, imageInstance.id);
        this.db.imageMetadata.update(imageMetadata.id, { cachedSize: (imageMetadata.cachedSize += totalImageSize) });
      })
      .catch((e) => {
        showDangerNotification('ERROR', 'Cannot cache data.');
        console.log(e);
      });
  }

  async finishCaching(imageInstance: ImageInstance, dicoms: Dicom[], dataset: any) {
    const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);

    const cachedDicoms = dicoms.filter((dicom) => this.hasDicom(dicom));

    if (cachedDicoms.length === dicoms.length) {
      this.db.imageMetadata.update(imageMetadata.id, { fullyCached: true, dataset });
    }
  }

  async getImage(imageInstance: ImageInstance) {
    const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);

    if (imageMetadata.fullyCached) {
      const dicomDataList = (await this.db.imageData.where({ imageInstanceId: imageInstance.id }).toArray()).map(
        (dicomData) => dicomData.data
      );

      return { imageData: dicomDataList, dataset: imageMetadata?.dataset };
    }

    throw 'Image is not fully cached. Cannot retrieve.';
  }

  async getDicom(dicom: Dicom) {
    return await this.db.imageData.get(dicom.id);
  }

  async hasEntry(imageInstance: ImageInstance) {
    const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);

    return imageMetadata != null;
  }

  async hasCachedImage(imageInstance: ImageInstance) {
    const imageMetadata = await this.db.imageMetadata.get(imageInstance.id);

    return imageMetadata == undefined ? false : imageMetadata.fullyCached;
  }

  async hasDicom(dicom: Dicom) {
    const imageData = await this.db.imageData.get(dicom.id);

    return imageData != null;
  }

  async _dropImagesUntilEnoughSpace(newDataSize: number) {
    const storedMetaAll = await this.db.imageMetadata.orderBy('dateCreated').reverse().toArray();
    const cacheSize = Number(localStorage.getItem('imageCacheSizeMb')) * 1024 * 1024;

    let totalSize = storedMetaAll.reduce((prev, curr) => prev + curr.cachedSize, 0);

    const metaToDrop: ImageMetadataDb[] = [];
    while (totalSize + newDataSize > cacheSize) {
      const toDrop = storedMetaAll.pop();
      totalSize -= toDrop.cachedSize;
      metaToDrop.push(toDrop);
    }

    await this.useRaw().transaction('rw', this.db.imageData, this.db.imageMetadata, async () => {
      metaToDrop.forEach(async (meta) => {
        this.db.imageMetadata.delete(meta.id);

        this.db.imageData.where({ imageInstanceId: meta.id }).delete();
      });
    });
  }
}

const db = new ViewerDb();

export { db };
