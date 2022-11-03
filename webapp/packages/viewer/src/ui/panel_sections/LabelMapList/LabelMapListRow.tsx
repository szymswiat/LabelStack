import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { BsBrush, BsBrushFill, BsEye, BsEyeFill } from 'react-icons/bs';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';
import { LabelMap, useAnnotationDataContext } from '../../../contexts/AnnotationDataContext';
import FloatingWindow from '../../components/FloatingWindow';
import ColorPicker from '../../components/ColorPicker';
import { floatRGB2HexCode } from '@kitware/vtk.js/Common/Core/Math';
import { capitalize } from '../../../utils';
import ContentChangedIndicator from '../../components/ContentChangedIndicator';
import { ColorResult } from 'react-color';

export interface LabelMapListRowProps {
  labelMap: LabelMap;
  editable: boolean;
  editedLabelMapId: string;
  disableTools: boolean;
  activateLabelMap: (labelMap: LabelMap) => () => void;
  reverseLabelMapVisibility: (labelMap: LabelMap) => () => void;
}

const LabelMapListRow: React.FC<LabelMapListRowProps> = ({
  labelMap,
  editable,
  editedLabelMapId,
  disableTools,
  activateLabelMap,
  reverseLabelMapVisibility
}) => {
  const [, { updateLabelMap }] = useAnnotationDataContext();
  const [, { showFloatingWindow, hideFloatingWindow }] = useViewerLayoutContext();
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);

  function renderVisibilityEye(labelMap: LabelMap) {
    const EyeComponent = labelMap.visibility ? BsEyeFill : BsEye;
    return (
      <div className={classNames({ 'opacity-40 cursor-default': editedLabelMapId === labelMap.id.uniqueId })}>
        <EyeComponent size={20} onClick={reverseLabelMapVisibility(labelMap)} />
      </div>
    );
  }

  function renderPaintToolsBrush(labelMap: LabelMap) {
    const BrushComponent = editedLabelMapId === labelMap.id.uniqueId ? BsBrushFill : BsBrush;
    return (
      <BrushComponent
        className={classNames({ 'opacity-40': disableTools })}
        size={20}
        onClick={disableTools ? undefined : activateLabelMap(labelMap)}
      />
    );
  }

  useEffect(() => {
    if (!colorPickerVisible) {
      return;
    }

    function handleColorChange(color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) {
      const {
        rgb: { r, g, b }
      } = color;
      updateLabelMap({ ...labelMap, color: [r / 255, g / 255, b / 255] });
    }

    function onColorPickerClose() {
      setColorPickerVisible(false);
    }

    showFloatingWindow(
      'colorPicker',
      <FloatingWindow name={'Pick color'} windowKey={'colorPicker'} onClose={onColorPickerClose}>
        <ColorPicker description={`Pick color for: ${labelMap.name}`} handleColorChange={handleColorChange} />
      </FloatingWindow>
    );
  }, [labelMap, colorPickerVisible]);

  return (
    <>
      <div className={'col-start-1 col-span-1 place-self-center cursor-pointer'}>{renderVisibilityEye(labelMap)}</div>
      {editable && (
        <div className={'col-start-2 col-span-1 place-self-center cursor-pointer'}>
          {renderPaintToolsBrush(labelMap)}
        </div>
      )}
      <div
        style={{ backgroundColor: floatRGB2HexCode(labelMap.color) }}
        className={`col-start-3 col-span-1 w-4 h-4 place-self-center opacity-70 cursor-pointer`}
        onClick={() => setColorPickerVisible(true)}
      />
      <div className={'col-start-4 col-span-6'}>{capitalize(labelMap.name)}</div>
      {editable && labelMap.modificationTime > 0 &&
        <ContentChangedIndicator className={'col-start-12 col-span-1 p-[0.1rem] w-5 h-5'} />
      }
    </>
  );
};

export default LabelMapListRow;
