import HookCompanion from '../../utils/HookCompanion';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import { LabelMapSliceRepresentationProps } from './index';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { View } from 'react-vtk-js';
import { ImageData } from '../../contexts/ImageDataContext';
import { delay } from '../../utils';

export interface LabelMapSliceRepresentationCompanionProps extends LabelMapSliceRepresentationProps {
  view: View;
  imageData: ImageData;
}

class LabelMapSliceRepresentationCompanion extends HookCompanion<LabelMapSliceRepresentationCompanionProps> {
  labelMapId: string;
  mapper: vtkImageMapper;
  actor: vtkImageSlice;
  colorFunction: vtkColorTransferFunction;
  piecewiseFunction: vtkPiecewiseFunction;

  constructor(props: LabelMapSliceRepresentationCompanionProps) {
    super(props);

    this.labelMapId = props.id;

    this.mapper = vtkImageMapper.newInstance();
    this.actor = vtkImageSlice.newInstance();
    this.colorFunction = vtkColorTransferFunction.newInstance();
    this.piecewiseFunction = vtkPiecewiseFunction.newInstance();
  }

  mount() {
    const {
      view,
      inputLabelMap: { visibility, color, data }
    } = this.props;
    // @ts-ignore
    this.actor.setMapper(this.mapper);
    this.mapper.setSlicingMode(this.props.slicingMode);

    const [r, g, b] = color;

    this.colorFunction.addRGBPoint(1, r, g, b);
    this.piecewiseFunction.addPoint(0, 0);
    this.piecewiseFunction.addPoint(1, 1);

    this.actor.getProperty().setRGBTransferFunction(0, this.colorFunction);
    this.actor.getProperty().setPiecewiseFunction(0, this.piecewiseFunction);
    this.actor.getProperty().setOpacity(this.props.opacity);

    this.setLabelMapData(data);

    // @ts-ignore
    view.renderer.addActor(this.actor);

    this.actor.setVisibility(visibility);
  }

  unmount() {
    const { view } = this.props;
    if (view.renderer) {
      // @ts-ignore
      view.renderer.removeActor(this.actor);
    }
    this.actor.delete();
    this.mapper.delete();
    view.renderView();
  }

  async setVisibility(visibility: boolean) {
    const { view } = this.props;
    this.actor.setVisibility(visibility);
    await delay(1);
    view.renderView();
  }

  updateVisibleSlice(sliceIndex: number) {
    this.mapper.setSlice(sliceIndex);
  }

  setLabelMapData(inputLabelMap: vtkImageData) {
    const { view } = this.props;
    this.mapper.setInputData(inputLabelMap);
    view.renderView();
  }

  setSlicingMode(slicingMode: SlicingMode) {
    this.mapper.setSlicingMode(slicingMode);
  }

  setColor(color: number[]) {
    const { view } = this.props;
    const [r, g, b] = color;
    this.colorFunction.addRGBPoint(1, r, g, b);
    view.renderView();
  }
}

export default LabelMapSliceRepresentationCompanion;
