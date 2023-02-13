import HookCompanion from '../../utils/HookCompanion';
import { SliceManipulatorProps } from './index';
import { View } from 'react-vtk-js';
import vtkMouseRangeManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseRangeManipulator';
import { delay } from '../../utils';
import { ImageData } from '../../contexts/ImageDataContext';
import { ImagePropertiesApi, ImagePropertiesState } from '../../contexts/ImagePropertiesContext';

export interface SliceManipulatorCompanionProps extends SliceManipulatorProps {
  view: View;
  imageData: ImageData;
}

class SliceManipulatorCompanion extends HookCompanion<SliceManipulatorCompanionProps> {
  rangeManipulator: vtkMouseRangeManipulator;
  rangeManipulatorSecond?: vtkMouseRangeManipulator;

  imagePropertiesState: ImagePropertiesState;
  imagePropertiesApi: ImagePropertiesApi;

  constructor(props: SliceManipulatorCompanionProps) {
    super(props);
    const { manipulatorOptions, manipulatorOptionsSecond } = props;

    this.rangeManipulator = vtkMouseRangeManipulator.newInstance(manipulatorOptions);
    if (manipulatorOptionsSecond) {
      this.rangeManipulatorSecond = vtkMouseRangeManipulator.newInstance(manipulatorOptionsSecond);
    }
  }

  async mount() {
    await delay(200);

    const {
      manipulatorOptions,
      manipulatorOptionsSecond,
      view,
      imageData: { vtkImage }
    } = this.props;

    view.style.addMouseManipulator(this.rangeManipulator);
    view.style.addMouseManipulator(this.rangeManipulatorSecond);

    const dims = vtkImage.getDimensions();

    const maxValue = dims[Number(this.props.slicingMode)] - 1;
    this.rangeManipulator.setScrollListener(
      0,
      maxValue,
      1,
      () => maxValue - this.getCurrentSliceIndex(),
      (value) => this.updateVisibleSlices(maxValue - value),
      manipulatorOptions.scale != null ? manipulatorOptions.scale : 1
    );
    if (this.rangeManipulatorSecond) {
      this.rangeManipulatorSecond.setScrollListener(
        0,
        maxValue,
        1,
        () => maxValue - this.getCurrentSliceIndex(),
        (value) => this.updateVisibleSlices(maxValue - value),
        manipulatorOptionsSecond.scale != null ? manipulatorOptionsSecond.scale : 1
      );
    }
  }

  unmount() {
    //TODO: unmount manipulators
  }

  setImagePropertiesContext(state: ImagePropertiesState, api: ImagePropertiesApi) {
    this.imagePropertiesState = state;
    this.imagePropertiesApi = api;
  }

  updateVisibleSlices(sliceIndex: number) {
    const { slicingMode } = this.props;
    let { visibleSlices } = this.imagePropertiesState;
    visibleSlices = [...visibleSlices];
    visibleSlices[slicingMode] = sliceIndex;

    this.imagePropertiesApi.setVisibleSlices(visibleSlices);
  }

  getCurrentSliceIndex(): number {
    const { visibleSlices } = this.imagePropertiesState;

    return visibleSlices[this.props.slicingMode];
  }
}

export default SliceManipulatorCompanion;
