import { LabelAssignment } from './labelAssignment';
import { ImageInstanceTagValue } from './tag';

export interface ImageInstance {
  id: number;
  id_ref: string;
  visited: boolean;
  label_assignments: LabelAssignment[];
  tags: ImageInstanceTagValue[];
}

export type ImageInstancesObject = Record<number, ImageInstance>;
