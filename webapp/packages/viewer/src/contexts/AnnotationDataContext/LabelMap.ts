import { RGBColor } from '@kitware/vtk.js/types';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';

export class LabelMapId {
  annotationId: number;
  // id sequence is null it means that LabelMapId represents latest data from data list
  sequence?: number;

  private _uniqueId: string;

  private constructor(annotationId: number, sequence?: number) {
    this.annotationId = annotationId;
    this.sequence = sequence;
  }

  static create(annotationId: number, sequence?: number) {
    return new LabelMapId(annotationId, sequence);
  }

  get uniqueId(): string {
    if (this._uniqueId) {
      return this._uniqueId;
    }
    this._uniqueId = this.annotationId.toString(16).padStart(8, '0');
    if (this.sequence != null) {
      this._uniqueId += this.sequence.toString(16).padStart(4, '0');
    }
    return this._uniqueId;
  }

  static fromUniqueId(idStr: string): LabelMapId {
    const idInstance = new LabelMapId(Number(idStr.slice(0, 8)));
    if (idStr.length > 8) {
      idInstance.sequence = Number(idStr.slice(8));
    }
    return idInstance;
  }
}

export type LabelMapsObject = Record<string, LabelMap>;
export type ImageDataObject = Record<string, vtkImageData>;

export interface LabelMap {
  id: LabelMapId;
  name: string;
  data: vtkImageData;
  color: RGBColor;
  visibility: boolean;
  editable: boolean;
  isModified: boolean;
}
