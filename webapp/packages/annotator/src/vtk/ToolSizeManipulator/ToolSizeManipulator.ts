import { View } from 'react-vtk-js';
import vtkMouseRangeManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseRangeManipulator';
import HookCompanion from '@labelstack/viewer/src/utils/HookCompanion';
import { ToolSizeManipulatorProps } from './index';
import { delay } from '@labelstack/app/src/utils';

export interface ToolSizeManipulatorCompanionProps extends ToolSizeManipulatorProps {
  view: View;
}

class ToolSizeManipulatorCompanion extends HookCompanion<ToolSizeManipulatorCompanionProps> {
  rangeManipulator: vtkMouseRangeManipulator;

  getToolSize: () => number;
  setToolSize: (size: number) => void;

  constructor(props: ToolSizeManipulatorCompanionProps) {
    super(props);
    const { manipulatorOptions } = props;

    this.rangeManipulator = vtkMouseRangeManipulator.newInstance(manipulatorOptions);
    this.getToolSize = () => 0;
    this.setToolSize = (value) => {};
  }

  async mount() {
    await delay(200);

    const { manipulatorOptions, view, minToolSize, maxToolSize } = this.props;

    view.style.addMouseManipulator(this.rangeManipulator);

    this.rangeManipulator.setScrollListener(
      0,
      maxToolSize - minToolSize,
      1,
      () => maxToolSize - this.getToolSize(),
      (value) => this.setToolSize(maxToolSize - value),
      manipulatorOptions.scale != null ? manipulatorOptions.scale : 1
    );
  }

  unmount() {
    this.rangeManipulator.delete();
  }
}

export default ToolSizeManipulatorCompanion;
