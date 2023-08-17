import { LabelAssignment } from './labelAssignment';
import { ImageInstanceTagValue } from './tag';

export interface ImageInstance {
  id: number;
  id_ref: string;
  label_assignments: LabelAssignment[];
  tags: ImageInstanceTagValue[];
}

export function getTagValue(imageInstance: ImageInstance, tagKey: string): string {
  return imageInstance.tags.find((tag) => tag.tag.keyword == tagKey).value;
}

export type ImageInstancesObject = Record<number, ImageInstance>;
