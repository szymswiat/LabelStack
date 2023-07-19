import { TaskType, taskTypeRepresentation, taskTypeShortMap } from '@labelstack/api';
import PanelButton from '@labelstack/viewer/src/ui/components/PanelButton';
import TopBarButton from '@labelstack/viewer/src/ui/components/TopBarButton';
import React from 'react';
import { useNavigate } from 'react-router';

export interface SelectCreateTaskTypeBarProps {
  taskType: TaskType;
}

const SelectCreateTaskTypeBar: React.FC<SelectCreateTaskTypeBarProps> = ({ taskType }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full grid grid-cols-3 gap-x-4 p-2">
      {Object.values(taskTypeShortMap).map((type) => (
        <TopBarButton
          containerClassName="h-12 w-full"
          isActive={type == taskType}
          name={taskTypeRepresentation[type]}
          onClick={() => navigate(`/tasks/create/${taskTypeRepresentation[type].split(' ')[0].toLowerCase()}`)}
        />
      ))}
    </div>
  );
};

export default SelectCreateTaskTypeBar;
