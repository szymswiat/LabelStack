import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import Select from 'react-dropdown-select';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { Label, api } from '@labelstack/api';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { capitalize } from '@labelstack/viewer/src/utils';

export interface CreateLabelAssignmentBarProps {}

const CreateLabelAssignmentBar: React.FC<CreateLabelAssignmentBarProps> = () => {
  const [{ allLabels, task }, { refreshTaskObjects }] = useAnnotatorDataContext();
  const [{ imageInstance }] = useImageDataContext();
  const [{ token }] = useUserDataContext();

  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  const imageInstanceLabelIds = imageInstance.label_assignments.map((labelAssignment) => labelAssignment.label_id);

  const selectOptions = Object.entries(allLabels)
    .filter(([_, label]) => !imageInstanceLabelIds.includes(label.id))
    .map(([_, label]) => label);

  useEffect(() => {
    (async () => {
      if (selectedLabels.length == 0) {
        return;
      }
      await api.createAnnotationWithLabel(token, task, imageInstance, selectedLabels[0]);
      refreshTaskObjects();
      setSelectedLabels([]);
    })();
  });

  return (
    <div className={classNames('grid grid-cols-12 gap-y-2 gap-x-1 w-full place-items-center')}>
      <div className={classNames('w-4 h-4 col-span-2')} />
      <div className={classNames('col-span-10 w-full')}>
        <Select
          name=""
          labelField="name"
          valueField="id"
          options={selectOptions}
          onChange={(values) => setSelectedLabels(values)}
          values={selectedLabels}
          className="bg-primary-dark"
          itemRenderer={({ item, methods }) => (
            <div className="bg-primary-dark pl-2 py-1" onClick={() => methods.addItem(item)}>
              {capitalize(item.name)}
            </div>
          )}
          clearOnSelect={true}
          placeholder="Select label to add"
        />
      </div>
    </div>
  );
};

export default CreateLabelAssignmentBar;
