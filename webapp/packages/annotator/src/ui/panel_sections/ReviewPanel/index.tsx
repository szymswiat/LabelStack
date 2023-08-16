import React from 'react';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import { BsBrush, BsCheckLg, BsXLg } from 'react-icons/bs';
import { IconType } from 'react-icons';
import PanelButton from '@labelstack/viewer/src/ui/components/PanelButton';
import { AnnotationReview, AnnotationReviewResult, api } from '@labelstack/api';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { showWarningNotification } from '@labelstack/app/src/utils';
import {
  shouldShowTaskInProgressAlert,
  TaskInProgressAlert
} from '@labelstack/viewer/src/ui/panel_sections/LabelMapList/Alerts';
import { capitalize } from '@labelstack/viewer/src/utils';
import { useEditedAnnotationDataContext } from '../../../contexts/EditedAnnotationDataContext';
import { useAnnotatorLayoutContext } from '../../../contexts/AnnotatorLayoutContext';

interface ReviewPanelProps {}

const ReviewPanel: React.FC<ReviewPanelProps> = () => {
  const [{ token }] = useUserDataContext();
  const [
    {
      task,
      taskObjects: { taskReviews },
      allLabels
    },
    { refreshTaskObjects }
  ] = useAnnotatorDataContext();

  const [, { setEditedLabelMapId }] = useEditedAnnotationDataContext();
  const [{ editModeLocked }] = useAnnotatorLayoutContext();

  if (!taskReviews || !allLabels) {
    return <></>;
  }

  function renderReviewActionButton(
    name: string,
    icon: IconType,
    review: AnnotationReview,
    boundResult: AnnotationReviewResult
  ) {
    async function updateReviewResult() {
      try {
        await api.updateAnnotationReview(token, review, boundResult, '');
        refreshTaskObjects();
        setEditedLabelMapId(null);
      } catch (reason) {
        showWarningNotification('Warning', reason.response.data.detail);
      }
    }

    return (
      <PanelButton
        name={name}
        isActive={review.result === boundResult}
        border={false}
        icon={icon}
        containerClassName={'w-5 h-5'}
        iconClassName={'w-[0.9rem] h-[0.9rem]'}
        activeClassName={`text-dark-text bg-green-700`}
        inactiveClassName={`opacity-70`}
        onClick={updateReviewResult}
        disabled={editModeLocked}
      />
    );
  }

  if (shouldShowTaskInProgressAlert(task)) {
    return <TaskInProgressAlert />;
  }

  return (
    <div className={'flex flex-col'}>
      <div className={'grid grid-cols-12 gap-y-2 gap-x-1'}>
        {Object.values(taskReviews).map((review) => {
          const labelId = review.annotation.labelAssignment.label_id;
          const label = allLabels[labelId];

          return (
            <React.Fragment key={review.id}>
              <div className={'col-start-1 place-self-center'}>
                {renderReviewActionButton('Accept', BsCheckLg, review, AnnotationReviewResult.accepted)}
              </div>
              <div className={'col-start-2 place-self-center'}>
                {renderReviewActionButton('Deny', BsXLg, review, AnnotationReviewResult.denied)}
              </div>
              <div className={'col-start-3 place-self-center'}>
                {renderReviewActionButton('Deny and correct', BsBrush, review, AnnotationReviewResult.deniedCorrected)}
              </div>
              <div className={'col-start-4 col-span-7'}>{capitalize(label.name)}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewPanel;
