import { LabelAssignment } from './labelAssignment';
import { Annotation } from './annotation';
import { DicomTagValue } from './tag';

export interface Dicom {
  id: number;
  patient_id: string;
  study_id: string;
  series_id: string;
  description: string;
  instance_id: string;
  visited: boolean;
  label_assignments: LabelAssignment[];
  annotations: Annotation[];

  tags: DicomTagValue[];
}
