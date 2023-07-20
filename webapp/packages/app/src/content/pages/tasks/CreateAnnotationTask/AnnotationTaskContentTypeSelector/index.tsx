import TopBarButton from '@labelstack/viewer/src/ui/components/TopBarButton';
import React from 'react';

export interface AnnotationTaskContentTypeSelectorProps {
  selectedContentType: AnnotationTaskContentType;
  setSelectedContentType: (v: AnnotationTaskContentType) => void;
}

export enum AnnotationTaskContentType {
  imageInstance = 'Image',
  labelAssignment = 'Label Assignment'
}

const AnnotationTaskContentTypeSelector: React.FC<AnnotationTaskContentTypeSelectorProps> = ({
  selectedContentType,
  setSelectedContentType
}) => {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-x-4 p-2 px-16">
      {Object.keys(AnnotationTaskContentType).map((contentTypeKey) => {
        const contentType = AnnotationTaskContentType[contentTypeKey];
        return (
          <TopBarButton
            containerClassName="h-8 w-full"
            isActive={selectedContentType == contentType}
            name={contentType}
            onClick={() => setSelectedContentType(contentType)}
          />
        );
      })}
    </div>
  );
};

export default AnnotationTaskContentTypeSelector;
