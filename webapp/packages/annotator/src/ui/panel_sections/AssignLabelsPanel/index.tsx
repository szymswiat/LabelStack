import React, { useEffect, useState } from 'react';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import { BsCheck, BsCircle, BsSdCardFill, BsSearch } from 'react-icons/bs';
import { api, Label } from '@labelstack/api';
import classNames from 'classnames';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { normalizeStr, showDangerNotification } from '@labelstack/app/src/utils';
import ContentChangedIndicator from '@labelstack/viewer/src/ui/components/ContentChangedIndicator';
import { useAnnotatorLayoutContext } from '../../../contexts/AnnotatorLayoutContext';
import { useViewerSettingsContext } from '@labelstack/viewer/src/contexts/ViewerSettingsContext';
import { useHotkeys } from 'react-hotkeys-hook';

interface AssignLabelsPanelProps {}

const AssignLabelsPanel: React.FC<AssignLabelsPanelProps> = () => {
  const [{ allLabels, task }, { refreshTaskObjects }] = useAnnotatorDataContext();
  const [{ imageInstance }] = useImageDataContext();
  const [{ token }] = useUserDataContext();
  const [{ editModeLocked }] = useAnnotatorLayoutContext();
  const [{ saveHotkeys }] = useViewerSettingsContext();

  const [contentModified, setContentModified] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [checkboxesState, setCheckboxesState] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (allLabels) {
      setCheckboxesState(Object.fromEntries(Object.values(allLabels).map((label) => [label.id, false])));
    }
  }, [allLabels]);

  useEffect(() => {
    if (!imageInstance?.label_assignments) {
      return;
    }
    const imageInstanceLabelIds = imageInstance.label_assignments.map((labelAssignment) => labelAssignment.label_id);
    Object.keys(checkboxesState).forEach((labelId) => {
      checkboxesState[Number(labelId)] = imageInstanceLabelIds.includes(Number(labelId));
    });
    setCheckboxesState({ ...checkboxesState });
    setContentModified(false);
  }, [imageInstance?.id]);

  useHotkeys(saveHotkeys.join(','), uploadCheckedAssignments, [uploadCheckedAssignments]);

  function uploadCheckedAssignments() {
    const labelIdsToCreate = Object.entries(checkboxesState)
      .filter(([, isChecked]) => isChecked)
      .map(([labelId]) => Number(labelId));
    const labelIdsToRemove = Object.entries(checkboxesState)
      .filter(([, isChecked]) => !isChecked)
      .map(([labelId]) => Number(labelId));
    api
      .modifyLabelAssignments(token, labelIdsToCreate, labelIdsToRemove, imageInstance, task)
      .then(() => {
        setContentModified(false);
        refreshTaskObjects();
      })
      .catch((reason) => {
        const message = reason.response.data.detail;
        showDangerNotification('Error', message);
      });
  }

  function renderCheckboxCircle(label: Label) {
    const active = checkboxesState[label.id];
    const CircleComponent = active ? BsCheck : BsCircle;
    return (
      <CircleComponent
        className={classNames('rounded-full w-[1rem] h-[1rem]', {
          'bg-dark-text text-dark-card-bg': active,
          'opacity-40': editModeLocked,
          'cursor-pointer': !editModeLocked
        })}
        onClick={() => {
          if (editModeLocked) {
            return;
          }
          checkboxesState[label.id] = !checkboxesState[label.id];
          setContentModified(true);
          setCheckboxesState({ ...checkboxesState });
        }}
      />
    );
  }

  if (allLabels == null) {
    return <></>;
  }

  const labelsToDisplay = Object.values(allLabels).filter((label) => {
    if (searchText === '') {
      return true;
    }
    const normalized = normalizeStr(label.name);
    if (searchText.length <= 2) {
      return normalized.toLowerCase().startsWith(searchText) || normalized.startsWith(searchText);
    }
    return normalized.toLowerCase().includes(searchText) || normalized.includes(searchText);
  });

  return (
    <div className={'flex flex-col gap-y-6'}>
      <div className={'flex flex-row h-12 gap-x-4'}>
        <div className={'w-1/12 h-10 place-self-center grid'}>
          <div className={'place-self-center'}>
            <BsSearch className='w-7 h-7' />
          </div>
        </div>
        <div
          className={
            'flex-grow h-10 p-1 pl-3 pr-3 place-self-center rounded-lg text-dark-text border-dark-text border-2'
          }
        >
          <input
            type={'text'}
            className={'bg-dark-card-bg h-full w-full border-none outline-none place-self-center'}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        {contentModified && <ContentChangedIndicator className={'w-6 h-10 py-2'} />}
      </div>
      <div className={'flex-grow h-100 overflow-auto no-scrollbar'}>
        <div className={'grid grid-cols-12 gap-y-2'}>
          {labelsToDisplay.map((label) => (
            <React.Fragment key={label.id}>
              <div className={'col-start-1 place-self-center'}>{renderCheckboxCircle(label)}</div>
              <div className={'col-start-3 col-span-8 text-sm'}>{label.name}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignLabelsPanel;
