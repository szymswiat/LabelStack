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

  if (!taskReviews || !allLabels) {
    return <></>;
  }

  function renderReviewActionButton(
    name: string,
    icon: IconType,
    review: AnnotationReview,
    boundResult: AnnotationReviewResult
  ) {
    function updateReviewResult() {
      api
        .updateAnnotationReview(token, review, boundResult, '')
        .then(() => {
          refreshTaskObjects();
        })
        .catch((reason) => {
          showWarningNotification('Warning', reason.response.data.detail);
        });
    }

    return (
      <PanelButton
        name={name}
        isActive={review.result === boundResult}
        border={false}
        icon={icon}
        iconProps={{ size: 17 }}
        onClick={updateReviewResult}
      />
    );
  }

  if (shouldShowTaskInProgressAlert(task)) {
    return <TaskInProgressAlert />;
  }

  return (
    <div className={'flex flex-col'}>
      <div className={'grid grid-cols-12 gap-y-2'}>
        {Object.values(taskReviews).map((review) => {
          const labelId = review.annotation.labelAssignment.label_id;
          const label = allLabels[labelId];

          return (
            <React.Fragment key={review.id}>
              <div className={'col-start-1 w-6 h-6 place-self-center'}>
                {renderReviewActionButton('Accept', BsCheckLg, review, AnnotationReviewResult.accepted)}
              </div>
              <div className={'col-start-2 w-6 h-6 place-self-center'}>
                {renderReviewActionButton('Deny', BsXLg, review, AnnotationReviewResult.denied)}
              </div>
              <div className={'col-start-3 w-6 h-6 place-self-center'}>
                {renderReviewActionButton('Deny and correct', BsBrush, review, AnnotationReviewResult.deniedCorrected)}
              </div>
              <div className={'col-start-4 col-span-7'}>{label.name}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewPanel;
