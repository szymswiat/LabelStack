import React from 'react';
import { LabelAssignment } from '@labelstack/api';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';

interface LabelAssignmentListProps {
  labelAssignments: LabelAssignment[];
}

const LabelAssignmentList: React.FC<LabelAssignmentListProps> = ({ labelAssignments }) => {
  const [{ allLabels }] = useAnnotatorDataContext();

  if (!allLabels) {
    return;
  }

  return (
    <div className={'flex flex-col gap-y-2'}>
      {labelAssignments.map((labelAssignment) => (
        <div key={labelAssignment.id} className={'h-5 text-dark-text'}>
          {allLabels[labelAssignment.label_id].name}
        </div>
      ))}
    </div>
  );
};

export { LabelAssignmentList };
