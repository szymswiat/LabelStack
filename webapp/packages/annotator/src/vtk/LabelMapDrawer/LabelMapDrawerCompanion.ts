import { LabelMapDrawerProps } from './index';
import vtkPaintFilter from '@kitware/vtk.js/Filters/General/PaintFilter';
import { ImageData } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import LabelMapSliceRepresentationCompanion from '@labelstack/viewer/src/vtk/LabelMapSliceRepresentation/LabelMapSliceRepresentationCompanion';
import { DrawerMode, DrawMode } from '../../contexts/AnnotatorToolsContext';
import HookCompanion from '@labelstack/viewer/src/utils/HookCompanion';

export interface LabelMapDrawerCompanionProps extends LabelMapDrawerProps {
  drawerMode: DrawerMode;
}

class LabelMapDrawerCompanion extends HookCompanion<LabelMapDrawerCompanionProps> {
  props: LabelMapDrawerCompanionProps;

  paintFilter: vtkPaintFilter;
  backgroundImage: ImageData;
  attachedLabelMapCompanion: LabelMapSliceRepresentationCompanion;
  slicingMode: SlicingMode;

  constructor(props: LabelMapDrawerCompanionProps) {
    super(props);

    this.paintFilter = vtkPaintFilter.newInstance();
  }

  unmount() {
    super.unmount();

    this.paintFilter.delete();
  }

  attachLabelMap(labelMapCompanion: LabelMapSliceRepresentationCompanion) {
    this.paintFilter.setLabelMap(labelMapCompanion.mapper.getInputData());
    labelMapCompanion.mapper.setInputConnection(this.paintFilter.getOutputPort());
    this.attachedLabelMapCompanion = labelMapCompanion;
  }

  detachLabelMap() {
    if (this.attachedLabelMapCompanion && !this.attachedLabelMapCompanion?.mapper?.isDeleted()) {
      this.attachedLabelMapCompanion.mapper.setInputData(this.paintFilter.getOutputData());
    }
  }

  setDrawMode(mode: DrawMode) {
    this.paintFilter.setLabel(mode);
  }

  setBackgroundImage(imageData: ImageData) {
    this.backgroundImage = imageData;
    this.paintFilter.setBackgroundImage(imageData.vtkImage);
  }

  undo() {
    this.paintFilter.undo();
  }

  redo() {
    this.paintFilter.redo();
  }

  canUndo(): boolean {
    return this.paintFilter.canUndo();
  }

  canRedo(): boolean {
    return this.paintFilter.canRedo();
  }

  setPaintFilterRadius(radius: number) {
    this.paintFilter.setRadius(radius);
  }

  updateWidgetOrigin(widget: any, sliceIndex: number, slicingMode: SlicingMode) {
    const { vtkImage } = this.backgroundImage;

    const manipulatorOrigin = [...vtkImage.getOrigin()];
    const spacing = [...vtkImage.getSpacing()];

    manipulatorOrigin[slicingMode] += sliceIndex * spacing[slicingMode];

    widget.getManipulator().setWidgetOrigin(manipulatorOrigin);
  }

  setSlicingMode(slicingMode: SlicingMode | null) {
    const { drawerMode } = this.props;
    this.slicingMode = slicingMode;
    if (drawerMode === DrawerMode.SLICE) {
      this.paintFilter.setSlicingMode(slicingMode);
    }
  }

  setDrawerMode(drawerMode: DrawerMode) {
    if (drawerMode === DrawerMode.SLICE) {
      this.paintFilter.setSlicingMode(this.slicingMode);
    } else {
      this.paintFilter.setSlicingMode(null);
    }
  }
}

export default LabelMapDrawerCompanion;
