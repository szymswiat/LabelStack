import React from 'react';
import { LabelMap, useAnnotationDataContext } from '../../../contexts/AnnotationDataContext';
import { useViewerSettingsContext } from '../../../contexts/ViewerSettingsContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { NoLabelMapsToShowAlert } from './Alerts';
import { LabelMapsObject } from '../../../contexts/AnnotationDataContext';
import LabelMapListRow from './LabelMapListRow';

interface LabelMapListProps {
  editable: boolean;
  labelMaps: LabelMapsObject;
  editedLabelMapId?: string;
  setEditedLabelMapId?: (id: string) => void;
  onLabelMapSaved?: () => void;
  onLabelMapRemoved?: (labelMap: LabelMap) => void;
  triggerAnnotationsUpload?: (callback: () => void) => void;
  disableTools?: boolean;
  canDropLabelMap?: (labelMap: LabelMap) => boolean;
}

export const LabelMapList: React.FC<LabelMapListProps> = ({
  editable,
  labelMaps,
  editedLabelMapId,
  setEditedLabelMapId,
  onLabelMapSaved,
  onLabelMapRemoved,
  disableTools = false,
  canDropLabelMap
}) => {
  const [, { updateLabelMap }] = useAnnotationDataContext();
  const [{ saveHotkeys }] = useViewerSettingsContext();

  const labelMapsToDisplay = Object.values(labelMaps).filter((labelMap) => labelMap.editable === editable);

  function activateLabelMap(labelMap: LabelMap): () => void {
    return () => {
      if (!labelMap.visibility) {
        reverseLabelMapVisibility(labelMap)();
      }
      if (editedLabelMapId === labelMap.id.uniqueId) {
        setEditedLabelMapId(null);
      } else {
        setEditedLabelMapId(labelMap.id.uniqueId);
      }
    };
  }

  function reverseLabelMapVisibility(labelMap: LabelMap): () => void {
    return () => {
      if (editedLabelMapId === labelMap.id.uniqueId) {
        return;
      }
      labelMap.visibility = !labelMap.visibility;
      updateLabelMap(labelMap);
    };
  }

  function onHotkeySave() {
    if (!editable) {
      return;
    }
    onLabelMapSaved();
  }

  useHotkeys(saveHotkeys.join(','), onHotkeySave, [onHotkeySave]);

  return (
    <>
      {labelMapsToDisplay.length === 0 && <NoLabelMapsToShowAlert />}
      <div className={'grid grid-cols-12 gap-y-2 gap-x-1 w-full'}>
        {labelMapsToDisplay.map((labelMap) => (
          <LabelMapListRow
            key={labelMap.id.uniqueId}
            activateLabelMap={activateLabelMap}
            disableTools={disableTools}
            editable={editable}
            editedLabelMapId={editedLabelMapId}
            labelMap={labelMap}
            reverseLabelMapVisibility={reverseLabelMapVisibility}
            onLabelMapRemoved={onLabelMapRemoved}
            canDropLabelMap={canDropLabelMap}
          />
        ))}
      </div>
    </>
  );
};

export default LabelMapList;
