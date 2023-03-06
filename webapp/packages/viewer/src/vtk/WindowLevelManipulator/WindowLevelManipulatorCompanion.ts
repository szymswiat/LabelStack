import HookCompanion from '../../utils/HookCompanion';
import { WindowLevelManipulatorProps } from './index';
import { View } from 'react-vtk-js';
import vtkMouseRangeManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseRangeManipulator';
import { delay } from '../../utils';
import { ImageData } from '../../contexts/ImageDataContext';
import { ImagePropertiesApi, ImagePropertiesState } from '../../contexts/ImagePropertiesContext';

export interface WindowLevelManipulatorCompanionProps extends WindowLevelManipulatorProps {
  view: View;
  imageData: ImageData;
}

class WindowLevelManipulatorCompanion extends HookCompanion<WindowLevelManipulatorCompanionProps> {
  rangeManipulator: vtkMouseRangeManipulator;

  imagePropertiesState: ImagePropertiesState;
  imagePropertiesApi: ImagePropertiesApi;

  minImageValue: number;
  maxImageValue: number;

  constructor(props: WindowLevelManipulatorCompanionProps) {
    super(props);
    const { manipulatorOptions } = props;

    this.rangeManipulator = vtkMouseRangeManipulator.newInstance(manipulatorOptions);
  }

  async mount() {
    const { view, imageData } = this.props;
    await delay(200);

    view.style.addMouseManipulator(this.rangeManipulator);

    const { dataset } = imageData;

    this.minImageValue = dataset.WindowCenter - dataset.WindowWidth / 2;
    this.maxImageValue = dataset.WindowCenter + dataset.WindowWidth / 2;

    this.rangeManipulator.setHorizontalListener(
      0,
      dataset.WindowWidth,
      10,
      () => this.getWindowWidth(),
      (value) => {
        this.setWindowWidth(value);
      },
      10
    );
    this.rangeManipulator.setVerticalListener(
      this.minImageValue,
      this.maxImageValue,
      10,
      () => this.getWindowCenter(),
      (value) => {
        this.setWindowCenter(value);
      },
      10
    );
  }

  unmount() {
    //TODO: unmount manipulators
  }

  setImagePropertiesContext(state: ImagePropertiesState, api: ImagePropertiesApi) {
    this.imagePropertiesState = state;
    this.imagePropertiesApi = api;
  }

  setWindowWidth(windowWidth: number) {
    const { windowCenter } = this.imagePropertiesState;
    this.imagePropertiesApi.setWindowCenterWidth(windowCenter, windowWidth);
  }

  setWindowCenter(windowCenter: number) {
    const { windowWidth } = this.imagePropertiesState;

    const shiftedMaxImageValue = this.maxImageValue - this.minImageValue;
    const shiftedWindowCenter = windowCenter - this.minImageValue;

    this.imagePropertiesApi.setWindowCenterWidth(
      shiftedMaxImageValue - shiftedWindowCenter + this.minImageValue,
      windowWidth
    );
  }

  getWindowWidth(): number {
    return this.imagePropertiesState.windowWidth;
  }

  getWindowCenter(): number {
    const { windowCenter } = this.imagePropertiesState;

    const shiftedMaxImageValue = this.maxImageValue - this.minImageValue;
    const shiftedWindowCenter = windowCenter - this.minImageValue;

    return shiftedMaxImageValue - shiftedWindowCenter + this.minImageValue;
  }
}

export default WindowLevelManipulatorCompanion;
