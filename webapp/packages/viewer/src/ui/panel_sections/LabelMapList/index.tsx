import React, { useRef } from 'react';
import { capitalize } from '../../../utils';
import { BsBrush, BsBrushFill, BsEye, BsEyeFill } from 'react-icons/bs';
import { floatRGB2HexCode } from '@kitware/vtk.js/Common/Core/Math';
import { LabelMap, LabelMapId, useAnnotationDataContext } from '../../../contexts/AnnotationDataContext';
import classNames from 'classnames';
import { useHotkeysControllerContext } from '../../../contexts/HotkeysControllerContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { NoLabelMapsToShowAlert } from './Alerts';
import { LabelMapsObject } from '../../../contexts/AnnotationDataContext';
import { CirclePicker, ColorResult } from 'react-color';
import ContentChangedIndicator from '@labelstack/viewer/src/ui/components/ContentChangedIndicator';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';
import FloatingWindow from '../../components/FloatingWindow';

interface LabelMapListProps {
  editable: boolean;
  labelMaps: LabelMapsObject;
  editedLabelMapId?: string;
  setEditedLabelMapId?: (id: string) => void;
  onLabelMapSaved?: () => void;
  triggerAnnotationsUpload?: (callback: () => void) => void;
  disableTools?: boolean;
}

export const LabelMapList: React.FC<LabelMapListProps> = ({
  editable,
  labelMaps,
  editedLabelMapId,
  setEditedLabelMapId,
  triggerAnnotationsUpload,
  onLabelMapSaved,
  disableTools = false
}) => {
  const [, { updateLabelMap }] = useAnnotationDataContext();
  const [, { showFloatingWindow, hideFloatingWindow }] = useViewerLayoutContext();
  const [{ saveHotkeys }] = useHotkeysControllerContext();
  const labelMapsRef = useRef<LabelMapsObject>(labelMaps);
  labelMapsRef.current = labelMaps;

  const labelMapsToDisplay = Object.values(labelMaps).filter((labelMap) => labelMap.editable === editable);

  function changeActiveLabelMap(labelMap: LabelMap): () => void {
    return () => {
      if (!labelMap.visibility) {
        changeLabelMapVisibility(labelMap)();
      }
      if (editedLabelMapId === labelMap.id.uniqueId) {
        setEditedLabelMapId(null);
      } else {
        setEditedLabelMapId(labelMap.id.uniqueId);
      }
    };
  }

  function changeLabelMapVisibility(labelMap: LabelMap): () => void {
    return () => {
      if (editedLabelMapId === labelMap.id.uniqueId) {
        return;
      }
      labelMap.visibility = !labelMap.visibility;
      updateLabelMap(labelMap);
    };
  }

  function renderVisibilityEye(labelMap: LabelMap) {
    const EyeComponent = labelMap.visibility ? BsEyeFill : BsEye;
    return (
      <div className={classNames({ 'opacity-40 cursor-default': editedLabelMapId === labelMap.id.uniqueId })}>
        <EyeComponent size={20} onClick={changeLabelMapVisibility(labelMap)} />
      </div>
    );
  }

  function renderPaintToolsBrush(labelMap: LabelMap) {
    const BrushComponent = editedLabelMapId === labelMap.id.uniqueId ? BsBrushFill : BsBrush;
    return (
      <BrushComponent
        className={classNames({ 'opacity-40': disableTools })}
        size={20}
        onClick={disableTools ? undefined : changeActiveLabelMap(labelMap)}
      />
    );
  }

  function onHotkeySave() {
    if (!editable) {
      return;
    }
    triggerAnnotationsUpload(onLabelMapSaved);
  }

  useHotkeys(saveHotkeys.join(','), onHotkeySave, [onHotkeySave]);

  function showColorPicker(labelMapId: LabelMapId) {
    return () => {
      const labelMap = labelMapsRef.current[labelMapId.uniqueId];

      function handleColorChange(color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) {
        const labelMap = labelMapsRef.current[labelMapId.uniqueId];
        const {
          rgb: { r, g, b }
        } = color;
        updateLabelMap({ ...labelMap, color: [r / 255, g / 255, b / 255] });
      }

      showFloatingWindow(
        'colorPicker',
        <FloatingWindow name={'Pick color'} key={'colorPicker'} onClose={() => hideFloatingWindow('colorPicker')}>
          <div className={'w-full h-full flex flex-col gap-y-4'}>
            <div className={'h-6 pl-2'}>Pick color for: {labelMap.name}</div>
            <div className={'grid place-items-center'}>
              {/*@ts-ignore*/}
              <CirclePicker onChange={handleColorChange} />
            </div>
          </div>
        </FloatingWindow>
      );
    };
  }

  return (
    <>
      {labelMapsToDisplay.length === 0 && <NoLabelMapsToShowAlert />}
      <div className={'grid grid-cols-12 gap-y-2 w-full'}>
        {labelMapsToDisplay.map((labelMap) => (
          <React.Fragment key={labelMap.id.uniqueId}>
            <div className={'col-start-1 col-span-1 place-self-center cursor-pointer'}>
              {renderVisibilityEye(labelMap)}
            </div>
            {editable && (
              <div className={'col-start-2 col-span-1 place-self-center cursor-pointer'}>
                {renderPaintToolsBrush(labelMap)}
              </div>
            )}
            <div
              style={{ backgroundColor: floatRGB2HexCode(labelMap.color) }}
              className={`col-start-3 col-span-1 w-4 h-4 place-self-center opacity-70 cursor-pointer`}
              onClick={showColorPicker(labelMap.id)}
            />
            <div className={'col-start-4 col-span-6'}>{capitalize(labelMap.name)}</div>
            {editable && (
              <ContentChangedIndicator className={'col-start-12 col-span-1 w-5 h-5'} modified={labelMap.isModified} />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default LabelMapList;
