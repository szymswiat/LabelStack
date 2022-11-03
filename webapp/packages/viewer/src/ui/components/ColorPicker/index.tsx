import React from 'react';
import { CirclePicker, ColorResult } from 'react-color';

export interface ColorPickerProps {
  description: string;
  handleColorChange: (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ description, handleColorChange }) => {
  return (
    <div className={'w-full h-full flex flex-col gap-y-4'}>
      <div className={'h-6 pl-2'}>{description}</div>
      <div className={'grid place-items-center'}>
        {/*@ts-ignore*/}
        <CirclePicker onChange={handleColorChange} />
      </div>
    </div>
  );
};

export default ColorPicker;
