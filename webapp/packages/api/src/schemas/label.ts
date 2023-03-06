import { AnnotationType } from './annotation';

export interface LabelType {
  id: number;
  name?: string;
}

export interface Label {
  id?: number;
  name: string;
  allowed_annotation_type: AnnotationType;
  types: LabelType[];
}

export interface LabelCreateApiIn {
  name: string;
  allowed_annotation_type_id: number;
  type_ids: number[];
}

export type LabelsObject = Record<number, Label>;
