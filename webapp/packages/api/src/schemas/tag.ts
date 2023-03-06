export interface Tag {
  id: number;
  tag_group: number;
  tag_element: number;
  name: string;
  keyword: string;
}

export interface DicomTagValue {
  dicom_id: number;
  tag_id: number;
  value: string;

  tag: Tag;
}

export interface ImageInstanceTagValue {
  image_instance_id: number;
  tag_id: number;
  value: string;

  tag: Tag;
}
