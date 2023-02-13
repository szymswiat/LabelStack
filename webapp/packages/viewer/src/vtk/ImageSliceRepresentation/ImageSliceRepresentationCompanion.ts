import HookCompanion from '../../utils/HookCompanion';
import { View } from 'react-vtk-js';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import { getOrientation } from '../../constants/slicingModeToOrientation';
import { ImageData } from '../../contexts/ImageDataContext';
import { ImageSliceRepresentationProps } from './index';
import { delay } from '../../utils';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

export interface ImageSliceRepresentationCompanionProps extends ImageSliceRepresentationProps {
  view: View;
}

class ImageSliceRepresentationCompanion extends HookCompanion<ImageSliceRepresentationCompanionProps> {
  actor: vtkImageSlice;
  mapper: vtkImageMapper;

  constructor(props: ImageSliceRepresentationCompanionProps) {
    super(props);

    this.actor = vtkImageSlice.newInstance();
    this.mapper = vtkImageMapper.newInstance();
  }

  mount() {
    const { view, slicingMode } = this.props;
    // @ts-ignore
    this.actor.setMapper(this.mapper);
    // @ts-ignore
    view.renderer.addActor(this.actor);

    this.mapper.setSlicingMode(slicingMode);
  }

  unmount() {
    const { view } = this.props;
    if (view.renderer) {
      // @ts-ignore
      view.renderer.removeActor(this.actor);
    }
    this.actor.delete();
    this.mapper.delete();
  }

  updateWindowWidthCenter(windowWidth: number, windowCenter: number, invertColors: boolean) {
    const { view } = this.props;

    this.actor.getProperty().setColorWindow(invertColors ? -windowWidth : windowWidth);
    this.actor.getProperty().setColorLevel(windowCenter);

    view.renderView();
  }

  updateVisibleSlice(sliceIndex: number) {
    const { view } = this.props;

    this.mapper.setSlice(sliceIndex);
    view.renderView();
  }

  attachImageData(imageData: ImageData) {
    const { view } = this.props;
    const { vtkImage } = imageData;

    // @ts-ignore
    this.mapper.setInputData(vtkImage);
    this.mapper.update();

    this.centerCamera();
  }

  // TODO: move to SliceView
  async centerCamera() {
    const { view } = this.props;
    const camera = view.renderer.getActiveCamera();

    const { sliceNormal, viewUp } = getOrientation(this.props.slicingMode);

    camera.setDirectionOfProjection(-sliceNormal[0], -sliceNormal[1], -sliceNormal[2]);
    camera.set({ viewUp });
    view.renderer.resetCamera();
    await delay(1);
    view.renderView();
  }

  setSlicingMode(slicingMode: SlicingMode) {
    const { view } = this.props;
    this.mapper.setSlicingMode(slicingMode);
    view.renderView();
  }
}

export default ImageSliceRepresentationCompanion;
